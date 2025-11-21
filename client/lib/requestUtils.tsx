import {
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const getStatusIcon = (status: string) => {
  const icons = {
    pending: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    in_progress: <Clock className="w-5 h-5 text-blue-600" />,
    resolved: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    rejected: <XCircle className="w-5 h-5 text-red-600" />,
  };
  return icons[status as keyof typeof icons] || icons.pending;
};

export const getStatusBadge = (status: string) => {
  const badges = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return badges[status as keyof typeof badges] || badges.pending;
};

export const getStatusText = (status: string) => {
  const texts = {
    pending: "Pendiente",
    in_progress: "En Progreso",
    resolved: "Resuelta",
    rejected: "Rechazada",
  };
  return texts[status as keyof typeof texts] || status;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
