import * as SecureStore from 'expo-secure-store';

import { createVerdiApi } from '../../../shared/api/services';

const STORAGE_KEY = 'verdiMobility.mobile.auth';
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5987';

export async function getStoredTokens() {
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      accessToken?: string;
      refreshToken?: string;
    };
  } catch {
    return null;
  }
}

export async function setStoredTokens(
  tokens: { accessToken?: string; refreshToken?: string } | null,
) {
  if (!tokens?.accessToken || !tokens.refreshToken) {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    return;
  }
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(tokens));
}

export function createApi(onUnauthorized: () => void) {
  return createVerdiApi(API_BASE_URL, {
    getTokens: () => getStoredTokens(),
    setTokens: (tokens) => setStoredTokens(tokens),
    onUnauthorized,
  });
}
