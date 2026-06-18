import { resolveContentLanguage } from '@/constants/app-config';
import { useTranslation } from 'react-i18next';

/** UI locale from i18n mapped to backend-supported content language (en/zh/bo). */
export function useContentLanguage(): string {
  const { i18n } = useTranslation();
  return resolveContentLanguage(i18n.language);
}
