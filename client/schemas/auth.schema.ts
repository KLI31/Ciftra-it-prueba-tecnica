import { z } from "zod";

// Schema para Login
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingrese un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(3, "La contraseña debe tener al menos 3 caracteres"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El nombre solo puede contener letras y espacios",
      ),
    lastname: z
      .string()
      .min(1, "El apellido es requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El apellido solo puede contener letras y espacios",
      )
      .optional(),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Ingrese un correo electrónico válido"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirmar contraseña es requerido"),
    role: z
      .enum(["CLIENT", "ADMIN", "SUPPORT"], {
        message: "El rol debe ser CLIENT, ADMIN o SUPPORT",
      })
      .optional()
      .default("CLIENT"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
