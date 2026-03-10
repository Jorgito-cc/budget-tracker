import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ExpensesByDayDTO } from "../../../domain/repositories/ExpenseRepository";

interface ExpensesByDayChartProps {
  data: ExpensesByDayDTO[];
}

export function ExpensesByDayChart({ data }: ExpensesByDayChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Gastos por Día</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("es", {
      day: "2-digit",
      month: "short",
    }),
    total: item.total,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Gastos por Día</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="total" fill="#3B82F6" name="Gasto Total" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium text-gray-700">Total del Período</span>
          <span className="text-xl font-bold text-blue-600">
            ${data.reduce((sum, day) => sum + day.total, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
