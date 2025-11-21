import type {
  AuthResponse,
  AuthData,
  RegisterPayload,
  LoginPayload,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/response.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const registerService = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<AuthData> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Error al registrar usuario");
    }

    if (!result.data) {
      throw new Error("Respuesta del servidor inválida");
    }

    return {
      ...result.data,
      message: result.message,
    };
  } catch (error) {
    console.error("Error en register:", error);
    throw error;
  }
};

export const loginService = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<AuthData> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Error al iniciar sesión");
    }

    if (!result.data) {
      throw new Error("Respuesta del servidor inválida");
    }

    return {
      ...result.data,
      message: result.message,
    };
  } catch (error) {
    throw error;
  }
};
