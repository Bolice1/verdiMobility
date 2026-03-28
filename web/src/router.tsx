import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import { useAuth } from './context/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { FleetManagementPage } from './pages/FleetManagementPage';
import { LoginPage } from './pages/LoginPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ShipmentManagementPage } from './pages/ShipmentManagementPage';
import { TrackingPage } from './pages/TrackingPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-page"><p>Loading...</p></div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <AppShell />;
}

export function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />
      <Route path="/reset-password" element={user ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fleet" element={<FleetManagementPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/shipments" element={<ShipmentManagementPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
