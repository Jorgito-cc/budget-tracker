import { useEffect, useState } from "react";
import { useCategoryStore } from "../store/categoryStore";
import { useConfigStore } from "../store/configStore";
import { Category } from "../../domain/entities/Category";
import { Layout } from "../components/common/Layout";
import { Modal } from "../components/common/Modal";
import { CategoryForm } from "../components/forms/CategoryForm";
import { Plus, Trash2, FolderOpen, DollarSign, Edit2 } from "lucide-react";

export const CategoriesPage = () => {
  const { categories, fetchCategories, deleteCategory, isLoading } =
    useCategoryStore();
  const { formatCurrency } = useConfigStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Categorías
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Organiza tus gastos por categorías
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50"
          >
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando categorías...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 text-center">
            <FolderOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No hay categorías creadas
            </h3>
            <p className="text-gray-600 mb-6">
              Crea categorías para organizar mejor tus gastos
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Crear Primera Categoría
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: category.color }}
                />
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: category.color + "20",
                        }}
                      >
                        <FolderOpen
                          size={20}
                          className="sm:w-6 sm:h-6"
                          style={{ color: category.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {category.totalExpenses !== undefined && (
                    <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <DollarSign size={14} className="sm:w-4 sm:h-4" />
                        <span>Total gastado</span>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                        {formatCurrency(category.totalExpenses)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Edit2 size={16} />
                      <span className="font-medium">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      <span className="font-medium">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
      >
        <CategoryForm category={editingCategory} onSuccess={handleCloseModal} />
      </Modal>
    </Layout>
  );
};
