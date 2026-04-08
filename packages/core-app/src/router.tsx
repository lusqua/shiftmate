import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthState } from "./auth/useAuthState";
import { AppLayout } from "./components/Layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ScheduleBoard } from "./pages/ScheduleBoard";
import { WorkersPage } from "./pages/WorkersPage";
import { RulesPage } from "./pages/RulesPage";
import { SettingsPage } from "./pages/SettingsPage";

const AppRoutes = () => {
  const { auth, loading, login, register, logout } = useAuthState();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          auth ? (
            <Navigate to="/app/schedule" replace />
          ) : (
            <LoginPage onLogin={login} loading={loading} />
          )
        }
      />
      <Route
        path="/register"
        element={
          auth ? (
            <Navigate to="/app/schedule" replace />
          ) : (
            <RegisterPage onRegister={register} loading={loading} />
          )
        }
      />
      <Route
        path="/app"
        element={
          auth ? (
            <AppLayout
              tenantName={auth.tenantName}
              userName={auth.name}
              onLogout={logout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="/app/schedule" replace />} />
        <Route path="schedule" element={<ScheduleBoard />} />
        <Route path="workers" element={<WorkersPage />} />
        <Route path="rules" element={<RulesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={auth ? "/app/schedule" : "/login"} replace />}
      />
    </Routes>
  );
};

export const AppRouter = () => (
  <HashRouter>
    <AppRoutes />
  </HashRouter>
);
