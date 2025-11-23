// src/auth/authStore.ts
export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

const ACCESS_KEY = "far7tna_access";
const REFRESH_KEY = "far7tna_refresh";
const USER_KEY = "far7tna_user";

// حفظ بيانات الدخول
export function setAuth(result: AuthResult) {
  localStorage.setItem(ACCESS_KEY, result.accessToken);
  localStorage.setItem(REFRESH_KEY, result.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));
}

// مسح بيانات الدخول
export function clearAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

// قراءة الـ Tokens
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
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
