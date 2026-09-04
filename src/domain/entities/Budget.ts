export class Budget {
  readonly id: string;
  readonly name: string;
  readonly totalAmount: number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly totalExpenses: number;
  readonly remainingAmount: number;
  readonly isActive: boolean;

  constructor(
    id: string,
    name: string,
    totalAmount: number,
    startDate: Date,
    endDate: Date,
    totalExpenses: number,
    remainingAmount: number,
    isActive: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.totalAmount = totalAmount;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalExpenses = totalExpenses;
    this.remainingAmount = remainingAmount;
    this.isActive = isActive;
  }

  getPercentageUsed(): number {
    return this.totalAmount > 0
      ? (this.totalExpenses / this.totalAmount) * 100
      : 0;
  }

  isOverBudget(): boolean {
    return this.remainingAmount < 0;
  }
}
