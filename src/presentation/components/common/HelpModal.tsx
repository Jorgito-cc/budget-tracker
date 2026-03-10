import {
  X,
  Wallet,
  Tags,
  DollarSign,
  BarChart3,
  CheckCircle,
} from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      icon: Wallet,
      title: "1. Crea un Presupuesto",
      description:
        "Ve a 'Gestión de Presupuesto' y crea un nuevo presupuesto. Define el monto total, fecha de inicio y fin (por ejemplo, semanal o mensual).",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Tags,
      title: "2. Define tus Categorías",
      description:
        "En 'Categorías', crea las categorías para organizar tus gastos (Comida, Transporte, Entretenimiento, etc.). Personaliza los colores para identificarlas fácilmente.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: DollarSign,
      title: "3. Registra tus Gastos",
      description:
        "Desde el Dashboard o 'Registro de Gastos', añade cada gasto seleccionando la categoría, monto, fecha y descripción. El presupuesto se actualizará automáticamente.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: BarChart3,
      title: "4. Analiza tus Finanzas",
      description:
        "Revisa los gráficos en el Dashboard y en 'Reportes y Análisis' para ver cómo gastas tu dinero. Puedes exportar reportes en PDF.",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle size={28} />
                Guía de Uso - Sistema de Cotización
              </h2>
              <p className="text-blue-100 mt-1">
                Aprende a usar la aplicación en 4 simples pasos
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-500 rounded-lg p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Intro */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-gray-700">
              <strong>Bienvenido!</strong> Esta aplicación te ayuda a gestionar
              tus presupuestos y controlar tus gastos de manera fácil y visual.
              Sigue estos pasos para comenzar:
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <div className={`${step.color} rounded-lg p-3 h-fit`}>
                    <step.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              Consejos Útiles
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>
                  <strong>Múltiples presupuestos:</strong> Puedes tener varios
                  presupuestos activos con diferentes nombres (ej: "Semanal",
                  "Extra", "Ahorros").
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>
                  <strong>Selecciona el presupuesto:</strong> Al registrar un
                  gasto, elige de qué presupuesto se descontará.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>
                  <strong>Edita y elimina:</strong> Puedes editar o eliminar
                  presupuestos y categorías desde sus respectivas páginas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>
                  <strong>Exporta reportes:</strong> En la sección de Reportes
                  puedes descargar tus análisis en formato PDF.
                </span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
            >
              ¡Entendido! Comenzar a usar la app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
