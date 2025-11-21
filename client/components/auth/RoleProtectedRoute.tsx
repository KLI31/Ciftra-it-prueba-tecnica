"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import ProtectedRoute from "./ProtectedRoute";
import { UserRoles } from "@/types/auth.types";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRoles[];
  redirectTo?: string;
}

const RoleProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
}: RoleProtectedRouteProps) => {
  const { role } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      // Si el usuario no tiene el rol permitido, redirigir
      router.push(redirectTo);
    }
  }, [role, allowedRoles, redirectTo, router]);

  return (
    <ProtectedRoute>
      {role && allowedRoles.includes(role) ? children : <></>}
    </ProtectedRoute>
  );
};

export default RoleProtectedRoute;
