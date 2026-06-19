import Constants from 'expo-constants';

/** Matches Flutter `appVersionLabelProvider`: "Version 2.5.5" */
export function getAppVersionLabel(): string {
  const version = Constants.expoConfig?.version ?? '';
  return version ? `Version ${version}` : '';
}
