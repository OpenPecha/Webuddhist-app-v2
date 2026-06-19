import { Text } from '@/components/ui/text';

export function SettingsSectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-muted-foreground text-xs font-semibold tracking-wider">{title}</Text>
  );
}
