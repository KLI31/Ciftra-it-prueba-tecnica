"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SelectSupport from "./SelectSupport";
import useRequestsStore from "@/store/requestsStore";

interface AssignRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  requestTitle?: string;
  currentSupportId?: string;
}

export default function AssignRequestModal({
  isOpen,
  onClose,
  requestId,
  requestTitle,
  currentSupportId,
}: AssignRequestModalProps) {
  const { assignRequest } = useRequestsStore();
  const [selectedSupport, setSelectedSupport] = useState<string>(
    currentSupportId || ""
  );
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedSupport) return;

    setIsAssigning(true);
    try {
      await assignRequest(requestId, { supportId: selectedSupport });
      setSelectedSupport("");
      onClose();
    } catch (error) {
      console.error("Error assigning request:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    if (!isAssigning) {
      setSelectedSupport(currentSupportId || "");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentSupportId ? "Reasignar" : "Asignar"} Solicitud
          </DialogTitle>
          <DialogDescription>
            {requestTitle && (
              <span className="block mt-2 font-medium text-gray-700">
                "{requestTitle}"
              </span>
            )}
            <span className="block mt-2">
              Selecciona un miembro del equipo de soporte para{" "}
              {currentSupportId ? "reasignar" : "asignar"} esta solicitud.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="support">
              Miembro del Soporte <span className="text-red-500">*</span>
            </Label>
            <SelectSupport
              value={selectedSupport}
              onValueChange={setSelectedSupport}
              disabled={isAssigning}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isAssigning}
          >
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!selectedSupport || isAssigning}>
            {isAssigning
              ? "Asignando..."
              : currentSupportId
                ? "Reasignar"
                : "Asignar"}{" "}
            Solicitud
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
