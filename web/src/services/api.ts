import { createVerdiApi } from '../../../shared/api/services';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5987';

type WebTokens = {
  accessToken?: string;
  refreshToken?: string;
};

const STORAGE_KEY = 'verdiMobility.web.auth';

export function getStoredTokens(): WebTokens | null {
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WebTokens;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: WebTokens | null) {
  if (!tokens?.accessToken || !tokens.refreshToken) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function createApi(onUnauthorized: () => void) {
  return createVerdiApi(API_BASE_URL, {
    getTokens: () => getStoredTokens(),
    setTokens: (tokens) => setStoredTokens(tokens),
    onUnauthorized,
  });
}
