import { useEffect, useState } from "react";
import { useBudgetStore } from "../store/budgetStore";
import { useConfigStore } from "../store/configStore";
import { Budget } from "../../domain/entities/Budget";
import { Layout } from "../components/common/Layout";
import { Modal } from "../components/common/Modal";
import { BudgetForm } from "../components/forms/BudgetForm";
import {
  Plus,
  Wallet,
  Calendar,
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

export const BudgetsPage = () => {
  const {
    budgets,
    activeBudgets,
    fetchBudgets,
    fetchActiveBudgets,
    deleteBudget,
    isLoading,
  } = useBudgetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets();
    fetchActiveBudgets();
  }, []);

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
      await deleteBudget(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Presupuestos
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gestiona tus presupuestos por categoría
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50"
          >
            <Plus size={20} />
            Nuevo Presupuesto
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando presupuestos...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 text-center">
            <Wallet className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No hay presupuestos creados
            </h3>
            <p className="text-gray-600 mb-6">
              Crea presupuestos por categoría (Mesada, Diversión, Médico, etc.)
              para controlar mejor tus gastos
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Crear Primer Presupuesto
            </button>
          </div>
        ) : (
          <>
            {/* Active Budgets Section */}
            {activeBudgets.length > 0 && (
              <div className="mb-6 lg:mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                  Presupuestos Activos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {activeBudgets.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      isActive={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Budgets Section */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                Todos los Presupuestos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    isActive={budget.isActive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? "Editar Presupuesto" : "Crear Nuevo Presupuesto"}
      >
        <BudgetForm budget={editingBudget} onSuccess={handleCloseModal} />
      </Modal>
    </Layout>
  );
};

// Budget Card Component
interface BudgetCardProps {
  budget: Budget;
  isActive: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetCard = ({
  budget,
  isActive,
  onEdit,
  onDelete,
}: BudgetCardProps) => {
  const { formatCurrency } = useConfigStore();
  const percentageUsed = budget.getPercentageUsed();
  const isOverBudget = budget.isOverBudget();

  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border-2 ${
        isActive ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100"
      }`}
    >
      {isActive && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 sm:px-4 py-1.5 sm:py-2">
          <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium">
            <Calendar size={14} />
            <span>Activo</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Name & Amount */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {budget.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-xl sm:text-3xl font-bold text-gray-900">
              {formatCurrency(budget.totalAmount)}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">total</p>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
            <Calendar size={14} />
            <span className="font-medium">Periodo</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-500">Inicio</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(budget.startDate), "dd/MM/yyyy")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Fin</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(budget.endDate), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <span className="text-gray-600">Gastado</span>
            <span
              className={`font-semibold ${
                isOverBudget ? "text-red-600" : "text-gray-900"
              }`}
            >
              {formatCurrency(budget.totalExpenses)}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`rounded-full h-2 transition-all ${
                isOverBudget ? "bg-red-500" : "bg-blue-600"
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {percentageUsed.toFixed(1)}% usado
            </span>
            <span
              className={`font-semibold ${
                budget.remainingAmount >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {budget.remainingAmount >= 0 ? (
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  {formatCurrency(budget.remainingAmount)} restante
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <TrendingDown size={12} />
                  {formatCurrency(Math.abs(budget.remainingAmount))} excedido
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(budget)}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            <span className="text-xs sm:text-sm font-medium">Editar</span>
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            <span className="text-xs sm:text-sm font-medium">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
