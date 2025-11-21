"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import useAuthStore from "@/store/authStore";

const SupportDashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <RoleProtectedRoute allowedRoles={["SUPPORT"]}>
      <div className="p-6 container mx-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-secondary mb-2">
              Dashboard Soporte
            </h1>
            <p className="text-gray-600">
              Bienvenido, {user?.name} {user?.lastname}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Tickets Abiertos</h3>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">En Progreso</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Resueltos Hoy</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold mb-4">Panel de Soporte</h2>
            <p className="text-gray-600 mb-4">
              Gestiona solicitudes y brinda soporte a los usuarios.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                • Gestión de tickets y solicitudes
              </p>
              <p className="text-sm text-gray-500">• Atención a usuarios</p>
              <p className="text-sm text-gray-500">• Seguimiento de casos</p>
              <p className="text-sm text-gray-500">• Historial de soporte</p>
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

export default SupportDashboard;
