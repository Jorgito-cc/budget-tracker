import { useState, FormEvent, useEffect } from "react";
import { useExpenseStore } from "../../store/expenseStore";
import { useCategoryStore } from "../../store/categoryStore";
import { useBudgetStore } from "../../store/budgetStore";

export const ExpenseForm = () => {
  const { createExpense, isLoading } = useExpenseStore();
  const { categories } = useCategoryStore();
  const { activeBudgets, fetchActiveBudgets } = useBudgetStore();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    categoryId: "",
    budgetId: "",
  });

  useEffect(() => {
    fetchActiveBudgets();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeBudgets.length === 0) {
      setError("No hay presupuestos activos. Crea un presupuesto primero.");
      return;
    }

    if (!formData.budgetId) {
      setError("Selecciona de qué presupuesto descontar el gasto.");
      return;
    }

    try {
      await createExpense({
        amount: Number(formData.amount),
        date: formData.date,
        description: formData.description || undefined,
        categoryId: formData.categoryId,
        budgetId: formData.budgetId,
      });

      // Reseteamos formulario después de crear el gasto
      setFormData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        categoryId: "",
        budgetId: "",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error al crear el gasto";
      setError(errorMessage);
      console.error("Error creating expense:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Registrar Gasto</h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monto
        </label>
        <input
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha
        </label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          required
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Presupuesto <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={formData.budgetId}
          onChange={(e) =>
            setFormData({ ...formData, budgetId: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">¿De qué presupuesto descontar?</option>
          {activeBudgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name} - ${budget.remainingAmount.toFixed(2)} disponible
            </option>
          ))}
        </select>
        {activeBudgets.length === 0 && (
          <p className="text-sm text-amber-600 mt-1">
            ⚠️ No hay presupuestos activos. Crea uno primero.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Ej: Almuerzo en restaurante"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || activeBudgets.length === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Guardando..." : "Registrar Gasto"}
      </button>
    </form>
  );
};
