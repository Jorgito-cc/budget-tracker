import { create } from "zustand";
import { Expense } from "../../domain/entities/Expense";
import {
  ExpensesByDayDTO,
  ExpensesByCategoryDTO,
} from "../../domain/repositories/ExpenseRepository";
import { ExpenseApiRepository } from "../../infrastructure/api/ExpenseApiRepository";
import { CreateExpenseDTO } from "../../domain/repositories/ExpenseRepository";

interface ExpenseState {
  expenses: Expense[];
  expensesByDay: ExpensesByDayDTO[];
  expensesByCategory: ExpensesByCategoryDTO[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: (budgetId: string) => Promise<void>;
  fetchExpensesByPeriod: (
    budgetId: string,
    startDate: string,
    endDate: string,
  ) => Promise<void>;
  fetchExpensesByCategory: (budgetId: string) => Promise<void>;
  createExpense: (data: CreateExpenseDTO) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearError: () => void;
}

const expenseRepository = new ExpenseApiRepository();

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  expensesByDay: [],
  expensesByCategory: [],
  isLoading: false,
  error: null,

  fetchExpenses: async (budgetId) => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await expenseRepository.getByBudget(budgetId);
      set({ expenses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch expenses",
        isLoading: false,
      });
    }
  },

  fetchExpensesByPeriod: async (budgetId, startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const expensesByDay = await expenseRepository.getByPeriod(
        budgetId,
        startDate,
        endDate,
      );
      set({ expensesByDay, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error || "Failed to fetch expenses by period",
        isLoading: false,
      });
    }
  },

  fetchExpensesByCategory: async (budgetId) => {
    set({ isLoading: true, error: null });
    try {
      const expensesByCategory =
        await expenseRepository.getByCategory(budgetId);
      set({ expensesByCategory, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error || "Failed to fetch expenses by category",
        isLoading: false,
      });
    }
  },

  createExpense: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await expenseRepository.create(data);
      // Fetch updated expenses for the budget
      const expenses = await expenseRepository.getByBudget(data.budgetId);
      set({ expenses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create expense",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await expenseRepository.delete(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete expense",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
