// src/api.ts
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import type { AuthResult } from "../auth/authStore";
import {
  getAccessToken,
  getRefreshToken,
  setAuth,
  clearAuth,
} from "../auth/authStore";

// 👇 غيّرها من .env إذا حاب
const baseURL =
  import.meta.env.VITE_API_URL ?? "https://localhost:5001";

// إنشاء instance واحد من Axios
export const api = axios.create({
  baseURL,
  withCredentials: false,
});

// ========= Request Interceptor =========
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========= Refresh Logic =========
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  // منع تكرار طلب refresh أكثر من مرة في نفس الوقت
  if (!refreshPromise) {
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const res = await axios.post<AuthResult>(
          `${baseURL}/api/tokens/refresh`,
          { refreshToken }
        );

        const result = res.data;
        setAuth(result);
        return result.accessToken;
      } catch (err) {
        clearAuth();
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

// ========= Response Interceptor =========
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
