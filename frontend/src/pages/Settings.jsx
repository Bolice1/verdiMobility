import { useState, useEffect } from 'react';
import { User, Bell, Shield, Wallet, Settings as SettingsIcon, Truck, Save, Building } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({ name: '', role: 'customer', email: '' });

  useEffect(() => {
    const userStr = localStorage.getItem('verdimo_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings have been saved locally!');
  };

  const renderRoleSpecificSettings = () => {
    switch (user.role) {
      case 'driver':
        return (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--color-primary)" /> Vehicle Configuration
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Vehicle Type</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}>
                  <option>Electric Box Truck</option>
                  <option>Electric Van</option>
                  <option>e-Cargo Bike</option>
                  <option>Passenger EV</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Max Capacity (kg)</label>
                <input type="number" defaultValue={500} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>
        );
      case 'company':
        return (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} color="var(--color-primary)" /> Fleet Operations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Default Dispatch Policy</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}>
                  <option>Internal Fleet Only</option>
                  <option>Internal First, then Independents</option>
                  <option>Cost-Optimized Network Search</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Maximum Broadcast Distance (Miles)</label>
                <input type="number" defaultValue={25} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="card" style={{ marginBottom: '1.5rem', border: '1px solid #DC2626' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626' }}>
              <Shield size={20} /> Super Admin Overrides
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" /> 
                <span style={{ fontWeight: 500 }}>System-wide Maintenance Mode (Lock all actions)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" defaultChecked /> 
                <span style={{ fontWeight: 500 }}>Require Background Checks for new Drivers</span>
              </label>
            </div>
          </div>
        );
      default:
        // Customer
        return (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={20} color="var(--color-primary)" /> Payments & Shipping
            </h3>
            <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
              <i>Payment integrations (Stripe) will be initialized when backend API connects. Default is "Cash / Custom Agreement with Driver".</i>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: user.role === 'customer' || user.role === 'driver' ? '1rem' : '0' }}>
      
      {(user.role === 'customer' || user.role === 'driver') && (
         <div style={{ marginBottom: '1.5rem' }}>
           <button onClick={() => window.history.back()} className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
             &larr; Back to Dashboard
           </button>
         </div>
      )}

      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Platform Settings</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem', textTransform: 'capitalize' }}>Manage your {user.role} profile and preferences.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary glass">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Settings Navigation */}
        <div style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: activeTab === 'profile' ? 'var(--color-secondary)' : 'transparent', color: activeTab === 'profile' ? 'white' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          >
            <User size={18} /> Account Profile
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: activeTab === 'notifications' ? 'var(--color-secondary)' : 'transparent', color: activeTab === 'notifications' ? 'white' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: activeTab === 'security' ? 'var(--color-secondary)' : 'transparent', color: activeTab === 'security' ? 'white' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          >
            <Shield size={18} /> Security & Privacy
          </button>
          <button 
            onClick={() => setActiveTab('role')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: activeTab === 'role' ? 'var(--color-secondary)' : 'transparent', color: activeTab === 'role' ? 'white' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          >
            <SettingsIcon size={18} /> System Configurations
          </button>
        </div>

        {/* Settings Content Area */}
        <div style={{ flexGrow: 1 }}>
          {activeTab === 'profile' && (
            <div className="card">
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Personal Information</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Full Name / Organization</label>
                    <input type="text" defaultValue={user.name} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
                  <input type="email" defaultValue={user.email} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Language Preference</label>
                  <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}>
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Push Notifications</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Get live alerts on browser when cargo is matched or assigned.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Email Digests</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Daily summary of fleet analytics or cargo routes completed.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Marketing & Updates</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Receive news regarding VerdiMobility enhancements.</div>
                  </div>
                  <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Security Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'transparent', width: 'fit-content' }}>Change Password</button>
                <button className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'transparent', width: 'fit-content' }}>Enable Two-Factor Authentication (2FA)</button>
                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <button className="btn" style={{ border: '1px solid #DC2626', color: '#DC2626', backgroundColor: 'transparent', width: 'fit-content' }}>Delete Account Permanently</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'role' && (
            <div>
              {renderRoleSpecificSettings()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
