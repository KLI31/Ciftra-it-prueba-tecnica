"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useRequestsStore from "@/store/requestsStore";

export default function CreateRequestModal() {
  const { createRequest } = useRequestsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 5) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createRequest({ title: title.trim() });
      setTitle("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Solicitud
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nueva Solicitud</DialogTitle>
            <DialogDescription>
              Describe tu problema o solicitud de soporte. Nuestro equipo la
              revisará lo antes posible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título de la solicitud <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ej: Problema con acceso al sistema"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                minLength={5}
                maxLength={100}
                required
                disabled={isSubmitting}
                autoFocus
              />
              <p className="text-xs text-gray-500">
                {title.length}/100 caracteres (mínimo 5)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || title.trim().length < 5}
            >
              {isSubmitting ? "Creando..." : "Crear Solicitud"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
