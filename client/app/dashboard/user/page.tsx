"use client";

import { useEffect } from "react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import useRequestsStore from "@/store/requestsStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import CreateRequestModal from "@/components/requests/CreateRequestModal";
import { StatsGridSkeleton } from "@/components/requests/StatsSkeleton";
import { RequestSmallListSkeleton } from "@/components/requests/RequestSkeleton";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusBadge, getStatusText, formatDate } from "@/lib/requestUtils";

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { requests, loading, fetchRequests } = useRequestsStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Calcular estadísticas
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const inProgressRequests = requests.filter(
    (r) => r.status === "in_progress",
  ).length;

  const resolvedRequests = requests.filter(
    (r) => r.status === "resolved",
  ).length;

  const rejectedRequests = requests.filter(
    (r) => r.status === "rejected",
  ).length;

  // Solicitudes recientes (últimas 5)
  const recentRequests = requests.slice(0, 5);

  return (
    <RoleProtectedRoute allowedRoles={["CLIENT"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Bienvenido, {user?.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Gestiona tus solicitudes CIFRA-IT desde aquí
            </p>
          </div>
          <CreateRequestModal />
        </div>

        {loading ? (
          <StatsGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Solicitudes
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {totalRequests}
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
                    Pendientes
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {pendingRequests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    En Progreso
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {inProgressRequests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resueltas</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {resolvedRequests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Solicitudes Recientes
              </h3>
              {!loading && totalRequests > 0 && (
                <Link href="/dashboard/user/requests">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Ver todas
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>

            {loading ? (
              <RequestSmallListSkeleton count={5} />
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No tienes solicitudes aún</p>
                <CreateRequestModal />
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {request.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Creada el {formatDate(request.created_at)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}
                      >
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && totalRequests > 0 && (
            <div className="space-y-6">
              <div className="border p-6 rounded-lg shadow-sm text-secondary hover:border-primary transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Resumen</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">
                      Tasa de resolución
                    </span>
                    <span className="text-2xl font-bold ">
                      {totalRequests > 0
                        ? Math.round((resolvedRequests / totalRequests) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{
                        width: `${totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                    <div>
                      <p className="text-xs opacity-75">Activas</p>
                      <p className="text-xl font-bold">
                        {pendingRequests + inProgressRequests}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">Completadas</p>
                      <p className="text-xl font-bold">{resolvedRequests}</p>
                    </div>
                  </div>
                  {rejectedRequests > 0 && (
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-75">Rechazadas</span>
                        <span className="font-semibold">
                          {rejectedRequests}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Link href="/dashboard/user/requests" className="block">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Ver todas mis solicitudes
                      </h4>
                      <p className="text-sm text-gray-600">
                        Gestiona y filtra tus solicitudes
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default UserDashboard;
