import { AllPlansView } from '@/components/practice/AllPlansView';
import { useRouter } from 'expo-router';

export default function PracticePlansScreen() {
  const router = useRouter();

  return <AllPlansView onSearchPress={() => router.push('/plans/search')} />;
}
