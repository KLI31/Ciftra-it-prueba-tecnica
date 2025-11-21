import { getToken, getAuthHeaders } from "@/lib/utils";
import {
  CreateRequestPayload,
  Request,
  RequestFilters,
  RequestStats,
  AssignRequestPayload,
  RespondRequestPayload,
} from "@/types/requests.types";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

export const createRequestService = async (
  payload: CreateRequestPayload,
): Promise<Request> => {
  const response = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la solicitud");
  }

  return data.data.request;
};

export const getAllRequestsService = async (
  filters?: RequestFilters,
): Promise<{ requests: Request[]; count: number }> => {
  const queryParams = new URLSearchParams();

  if (filters?.status) queryParams.append("status", filters.status);
  if (filters?.clientId) queryParams.append("clientId", filters.clientId);
  if (filters?.assignedTo) queryParams.append("assignedTo", filters.assignedTo);
  if (filters?.startDate) queryParams.append("startDate", filters.startDate);
  if (filters?.endDate) queryParams.append("endDate", filters.endDate);
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const url = `${API_URL}/requests${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las solicitudes");
  }

  return {
    requests: data.data.requests,
    count: data.data.count,
  };
};

export const getRequestByIdService = async (id: string): Promise<Request> => {
  const response = await fetch(`${API_URL}/requests/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener la solicitud");
  }

  return data.data.request;
};

export const assignRequestService = async (
  id: string,
  payload: AssignRequestPayload,
): Promise<Request> => {
  const response = await fetch(`${API_URL}/requests/${id}/assign`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al asignar la solicitud");
  }

  return data.data.request;
};

export const respondRequestService = async (
  id: string,
  payload: RespondRequestPayload,
): Promise<Request> => {
  const response = await fetch(`${API_URL}/requests/${id}/respond`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al responder la solicitud");
  }

  return data.data.request;
};

export const getRequestStatsService = async (): Promise<RequestStats> => {
  const response = await fetch(`${API_URL}/requests/stats`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las estadísticas");
  }

  return data.data.stats;
};

export const deleteRequestService = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/requests/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar la solicitud");
  }
};
