export class Budget {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly totalAmount: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly totalExpenses: number,
    public readonly remainingAmount: number,
    public readonly isActive: boolean,
  ) {}

  getPercentageUsed(): number {
    return this.totalAmount > 0
      ? (this.totalExpenses / this.totalAmount) * 100
      : 0;
  }

  isOverBudget(): boolean {
    return this.remainingAmount < 0;
  }
}
