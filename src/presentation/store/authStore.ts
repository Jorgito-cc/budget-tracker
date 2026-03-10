import { create } from "zustand";
import { User } from "../../domain/entities/User";
import { AuthApiRepository } from "../../infrastructure/api/AuthApiRepository";
import {
  LoginDTO,
  RegisterDTO,
} from "../../domain/repositories/AuthRepository";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const authRepository = new AuthApiRepository();

export const useAuthStore = create<AuthState>((set) => ({
  user: authRepository.getCurrentUser(),
  token: authRepository.getToken(),
  isAuthenticated: !!authRepository.getToken(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authRepository.login(credentials);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authRepository.register(data);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    authRepository.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
