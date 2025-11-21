import { getAuthHeaders } from "@/lib/utils";
import { SupportUser, CreateSupportUserPayload } from "@/types/support.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const getSupportUsersService = async (): Promise<SupportUser[]> => {
  const response = await fetch(`${API_URL}/users/support`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener usuarios de soporte");
  }

  return data.data.users;
};

export const createSupportUserService = async (
  payload: CreateSupportUserPayload,
): Promise<SupportUser> => {
  const response = await fetch(`${API_URL}/users/support`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear usuario de soporte");
  }

  return data.data.user;
};

export const deleteSupportUserService = async (
  userId: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/users/support/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar usuario de soporte");
  }
};
