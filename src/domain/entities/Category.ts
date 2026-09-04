export class Category {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly totalExpenses?: number;

  constructor(
    id: string,
    name: string,
    color: string,
    totalExpenses?: number,
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.totalExpenses = totalExpenses;
  }
}
