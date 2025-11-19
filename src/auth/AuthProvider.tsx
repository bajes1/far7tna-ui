import { createContext, useContext, useMemo, useState } from "react";

type UserInfo = { id: string; email: string; fullName: string; role: "Admin"|"Vendor"|"Customer" };
type AuthCtx = {
  user: UserInfo | null;
  setUser: (u: UserInfo|null) => void;
  logout: () => void;
};
const Ctx = createContext<AuthCtx | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const value = useMemo(() => ({
    user,
    setUser: (u: UserInfo|null) => {
      setUser(u);
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");
    },
    logout: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
      location.href = "/login";
    }
  }), [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
};
