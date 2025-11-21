"use client";

import { useEffect, useState } from "react";
import useSupportUsersStore from "@/store/supportUsersStore";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import { CreateSupportUserModal } from "@/components/support/CreateSupportUserModal";
import { DeleteSupportUserModal } from "@/components/support/DeleteSupportUserModal";
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Mail,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/requestUtils";

const SupportUsersPage = () => {
  const { supportUsers, loading, fetchSupportUsers } = useSupportUsersStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchSupportUsers();
  }, [fetchSupportUsers]);

  const handleOpenDeleteDialog = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = supportUsers.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.lastname.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });

  return (
    <RoleProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary">
              Usuarios de Soporte
            </h2>
            <p className="text-gray-600 mt-1">
              Gestiona los usuarios del equipo de soporte
            </p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="gap-2 bg-secondary hover:bg-secondary/90 w-full sm:w-auto sm:self-start"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Buscador y contador */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 justify-center sm:justify-start">
              <Shield className="w-4 h-4" />
              <span className="font-medium">{filteredUsers.length}</span>
              <span>usuario(s)</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto sm:mx-0" />
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <Skeleton className="h-5 w-40 mx-auto sm:mx-0" />
                    <Skeleton className="h-4 w-48 mx-auto sm:mx-0" />
                    <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                  </div>
                  <Skeleton className="h-9 w-full sm:w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          
          <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {supportUsers.length === 0
                ? "No hay usuarios de soporte"
                : "No se encontraron usuarios"}
            </h3>
            <p className="text-gray-600 mb-4">
              {supportUsers.length === 0
                ? "Crea el primer usuario de soporte para comenzar"
                : "Intenta cambiar los términos de búsqueda"}
            </p>
            {supportUsers.length === 0 && (
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="gap-2 bg-secondary hover:bg-secondary/90"
              >
                <UserPlus className="w-4 h-4" />
                Crear Primer Usuario
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto sm:mx-0 shrink-0">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>

                  
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                   
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name} {user.lastname}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        SOPORTE
                      </span>
                    </div>

                   
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 justify-center sm:justify-start text-sm text-gray-600">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center sm:justify-start text-sm text-gray-600">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>Creado: {formatDate(user.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleOpenDeleteDialog(
                        user.id,
                        `${user.name} ${user.lastname}`,
                      )
                    }
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        
        {!loading && filteredUsers.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Mostrando {filteredUsers.length} de {supportUsers.length} usuario(s)
            de soporte
          </div>
        )}
      </div>

      <CreateSupportUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <DeleteSupportUserModal
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        userId={userToDelete?.id || null}
        userName={userToDelete?.name || null}
      />
    </RoleProtectedRoute>
  );
};

export default SupportUsersPage;
