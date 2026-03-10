export class Expense {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly date: Date,
    public readonly description: string | null,
    public readonly categoryId: string,
    public readonly categoryName?: string,
    public readonly categoryColor?: string,
    public readonly budgetId?: string,
  ) {}
}
