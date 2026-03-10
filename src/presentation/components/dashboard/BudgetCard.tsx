import { Budget } from "../../../domain/entities/Budget";

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const percentageUsed = budget.getPercentageUsed();
  const isOverBudget = budget.isOverBudget();

  const getProgressColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (percentageUsed > 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Presupuesto Actual
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {budget.startDate.toLocaleDateString()} -{" "}
            {budget.endDate.toLocaleDateString()}
          </p>
        </div>
        {budget.isActive && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Activo
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-gray-600 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">
            Bs {budget.totalAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">Gastado</p>
          <p className="text-2xl font-bold text-red-600">
            Bs {budget.totalExpenses.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">Restante</p>
          <p
            className={`text-2xl font-bold ${
              isOverBudget ? "text-red-600" : "text-green-600"
            }`}
          >
            Bs {budget.remainingAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progreso</span>
          <span
            className={`text-sm font-medium ${
              isOverBudget ? "text-red-600" : "text-gray-700"
            }`}
          >
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${getProgressColor()} h-3 rounded-full transition-all`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          ></div>
        </div>
        {isOverBudget && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            ⚠️ Has excedido tu presupuesto
          </p>
        )}
      </div>
    </div>
  );
}
