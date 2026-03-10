import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./presentation/pages/LoginPage";
import { DashboardPage } from "./presentation/pages/DashboardPage";
import { ExpensesPage } from "./presentation/pages/ExpensesPage";
import { CategoriesPage } from "./presentation/pages/CategoriesPage";
import { BudgetsPage } from "./presentation/pages/BudgetsPage";
import { ReportsPage } from "./presentation/pages/ReportsPage";
import { ProtectedRoute } from "./presentation/components/common/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <BudgetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
