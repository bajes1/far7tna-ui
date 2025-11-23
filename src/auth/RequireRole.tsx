import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

type Props = {
  children: ReactNode;
  roles: string[];
};

export default function RequireRole({ children, roles }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
