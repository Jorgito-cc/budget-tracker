import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { HelpModal } from "./HelpModal";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600">
              💰 Budget App
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Gastos
              </Link>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Categorías
              </Link>
              <Link
                to="/budgets"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Presupuestos
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              title="Guía de uso"
            >
              <HelpCircle size={20} />
              <span className="hidden md:inline">Ayuda</span>
            </button>
            <span className="text-gray-700 text-sm">
              Hola, <strong>{user?.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </nav>
  );
}
