"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import PublicRoute from "@/components/auth/PublicRoute";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Verifica la ruta actual para determinar si es la página de login
  const isLogin = pathname === "/login";

  return (
    <PublicRoute>
      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white">
        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="hidden lg:block relative bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="absolute inset-0">
            {isLogin ? (
              <Image
                src="/image-login.webp"
                alt="Profesional gestionando solicitudes"
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
            ) : (
              <Image
                src="/image-register.webp"
                alt="Registro en el sistema"
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-12 text-white">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold mb-4">
                {isLogin
                  ? "Sistema de Gestión de Solicitudes"
                  : "Únete a nuestra plataforma"}
              </h2>
              <p className="text-lg text-white/90">
                {isLogin
                  ? "Gestiona tus solicitudes de manera eficiente y profesional"
                  : "Crea tu cuenta y comienza a gestionar tus solicitudes hoy mismo"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </PublicRoute>
  );
}
