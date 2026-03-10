import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ExpensesByCategoryDTO } from "../../../domain/repositories/ExpenseRepository";

interface ExpensesByCategoryChartProps {
  data: ExpensesByCategoryDTO[];
}

export function ExpensesByCategoryChart({
  data,
}: ExpensesByCategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Gastos por Categoría
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.total,
    color: item.categoryColor,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Gastos por Categoría
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: $${entry.value.toFixed(2)}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        {data.map((item) => (
          <div
            key={item.categoryId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.categoryColor }}
              ></div>
              <span className="font-medium text-gray-700">
                {item.categoryName}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">
                ${item.total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {item.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
