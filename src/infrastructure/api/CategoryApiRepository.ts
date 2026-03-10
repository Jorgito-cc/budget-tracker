import {
  CategoryRepository,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../../domain/repositories/CategoryRepository";
import { Category } from "../../domain/entities/Category";
import { axiosInstance } from "./axiosInstance";

export class CategoryApiRepository implements CategoryRepository {
  async create(data: CreateCategoryDTO): Promise<Category> {
    const response = await axiosInstance.post("/categories", data);
    return this.mapToDomain(response.data);
  }

  async getAll(): Promise<Category[]> {
    const response = await axiosInstance.get("/categories");
    return response.data.map((c: any) => this.mapToDomain(c));
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return this.mapToDomain(response.data);
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/categories/${id}`);
  }

  private mapToDomain(data: any): Category {
    return new Category(data.id, data.name, data.color, data.totalExpenses);
  }
}
