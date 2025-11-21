export interface Request {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  response?: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  client_name: string;
  client_lastname: string;
  client_email: string;
  assigned_to?: string;
  support_name?: string;
  support_lastname?: string;
  support_email?: string;
}

export interface CreateRequestPayload {
  title: string;
}

export interface AssignRequestPayload {
  supportId: string;
}

export interface RespondRequestPayload {
  status: "in_progress" | "resolved" | "rejected";
  response: string;
}

export interface RequestFilters {
  status?: "pending" | "in_progress" | "resolved" | "rejected";
  clientId?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: "created_at" | "updated_at" | "status";
  sortOrder?: "ASC" | "DESC";
}

export interface RequestStats {
  overview: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    unassigned: number;
    monthGrowth: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    label: string;
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
    rejected: number;
  }>;
  supportPerformance: Array<{
    id: string;
    name: string;
    email: string;
    totalAssigned: number;
    resolved: number;
    rejected: number;
    inProgress: number;
    resolutionRate: number;
  }>;
  resolutionTime: {
    averageHours: number;
    minHours: number;
    maxHours: number;
  };
  topClients: Array<{
    id: string;
    name: string;
    email: string;
    totalRequests: number;
    pending: number;
    resolved: number;
  }>;
}
