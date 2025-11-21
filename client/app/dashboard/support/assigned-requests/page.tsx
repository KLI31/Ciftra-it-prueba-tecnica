"use client";

import { useEffect, useState } from "react";
import useRequestsStore from "@/store/requestsStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import { RespondRequestModal } from "@/components/requests/RespondRequestModal";
import { RequestListSkeleton } from "@/components/requests/RequestSkeleton";
import {
  FileText,
  Search,
  MessageSquare,
  Calendar,
  User,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStatusIcon,
  getStatusBadge,
  getStatusText,
  formatDate,
} from "@/lib/requestUtils";

const AssignedRequestsPage = () => {
  const { requests, loading, fetchRequests } = useRequestsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    title: string;
    status: string;
    response?: string;
  } | null>(null);

  useEffect(() => {
    const filters: any = {};

    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }

    fetchRequests(filters);
  }, [fetchRequests, statusFilter]);

  const handleOpenRespondModal = (request: any) => {
    setSelectedRequest({
      id: request.id,
      title: request.title,
      status: request.status,
      response: request.response,
    });
    setRespondModalOpen(true);
  };

  const handleCloseRespondModal = () => {
    setRespondModalOpen(false);
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter((request) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        request.title.toLowerCase().includes(search) ||
        request.client_name.toLowerCase().includes(search) ||
        request.client_lastname.toLowerCase().includes(search) ||
        request.client_email.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const stats = {
    total: filteredRequests.length,
    pending: filteredRequests.filter((r) => r.status === "pending").length,
    inProgress: filteredRequests.filter((r) => r.status === "in_progress")
      .length,
    resolved: filteredRequests.filter((r) => r.status === "resolved").length,
    rejected: filteredRequests.filter((r) => r.status === "rejected").length,
  };

  return (
    <RoleProtectedRoute allowedRoles={["SUPPORT"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary">
              Solicitudes Asignadas
            </h2>
            <p className="text-gray-600 mt-1">
              Gestiona y responde tus solicitudes
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-medium text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-medium text-gray-600">En Progreso</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-medium text-gray-600">Resueltas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.resolved}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-medium text-gray-600">Rechazadas</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {stats.rejected}
            </p>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filtros
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="resolved">Resuelta</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Búsqueda</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por título o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {loading ? (
          <RequestListSkeleton count={5} />
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {requests.length === 0
                ? "No tienes solicitudes asignadas"
                : "No se encontraron solicitudes"}
            </h3>
            <p className="text-gray-600">
              {requests.length === 0
                ? "Espera a que el administrador te asigne solicitudes"
                : "Intenta cambiar los filtros de búsqueda"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Solicitud
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Cliente
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">
                              {request.title}
                            </p>
                            {request.response && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {request.response}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {request.client_name} {request.client_lastname}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.client_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(request.status)}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(request.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleOpenRespondModal(request)}
                          className="bg-secondary hover:bg-secondary/90"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {request.response ? "Actualizar" : "Responder"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filteredRequests.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Mostrando {filteredRequests.length} de {requests.length}{" "}
            solicitud(es)
          </div>
        )}
      </div>

      <RespondRequestModal
        isOpen={respondModalOpen}
        onClose={handleCloseRespondModal}
        requestId={selectedRequest?.id || null}
        requestTitle={selectedRequest?.title || null}
        currentStatus={selectedRequest?.status || null}
        currentResponse={selectedRequest?.response || null}
      />
    </RoleProtectedRoute>
  );
};

export default AssignedRequestsPage;
