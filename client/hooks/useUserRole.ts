import useAuthStore from "@/store/authStore";

export const useUserRole = () => {
  const { user } = useAuthStore();

  return {
    role: user?.role,
    isAdmin: user?.role === "ADMIN",
    isSupport: user?.role === "SUPPORT",
    isUser: user?.role === "CLIENT",
  };
};
