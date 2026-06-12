import axios from 'axios';
import { API_BASE_URL } from '@/config/apiOrigin';
import {
  AuthenticationFailure,
  NetworkFailure,
  NotFoundFailure,
  RateLimitFailure,
  ServerFailure,
  UnknownFailure,
} from '@/lib/api-error';

// Updated by AuthProvider when credentials change — keeps the HTTP client
// decoupled from React context while still injecting fresh tokens.
let authToken: string | null = null;
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

http.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(new NetworkFailure());
    }

    const { status } = error.response;

    if (status === 401) {
      // Auth0 handles token refresh via its SDK; signal the app to re-authenticate.
      return Promise.reject(new AuthenticationFailure());
    }
    if (status === 404) {
      return Promise.reject(new NotFoundFailure());
    }
    if (status === 429) {
      return Promise.reject(new RateLimitFailure());
    }
    if (status >= 500) {
      return Promise.reject(
        new ServerFailure(status, error.response.data?.message ?? 'Server error'),
      );
    }

    return Promise.reject(new UnknownFailure(error.response.data?.message));
  },
);
