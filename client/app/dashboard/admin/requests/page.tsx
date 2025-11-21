"use client";

import { useEffect, useState } from "react";
import useRequestsStore from "@/store/requestsStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import { RequestListSkeleton } from "@/components/requests/RequestSkeleton";
import {
  FileText,
  Search,
  Calendar,
  Filter,
  Download,
  Trash2,
  X,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getStatusIcon,
  getStatusBadge,
  getStatusText,
  formatDate,
} from "@/lib/requestUtils";

const AdminRequestsPage = () => {
  const { requests, loading, fetchRequests, deleteRequest } =
    useRequestsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("DESC");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const filters: any = {};

    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }

    if (searchTerm) {
      filters.search = searchTerm;
    }

    filters.sortBy = sortBy;
    filters.sortOrder = sortOrder;

    fetchRequests(filters);
  }, [fetchRequests, statusFilter, searchTerm, sortBy, sortOrder]);

  const handleOpenDeleteDialog = (requestId: string) => {
    setRequestToDelete(requestId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!requestToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRequest(requestToDelete);
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Título",
      "Cliente",
      "Email",
      "Estado",
      "Asignado a",
      "Fecha Creación",
    ];
    const rows = filteredRequests.map((req) => [
      req.id,
      req.title,
      `${req.client_name} ${req.client_lastname}`,
      req.client_email,
      getStatusText(req.status),
      req.assigned_to
        ? `${req.support_name} ${req.support_lastname}`
        : "Sin asignar",
      formatDate(req.created_at),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `solicitudes_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("created_at");
    setSortOrder("DESC");
  };

  const filteredRequests = requests.filter((request) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        request.title.toLowerCase().includes(search) ||
        request.client_name.toLowerCase().includes(search) ||
        request.client_lastname.toLowerCase().includes(search) ||
        request.client_email.toLowerCase().includes(search) ||
        (request.support_name &&
          request.support_name.toLowerCase().includes(search)) ||
        (request.support_email &&
          request.support_email.toLowerCase().includes(search))
      );
    }
    return true;
  });

  // Estadísticas de filtrado
  const stats = {
    total: filteredRequests.length,
    pending: filteredRequests.filter((r) => r.status === "pending").length,
    inProgress: filteredRequests.filter((r) => r.status === "in_progress")
      .length,
    resolved: filteredRequests.filter((r) => r.status === "resolved").length,
    rejected: filteredRequests.filter((r) => r.status === "rejected").length,
  };

  return (
    <RoleProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary">
              Gestión de Solicitudes
            </h2>
            <p className="text-gray-600 mt-1">
              Vista completa con filtros avanzados
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="gap-2"
              disabled={filteredRequests.length === 0}
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Filtros Avanzados
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Limpiar Filtros
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Label htmlFor="sortBy">Ordenar por</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">
                      Fecha de Creación
                    </SelectItem>
                    <SelectItem value="updated_at">
                      Última Actualización
                    </SelectItem>
                    <SelectItem value="status">Estado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Orden</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger id="sortOrder">
                    <SelectValue placeholder="Orden" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DESC">Descendente</SelectItem>
                    <SelectItem value="ASC">Ascendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Búsqueda</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar..."
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
                placeholder="Buscar por título, cliente, email o soporte..."
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
                ? "No hay solicitudes"
                : "No se encontraron solicitudes"}
            </h3>
            <p className="text-gray-600">
              {requests.length === 0
                ? "Aún no hay solicitudes en el sistema"
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Asignado a
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Creado
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Actualizado
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Acciones
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
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {request.response}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {request.client_name} {request.client_lastname}
                          </p>
                          <p className="text-xs text-gray-500">
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
                            <p className="font-medium text-gray-900 text-sm">
                              {request.support_name} {request.support_lastname}
                            </p>
                            <p className="text-xs text-gray-500">
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
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(request.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-gray-600">
                          {formatDate(request.updated_at)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDeleteDialog(request.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar esta solicitud? Esta acción
                no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

export default AdminRequestsPage;
