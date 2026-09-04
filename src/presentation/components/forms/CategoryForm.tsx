import { useState, useEffect, type FormEvent } from "react";
import { useCategoryStore } from "../../store/categoryStore";
import { Category } from "../../../domain/entities/Category";

const PRESET_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

interface CategoryFormProps {
  category?: Category | null;
  onSuccess?: () => void;
}

export const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const { createCategory, updateCategory, isLoading } = useCategoryStore();
  const [formData, setFormData] = useState({
    name: "",
    color: PRESET_COLORS[0],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
      });
    }
  }, [category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (category) {
        await updateCategory(category.id, formData);
      } else {
        await createCategory(formData);
      }
      setFormData({
        name: "",
        color: PRESET_COLORS[0],
      });
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        `Error al ${category ? "actualizar" : "crear"} la categoría`;
      setError(errorMessage);
      console.error("Error with category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">
        {category ? "Editar Categoría" : "Nueva Categoría"}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Comida, Transporte..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`h-10 rounded-md border-2 ${
                formData.color === color
                  ? "border-gray-900 scale-110"
                  : "border-gray-300"
              } transition-transform`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading
          ? "Guardando..."
          : category
            ? "Actualizar Categoría"
            : "Crear Categoría"}
      </button>
    </form>
  );
};
