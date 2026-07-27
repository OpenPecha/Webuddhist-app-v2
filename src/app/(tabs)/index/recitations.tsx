import { RecitationsBrowseView } from '@/components/recitation/RecitationsBrowseView';
import { useRouter, type Href } from 'expo-router';

export default function RecitationsScreen() {
  const router = useRouter();

  return (
    <RecitationsBrowseView onSearchPress={() => router.push('/recitations-search' as Href)} />
  );
}
