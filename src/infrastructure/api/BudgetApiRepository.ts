import {
  BudgetRepository,
  CreateBudgetDTO,
  UpdateBudgetDTO,
} from "../../domain/repositories/BudgetRepository";
import { Budget } from "../../domain/entities/Budget";
import { axiosInstance } from "./axiosInstance";

export class BudgetApiRepository implements BudgetRepository {
  async create(data: CreateBudgetDTO): Promise<Budget> {
    const response = await axiosInstance.post("/budgets", data);
    return this.mapToDomain(response.data);
  }

  async getAll(): Promise<Budget[]> {
    const response = await axiosInstance.get("/budgets");
    return response.data.map((b: any) => this.mapToDomain(b));
  }

  async getAllActive(): Promise<Budget[]> {
    const response = await axiosInstance.get("/budgets/active");
    return response.data.map((b: any) => this.mapToDomain(b));
  }

  async getSummary(id: string): Promise<Budget> {
    const response = await axiosInstance.get(`/budgets/${id}/summary`);
    return this.mapToDomain(response.data);
  }

  async update(id: string, data: UpdateBudgetDTO): Promise<Budget> {
    const response = await axiosInstance.put(`/budgets/${id}`, data);
    return this.mapToDomain(response.data);
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/budgets/${id}`);
  }

  private mapToDomain(data: any): Budget {
    return new Budget(
      data.id,
      data.name,
      data.totalAmount,
      new Date(data.startDate),
      new Date(data.endDate),
      data.totalExpenses || 0,
      data.remainingAmount || data.totalAmount,
      data.isActive || false,
    );
  }
}
