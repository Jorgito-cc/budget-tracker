import {
  AuthRepository,
  LoginDTO,
  RegisterDTO,
  AuthResponse,
} from "../../domain/repositories/AuthRepository";
import { User } from "../../domain/entities/User";
import { axiosInstance } from "./axiosInstance";

export class AuthApiRepository implements AuthRepository {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await axiosInstance.post("/auth/login", credentials);
    const { token, user } = response.data;

    // Guardar en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      token,
      user: new User(user.id, user.email, user.name),
    };
  }

  async register(data: RegisterDTO): Promise<User> {
    const response = await axiosInstance.post("/auth/register", data);
    const user = response.data;
    return new User(user.id, user.email, user.name);
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem("user");
    if (!userData) return null;

    const user = JSON.parse(userData);
    return new User(user.id, user.email, user.name);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}
