/**
 * Ports hi/mn/ne locale JSON from Flutter ARB files into v2 nested JSON shape.
 * Run: node scripts/port-locale-from-flutter.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const flutterL10n = path.join(root, '..', 'WeBuddhist-app', 'lib', 'core', 'l10n');
const keyMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'locale-key-map.json'), 'utf8'));
const enTemplate = JSON.parse(fs.readFileSync(path.join(root, 'src', 'locales', 'en.json'), 'utf8'));

const TARGET_LOCALES = ['hi', 'mn', 'ne'];

function parseArb(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const entries = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith('@') || typeof value !== 'string') continue;
    entries[key] = value;
  }
  return entries;
}

function flutterToI18next(value) {
  if (!value) return value;
  return value
    .replace(/\{(\w+)\}/g, '{{$1}}')
    .replace(/\{count, plural, =0\{([^}]*)\} =1\{([^}]*)\} other\{([^}]*)\}\}/g, (_, _zero, one, other) => {
      return other.replace(/\{count\}/g, '{{count}}');
    })
    .replace(/\{gap\}/g, '{{minutes}}')
    .replace(/\{time\}/g, '{{time}}');
}

function setNested(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) current[part] = {};
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

function collectLeafPaths(obj, prefix = '') {
  const paths = [];
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      paths.push(...collectLeafPaths(value, next));
    } else {
      paths.push(next);
    }
  }
  return paths;
}

function getNested(obj, dotPath) {
  return dotPath.split('.').reduce((acc, part) => acc?.[part], obj);
}

function resolveValue(path, arb, enFallback) {
  const arbKey = keyMap[path];
  if (!arbKey || !(arbKey in arb)) {
    return { value: enFallback, source: 'en-fallback' };
  }

  let value = arb[arbKey];

  if (path === 'practice.missed_days_one') {
    const match = arb[arbKey]?.match(/=1\{([^}]*)\}/);
    if (match) value = match[1];
  } else if (path === 'practice.missed_days_other') {
    const match = arb[arbKey]?.match(/other\{([^}]*)\}/);
    if (match) value = match[1].replace(/\{count\}/g, '{{count}}');
  } else if (path === 'editRoutine.time_adjusted_title') {
    value = enFallback;
  } else if (path === 'editRoutine.time_adjusted_message') {
    value = flutterToI18next(value).replace('{{minutes}}-min minimum gap', '{{minutes}} min gap required');
  } else if (path === 'profile.username_available') {
    return { value: enFallback, source: 'en-fallback' };
  } else {
    value = flutterToI18next(value);
  }

  return { value, source: 'arb' };
}

for (const locale of TARGET_LOCALES) {
  const arbPath = path.join(flutterL10n, `app_${locale}.arb`);
  if (!fs.existsSync(arbPath)) {
    console.error(`Missing ARB: ${arbPath}`);
    process.exit(1);
  }

  const arb = parseArb(arbPath);
  const output = {};
  const stats = { arb: 0, fallback: 0 };

  for (const dotPath of collectLeafPaths(enTemplate)) {
    const enFallback = getNested(enTemplate, dotPath);
    const { value, source } = resolveValue(dotPath, arb, enFallback);
    setNested(output, dotPath, value);
    stats[source === 'arb' ? 'arb' : 'fallback']++;
  }

  const outPath = path.join(root, 'src', 'locales', `${locale}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`${locale}.json: ${stats.arb} from ARB, ${stats.fallback} English fallback → ${outPath}`);
}
