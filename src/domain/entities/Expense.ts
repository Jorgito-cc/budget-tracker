export class Expense {
  readonly id: string;
  readonly amount: number;
  readonly date: Date;
  readonly description: string | null;
  readonly categoryId: string;
  readonly categoryName?: string;
  readonly categoryColor?: string;
  readonly budgetId?: string;

  constructor(
    id: string,
    amount: number,
    date: Date,
    description: string | null,
    categoryId: string,
    categoryName?: string,
    categoryColor?: string,
    budgetId?: string,
  ) {
    this.id = id;
    this.amount = amount;
    this.date = date;
    this.description = description;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.categoryColor = categoryColor;
    this.budgetId = budgetId;
  }
}
