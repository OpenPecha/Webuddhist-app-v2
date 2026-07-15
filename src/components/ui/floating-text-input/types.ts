import type { ReactNode } from 'react';

export interface FloatingTextInputProps {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string | null;
  hint?: string;
  multiline?: boolean;
  minHeight?: number;
  maxLength?: number;
  trailingIcon?: ReactNode;
  containerClassName?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
}
