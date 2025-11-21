"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import useAuthStore from "@/store/authStore";

import ProfileIcon from "../Profile";
import {
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCheckIcon,
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
    href: "/dashboard/user",
    icon: <FileText className="w-5 h-5" />,
    roles: ["CLIENT"],
  },
  {
    label: "Mis Solicitudes",
    href: "/dashboard/user/requests",
    icon: <FileText className="w-5 h-5" />,
    roles: ["CLIENT"],
  },
  {
    label: "Dashboard",
    href: "/dashboard/support",
    icon: <FileText className="w-5 h-5" />,
    roles: ["SUPPORT"],
  },
  {
    label: "Solicitudes asignadas",
    href: "/dashboard/support/assigned-requests",
    icon: <FileText className="w-5 h-5" />,
    roles: ["SUPPORT"],
  },
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ["ADMIN"],
  },
  {
    label: "Asignar Solicitudes",
    href: "/dashboard/admin/assign",
    icon: <Users className="w-5 h-5" />,
    roles: ["ADMIN"],
  },
  {
    label: "Todas las Solicitudes",
    href: "/dashboard/admin/requests",
    icon: <FileText className="w-5 h-5" />,
    roles: ["ADMIN"],
  },
  {
    label: "Usuarios de Soporte",
    href: "/dashboard/admin/support-users",
    icon: <Users className="w-5 h-5" />,
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

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(role as any),
  );

  const completeName = user ? `${user.name} ${user.lastname}` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out flex flex-col
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 ">
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
            <CheckCheckIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 ">
          <div className="flex items-center gap-3">
            <ProfileIcon size={40} completeName={completeName} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary truncate">
                {user?.name} {user?.lastname}
              </p>
              <p className="text-xs text-secondary truncate">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {role === "CLIENT" && "Usuario"}
                  {role === "SUPPORT" && "Soporte"}
                  {role === "ADMIN" && "Administrador"}
                </span>
              </div>
            </div>
          </div>
        </div>

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
                      ? "bg-primary text-white"
                      : "text-secondary hover:bg-gray-100"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 ">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 ">
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
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
