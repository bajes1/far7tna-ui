import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

type Props = {
  children: ReactNode;
  roles: string[];
};

export default function RequireRole({ children, roles }: Props) {
  const { isAuthenticated, roles: userRoles } = useAuth();
  const location = useLocation();

  const hasRole =
    isAuthenticated && userRoles.some((r) => roles.includes(r));

  if (!hasRole) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
