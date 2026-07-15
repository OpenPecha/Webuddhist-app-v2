/** Bead strand layout — ported from Flutter `mala_beads.dart` painter. */

export const MALA_BEADS_LAYOUT_WIDTH = 360;
export const MALA_BEADS_LAYOUT_HEIGHT = 220;
/** Bottom padding for the bead strand container on the mala screen. */
export const MALA_BEADS_BOTTOM_INSET = 80;

export interface BeadPoint {
  x: number;
  y: number;
  radius: number;
  slot: number;
}

const BEAD_FROM = -9;
const BEAD_TO = 9;
const FOCAL_T = 0.56;
const RADIUS_FACTOR = 0.070;
const SPACING_FACTOR = 2.0;
const GAP = 1.0;
const ARC_SAMPLES = 240;
const T_MIN = -0.4;
const T_MAX = 1.4;

function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

function bezier(t: number, w: number, h: number): { x: number; y: number } {
  const a = { x: w * -0.06, y: h * 0.88 };
  const c = { x: w * 0.4, y: h * 0.4 };
  const b = { x: w * 1.06, y: h * 0.34 };
  const mt = 1 - t;
  return {
    x: mt * mt * a.x + 2 * mt * t * c.x + t * t * b.x,
    y: mt * mt * a.y + 2 * mt * t * c.y + t * t * b.y,
  };
}

function buildArcTable(w: number, h: number) {
  const ts = new Array<number>(ARC_SAMPLES + 1);
  const cum = new Array<number>(ARC_SAMPLES + 1);
  let prev = bezier(T_MIN, w, h);
  let len = 0;
  ts[0] = T_MIN;
  cum[0] = 0;

  for (let k = 1; k <= ARC_SAMPLES; k += 1) {
    const t = T_MIN + ((T_MAX - T_MIN) * k) / ARC_SAMPLES;
    const pt = bezier(t, w, h);
    len += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    ts[k] = t;
    cum[k] = len;
    prev = pt;
  }

  return { ts, cum, totalLen: len };
}

function tAtLength(s: number, ts: number[], cum: number[], totalLen: number): number {
  if (s <= 0) return T_MIN;
  if (s >= totalLen) return T_MAX;
  let lo = 0;
  let hi = ARC_SAMPLES;
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= s) lo = mid;
    else hi = mid;
  }
  const span = cum[hi] - cum[lo];
  const f = span <= 0 ? 0 : (s - cum[lo]) / span;
  return ts[lo] + (ts[hi] - ts[lo]) * f;
}

function lengthAtT(t: number, ts: number[], cum: number[]): number {
  const f = Math.max(0, Math.min(ARC_SAMPLES, ((t - T_MIN) / (T_MAX - T_MIN)) * ARC_SAMPLES));
  const lo = Math.floor(f);
  const hi = Math.min(lo + 1, ARC_SAMPLES);
  return cum[lo] + (cum[hi] - cum[lo]) * (f - lo);
}

export function malaThreadPath(width: number, height: number): string {
  const a = { x: width * -0.06, y: height * 0.88 };
  const c = { x: width * 0.4, y: height * 0.4 };
  const b = { x: width * 1.06, y: height * 0.34 };
  return `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
}

export function computeBeadPositions(
  width: number,
  height: number,
  phase: number,
): BeadPoint[] {
  const { ts, cum, totalLen } = buildArcTable(width, height);
  const radius = width * RADIUS_FACTOR;
  const spacing = radius * SPACING_FACTOR;
  const sFocal = lengthAtT(FOCAL_T, ts, cum);
  const frac = phase - Math.floor(phase);
  const points: BeadPoint[] = [];

  for (let i = BEAD_TO; i >= BEAD_FROM; i -= 1) {
    const slot = i - frac;
    const p = slot + GAP * smoothstep(slot);
    const s = sFocal + p * spacing;
    if (s < -spacing || s > totalLen + spacing) continue;
    const t = tAtLength(s, ts, cum, totalLen);
    const pt = bezier(t, width, height);
    points.push({ x: pt.x, y: pt.y, radius, slot: i });
  }

  return points;
}
