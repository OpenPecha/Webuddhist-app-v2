import { useThemeColors } from '@/hooks/useThemeColors';
import { useMemo } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';

const BASE_FONT_SIZE = 14;
const BASE_LINE_HEIGHT = 22;

interface MarkdownTextProps {
  content: string;
  style?: TextStyle;
  allowImages?: boolean;
}

function scaledHeadingStyle(
  base: TextStyle,
  fontSize: number,
  lineHeight: number,
  sizeRatio: number,
  marginTop: number,
  marginBottom: number,
): TextStyle {
  const scale = fontSize / BASE_FONT_SIZE;

  return {
    fontWeight: '700' as const,
    color: base.color,
    fontFamily: base.fontFamily,
    fontSize: Math.round(fontSize * sizeRatio),
    lineHeight: Math.round(lineHeight * sizeRatio),
    marginTop: Math.round(marginTop * scale),
    marginBottom: Math.round(marginBottom * scale),
  };
}

export function MarkdownText({ content, style, allowImages = false }: MarkdownTextProps) {
  const { foreground, isDark } = useThemeColors();

  const markdownStyles = useMemo(() => {
    const base = StyleSheet.flatten({
      fontSize: BASE_FONT_SIZE,
      lineHeight: BASE_LINE_HEIGHT,
      color: foreground,
      ...style,
    }) as TextStyle;

    const fontSize = typeof base.fontSize === 'number' ? base.fontSize : BASE_FONT_SIZE;
    const lineHeight =
      typeof base.lineHeight === 'number' ? base.lineHeight : BASE_LINE_HEIGHT;
    const scale = fontSize / BASE_FONT_SIZE;
    const codeSurface = isDark ? '#1a1a1a' : '#f5f5f5';
    const codeBorder = isDark ? '#444444' : '#CCCCCC';
    const tableBorder = isDark ? '#444444' : '#000000';

    return {
      body: base,
      text: base,
      paragraph: {
        marginTop: 0,
        marginBottom: Math.round(12 * scale),
        fontSize,
        lineHeight,
        color: base.color,
        fontFamily: base.fontFamily,
      },
      heading1: scaledHeadingStyle(base, fontSize, lineHeight, 24 / BASE_FONT_SIZE, 16, 8),
      heading2: scaledHeadingStyle(base, fontSize, lineHeight, 20 / BASE_FONT_SIZE, 14, 6),
      heading3: scaledHeadingStyle(base, fontSize, lineHeight, 17 / BASE_FONT_SIZE, 12, 4),
      heading4: scaledHeadingStyle(base, fontSize, lineHeight, 15 / BASE_FONT_SIZE, 10, 4),
      heading5: scaledHeadingStyle(base, fontSize, lineHeight, 1, 8, 4),
      heading6: scaledHeadingStyle(base, fontSize, lineHeight, 1, 8, 4),
      strong: { fontWeight: '700' as const },
      em: { fontStyle: 'italic' as const },
      s: { textDecorationLine: 'line-through' as const },
      link: {
        color: '#0066cc',
        textDecorationLine: 'underline' as const,
      },
      bullet_list: {
        marginBottom: Math.round(8 * scale),
      },
      ordered_list: {
        marginBottom: Math.round(8 * scale),
      },
      list_item: {
        marginBottom: Math.round(4 * scale),
      },
      blockquote: {
        backgroundColor: isDark ? '#1a1a1a' : '#F5F5F5',
        borderColor: isDark ? '#444444' : '#CCCCCC',
      },
      hr: {
        backgroundColor: isDark ? '#444444' : '#000000',
      },
      code_inline: {
        backgroundColor: codeSurface,
        borderColor: codeBorder,
      },
      code_block: {
        backgroundColor: codeSurface,
        borderColor: codeBorder,
      },
      fence: {
        backgroundColor: codeSurface,
        borderColor: codeBorder,
      },
      table: {
        borderColor: tableBorder,
      },
      tr: {
        borderColor: tableBorder,
      },
    };
  }, [foreground, isDark, style]);

  const rules = useMemo(
    () =>
      allowImages
        ? undefined
        : {
          image: (
            node: { key: string; attributes: { alt?: string } },
            _children: unknown,
            _parent: unknown,
            styles: { text: TextStyle },
          ) => {
            const alt = node.attributes.alt?.trim();
            if (!alt) return null;

            return (
              <Text key={node.key} style={styles.text}>
                {alt}
              </Text>
            );
          },
        },
    [allowImages],
  );

  return (
    <Markdown style={markdownStyles} mergeStyle rules={rules}>
      {content}
    </Markdown>
  );
}
