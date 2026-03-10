import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
