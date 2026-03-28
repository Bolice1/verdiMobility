import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Settings, LogOut, MapPin } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/fleet', name: 'Fleet Status', icon: Truck },
    { path: '/drivers', name: 'Drivers', icon: Users },
    { path: '/routes', name: 'Routes', icon: MapPin },
    { path: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        {/* Simple Icon representing the VerdiMo leaf/road logo concept */}
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
        <button className="nav-item" style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit', fontSize: '1rem' }}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
