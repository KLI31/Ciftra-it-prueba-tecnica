import { z } from "zod";

// Schema para responder a una solicitud
export const RespondRequestSchema = z.object({
  status: z.enum(["in_progress", "resolved", "rejected"], {
    message: "El estado debe ser 'En Progreso', 'Resuelta' o 'Rechazada'",
  }),
  response: z
    .string()
    .min(1, "La respuesta es requerida")
    .min(10, "La respuesta debe tener al menos 10 caracteres")
    .max(1000, "La respuesta no puede exceder 1000 caracteres"),
});

export type RespondRequestFormData = z.infer<typeof RespondRequestSchema>;
