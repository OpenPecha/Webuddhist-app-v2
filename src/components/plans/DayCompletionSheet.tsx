import { AppBottomSheet } from "@/components/settings/AppBottomSheet";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/hooks/useThemeColors";
import { sharePlanDayImage } from "@/lib/plan-day-share";
import type { ImageSizes } from "@/types/api";
import { cn } from "@/utils/cn";
import { imageUrl } from "@/utils/image-url";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ShareNetwork } from "phosphor-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, View } from "react-native";

interface DayCompletionSheetProps {
  visible: boolean;
  onClose: () => void;
  dayNumber: number;
  totalDays: number;
  completedDays: number;
  planImage?: ImageSizes | null;
  thumbnailUrl?: string | null;
  shareableImageUrl?: string | null;
}

export function DayCompletionSheet({
  visible,
  onClose,
  dayNumber,
  totalDays,
  completedDays,
  planImage,
  thumbnailUrl,
  shareableImageUrl,
}: DayCompletionSheetProps) {
  const { t } = useTranslation();
  const { foreground } = useThemeColors();
  const [sharing, setSharing] = useState(false);

  const progress = totalDays > 0 ? completedDays / totalDays : 0;
  const hasShareableImage = !!shareableImageUrl?.trim();

  const cardImageUri =
    thumbnailUrl?.trim() || imageUrl(planImage, "medium") || "";

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await sharePlanDayImage(shareableImageUrl, t);
    } finally {
      setSharing(false);
    }
  };

  return (
    <AppBottomSheet visible={visible} onClose={onClose} maxHeight="85%">
      <View className="items-center px-6 pt-2">
        <View
          className="mb-4 items-center justify-center rounded-full"
          style={{
            width: 50,
            height: 50,
            borderWidth: 2,
            borderColor: foreground,
          }}
        >
          <Ionicons name="checkmark" size={30} color={foreground} />
        </View>

        <Text
          className="mb-5 text-xl text-foreground"
          style={{ fontFamily: "Inter-Black", fontWeight: "900" }}
        >
          {t("planTrack.day_of", { day: dayNumber, total: totalDays })}
        </Text>

        {cardImageUri ? (
          <Image
            source={{ uri: cardImageUri }}
            style={{ width: "100%", height: 180, borderRadius: 12 }}
            contentFit="cover"
          />
        ) : (
          <View
            className="w-full items-center justify-center rounded-xl bg-muted/40"
            style={{ height: 180 }}
          >
            <Ionicons name="image-outline" size={40} color={foreground} />
          </View>
        )}

        <View className="mt-6 w-full">
          {hasShareableImage ? (
            <Pressable
              onPress={handleShare}
              disabled={sharing}
              className={cn(
                "h-[52px] flex-row items-center justify-center gap-2 rounded-full bg-black active:opacity-85",
                sharing && "opacity-85",
              )}
            >
              {sharing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <ShareNetwork size={22} color="#fff" />
                  <Text className="text-base font-bold text-white">
                    {t("planTrack.share_this_day")}
                  </Text>
                </>
              )}
            </Pressable>
          ) : (
            <View className="h-[5px] w-full overflow-hidden rounded-sm bg-[#e8e8e4]">
              <View
                className="h-[5px] bg-destructive"
                style={{ width: `${Math.min(100, progress * 100)}%` }}
              />
            </View>
          )}
        </View>
      </View>
    </AppBottomSheet>
  );
}
