"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import useSupportUsersStore from "@/store/supportUsersStore";

interface DeleteSupportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string | null;
}

export function DeleteSupportUserModal({
  isOpen,
  onClose,
  userId,
  userName,
}: DeleteSupportUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteSupportUser } = useSupportUsersStore();

  const handleDelete = async () => {
    if (!userId) return;

    setIsDeleting(true);
    try {
      await deleteSupportUser(userId);
      onClose();
    } catch (error) {
      console.error("Error deleting support user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="pt-2">
            ¿Estás seguro de que deseas eliminar al usuario de soporte{" "}
            <span className="font-semibold text-gray-900">{userName}</span>?
            <br />
            <br />
            Esta acción no se puede deshacer y el usuario perderá el acceso
            inmediatamente al sistema.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar Usuario"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
