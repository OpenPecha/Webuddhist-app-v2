import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Auth0ProviderWrapper } from '@/providers/auth0';
import '../../global.css';

export default function TabLayout() {
  return (
    <Auth0ProviderWrapper>
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="routes/recitation">
        <NativeTabs.Trigger.Label>Recitation</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.fill" md="book" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="routes/setting" role='more'>
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Setting</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
    </Auth0ProviderWrapper>
  );
}
