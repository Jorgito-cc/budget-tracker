import { Expense } from "../entities/Expense";

export interface CreateExpenseDTO {
  amount: number;
  date: string;
  description?: string;
  categoryId: string;
  budgetId: string;
}

export interface ExpensesByDayDTO {
  date: string;
  total: number;
  expenses: Expense[];
}

export interface ExpensesByCategoryDTO {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  total: number;
  percentage: number;
}

export interface ExpenseRepository {
  create(data: CreateExpenseDTO): Promise<Expense>;
  getByBudget(budgetId: string): Promise<Expense[]>;
  getByCategory(budgetId: string): Promise<ExpensesByCategoryDTO[]>;
  getByPeriod(
    budgetId: string,
    startDate: string,
    endDate: string,
  ): Promise<ExpensesByDayDTO[]>;
  delete(id: string): Promise<void>;
}
