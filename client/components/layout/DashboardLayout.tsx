"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: ("CLIENT" | "SUPPORT" | "ADMIN")[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["CLIENT", "SUPPORT", "ADMIN"],
  },
  {
    label: "Mis Solicitudes",
    href: "/dashboard/user",
    icon: <FileText className="w-5 h-5" />,
    roles: ["CLIENT"],
  },
  {
    label: "Solicitudes Asignadas",
    href: "/dashboard/support",
    icon: <FileText className="w-5 h-5" />,
    roles: ["SUPPORT"],
  },
  {
    label: "Gestión de Solicitudes",
    href: "/dashboard/admin",
    icon: <FileText className="w-5 h-5" />,
    roles: ["ADMIN"],
  },
  {
    label: "Usuarios",
    href: "/dashboard/admin/users",
    icon: <Users className="w-5 h-5" />,
    roles: ["ADMIN"],
  },
  {
    label: "Estadísticas",
    href: "/dashboard/admin/stats",
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ["ADMIN"],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const { role } = useUserRole();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filtrar items según el rol
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(role as any),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CI</span>
            </div>
            <span className="font-bold text-lg">Cifra-it</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {user?.name?.charAt(0)}
                {user?.lastname?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name} {user?.lastname}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {role === "CLIENT" && "Usuario"}
              {role === "SUPPORT" && "Soporte"}
              {role === "ADMIN" && "Administrador"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Menú Principal
            </p>
          </div>
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-secondary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 Cifra-it. Todos los derechos reservados.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl font-semibold text-gray-900">
                {pathname === "/dashboard" && "Dashboard"}
                {pathname === "/dashboard/user" && "Mis Solicitudes"}
                {pathname === "/dashboard/support" && "Solicitudes Asignadas"}
                {pathname === "/dashboard/admin" && "Gestión de Solicitudes"}
                {pathname === "/dashboard/admin/stats" && "Estadísticas"}
                {pathname === "/dashboard/admin/users" && "Usuarios"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* You can add notifications, settings, etc. here */}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
