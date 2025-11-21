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

  // Primero verificar autenticación, luego verificar rol
  return (
    <ProtectedRoute>
      {role && allowedRoles.includes(role) ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600">
              No tienes permisos para acceder a esta página.
            </p>
            <p className="text-sm text-gray-500 mt-2">Redirigiendo...</p>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default RoleProtectedRoute;
