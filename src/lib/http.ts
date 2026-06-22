import axios from 'axios';
import { API_BASE_URL } from '@/config/apiOrigin';
import {
  AuthenticationFailure,
  NetworkFailure,
  NotFoundFailure,
  RateLimitFailure,
  ConflictFailure,
  ServerFailure,
  UnknownFailure,
} from '@/lib/api-error';
import { extractApiErrorMessage } from '@/lib/http-error';

type AuthTokenProvider = () => Promise<string | null>;
let authTokenProvider: AuthTokenProvider | null = null;

export const setAuthTokenProvider = (provider: AuthTokenProvider | null) => {
  authTokenProvider = provider;
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

http.interceptors.request.use(async (config) => {
  if (authTokenProvider) {
    const token = await authTokenProvider();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(new NetworkFailure());
    }

    const { status, data } = error.response;
    const apiMessage = extractApiErrorMessage(data);

    if (status === 401) {
      return Promise.reject(new AuthenticationFailure(apiMessage || 'Authentication required'));
    }
    if (status === 403 && apiMessage.toLowerCase().includes('not authenticated')) {
      return Promise.reject(new AuthenticationFailure(apiMessage));
    }
    if (status === 404) {
      return Promise.reject(new NotFoundFailure());
    }
    if (status === 429) {
      return Promise.reject(new RateLimitFailure());
    }
    if (status === 409) {
      const detail = data?.detail as { message?: string; suggestions?: string[] } | undefined;
      return Promise.reject(
        new ConflictFailure(
          detail?.message ?? apiMessage ?? 'Conflict',
          detail?.suggestions ?? [],
        ),
      );
    }
    if (status >= 500) {
      return Promise.reject(new ServerFailure(status, apiMessage || 'Server error'));
    }

    // #region agent log
    const requestUrl = error.config?.url ?? '';
    if (requestUrl.includes('timer_stop')) {
      fetch('http://127.0.0.1:7544/ingest/57328dfe-8256-4e2a-91e6-138b7c8b37e5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '3a2ae6' },
        body: JSON.stringify({
          sessionId: '3a2ae6',
          runId: 'pre-fix',
          hypothesisId: 'H3-H4',
          location: 'http.ts:interceptor:timer_stop',
          message: 'timer_stop HTTP error before UnknownFailure',
          data: { status, apiMessage, responseData: data, requestBody: error.config?.data },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
    // #endregion

    return Promise.reject(new UnknownFailure(apiMessage || 'An unexpected error occurred'));
  },
);
