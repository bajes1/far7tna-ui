import React, { createContext, useContext, useMemo, useState } from "react";
import {api} from "../lib/api";
import { saveAuth, clearAuth, getUser } from "./token";

type UserInfo = { id:string; email:string; fullName?:string; role:"Admin"|"Vendor"|"Customer" } | null;
type Ctx = { user: UserInfo; login:(e:string,p:string)=>Promise<void>; logout:()=>void; };

const C = createContext<Ctx>(null as any);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>(() => getUser());

  const value = useMemo(() => ({
    user,
    async login(email: string, password: string) {
      const { data } = await api.post("/auth/login", { email, password });
      // نتوقع { accessToken, user:{id,email,fullName,role} }
      saveAuth(data.accessToken, JSON.stringify(data.user));
      setUser(data.user);
    },
    logout() {
      clearAuth();
      setUser(null);
      location.href = "/login";
    }
  }), [user]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);
