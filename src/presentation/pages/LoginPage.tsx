import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Mail, Lock, Calendar, PieChart, DollarSign, User } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "login") {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      navigate("/dashboard");
    } catch (err) {
      // Error manejado por el store
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section (visible en desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 opacity-20">
          <Calendar size={120} className="text-white" />
        </div>
        <div className="absolute bottom-40 left-20 opacity-20">
          <PieChart size={100} className="text-white" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10">
          <DollarSign size={80} className="text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white rounded-lg p-2">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <span className="text-white text-xl font-bold">
              Sistema de Gestión de Presupuesto
              <br />
              <span className="text-sm font-normal">
                Semanal para Estudiantes
              </span>
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-5xl font-bold mb-6 leading-tight">
            Controla tus
            <br />
            finanzas, alcanza
            <br />
            tus metas.
          </h1>
          <p className="text-blue-100 text-lg">
            Tu camino hacia la libertad
            <br />
            financiera comienza aquí
          </p>
        </div>

        <div className="relative z-10 text-blue-100 text-sm">
          Wednesday, January 28, 2026 at 10:00:34 PM -04
        </div>
      </div>

      {/* Right Side - Form Section con fondo decorativo en mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 lg:bg-gray-50">
        {/* Decorative Elements para Mobile */}
        <div className="lg:hidden absolute top-10 right-10 opacity-10">
          <Calendar size={80} className="text-white" />
        </div>
        <div className="lg:hidden absolute bottom-20 left-10 opacity-10">
          <PieChart size={70} className="text-white" />
        </div>
        <div className="lg:hidden absolute top-1/2 left-1/4 opacity-5">
          <DollarSign size={60} className="text-white" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Header para mobile con el degradado */}
          <div className="lg:hidden text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              Controla tus finanzas,
              <br />
              alcanza tus metas
            </h1>
            <p className="text-blue-100 text-sm">
              Tu camino hacia la libertad financiera
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Bienvenido!
            </h2>
            <p className="text-gray-600 mb-6">
              Ingresa a tu cuenta o crea una nueva
            </p>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`pb-3 px-4 font-medium transition-colors relative ${
                  activeTab === "login"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Iniciar Sesión
                {activeTab === "login" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`pb-3 px-4 font-medium transition-colors relative ${
                  activeTab === "register"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Registrarse
                {activeTab === "register" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                    <User
                      className="absolute left-3 top-3.5 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                  <Mail
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <Lock
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              {activeTab === "login" && (
                <div className="flex items-center justify-end">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors shadow-lg shadow-blue-500/50"
              >
                {isLoading
                  ? "Procesando..."
                  : activeTab === "login"
                    ? "Ingresar"
                    : "Crear Cuenta"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
