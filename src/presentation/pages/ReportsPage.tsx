import { useEffect, useRef } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useBudgetStore } from "../store/budgetStore";
import { useCategoryStore } from "../store/categoryStore";
import { useConfigStore } from "../store/configStore";
import { Layout } from "../components/common/Layout";
import { ExpensesByCategoryChart } from "../components/charts/ExpensesByCategoryChart";
import { ExpensesByDayChart } from "../components/charts/ExpensesByDayChart";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const ReportsPage = () => {
  const {
    expensesByCategory,
    expensesByDay,
    expenses,
    fetchExpensesByCategory,
    fetchExpensesByPeriod,
    fetchExpenses,
  } = useExpenseStore();
  const { activeBudgets, fetchActiveBudgets } = useBudgetStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { formatCurrency } = useConfigStore();
  const reportRef = useRef<HTMLDivElement>(null);

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

      const startDate = new Date(activeBudget.startDate);
      const endDate = new Date(activeBudget.endDate);

      fetchExpensesByPeriod(
        activeBudget.id,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      );
    }
  }, [activeBudget]);

  if (!activeBudget) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <BarChart3 className="mx-auto text-yellow-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              No hay presupuesto activo
            </h2>
            <p className="text-yellow-700 mb-6">
              Crea un presupuesto para ver tus reportes y análisis
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const totalGastado = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const restante = activeBudget.totalAmount - totalGastado;
  const porcentajeGastado = (totalGastado / activeBudget.totalAmount) * 100;

  // Top categorías con más gastos
  const topCategories = expensesByCategory
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const handleExportPDF = async () => {
    if (!reportRef.current || !activeBudget) return;

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `reporte_${format(new Date(), "yyyy-MM-dd_HH-mm")}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor intenta nuevamente.");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Reportes y Análisis
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Visualiza el rendimiento de tu presupuesto
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg w-full sm:w-auto">
              <Calendar size={18} className="sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                {format(new Date(activeBudget.startDate), "dd/MM/yyyy")} -{" "}
                {format(new Date(activeBudget.endDate), "dd/MM/yyyy")}
              </span>
            </div>
            <button
              onClick={handleExportPDF}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50"
            >
              <Download size={18} className="sm:w-5 sm:h-5" />
              Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8" ref={reportRef}>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-blue-100 rounded-lg p-1.5 sm:p-2">
                <DollarSign className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Presupuesto Total
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatCurrency(activeBudget.totalAmount)}
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-red-100 rounded-lg p-1.5 sm:p-2">
                <TrendingUp className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Total Gastado
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatCurrency(totalGastado)}
            </p>
            <div className="mt-2 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-red-500 rounded-full h-1.5 transition-all"
                style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-green-100 rounded-lg p-1.5 sm:p-2">
                <TrendingDown className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Restante</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatCurrency(restante)}
            </p>
            <p
              className={`text-xs mt-1 ${
                restante >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {restante >= 0
                ? "Dentro del presupuesto"
                : "Presupuesto excedido"}
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-purple-100 rounded-lg p-1.5 sm:p-2">
                <BarChart3 className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Total de Gastos
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {expenses.length}
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Promedio:{" "}
              {formatCurrency(
                expenses.length > 0 ? totalGastado / expenses.length : 0,
              )}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <BarChart3 className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Gastos por Día
              </h2>
            </div>
            <div className="h-64 sm:h-auto">
              <ExpensesByDayChart data={expensesByDay} />
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <PieChart className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Distribución por Categoría
              </h2>
            </div>
            <div className="h-64 sm:h-auto">
              <ExpensesByCategoryChart data={expensesByCategory} />
            </div>
          </div>
        </div>

        {/* Top Categories Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Top 5 Categorías con Más Gastos
            </h2>
          </div>

          {/* Mobile view - cards */}
          <div className="sm:hidden p-4 space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No hay datos disponibles
              </p>
            ) : (
              topCategories.map((category, index) => {
                const percentage =
                  (category.total / activeBudget.totalAmount) * 100;
                return (
                  <div
                    key={category.name}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                          {index + 1}
                        </span>
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-gray-900 text-sm">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(category.total)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2 transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop view - table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % del Presupuesto
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No hay datos disponibles
                    </td>
                  </tr>
                ) : (
                  topCategories.map((category, index) => {
                    const percentage =
                      (category.total / activeBudget.totalAmount) * 100;
                    return (
                      <tr
                        key={category.name}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium text-gray-900">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-bold text-gray-900">
                            {formatCurrency(category.total)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 rounded-full h-2 transition-all"
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 w-12">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
