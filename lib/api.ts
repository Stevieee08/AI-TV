import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS, API_BASE_URL } from '@/constants';

const TIMEOUT_MS = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Safe SecureStore get — never throws
async function safeSecureGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

// Safe SecureStore set — only writes valid non-empty strings
async function safeSecureSet(key: string, value: string): Promise<void> {
  try {
    if (value && typeof value === 'string' && value.length > 0) {
      await SecureStore.setItemAsync(key, value);
    }
  } catch {}
}

async function safeSecureDel(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Attach bearer token to every request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await safeSecureGet(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 refresh + network retries + extract API error messages
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // 401 → try token refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await safeSecureGet(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_BASE_URL}/api/v1/users/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        await safeSecureSet(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await safeSecureSet(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        await safeSecureDel(STORAGE_KEYS.ACCESS_TOKEN);
        await safeSecureDel(STORAGE_KEYS.REFRESH_TOKEN);
        return Promise.reject(error);
      }
    }

    // Network error → retry with back-off
    if (!error.response && originalRequest) {
      const retryCount = originalRequest._retryCount || 0;
      if (retryCount < MAX_RETRIES) {
        originalRequest._retryCount = retryCount + 1;
        await sleep(RETRY_DELAY_MS * (retryCount + 1));
        return apiClient(originalRequest);
      }
    }

    // Extract readable message from API response body
    const apiMessage =
      (error.response?.data as { message?: string })?.message ||
      (error.response?.data as { error?: string })?.error;

    if (apiMessage) {
      return Promise.reject(new Error(apiMessage));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
