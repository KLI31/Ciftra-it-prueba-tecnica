import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "@/types/auth.types";
import { loginService, registerService } from "@/services/authService";
import { showNotification } from "@/lib/utils";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      login: async (payload) => {
        set({ loading: true, error: null });
        try {
          const data = await loginService(payload);

          if (data && data.user && data.token) {
            localStorage.setItem("token", data.token);

            set({
              isAuthenticated: true,
              user: data.user,
              loading: false,
              error: null,
            });

            showNotification("¡Bienvenido de nuevo!", data.message, "success");
          }
        } catch (error: any) {
          const errorMessage =
            error.message || "Error al iniciar sesión. Intenta nuevamente.";

          set({
            loading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });

          showNotification("Error al iniciar sesión", errorMessage, "error");
        }
      },

      register: async (payload) => {
        set({ loading: true, error: null });
        try {
          const data = await registerService(payload);

          if (data && data.user && data.token) {
            localStorage.setItem("token", data.token);

            set({
              isAuthenticated: true,
              user: data.user,
              loading: false,
              error: null,
            });

            showNotification(
              "¡Bienvenido a Cifra-it!",
              data.message,
              "success",
            );
          }
        } catch (error: any) {
          const errorMessage =
            error.message || "Error al registrar usuario. Intenta nuevamente.";

          set({
            loading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });

          showNotification("Error al registrar usuario", errorMessage, "error");
        }
      },

      logout: () => {
        localStorage.removeItem("token");

        set({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });

        showNotification(
          "Hasta pronto",
          "Sesión cerrada correctamente",
          "success",
        );
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);

export default useAuthStore;
