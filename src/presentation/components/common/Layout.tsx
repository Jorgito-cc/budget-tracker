import { type ReactNode, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useConfigStore, CURRENCIES } from "../../store/configStore";
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  Wallet,
  BarChart3,
  LogOut,
  User,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Menu,
  X,
  Coins,
} from "lucide-react";
import { HelpModal } from "./HelpModal";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuthStore();
  const {
    currency,
    setCurrency,
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  } = useConfigStore();
  const navigate = useNavigate();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  // Cerrar menú móvil cuando cambia el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar sidebar en móvil por defecto
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Receipt, label: "Gastos", path: "/expenses" },
    { icon: FolderOpen, label: "Categorías", path: "/categories" },
    { icon: Wallet, label: "Presupuestos", path: "/budgets" },
    { icon: BarChart3, label: "Reportes", path: "/reports" },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-900 text-white flex flex-col fixed h-full z-50 transition-all duration-300
          ${sidebarCollapsed ? "w-20" : "w-64"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo / Header */}
        <div
          className={`p-4 border-b border-gray-800 ${sidebarCollapsed ? "px-2" : "p-6"}`}
        >
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-lg p-2 flex-shrink-0">
                <Wallet size={24} />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-lg">Dashboard</h1>
                  <p className="text-xs text-gray-400">
                    Gestión de Presupuesto
                  </p>
                </div>
              )}
            </div>
            {/* Botón para colapsar/expandir sidebar (solo desktop) */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
              title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
            {/* Botón cerrar menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Currency Selector */}
        <div
          className={`p-4 border-b border-gray-800 ${sidebarCollapsed ? "px-2" : ""}`}
        >
          <div className="relative">
            <button
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors ${sidebarCollapsed ? "justify-center px-2" : ""}`}
              title="Seleccionar moneda"
            >
              <Coins size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="text-sm font-medium">
                    {currency.symbol} {currency.code}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`ml-auto transition-transform ${isCurrencyMenuOpen ? "rotate-90" : ""}`}
                  />
                </>
              )}
            </button>

            {/* Dropdown de monedas */}
            {isCurrencyMenuOpen && (
              <div
                className={`absolute z-50 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 max-h-64 overflow-y-auto ${sidebarCollapsed ? "left-full ml-2 top-0 w-48" : "left-0 right-0"}`}
              >
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrencyMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${currency.code === curr.code ? "bg-blue-600 text-white" : "text-gray-300"}`}
                  >
                    <span className="font-bold w-8">{curr.symbol}</span>
                    <span>{curr.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${sidebarCollapsed ? "justify-center px-2" : ""} ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight
                        size={16}
                        className="ml-auto opacity-0 group-hover:opacity-100"
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div
          className={`p-4 border-t border-gray-800 ${sidebarCollapsed ? "px-2" : ""}`}
        >
          {/* Botón de Ayuda */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-blue-400 rounded-lg transition-colors mb-2 ${sidebarCollapsed ? "justify-center px-2" : ""}`}
            title={sidebarCollapsed ? "Ayuda" : undefined}
          >
            <HelpCircle size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Ayuda</span>
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg mb-2">
              <div className="bg-gray-700 rounded-full p-2">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors ${sidebarCollapsed ? "justify-center px-2" : ""}`}
            title={sidebarCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        {/* Header móvil con botón hamburguesa */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-lg p-1.5">
                <Wallet size={20} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">Budget App</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                {currency.symbol}
              </span>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main>{children}</main>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};
