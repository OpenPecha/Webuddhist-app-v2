import { Platform, ToastAndroid } from 'react-native';

type ToastHandler = (message: string) => void;

let toastHandler: ToastHandler | null = null;

export function registerAppToastHandler(handler: ToastHandler | null) {
  toastHandler = handler;
}

export function showAppToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  toastHandler?.(message);
}
