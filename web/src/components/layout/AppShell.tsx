import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { navigationItems } from '../../../../shared/constants/navigation';
import { roleLabels } from '../../../../shared/constants/roles';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const items = navigationItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand">
          verdiMobility
        </Link>
        <p className="sidebar-role">{roleLabels[user.role]} Workspace</p>
        <nav className="nav-list">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>verdiMobility</h1>
            <p>Secure logistics, fleet visibility, and shipment orchestration.</p>
          </div>
          <div className="topbar-user">
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign out
            </Button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
