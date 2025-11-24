import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAuth,
  setAuth,
  clearAuth,
  type AuthResult,
} from "./authStore";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  roles: string[];
  login: (result: AuthResult) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // تحميل المستخدم من localStorage عند أول تحميل
  useEffect(() => {
    const stored = getAuth();
    if (stored?.user) {
      setUser(stored.user);
    }
  }, []);

  const login = (result: AuthResult) => {
    setAuth(result);
    setUser(result.user);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      roles: user?.role ? [user.role] : [],
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
