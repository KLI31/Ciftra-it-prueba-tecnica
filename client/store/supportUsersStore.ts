import { create } from "zustand";
import {
  SupportUsersState,
  CreateSupportUserPayload,
} from "@/types/support.types";
import {
  getSupportUsersService,
  createSupportUserService,
  deleteSupportUserService,
} from "@/services/userService";
import { showNotification } from "@/lib/utils";

const useSupportUsersStore = create<SupportUsersState>((set, get) => ({
  supportUsers: [],
  loading: false,
  error: null,

  fetchSupportUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await getSupportUsersService();
      set({ supportUsers: users, loading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener usuarios de soporte";
      set({ error: errorMessage, loading: false, supportUsers: [] });
      showNotification("Error", errorMessage, "error");
    }
  },

  createSupportUser: async (payload: CreateSupportUserPayload) => {
    set({ loading: true, error: null });
    try {
      const newUser = await createSupportUserService(payload);

      set((state) => ({
        supportUsers: [...state.supportUsers, newUser],
        loading: false,
      }));

      showNotification(
        "¡Usuario creado!",
        "El usuario de soporte ha sido creado exitosamente",
        "success",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear usuario de soporte";
      set({ error: errorMessage, loading: false });
      showNotification("Error al crear usuario", errorMessage, "error");
      throw error;
    }
  },

  deleteSupportUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteSupportUserService(id);

      set((state) => ({
        supportUsers: state.supportUsers.filter((user) => user.id !== id),
        loading: false,
      }));

      showNotification(
        "Usuario eliminado",
        "El usuario de soporte ha sido eliminado correctamente",
        "success",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al eliminar usuario de soporte";
      set({ error: errorMessage, loading: false });
      showNotification("Error al eliminar", errorMessage, "error");
      throw error;
    }
  },
}));

export default useSupportUsersStore;
