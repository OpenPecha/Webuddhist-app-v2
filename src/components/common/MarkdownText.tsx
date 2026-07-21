import { useThemeColors } from '@/hooks/useThemeColors';
import { useMemo } from 'react';
import { StyleSheet, type TextStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownTextProps {
  content: string;
  style?: TextStyle;
}

export function MarkdownText({ content, style }: MarkdownTextProps) {
  const { foreground, isDark } = useThemeColors();

  const markdownStyles = useMemo(() => {
    const base = StyleSheet.flatten({
      fontSize: 14,
      lineHeight: 22,
      color: foreground,
      ...style,
    }) as TextStyle;

    const headingBase: TextStyle = {
      fontWeight: '700' as const,
      color: base.color,
      fontFamily: base.fontFamily,
    };

    return {
      body: base,
      text: base,
      paragraph: {
        marginTop: 0,
        marginBottom: 12,
        fontSize: base.fontSize,
        lineHeight: base.lineHeight,
        color: base.color,
        fontFamily: base.fontFamily,
      },
      heading1: { ...headingBase, fontSize: 24, marginTop: 16, marginBottom: 8 },
      heading2: { ...headingBase, fontSize: 20, marginTop: 14, marginBottom: 6 },
      heading3: { ...headingBase, fontSize: 17, marginTop: 12, marginBottom: 4 },
      heading4: { ...headingBase, fontSize: 15, marginTop: 10, marginBottom: 4 },
      heading5: { ...headingBase, fontSize: base.fontSize, marginTop: 8, marginBottom: 4 },
      heading6: { ...headingBase, fontSize: base.fontSize, marginTop: 8, marginBottom: 4 },
      strong: { fontWeight: '700' as const },
      em: { fontStyle: 'italic' as const },
      link: {
        color: '#0066cc',
        textDecorationLine: 'underline' as const,
      },
      bullet_list: {
        marginBottom: 8,
      },
      ordered_list: {
        marginBottom: 8,
      },
      list_item: {
        marginBottom: 4,
      },
      blockquote: {
        backgroundColor: isDark ? '#1a1a1a' : '#F5F5F5',
        borderColor: isDark ? '#444444' : '#CCCCCC',
      },
      hr: {
        backgroundColor: isDark ? '#444444' : '#000000',
      },
    };
  }, [foreground, isDark, style]);

  return (
    <Markdown style={markdownStyles} mergeStyle={false}>
      {content}
    </Markdown>
  );
}
