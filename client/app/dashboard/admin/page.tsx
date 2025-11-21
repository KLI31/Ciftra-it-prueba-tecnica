"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import useRequestsStore from "@/store/requestsStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import { StatsGridSkeleton } from "@/components/requests/StatsSkeleton";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { requestStats, loading, fetchRequestStats } = useRequestsStore();

  useEffect(() => {
    fetchRequestStats();
  }, [fetchRequestStats]);

  const stats = requestStats?.overview;
  const byStatus = requestStats?.byStatus || [];
  const monthlyTrends = requestStats?.monthlyTrends || [];
  const supportPerformance = requestStats?.supportPerformance || [];

  const doughnutData = {
    labels: byStatus.map((s) => {
      const labels: Record<string, string> = {
        pending: "Pendientes",
        in_progress: "En Progreso",
        resolved: "Resueltas",
        rejected: "Rechazadas",
      };
      return labels[s.status] || s.status;
    }),
    datasets: [
      {
        data: byStatus.map((s) => s.count),
        backgroundColor: [
          "rgba(234, 179, 8, 0.8)", // Amarrillo   - Pendientes
          "rgba(59, 130, 246, 0.8)", // Azul - En progreso
          "rgba(34, 197, 94, 0.8)", // Verde - Resuelta
          "rgba(239, 68, 68, 0.8)", // Rojo - Rechazada
        ],
        borderColor: [
          "rgba(234, 179, 8, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: monthlyTrends.slice(-6).map((m) => m.label),
    datasets: [
      {
        label: "Pendientes",
        data: monthlyTrends.slice(-6).map((m) => m.pending),
        backgroundColor: "rgba(234, 179, 8, 0.8)",
      },
      {
        label: "En Progreso",
        data: monthlyTrends.slice(-6).map((m) => m.in_progress),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
      {
        label: "Resueltas",
        data: monthlyTrends.slice(-6).map((m) => m.resolved),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
      {
        label: "Rechazadas",
        data: monthlyTrends.slice(-6).map((m) => m.rejected),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
      },
    ],
  };

  const lineData = {
    labels: monthlyTrends.slice(-6).map((m) => m.label),
    datasets: [
      {
        label: "Total de Solicitudes",
        data: monthlyTrends.slice(-6).map((m) => m.total),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <RoleProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary">
            Dashboard Administrador
          </h2>
          <p className="text-gray-600 mt-1">
            Bienvenido, {user?.name} - Estadísticas y métricas del sistema
          </p>
        </div>

        {loading ? (
          <StatsGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Solicitudes
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {stats?.total || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +{stats?.today || 0} hoy
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
                    Sin Asignar
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {stats?.unassigned || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requieren atención
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
                    Esta Semana
                  </p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {stats?.thisWeek || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Últimos 7 días</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mes</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {stats?.thisMonth || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stats?.monthGrowth || 0}% vs mes anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resueltas</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {byStatus.find((s) => s.status === "resolved")?.count || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {byStatus
                      .find((s) => s.status === "resolved")
                      ?.percentage.toFixed(1) || 0}
                    % del total
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
                    Equipo Soporte
                  </p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">
                    {supportPerformance.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Usuarios activos</p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por Estado
            </h3>
            {loading ? (
              <Skeleton className="w-full h-[300px]" />
            ) : byStatus.length > 0 ? (
              <div className="h-[300px]">
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tendencia Mensual
            </h3>
            {loading ? (
              <Skeleton className="w-full h-[300px]" />
            ) : monthlyTrends.length > 0 ? (
              <div className="h-[300px]">
                <Line data={lineData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Solicitudes por Mes (Últimos 6 meses)
          </h3>
          {loading ? (
            <Skeleton className="w-full h-[350px]" />
          ) : monthlyTrends.length > 0 ? (
            <div className="h-[350px]">
              <Bar data={barData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>

        {!loading && supportPerformance.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rendimiento del Equipo de Soporte
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Miembro
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Asignadas
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Resueltas
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      En Progreso
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Tasa de Resolución
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {supportPerformance.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {member.totalAssigned}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {member.resolved}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {member.inProgress}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${member.resolutionRate}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {member.resolutionRate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default AdminDashboard;
