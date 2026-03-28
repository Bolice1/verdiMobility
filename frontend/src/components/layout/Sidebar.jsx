import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Settings, LogOut, MapPin, Search } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('verdimo_user');
  const user = userStr ? JSON.parse(userStr) : { role: 'admin' };

  let navItems = [];

  if (user.role === 'admin') {
    navItems = [
      { path: '/admin/overview', name: 'Global Overview', icon: LayoutDashboard },
      { path: '/admin/users', name: 'All Users', icon: Users },
      { path: '/admin/audit', name: 'Audit Logs', icon: MapPin }, // Map pin or activity icon
    ];
  } else {
    // Default / Company routes
    navItems = [
      { path: `/${user.role}/dashboard`, name: 'Dashboard Overview', icon: LayoutDashboard },
      { path: `/${user.role}/fleet`, name: 'Fleet Status', icon: Truck },
      { path: `/${user.role}/drivers`, name: 'Your Drivers', icon: Users },
    ];
  }

  if (user.role === 'company') {
    navItems.push({ path: '/company/find-drivers', name: 'Find Carriers', icon: Search });
  }

  navItems.push({ path: `/${user.role}/settings`, name: 'Settings', icon: Settings });

  const handleLogout = () => {
    localStorage.removeItem('verdimo_user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Truck size={32} strokeWidth={2.5} />
        </div>
        <span>VerdiMo</span>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="nav-menu" style={{ marginTop: 'auto', flexGrow: 0 }}>
        <button onClick={handleLogout} className="nav-item" style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit', fontSize: '1rem' }}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
