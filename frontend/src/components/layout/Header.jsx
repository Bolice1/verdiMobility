import { Search, Bell, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search vehicles, drivers, locations..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
        
        <div className="user-profile">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User avatar" 
            className="avatar" 
          />
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Operations Mgr</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
