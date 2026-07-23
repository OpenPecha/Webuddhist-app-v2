import { resolveContentLanguage } from '@/constants/app-config';
import { useAppLanguage } from '@/lib/tolgee';

/** UI locale mapped to backend-supported content language (en/zh/bo). */
export function useContentLanguage(): string {
  const language = useAppLanguage();
  return resolveContentLanguage(language);
}
