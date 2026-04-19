import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import FindDrivers from './pages/company/FindDrivers';
import DriverDashboard from './pages/driver/DriverDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import GlobalDashboard from './pages/admin/GlobalDashboard';
import SystemUsers from './pages/admin/SystemUsers';
import SystemAudit from './pages/admin/SystemAudit';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Super Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<GlobalDashboard />} />
            <Route path="users" element={<SystemUsers />} />
            <Route path="audit" element={<SystemAudit />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Company Manager Routes */}
        <Route path="/company" element={<ProtectedRoute allowedRoles={['company']} />}>
          <Route element={<Layout />}>
          
            <Route index element={<Navigate to="/company/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fleet" element={<Fleet />} />
            <Route path="find-drivers" element={<FindDrivers />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Independent Driver Routes */}
        <Route path="/driver" element={<ProtectedRoute allowedRoles={['driver']} />}>
          <Route index element={<Navigate to="/driver/dashboard" replace />} />
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>


        {/* Customer / Client Routes */}
        <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
