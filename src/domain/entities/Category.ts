export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly color: string,
    public readonly totalExpenses?: number,
  ) {}
}
