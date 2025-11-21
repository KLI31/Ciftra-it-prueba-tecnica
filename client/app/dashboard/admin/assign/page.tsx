"use client";

import { useEffect, useState } from "react";
import useRequestsStore from "@/store/requestsStore";
import useSupportUsersStore from "@/store/supportUsersStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import AssignRequestModal from "@/components/support/AssignRequestModal";
import { RequestListSkeleton } from "@/components/requests/RequestSkeleton";
import { FileText, UserPlus, Calendar, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const AssignRequestsPage = () => {
  const { requests, loading, fetchRequests } = useRequestsStore();
  const { supportUsers, fetchSupportUsers } = useSupportUsersStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    title: string;
    currentSupportId?: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchRequests({ status: statusFilter as any });
    fetchSupportUsers();
  }, [fetchRequests, fetchSupportUsers, statusFilter]);

  const handleOpenDialog = (
    requestId: string,
    title: string,
    currentSupportId?: string,
  ) => {
    setSelectedRequest({ id: requestId, title, currentSupportId });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  // Filtrar solicitudes
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Agrupar por estado
  const unassignedRequests = filteredRequests.filter((r) => !r.assigned_to);
  const assignedRequests = filteredRequests.filter((r) => r.assigned_to);

  return (
    <RoleProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Asignar Solicitudes
          </h2>
          <p className="text-gray-600 mt-1">
            Asigna solicitudes a miembros del equipo de soporte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sin Asignar</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {unassignedRequests.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Asignadas</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {assignedRequests.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Equipo Soporte
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {supportUsers.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título, cliente o email..."
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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="resolved">Resueltas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
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
              No se encontraron solicitudes
            </h3>
            <p className="text-gray-600">
              Intenta cambiar los filtros de búsqueda
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Asignado a
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
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className="font-medium text-gray-900">
                            {request.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.client_name} {request.client_lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.client_email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(request.status)}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {request.assigned_to ? (
                          <div>
                            <p className="font-medium text-gray-900">
                              {request.support_name} {request.support_lastname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.support_email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            Sin asignar
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(request.created_at)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {request.status !== "resolved" &&
                          request.status !== "rejected" && (
                            <Button
                              size="sm"
                              variant={
                                request.assigned_to ? "outline" : "default"
                              }
                              onClick={() =>
                                handleOpenDialog(
                                  request.id,
                                  request.title,
                                  request.assigned_to,
                                )
                              }
                              className="gap-2"
                            >
                              <UserPlus className="w-4 h-4" />
                              {request.assigned_to ? "Reasignar" : "Asignar"}
                            </Button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {selectedRequest && (
          <AssignRequestModal
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            requestId={selectedRequest.id}
            requestTitle={selectedRequest.title}
            currentSupportId={selectedRequest.currentSupportId}
          />
        )}

        {/* Results count */}
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

export default AssignRequestsPage;
