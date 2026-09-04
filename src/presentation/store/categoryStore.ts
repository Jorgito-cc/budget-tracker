import { create } from "zustand";
import { Category } from "../../domain/entities/Category";
import { CategoryApiRepository } from "../../infrastructure/api/CategoryApiRepository";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../../domain/repositories/CategoryRepository";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryDTO) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryDTO) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

const categoryRepository = new CategoryApiRepository();

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryRepository.getAll();
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await categoryRepository.create(data);
      // Recargar la lista de categorías después de crear
      const categories = await categoryRepository.getAll();
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create category",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await categoryRepository.update(id, data);
      // Recargar la lista de categorías después de actualizar
      const categories = await categoryRepository.getAll();
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update category",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoryRepository.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete category",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
