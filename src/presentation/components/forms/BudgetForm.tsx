import { useState, useEffect, type FormEvent } from "react";
import { useBudgetStore } from "../../store/budgetStore";
import { Budget } from "../../../domain/entities/Budget";

interface BudgetFormProps {
  budget?: Budget | null;
  onSuccess?: () => void;
}

export const BudgetForm = ({ budget, onSuccess }: BudgetFormProps) => {
  const { createBudget, updateBudget, isLoading } = useBudgetStore();
  const [formData, setFormData] = useState({
    name: "",
    totalAmount: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name,
        totalAmount: budget.totalAmount.toString(),
        startDate: budget.startDate.toISOString().split("T")[0],
        endDate: budget.endDate.toISOString().split("T")[0],
      });
    }
  }, [budget]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (budget) {
        await updateBudget(budget.id, {
          name: formData.name,
          totalAmount: Number(formData.totalAmount),
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
      } else {
        await createBudget({
          name: formData.name,
          totalAmount: Number(formData.totalAmount),
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
      }

      setFormData({
        name: "",
        totalAmount: "",
        startDate: "",
        endDate: "",
      });
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        `Error al ${budget ? "actualizar" : "crear"} el presupuesto`;
      setError(errorMessage);
      console.error("Error with budget:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">
        {budget ? "Editar Presupuesto" : "Crear Presupuesto"}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Presupuesto
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Mesada, Diversión, Médico..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monto Total
        </label>
        <input
          type="number"
          step="0.01"
          required
          value={formData.totalAmount}
          onChange={(e) =>
            setFormData({ ...formData, totalAmount: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 500.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de Inicio
        </label>
        <input
          type="date"
          required
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de Fin
        </label>
        <input
          type="date"
          required
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading
          ? "Guardando..."
          : budget
            ? "Actualizar Presupuesto"
            : "Crear Presupuesto"}
      </button>
    </form>
  );
};
