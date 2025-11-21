export type UserRoles = "ADMIN" | "CLIENT" | "SUPPORT";

export interface RegisterPayload {
  name: string;
  lastname?: string;
  email: string;
  password: string;
  role?: UserRoles;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  lastname?: string;
  email: string;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;
}

// Lo que viene en result.data del servidor
export interface AuthData {
  token: string;
  user: User;
}

// Lo que retornan los servicios (data + message)
export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login(payload: LoginPayload): Promise<void>;
  register(payload: RegisterPayload): Promise<void>;
  logout(): void;
}
