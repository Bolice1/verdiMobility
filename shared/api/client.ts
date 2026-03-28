import type { ApiError, AuthTokens } from '../types';

type TokenBundle = Partial<AuthTokens>;

export type TokenProvider = () => Promise<TokenBundle | null> | TokenBundle | null;
export type TokenSetter = (tokens: TokenBundle | null) => Promise<void> | void;

export type ApiClientOptions = {
  baseUrl: string;
  getTokens: TokenProvider;
  setTokens: TokenSetter;
  onUnauthorized?: () => Promise<void> | void;
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  requiresAuth?: boolean;
  retryCount?: number;
  headers?: Record<string, string>;
};

export class HttpError extends Error {
  status: number;
  payload: ApiError | null;

  constructor(status: number, payload: ApiError | null) {
    super(payload?.error || `HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']) {
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

export function createApiClient(options: ApiClientOptions) {
  let refreshingPromise: Promise<boolean> | null = null;

  async function refreshAccessToken(): Promise<boolean> {
    if (refreshingPromise) {
      return refreshingPromise;
    }

    refreshingPromise = (async () => {
      const tokens = await options.getTokens();
      if (!tokens?.refreshToken) return false;

      const response = await fetch(buildUrl(options.baseUrl, '/api/auth/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        await options.setTokens(null);
        return false;
      }

      const payload = await parseJsonSafe<AuthTokens>(response);
      if (!payload) return false;

      await options.setTokens({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
      return true;
    })().finally(() => {
      refreshingPromise = null;
    });

    return refreshingPromise;
  }

  async function request<T>(path: string, requestOptions: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      query,
      requiresAuth = true,
      retryCount = 1,
      headers = {},
    } = requestOptions;

    const tokens = await options.getTokens();
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    if (body !== undefined) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    if (requiresAuth && tokens?.accessToken) {
      requestHeaders.Authorization = `Bearer ${tokens.accessToken}`;
    }

    const response = await fetch(buildUrl(options.baseUrl, path, query), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && requiresAuth && retryCount > 0) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return request<T>(path, {
          ...requestOptions,
          retryCount: retryCount - 1,
        });
      }
      await options.onUnauthorized?.();
    }

    if (!response.ok) {
      const payload = await parseJsonSafe<ApiError>(response);
      throw new HttpError(response.status, payload);
    }

    const payload = await parseJsonSafe<T>(response);
    return payload as T;
  }

  return {
    get: <T>(path: string, query?: RequestOptions['query'], requiresAuth = true) =>
      request<T>(path, { method: 'GET', query, requiresAuth }),
    post: <T>(path: string, body?: unknown, requiresAuth = true) =>
      request<T>(path, { method: 'POST', body, requiresAuth }),
    patch: <T>(path: string, body?: unknown, requiresAuth = true) =>
      request<T>(path, { method: 'PATCH', body, requiresAuth }),
  };
}
