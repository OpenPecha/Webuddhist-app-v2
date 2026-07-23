export type ThemeMode = 'light' | 'dark' | 'system';

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9_.-]{1,28}[a-zA-Z0-9])?$/;
const PERSON_NAME_PATTERN = /^[\p{L}\s'-]+$/u;

export type UsernameValidationKey =
  | 'username_min_length'
  | 'username_max_length'
  | 'username_no_spaces'
  | 'username_invalid_chars'
  | 'username_must_start_alphanumeric'
  | 'username_must_end_alphanumeric'
  | null;

export function validateUsername(value: string): UsernameValidationKey {
  const trimmed = value.trim();
  if (trimmed.length < 3) return 'username_min_length';
  if (trimmed.length > 30) return 'username_max_length';
  if (/\s/.test(trimmed)) return 'username_no_spaces';
  if (!USERNAME_PATTERN.test(trimmed)) {
    if (!/^[a-zA-Z0-9]/.test(trimmed)) return 'username_must_start_alphanumeric';
    if (!/[a-zA-Z0-9]$/.test(trimmed)) return 'username_must_end_alphanumeric';
    return 'username_invalid_chars';
  }
  return null;
}

export type PersonNameValidationKey =
  | 'person_name_min_length'
  | 'person_name_max_length'
  | 'person_name_invalid_chars'
  | null;

export function validatePersonName(value: string): PersonNameValidationKey {
  const trimmed = value.trim();
  if (trimmed.length < 1) return 'person_name_min_length';
  if (trimmed.length > 50) return 'person_name_max_length';
  if (!PERSON_NAME_PATTERN.test(trimmed)) return 'person_name_invalid_chars';
  return null;
}

/**
 * Hardcoded English message for a username/person-name validation code.
 * TODO(i18n): replace with a Tolgee `t()` lookup once keys are wired up.
 */
export function validationMessage(
  key: UsernameValidationKey | PersonNameValidationKey,
): string {
  switch (key) {
    case 'username_min_length':
      return 'Username must be at least 3 characters';
    case 'username_max_length':
      return 'Username must be 30 characters or less';
    case 'username_no_spaces':
      return 'Username cannot contain spaces';
    case 'username_invalid_chars':
      return 'Only letters, numbers, _ . - are allowed';
    case 'username_must_start_alphanumeric':
      return 'Username must start with a letter or number';
    case 'username_must_end_alphanumeric':
      return 'Username must end with a letter or number';
    case 'person_name_min_length':
      return 'Must be at least 1 character';
    case 'person_name_max_length':
      return 'Must be 50 characters or less';
    case 'person_name_invalid_chars':
      return 'Only letters, spaces, hyphens, and apostrophes are allowed';
    default:
      return '';
  }
}

export function avatarCacheKey(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url.split('?')[0] ?? url;
  }
}
