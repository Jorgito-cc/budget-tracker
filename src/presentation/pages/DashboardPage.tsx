import { useEffect, useState } from "react";
import { useBudgetStore } from "../store/budgetStore";
import { useExpenseStore } from "../store/expenseStore";
import { useCategoryStore } from "../store/categoryStore";
import { useConfigStore } from "../store/configStore";
import { Layout } from "../components/common/Layout";
import { Modal } from "../components/common/Modal";
import { ExpenseForm } from "../components/forms/ExpenseForm";
import { ExpensesByCategoryChart } from "../components/charts/ExpensesByCategoryChart";
import { ExpensesByDayChart } from "../components/charts/ExpensesByDayChart";
import { format } from "date-fns";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  DollarSign,
  User,
  Bell,
} from "lucide-react";

export function DashboardPage() {
  const {
    activeBudgets,
    fetchActiveBudgets,
    isLoading: budgetLoading,
  } = useBudgetStore();
  const {
    expensesByCategory,
    expensesByDay,
    expenses,
    fetchExpensesByCategory,
    fetchExpensesByPeriod,
    fetchExpenses,
  } = useExpenseStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { formatCurrency } = useConfigStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usar el primer presupuesto activo
  const activeBudget = activeBudgets.length > 0 ? activeBudgets[0] : null;

  useEffect(() => {
    fetchActiveBudgets();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeBudget) {
      fetchExpensesByCategory(activeBudget.id);
      fetchExpenses(activeBudget.id);

      const startDate = format(activeBudget.startDate, "yyyy-MM-dd");
      const endDate = format(activeBudget.endDate, "yyyy-MM-dd");
      fetchExpensesByPeriod(activeBudget.id, startDate, endDate);
    }
  }, [activeBudget]);

  if (budgetLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!activeBudget) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <Wallet className="mx-auto text-yellow-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              No tienes un presupuesto activo
            </h2>
            <p className="text-yellow-700 mb-6">
              Crea un presupuesto para comenzar a registrar tus gastos
            </p>
            <a
              href="/budgets"
              className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Plus size={20} />
              Crear Presupuesto
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const totalGastado = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const restante = activeBudget.totalAmount - totalGastado;
  const porcentajeGastado = (totalGastado / activeBudget.totalAmount) * 100;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {activeBudget.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {format(new Date(activeBudget.startDate), "dd/MM/yyyy")} -{" "}
              {format(new Date(activeBudget.endDate), "dd/MM/yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="text-gray-600" size={20} />
            </button>
            <div className="bg-gray-100 rounded-full p-2 hidden sm:block">
              <User className="text-gray-700" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
          {/* Budget Card */}
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-green-100 text-sm sm:text-base">
                Presupuesto
              </span>
              <Wallet size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">
              {formatCurrency(activeBudget.totalAmount)}
            </div>
            <div className="flex items-center gap-2 text-green-100 text-xs sm:text-sm">
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              <span>Total asignado</span>
            </div>
          </div>

          {/* Spent Card */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-orange-100 text-sm sm:text-base">
                Gastado
              </span>
              <TrendingUp size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">
              {formatCurrency(totalGastado)}
            </div>
            <div className="flex items-center gap-2 text-orange-100 text-xs sm:text-sm">
              <div className="flex-1 bg-orange-300 bg-opacity-30 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}
                />
              </div>
              <span>{porcentajeGastado.toFixed(0)}%</span>
            </div>
          </div>

          {/* Remaining Card */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-blue-100 text-sm sm:text-base">
                Restante
              </span>
              <TrendingDown size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">
              {formatCurrency(restante)}
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
              <DollarSign size={14} className="sm:w-4 sm:h-4" />
              <span>Disponible</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Gasto por Día
            </h3>
            <div className="h-64 sm:h-auto">
              <ExpensesByDayChart data={expensesByDay} />
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Gasto por Categoría
            </h3>
            <div className="h-64 sm:h-auto">
              <ExpensesByCategoryChart data={expensesByCategory} />
            </div>
          </div>
        </div>

        {/* Recent Expenses Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Últimos Gastos
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50"
            >
              <Plus size={20} />
              Registrar Gasto
            </button>
          </div>

          {/* Mobile view - cards */}
          <div className="sm:hidden p-4 space-y-3">
            {expenses.slice(0, 5).map((expense, index) => (
              <div key={expense.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {format(new Date(expense.date), "dd/MM")}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <p className="text-sm text-gray-800">
                  {expense.description || "-"}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop view - table */}
          <div className="hidden sm:block overflow-x-auto">
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
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.slice(0, 5).map((expense, index) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(expense.date), "dd/MM")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              categories.find((c) => c.id === expense.categoryId)
                                ?.color || "#999",
                          }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {categories.find((c) => c.id === expense.categoryId)
                            ?.name || "Sin categoría"}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {expense.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Gasto"
      >
        <ExpenseForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </Layout>
  );
}
