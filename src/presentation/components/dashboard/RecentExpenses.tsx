import { Expense } from "../../../domain/entities/Expense";
import { format } from "date-fns";

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Gastos Recientes
        </h3>
        <p className="text-gray-500 text-center py-8">
          No hay gastos registrados aún
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Gastos Recientes</h3>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: expense.categoryColor || "#6B7280" }}
              ></div>
              <div>
                <p className="font-medium text-gray-800">
                  {expense.categoryName || "Sin categoría"}
                </p>
                <p className="text-sm text-gray-600">
                  {expense.description || "Sin descripción"}
                </p>
                <p className="text-xs text-gray-500">
                  {format(expense.date, "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600">
                -${expense.amount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
