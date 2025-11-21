"use client";

import { useEffect, useState } from "react";
import useRequestsStore from "@/store/requestsStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import CreateRequestModal from "@/components/requests/CreateRequestModal";
import { RequestListSkeleton } from "@/components/requests/RequestSkeleton";
import { FileText, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getStatusIcon,
  getStatusBadge,
  getStatusText,
  formatDate,
} from "@/lib/requestUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RequestsPage = () => {
  const { requests, loading, fetchRequests } = useRequestsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <RoleProtectedRoute allowedRoles={["CLIENT"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Mis Solicitudes
            </h2>
            <p className="text-gray-600 mt-1">
              Gestiona y crea nuevas solicitudes de soporte
            </p>
          </div>

          <CreateRequestModal />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="resolved">Resuelta</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <RequestListSkeleton count={5} />
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {requests.length === 0
                ? "No tienes solicitudes"
                : "No se encontraron solicitudes"}
            </h3>
            <p className="text-gray-600 mb-6">
              {requests.length === 0
                ? "Crea tu primera solicitud de soporte"
                : "Intenta cambiar los filtros de búsqueda"}
            </p>
            {requests.length === 0 && <CreateRequestModal />}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-1">{getStatusIcon(request.status)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {request.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(request.created_at)}</span>
                        </div>
                        {request.assigned_to && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Asignado a:</span>
                            <span className="font-medium">
                              {request.support_name} {request.support_lastname}
                            </span>
                          </div>
                        )}
                      </div>
                      {request.response && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Respuesta del equipo:
                          </p>
                          <p className="text-sm text-gray-600">
                            {request.response}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(request.status)}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredRequests.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Mostrando {filteredRequests.length} de {requests.length}{" "}
            solicitud(es)
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default RequestsPage;
