"use client";

import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Spinner } from "@/components/ui/spinner";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirigir según el rol del usuario
      switch (user.role) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "SUPPORT":
          router.push("/dashboard/support");
          break;
        case "CLIENT":
          router.push("/dashboard/user");
          break;
        default:
          router.push("/dashboard/user");
      }
    }
  }, [user, router]);

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
