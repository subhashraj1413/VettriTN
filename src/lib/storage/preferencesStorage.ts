import AsyncStorage from '@react-native-async-storage/async-storage';

import { Session } from '../../features/auth/types';

const SESSION_KEY = 'vettri.session';
const THEME_KEY = 'vettri.theme';

export type AppThemeMode = 'classic' | 'modern';

export async function readSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function writeSession(session: Session) {
  return AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  return AsyncStorage.removeItem(SESSION_KEY);
}

export async function readThemeMode() {
  const raw = await AsyncStorage.getItem(THEME_KEY);
  return raw === 'classic' || raw === 'modern' ? raw : null;
}

export function writeThemeMode(mode: AppThemeMode) {
  return AsyncStorage.setItem(THEME_KEY, mode);
}
