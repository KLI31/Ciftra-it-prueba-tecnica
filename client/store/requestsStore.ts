import { create } from "zustand";
import { RequestsState, RequestFilters } from "@/types/requests.types";
import {
  createRequestService,
  deleteRequestService,
  assignRequestService,
  getAllRequestsService,
  getRequestByIdService,
  getRequestStatsService,
  respondRequestService,
} from "@/services/requestService";
import { showNotification } from "@/lib/utils";

const useRequestsStore = create<RequestsState>((set, get) => ({
  requests: [],
  requestStats: null,
  totalCount: 0,
  loading: false,
  error: null,

  // Obtener todas las solicitudes con filtros opcionales
  fetchRequests: async (filters?: RequestFilters) => {
    set({ loading: true, error: null });
    try {
      const data = await getAllRequestsService(filters);
      set({
        requests: data.requests,
        totalCount: data.count,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener las solicitudes";
      set({ error: errorMessage, loading: false, requests: [], totalCount: 0 });
      showNotification("Error", errorMessage, "error");
    }
  },

  createRequest: async (payload) => {
    set({ loading: true, error: null });
    try {
      const newRequest = await createRequestService(payload);

      set((state) => ({
        requests: [newRequest, ...state.requests],
        loading: false,
      }));

      showNotification(
        "¡Solicitud creada!",
        "Tu solicitud ha sido creada exitosamente",
        "success",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear la solicitud";
      set({ error: errorMessage, loading: false });
      showNotification("Error al crear solicitud", errorMessage, "error");
      throw error;
    }
  },

  assignRequest: async (requestId, payload) => {
    set({ loading: true, error: null });
    try {
      const updatedRequest = await assignRequestService(requestId, payload);

      set((state) => ({
        requests: state.requests.map((req) =>
          req.id === requestId ? updatedRequest : req,
        ),
        loading: false,
      }));

      showNotification(
        "Solicitud asignada",
        "La solicitud ha sido asignada correctamente",
        "success",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al asignar la solicitud";
      set({ error: errorMessage, loading: false });
      showNotification("Error al asignar", errorMessage, "error");
      throw error;
    }
  },

  respondToRequest: async (requestId, payload) => {
    set({ loading: true, error: null });
    try {
      const updatedRequest = await respondRequestService(requestId, payload);

      set((state) => ({
        requests: state.requests.map((req) =>
          req.id === requestId ? updatedRequest : req,
        ),
        loading: false,
      }));

      showNotification(
        "Respuesta enviada",
        "La solicitud ha sido actualizada correctamente",
        "success",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al responder la solicitud";
      set({ error: errorMessage, loading: false });
      showNotification("Error al responder", errorMessage, "error");
      throw error;
    }
  },

  fetchRequestStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await getRequestStatsService();
      set({ requestStats: stats, loading: false });
      return stats;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener estadísticas";
      set({ error: errorMessage, loading: false, requestStats: null });
      showNotification("Error", errorMessage, "error");
      throw error;
    }
  },

  deleteRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      await deleteRequestService(requestId);

      set((state) => ({
        requests: state.requests.filter((req) => req.id !== requestId),
        loading: false,
      }));

      showNotification(
        "Solicitud eliminada",
        "La solicitud ha sido eliminada correctamente",
        "success",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al eliminar la solicitud";
      set({ error: errorMessage, loading: false });
      showNotification("Error al eliminar", errorMessage, "error");
      throw error;
    }
  },
}));

export default useRequestsStore;
