import React from 'react';
import { Linking, Text, View } from 'react-native';

interface MarkdownTextProps {
  content: string;
  style?: object;
}

function parseInline(text: string, baseStyle: object): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Text key={key++} style={baseStyle}>
          {text.slice(lastIndex, match.index)}
        </Text>,
      );
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(
        <Text key={key++} style={[baseStyle, { fontWeight: '700' }]}>
          {token.slice(2, -2)}
        </Text>,
      );
    } else {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        nodes.push(
          <Text
            key={key++}
            style={[baseStyle, { color: '#0066cc', textDecorationLine: 'underline' }]}
            onPress={() => void Linking.openURL(url)}
          >
            {label}
          </Text>,
        );
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <Text key={key++} style={baseStyle}>
        {text.slice(lastIndex)}
      </Text>,
    );
  }

  return nodes.length ? nodes : [<Text key={0} style={baseStyle}>{text}</Text>];
}

export function MarkdownText({ content, style }: MarkdownTextProps) {
  const baseStyle = {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    ...style,
  };

  const paragraphs = content.split(/\n{2,}/).filter(Boolean);

  return (
    <View>
      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={[baseStyle, index > 0 ? { marginTop: 12 } : null]}>
          {parseInline(paragraph.replace(/\n/g, ' '), baseStyle)}
        </Text>
      ))}
    </View>
  );
}
