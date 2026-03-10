import { Budget } from "../entities/Budget";

export interface CreateBudgetDTO {
  name: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
}

export interface UpdateBudgetDTO {
  name?: string;
  totalAmount?: number;
  startDate?: string;
  endDate?: string;
}

export interface BudgetRepository {
  create(data: CreateBudgetDTO): Promise<Budget>;
  getAll(): Promise<Budget[]>;
  getAllActive(): Promise<Budget[]>;
  getSummary(id: string): Promise<Budget>;
  update(id: string, data: UpdateBudgetDTO): Promise<Budget>;
  delete(id: string): Promise<void>;
}
