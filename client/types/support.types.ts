export interface SupportUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: "SUPPORT";
  created_at: string;
}

export interface CreateSupportUserPayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface SupportUsersState {
  supportUsers: SupportUser[];
  loading: boolean;
  error: string | null;
  fetchSupportUsers(): Promise<void>;
  createSupportUser(payload: CreateSupportUserPayload): Promise<void>;
  deleteSupportUser(id: string): Promise<void>;
}
