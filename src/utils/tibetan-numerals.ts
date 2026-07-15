const ENGLISH_TO_TIBETAN_DIGIT: Record<string, string> = {
  '0': '༠',
  '1': '༡',
  '2': '༢',
  '3': '༣',
  '4': '༤',
  '5': '༥',
  '6': '༦',
  '7': '༧',
  '8': '༨',
  '9': '༩',
};

/** Converts ASCII digits in a string to Tibetan Unicode digits. */
export function toTibetanDigits(value: string | number): string {
  return String(value)
    .split('')
    .map((char) => ENGLISH_TO_TIBETAN_DIGIT[char] ?? char)
    .join('');
}
