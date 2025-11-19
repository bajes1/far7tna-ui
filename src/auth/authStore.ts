// src/auth/authStore.ts

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string; // "Admin" | "Vendor" | "Customer" | ...
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

const ACCESS_TOKEN_KEY = "far7tna_access_token";
const REFRESH_TOKEN_KEY = "far7tna_refresh_token";
const USER_KEY = "far7tna_user";

export function setAuth(result: AuthResult) {
  localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
