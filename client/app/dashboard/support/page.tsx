"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import useRequestsStore from "@/store/requestsStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ListTodo,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SupportDashboard = () => {
  const { user } = useAuthStore();
  const { requests, loading, fetchRequests } = useRequestsStore();

  useEffect(() => {
    // Cargar solo las solicitudes asignadas al usuario de soporte
    fetchRequests();
  }, [fetchRequests]);

  // Estadísticas calculadas desde las solicitudes asignadas
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in_progress").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const resolutionRate =
    stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0;

  // Solicitudes recientes (últimas 5)
  const recentRequests = requests.slice(0, 5);

  return (
    <RoleProtectedRoute allowedRoles={["SUPPORT"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary">
            Dashboard de Soporte
          </h2>
          <p className="text-gray-600 mt-1">
            Bienvenido, {user?.name} - Tus solicitudes asignadas
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Solicitudes Asignadas
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {stats.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Total de solicitudes
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      En Progreso
                    </p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {stats.inProgress}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Trabajando actualmente
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pendientes
                    </p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                      {stats.pending}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Esperando inicio
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Resueltas
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {stats.resolved}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Completadas exitosamente
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rechazadas
                    </p>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {stats.rejected}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      No pudieron resolverse
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tasa de Resolución
                    </p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {resolutionRate}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Efectividad general
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ListTodo className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Solicitudes Recientes
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Últimas 5 solicitudes asignadas
                    </p>
                  </div>
                  <Link href="/dashboard/support/assigned-requests">
                    <Button variant="outline" size="sm">
                      Ver Todas
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {recentRequests.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      No tienes solicitudes asignadas aún
                    </p>
                  </div>
                ) : (
                  recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {request.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-600">
                              Cliente: {request.client_name}{" "}
                              {request.client_lastname}
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : request.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : request.status === "resolved"
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {request.status === "pending"
                                ? "Pendiente"
                                : request.status === "in_progress"
                                  ? "En Progreso"
                                  : request.status === "resolved"
                                    ? "Resuelta"
                                    : "Rechazada"}
                            </span>
                          </div>
                        </div>
                        <Link href="/dashboard/support/assigned-requests">
                          <Button size="sm" variant="ghost">
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default SupportDashboard;
