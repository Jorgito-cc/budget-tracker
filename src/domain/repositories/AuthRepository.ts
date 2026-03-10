import { User } from "../entities/User";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthRepository {
  login(credentials: LoginDTO): Promise<AuthResponse>;
  register(data: RegisterDTO): Promise<User>;
  logout(): void;
  getCurrentUser(): User | null;
  getToken(): string | null;
}
