import { FloatingTextInput } from '@/components/ui/floating-text-input';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { UsernameValidationKey } from '@/lib/username-validation';
import { Check, X } from 'phosphor-react-native';
import { useTranslate } from '@tolgee/react';

export type UsernameFieldState = 'idle' | 'checking' | 'available' | 'taken' | 'error';

interface UsernameFormFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  state: UsernameFieldState;
  validationKey?: UsernameValidationKey;
  suggestions?: string[];
  onSuggestionTap?: (suggestion: string) => void;
}

export function UsernameFormField({
  value,
  onChangeText,
  state,
  validationKey,
  suggestions = [],
  onSuggestionTap,
}: UsernameFormFieldProps) {
  const { t } = useTranslate();

  const trailingIcon =
    state === 'checking' ? (
      <ActivityIndicator size="small" />
    ) : state === 'available' ? (
      <Check size={20} color="#0d530e" />
    ) : state === 'taken' ? (
      <X size={20} color="#dc341e" />
    ) : null;

  return (
    <View>
      <FloatingTextInput
        label={t('username_label')}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        trailingIcon={trailingIcon}
      />
      {validationKey ? (
        <Text className="text-destructive mt-1 text-sm">{t(`profile.${validationKey}`)}</Text>
      ) : null}
      {state === 'error' ? (
        <Text className="text-destructive mt-1 text-sm">{t('username_check_error')}</Text>
      ) : null}
      {state === 'checking' ? (
        <Text className="text-muted-foreground mt-1 text-sm">{t('username_checking', "Checking availability…")}</Text>
      ) : null}
      {state === 'available' ? (
        <Text className="mt-1 text-sm text-[#0d530e]">{t('username_available', "Username is available")}</Text>
      ) : null}
      {state === 'taken' ? (
        <View className="mt-1">
          <Text className="text-destructive text-sm">{t('username_taken')}</Text>
          {suggestions.length > 0 ? (
            <View className="mt-1 flex-row flex-wrap gap-2">
              <Text className="text-muted-foreground text-sm">{t('username_available_label')}</Text>
              {suggestions.map((s) => (
                <Pressable key={s} onPress={() => onSuggestionTap?.(s)}>
                  <Text className="text-accent text-sm font-medium">{s}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
