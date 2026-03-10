import { useEffect, useState } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useCategoryStore } from "../store/categoryStore";
import { useBudgetStore } from "../store/budgetStore";
import { useConfigStore } from "../store/configStore";
import { Layout } from "../components/common/Layout";
import { Modal } from "../components/common/Modal";
import { ExpenseForm } from "../components/forms/ExpenseForm";
import { Plus, Trash2, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";

export const ExpensesPage = () => {
  const { expenses, fetchExpenses, deleteExpense, isLoading } =
    useExpenseStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { activeBudgets, fetchActiveBudgets } = useBudgetStore();
  const { formatCurrency } = useConfigStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeBudget = activeBudgets.length > 0 ? activeBudgets[0] : null;

  useEffect(() => {
    fetchActiveBudgets();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeBudget) {
      fetchExpenses(activeBudget.id);
    }
  }, [activeBudget]);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este gasto?")) {
      await deleteExpense(id);
      if (activeBudget) {
        fetchExpenses(activeBudget.id);
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Sin categoría";
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#9CA3AF";
  };

  const totalGastos = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Layout>
      {/* header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Registro de Gastos
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gestiona y visualiza todos tus gastos
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50"
          >
            <Plus size={20} />
            Nuevo Gasto
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-6 lg:mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm sm:text-base mb-1 sm:mb-2">
                Total Gastado
              </p>
              <p className="text-2xl sm:text-4xl font-bold">
                {formatCurrency(totalGastos)}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3 sm:p-4">
              <FileText size={24} className="sm:w-8 sm:h-8" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-400">
            <p className="text-blue-100 text-xs sm:text-sm">
              {expenses.length}{" "}
              {expenses.length === 1
                ? "gasto registrado"
                : "gastos registrados"}
            </p>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Todos los Gastos
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando gastos...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay gastos registrados
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza a registrar tus gastos para llevar un control de tu
                presupuesto
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Registrar Primer Gasto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar size={16} className="text-gray-400" />
                          {format(new Date(expense.date), "dd/MM/yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: getCategoryColor(
                                expense.categoryId,
                              ),
                            }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {getCategoryName(expense.categoryId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {expense.description ? (
                            <>
                              <FileText size={16} className="text-gray-400" />
                              {expense.description}
                            </>
                          ) : (
                            <span className="text-gray-400 italic">
                              Sin descripción
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Eliminar gasto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Gasto"
      >
        <ExpenseForm />
      </Modal>
    </Layout>
  );
};
