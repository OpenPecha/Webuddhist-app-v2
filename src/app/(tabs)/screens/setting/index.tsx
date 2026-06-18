import { type Href, Redirect } from 'expo-router';

/** @deprecated Use `/me/settings/index` from the Me tab gear icon. */
export default function LegacySettingScreen() {
  return <Redirect href={'/me/settings/index' as Href} />;
}
