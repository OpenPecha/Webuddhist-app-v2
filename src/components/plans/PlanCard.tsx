import type { PublicPlanListItem } from '@/types/plan-catalog';
import { imageUrl } from '@/utils/image-url';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

function authorDisplayName(plan: PublicPlanListItem): string | null {
  const author = plan.author;
  if (!author) return null;
  const name = [author.firstname, author.lastname].filter(Boolean).join(' ').trim();
  return name.length > 0 ? name : null;
}

function difficultyLabel(level?: string | null): string | null {
  if (!level?.trim()) return null;
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

function difficultyColor(level?: string | null): string {
  switch ((level ?? '').toLowerCase()) {
    case 'beginner':
      return 'green';
    case 'intermediate':
      return 'yellow';
    case 'advanced':
      return 'orange';
    default:
      return 'gray';
  }
}

interface PlanCardProps {
  plan: PublicPlanListItem;
  onPress?: () => void;
}

export function PlanCard({ plan, onPress }: PlanCardProps) {
  const authorName = authorDisplayName(plan);
  const difficulty = difficultyLabel(plan.difficulty_level);

  const content = (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 12,
      }}
    >
      <Image
        source={{ uri: imageUrl(plan.image, 'thumbnail') }}
        style={{ height: 72, width: 72, borderRadius: 8, backgroundColor: '#e8e8e4' }}
        contentFit="cover"
        transition={200}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{ fontSize: 14, fontWeight: '600', fontFamily: 'Inter-SemiBold', color: '#000' }}
          numberOfLines={2}
        >
          {plan.title}
        </Text>
        {authorName ? (
          <Text style={{ marginTop: 2, fontSize: 12, color: '#8a8a8a' }} numberOfLines={1}>
            {authorName}
          </Text>
        ) : null}
        {plan.description && !authorName ? (
          <Text style={{ marginTop: 2, fontSize: 12, color: '#8a8a8a' }} numberOfLines={2}>
            {plan.description}
          </Text>
        ) : null}
        <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {difficulty ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <MaterialIcons
                name="signal-cellular-alt"
                size={12}
                color={difficultyColor(plan.difficulty_level)}
              />
              <Text style={{ fontSize: 12, color: '#8a8a8a' }}>{difficulty}</Text>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <MaterialIcons name="calendar-month" size={12} color="gray" />
            <Text style={{ fontSize: 12, color: '#8a8a8a' }}>
              {plan.total_days} {plan.total_days === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
      {content}
    </Pressable>
  );
}
