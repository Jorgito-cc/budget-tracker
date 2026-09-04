import { create } from "zustand";
import { Budget } from "../../domain/entities/Budget";
import { BudgetApiRepository } from "../../infrastructure/api/BudgetApiRepository";
import type {
  CreateBudgetDTO,
  UpdateBudgetDTO,
} from "../../domain/repositories/BudgetRepository";

interface BudgetState {
  budgets: Budget[];
  activeBudgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  fetchActiveBudgets: () => Promise<void>;
  createBudget: (data: CreateBudgetDTO) => Promise<void>;
  updateBudget: (id: string, data: UpdateBudgetDTO) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  clearError: () => void;
}

const budgetRepository = new BudgetApiRepository();

export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: [],
  activeBudgets: [],
  isLoading: false,
  error: null,

  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const budgets = await budgetRepository.getAll();
      set({ budgets, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch budgets",
        isLoading: false,
      });
    }
  },

  fetchActiveBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const activeBudgets = await budgetRepository.getAllActive();
      set({ activeBudgets, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch active budgets",
        isLoading: false,
      });
    }
  },

  createBudget: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await budgetRepository.create(data);
      // Fetch all budgets and active budgets to update the state
      const budgets = await budgetRepository.getAll();
      const activeBudgets = await budgetRepository.getAllActive();
      set({ budgets, activeBudgets, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create budget",
        isLoading: false,
      });
      throw error;
    }
  },

  updateBudget: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await budgetRepository.update(id, data);
      // Refresh all budgets and active budgets
      const budgets = await budgetRepository.getAll();
      const activeBudgets = await budgetRepository.getAllActive();
      set({ budgets, activeBudgets, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update budget",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await budgetRepository.delete(id);
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
        activeBudgets: state.activeBudgets.filter((b) => b.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete budget",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
