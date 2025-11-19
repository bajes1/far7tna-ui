// RequireRole.tsx
import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "./token";
export default function RequireRole({ roles }: { roles: string[] }) {
  const role = getRole();
  if (!role || !roles.includes(role)) return <Navigate to="/login" replace />;
  return <Outlet />;
}
