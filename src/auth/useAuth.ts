// src/auth/useAuth.ts
import { useEffect, useState } from "react";
import type { AuthUser, AuthResult } from "../auth/authStore";
import { getAccessToken, getCurrentUser, clearAuth } from "./authStore";

/**
 * Hook بسيط يرجع حالة المستخدم الحالي
 * يعتمد على الدوال الموجودة في authStore.ts
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!getAccessToken()
  );

  useEffect(() => {
    // لو حابب تسجّل تغييرات من localStorage (مثلاً لو فتح صفحة ثانية)
    const handler = () => {
      const u = getCurrentUser();
      setUser(u);
      setIsAuthenticated(!!u && !!getAccessToken());
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const roles = user?.role ? [user.role] : [];

  const logout = () => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, roles, logout };
}
