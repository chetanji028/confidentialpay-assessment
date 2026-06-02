import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./lib/auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AuthenticatedAppShellPage from "./pages/AuthenticatedAppShellPage";
import DashboardPage from "./pages/DashboardPage";
import PayrollPage from "./pages/PayrollPage";
import EmployeesPage from "./pages/EmployeesPage";
import TreasuryPage from "./pages/TreasuryPage";
import CompliancePage from "./pages/CompliancePage";
import BridgePage from "./pages/BridgePage";
import SettingsPage from "./pages/SettingsPage";
import "./styles.css";

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <AuthenticatedAppShellPage><Outlet /></AuthenticatedAppShellPage>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/treasury" element={<TreasuryPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/bridge" element={<BridgePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.18 0.045 270)",
              color: "oklch(0.98 0.005 270)",
              border: "1px solid oklch(1 0 0 / 0.08)",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
