import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "BOB", symbol: "Bs", name: "Boliviano", locale: "es-BO" },
  { code: "USD", symbol: "$", name: "Dólar Estadounidense", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "es-ES" },
  { code: "ARS", symbol: "$", name: "Peso Argentino", locale: "es-AR" },
  { code: "PEN", symbol: "S/", name: "Sol Peruano", locale: "es-PE" },
  { code: "CLP", symbol: "$", name: "Peso Chileno", locale: "es-CL" },
  { code: "COP", symbol: "$", name: "Peso Colombiano", locale: "es-CO" },
  { code: "MXN", symbol: "$", name: "Peso Mexicano", locale: "es-MX" },
  { code: "BRL", symbol: "R$", name: "Real Brasileño", locale: "pt-BR" },
];

interface ConfigState {
  currency: Currency;
  sidebarCollapsed: boolean;
  setCurrency: (currency: Currency) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  formatCurrency: (amount: number) => string;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      currency: CURRENCIES[0], // Boliviano por defecto
      sidebarCollapsed: false,

      setCurrency: (currency: Currency) => set({ currency }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),

      formatCurrency: (amount: number) => {
        const { currency } = get();
        return `${currency.symbol} ${amount.toLocaleString(currency.locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    }),
    {
      name: "budget-app-config",
    },
  ),
);
