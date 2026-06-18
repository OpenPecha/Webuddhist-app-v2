type ImagePickerModule = typeof import('expo-image-picker');

let cachedModule: ImagePickerModule | null = null;
let loadFailed = false;

/** Lazy-load expo-image-picker so routes work before a native rebuild. */
export async function getImagePicker(): Promise<ImagePickerModule | null> {
  if (loadFailed) return null;
  if (cachedModule) return cachedModule;

  try {
    cachedModule = await import('expo-image-picker');
    return cachedModule;
  } catch {
    loadFailed = true;
    return null;
  }
}

export async function pickProfileImage(
  source: 'library' | 'camera',
): Promise<string | null> {
  const ImagePicker = await getImagePicker();
  if (!ImagePicker) return null;

  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) return null;

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}
