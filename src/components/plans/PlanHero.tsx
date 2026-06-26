import type { ImageSizes } from '@/types/api';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface PlanHeroProps {
  title: string;
  image?: ImageSizes | null;
  totalDays: number;
  description?: string | null;
  variant?: 'preview' | 'track';
}

export function PlanHero({
  title,
  image,
  totalDays,
  description,
  variant = 'preview',
}: PlanHeroProps) {
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowDimensions();
  const daysLabel =
    totalDays === 1
      ? t('series.n_days_one')
      : t('series.n_days_other', { count: totalDays });

  if (variant === 'track') {
    const heroHeight = Math.round(windowHeight * 0.3);
    return (
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        {image ? (
          <Image
            source={{ uri: imageUrl(image) }}
            style={{
              width: '100%',
              height: heroHeight,
              borderRadius: 12,
            }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: heroHeight,
              borderRadius: 12,
              backgroundColor: '#e8e8e4',
            }}
          />
        )}
        {description ? (
          <Text
            style={{
              fontSize: 14,
              color: '#333',
              lineHeight: 22,
              marginTop: 16,
            }}
          >
            {description}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View>
      {image ? (
        <Image
          source={{ uri: imageUrl(image) }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: '#e8e8e4' }} />
      )}
      <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            color: '#000',
            marginBottom: 6,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: '#8a8a8a', marginBottom: description ? 12 : 0 }}>
          {daysLabel}
        </Text>
        {description ? (
          <Text style={{ fontSize: 14, color: '#333', lineHeight: 22 }}>{description}</Text>
        ) : null}
      </View>
    </View>
  );
}
