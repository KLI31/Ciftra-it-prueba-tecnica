"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RespondRequestSchema,
  RespondRequestFormData,
} from "@/schemas/request.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import useRequestsStore from "@/store/requestsStore";

interface RespondRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  requestTitle: string | null;
  currentStatus: string | null;
  currentResponse?: string | null;
}

export function RespondRequestModal({
  isOpen,
  onClose,
  requestId,
  requestTitle,
  currentStatus,
  currentResponse,
}: RespondRequestModalProps) {
  const { respondToRequest } = useRequestsStore();

  const form = useForm<RespondRequestFormData>({
    resolver: zodResolver(RespondRequestSchema),
    mode: "onChange",
    defaultValues: {
      status: (currentStatus as any) || "in_progress",
      response: currentResponse || "",
    },
  });

  const onSubmit = async (data: RespondRequestFormData) => {
    if (!requestId) return;

    try {
      await respondToRequest(requestId, {
        status: data.status,
        response: data.response,
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const handleClose = () => {
    if (!form.formState.isSubmitting) {
      form.reset();
      onClose();
    }
  };

  const statusOptions = [
    {
      value: "in_progress",
      label: "En Progreso",
      description: "Estás trabajando en esta solicitud",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      value: "resolved",
      label: "Resuelta",
      description: "La solicitud ha sido completada exitosamente",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      value: "rejected",
      label: "Rechazada",
      description: "La solicitud no pudo ser completada",
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  const selectedStatus = form.watch("status");
  const responseLength = form.watch("response")?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Responder Solicitud
          </DialogTitle>
          <DialogDescription>
            Actualiza el estado y proporciona una respuesta para:{" "}
            <span className="font-semibold text-gray-900">{requestTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Estado <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${option.color}`} />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {
                      statusOptions.find((opt) => opt.value === selectedStatus)
                        ?.description
                    }
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Respuesta <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Proporciona una respuesta detallada para el cliente..."
                      className="min-h-[150px] resize-none"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormDescription>
                      Mínimo 10 caracteres, máximo 1000
                    </FormDescription>
                    <span
                      className={`text-xs ${
                        responseLength > 1000
                          ? "text-red-600"
                          : responseLength < 10
                            ? "text-gray-400"
                            : "text-green-600"
                      }`}
                    >
                      {responseLength} / 1000
                    </span>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-secondary hover:bg-secondary/90"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Respuesta
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
