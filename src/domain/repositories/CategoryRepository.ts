import { Category } from "../entities/Category";

export interface CreateCategoryDTO {
  name: string;
  color: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
}

export interface CategoryRepository {
  create(data: CreateCategoryDTO): Promise<Category>;
  getAll(): Promise<Category[]>;
  update(id: string, data: UpdateCategoryDTO): Promise<Category>;
  delete(id: string): Promise<void>;
}
