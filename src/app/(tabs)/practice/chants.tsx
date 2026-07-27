import { RecitationsBrowseView } from '@/components/recitation/RecitationsBrowseView';
import { useRouter } from 'expo-router';

export default function PracticeChantsScreen() {
  const router = useRouter();

  return <RecitationsBrowseView onSearchPress={() => router.push('/practice/chants-search')} />;
}
