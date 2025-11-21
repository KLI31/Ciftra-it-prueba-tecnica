import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NotificationType = "success" | "error" | "info" | "warning";

export const showNotification = (
  message: string,
  description?: string,
  type: NotificationType = "info",
): void => {
  switch (type) {
    case "success":
      toast.success(message, {
        description,
      });
      break;
    case "error":
      toast.error(message, {
        description,
      });
      break;
    case "warning":
      toast.warning(message, {
        description,
      });
      break;
    case "info":
    default:
      toast.info(message, {
        description,
      });
      break;
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
