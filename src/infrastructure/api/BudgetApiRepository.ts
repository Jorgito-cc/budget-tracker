import type {
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
    const budgets = await Promise.all(
      response.data.map(async (b: any) => {
        if (b.totalExpenses !== undefined && b.remainingAmount !== undefined) {
          return this.mapToDomain(b);
        }
        try {
          const expRes = await axiosInstance.get(`/expenses/budget/${b.id}`);
          const totalExpenses = (expRes.data || []).reduce(
            (sum: number, exp: any) => sum + (Number(exp.amount) || 0),
            0,
          );
          return this.mapToDomain({
            ...b,
            totalExpenses,
            remainingAmount: Number(b.totalAmount) - totalExpenses,
          });
        } catch {
          return this.mapToDomain(b);
        }
      }),
    );
    return budgets;
  }

  async getAllActive(): Promise<Budget[]> {
    const response = await axiosInstance.get("/budgets/active");
    const budgets = await Promise.all(
      response.data.map(async (b: any) => {
        if (b.totalExpenses !== undefined && b.remainingAmount !== undefined) {
          return this.mapToDomain(b);
        }
        try {
          const expRes = await axiosInstance.get(`/expenses/budget/${b.id}`);
          const totalExpenses = (expRes.data || []).reduce(
            (sum: number, exp: any) => sum + (Number(exp.amount) || 0),
            0,
          );
          return this.mapToDomain({
            ...b,
            totalExpenses,
            remainingAmount: Number(b.totalAmount) - totalExpenses,
          });
        } catch {
          return this.mapToDomain(b);
        }
      }),
    );
    return budgets;
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
    const totalAmount = Number(data.totalAmount) || 0;
    const totalExpenses =
      data.totalExpenses !== undefined ? Number(data.totalExpenses) : 0;
    const remainingAmount =
      data.remainingAmount !== undefined
        ? Number(data.remainingAmount)
        : totalAmount - totalExpenses;

    return new Budget(
      data.id,
      data.name,
      totalAmount,
      new Date(data.startDate),
      new Date(data.endDate),
      totalExpenses,
      remainingAmount,
      data.isActive !== undefined ? Boolean(data.isActive) : false,
    );
  }
}
