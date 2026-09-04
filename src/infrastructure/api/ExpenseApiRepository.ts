import type {
  ExpenseRepository,
  CreateExpenseDTO,
  ExpensesByDayDTO,
  ExpensesByCategoryDTO,
} from "../../domain/repositories/ExpenseRepository";
import { Expense } from "../../domain/entities/Expense";
import { axiosInstance } from "./axiosInstance";

export class ExpenseApiRepository implements ExpenseRepository {
  async create(data: CreateExpenseDTO): Promise<Expense> {
    const response = await axiosInstance.post("/expenses", data);
    return this.mapToDomain(response.data);
  }

  async getByBudget(budgetId: string): Promise<Expense[]> {
    const response = await axiosInstance.get(`/expenses/budget/${budgetId}`);
    return response.data.map((e: any) => this.mapToDomain(e));
  }

  async getByCategory(budgetId: string): Promise<ExpensesByCategoryDTO[]> {
    const response = await axiosInstance.get(
      `/expenses/budget/${budgetId}/by-category`,
    );
    return response.data;
  }

  async getByPeriod(
    budgetId: string,
    startDate: string,
    endDate: string,
  ): Promise<ExpensesByDayDTO[]> {
    const response = await axiosInstance.get(
      `/expenses/budget/${budgetId}/by-period`,
      {
        params: { startDate, endDate },
      },
    );

    return response.data.map((day: any) => ({
      ...day,
      expenses: day.expenses.map((e: any) => this.mapToDomain(e)),
    }));
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/expenses/${id}`);
  }

  private mapToDomain(data: any): Expense {
    return new Expense(
      data.id,
      data.amount,
      new Date(data.date),
      data.description,
      data.categoryId,
      data.categoryName,
      data.categoryColor,
      data.budgetId,
    );
  }
}
