// RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "./token";
export default function RequireAuth() {
  const t = getToken();
  const loc = useLocation();
  if (!t) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Outlet />;
}
