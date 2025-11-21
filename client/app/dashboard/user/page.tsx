"use client";

import useAuthStore from "@/store/authStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import { FileText, Clock, CheckCircle2 } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuthStore();

  return (
    <RoleProtectedRoute allowedRoles={["CLIENT"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-gray-600 mt-1">
            Gestiona tus solicitudes CRIFA-IT desde aquí
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Mis Solicitudes
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resueltas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              • Crear nuevas solicitudes de soporte
            </p>
            <p className="text-sm text-gray-600">
              • Ver el estado de tus solicitudes activas
            </p>
            <p className="text-sm text-gray-600">
              • Consultar el historial completo
            </p>
            <p className="text-sm text-gray-600">
              • Recibir notificaciones de actualizaciones
            </p>
          </div>
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default UserDashboard;
