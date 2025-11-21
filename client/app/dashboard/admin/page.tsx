"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import useAuthStore from "@/store/authStore";

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <RoleProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="p-6 container mx-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-secondary mb-2">
              Dashboard Administrador
            </h1>
            <p className="text-gray-600">
              Bienvenido, {user?.name} {user?.lastname}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Usuarios Totales</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Solicitudes</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Pendientes</h3>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold mb-4">Panel de Control</h2>
            <p className="text-gray-600 mb-4">
              Desde aquí puedes gestionar usuarios, solicitudes y configuración
              del sistema.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                • Gestión completa de usuarios
              </p>
              <p className="text-sm text-gray-500">
                • Control de solicitudes CRIFA-IT
              </p>
              <p className="text-sm text-gray-500">
                • Configuración del sistema
              </p>
              <p className="text-sm text-gray-500">• Reportes y estadísticas</p>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={logout}
            className="cursor-pointer"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default AdminDashboard;
