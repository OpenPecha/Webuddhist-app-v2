import { decodeHtmlEntities, normalizeSegmentHtml } from '@/utils/segment-plain-text';
import { useState } from 'react';
import { Text, type TextStyle } from 'react-native';

type InlineNode =
  | { kind: 'text'; value: string; bold: boolean; italic: boolean }
  | { kind: 'break' }
  | { kind: 'footnoteMarker'; id: number; label: string }
  | { kind: 'footnote'; id: number; value: string };

const FOOTNOTE_MARKER_COLOR = '#007bff';
const FOOTNOTE_BODY_COLOR = '#8a8a8a';

function classHasFootnoteMarker(tag: string): boolean {
  return /class\s*=\s*["'][^"']*footnote-marker[^"']*["']/i.test(tag);
}

function classHasFootnote(tag: string): boolean {
  return /class\s*=\s*["'][^"']*footnote[^"']*["']/i.test(tag);
}

/** Parse a subset of segment HTML into inline nodes for React Native <Text> rendering. */
export function parseSegmentHtml(rawHtml: string): InlineNode[] {
  const html = normalizeSegmentHtml(rawHtml);
  const nodes: InlineNode[] = [];
  let footnoteCounter = 0;
  let bold = 0;
  let italic = 0;
  let i = 0;

  const pushText = (value: string) => {
    if (!value) return;
    const decoded = decodeHtmlEntities(value);
    if (!decoded) return;
    nodes.push({ kind: 'text', value: decoded, bold: bold > 0, italic: italic > 0 });
  };

  const findClose = (fromIndex: number, closeTag: string): number => {
    const idx = html.toLowerCase().indexOf(closeTag, fromIndex);
    return idx === -1 ? html.length : idx;
  };

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      pushText(html.slice(i));
      break;
    }
    if (lt > i) pushText(html.slice(i, lt));

    const gt = html.indexOf('>', lt);
    if (gt === -1) {
      pushText(html.slice(lt));
      break;
    }

    const tag = html.slice(lt, gt + 1);
    const lower = tag.toLowerCase();

    if (/^<br\s*\/?>/.test(lower)) {
      nodes.push({ kind: 'break' });
      i = gt + 1;
    } else if (/^<\/p>/.test(lower) || /^<p[\s>]/.test(lower) || lower === '<p>') {
      if (/^<\/p>/.test(lower)) nodes.push({ kind: 'break' });
      i = gt + 1;
    } else if (/^<sup[\s>]/.test(lower) || lower === '<sup>') {
      const close = findClose(gt + 1, '</sup>');
      const inner = html.slice(gt + 1, close).replace(/<[^>]+>/g, '');
      if (classHasFootnoteMarker(tag)) {
        const id = footnoteCounter++;
        nodes.push({ kind: 'footnoteMarker', id, label: decodeHtmlEntities(inner).trim() || '*' });
      } else {
        pushText(inner);
      }
      i = close === html.length ? html.length : close + '</sup>'.length;
    } else if (/^<i[\s>]/.test(lower) || lower === '<i>') {
      if (classHasFootnote(tag)) {
        const close = findClose(gt + 1, '</i>');
        const inner = html.slice(gt + 1, close).replace(/<[^>]+>/g, '');
        const id = footnoteCounter - 1;
        nodes.push({ kind: 'footnote', id: id < 0 ? 0 : id, value: decodeHtmlEntities(inner).trim() });
        i = close === html.length ? html.length : close + '</i>'.length;
      } else {
        italic += 1;
        i = gt + 1;
      }
    } else if (lower === '</i>') {
      italic = Math.max(0, italic - 1);
      i = gt + 1;
    } else if (/^<(b|strong)[\s>]/.test(lower) || lower === '<b>' || lower === '<strong>') {
      bold += 1;
      i = gt + 1;
    } else if (lower === '</b>' || lower === '</strong>') {
      bold = Math.max(0, bold - 1);
      i = gt + 1;
    } else {
      // Unknown/unsupported tag: skip it.
      i = gt + 1;
    }
  }

  return nodes;
}

export interface SegmentHtmlProps {
  html: string;
  fontSize: number;
  color?: string;
  fontFamily?: string;
  lineHeight?: number;
  selected?: boolean;
  style?: TextStyle;
}

export function SegmentHtml({
  html,
  fontSize,
  color = '#000',
  fontFamily = 'Georgia',
  lineHeight,
  selected = false,
  style,
}: SegmentHtmlProps) {
  const [visibleFootnotes, setVisibleFootnotes] = useState<Set<number>>(new Set());
  const nodes = parseSegmentHtml(html);

  const toggleFootnote = (id: number) => {
    setVisibleFootnotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const baseStyle: TextStyle = {
    fontSize,
    lineHeight: lineHeight ?? fontSize * 1.6,
    color,
    fontFamily,
    ...(selected
      ? {
          textDecorationLine: 'underline',
          textDecorationStyle: 'dotted',
        }
      : null),
    ...style,
  };

  return (
    <Text style={baseStyle}>
      {nodes.map((node, index) => {
        switch (node.kind) {
          case 'break':
            return <Text key={index}>{'\n'}</Text>;
          case 'footnoteMarker':
            return (
              <Text
                key={index}
                onPress={() => toggleFootnote(node.id)}
                suppressHighlighting
                style={{
                  color: FOOTNOTE_MARKER_COLOR,
                  fontWeight: '700',
                  fontSize: fontSize * 0.85,
                }}
              >
                {` ${node.label} `}
              </Text>
            );
          case 'footnote':
            if (!visibleFootnotes.has(node.id)) return null;
            return (
              <Text
                key={index}
                style={{
                  fontStyle: 'italic',
                  color: FOOTNOTE_BODY_COLOR,
                  fontSize,
                }}
              >
                {` ${node.value} `}
              </Text>
            );
          default:
            return (
              <Text
                key={index}
                style={{
                  ...(node.bold ? { fontWeight: '700' } : null),
                  ...(node.italic ? { fontStyle: 'italic' } : null),
                }}
              >
                {node.value}
              </Text>
            );
        }
      })}
    </Text>
  );
}
