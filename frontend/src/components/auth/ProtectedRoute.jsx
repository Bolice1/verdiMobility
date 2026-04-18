import { Navigate, Outlet } from 'react-router-dom';

// This is a placeholder for real backend authentication.
// It checks localStorage to see if a generic user or specific role is logged in.
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const userStr = localStorage.getItem('verdimo_user');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userStr);
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If they don't have permission for this route, kick to their own dash
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
