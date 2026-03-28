import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Mock selection
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In reality, this would be an API call to your backend
    // For now, we mock the session so the UI paths work
    localStorage.setItem('verdimo_user', JSON.stringify({ email, role, name: 'Demo User' }));
    
    // Redirect based on role
    if (role === 'driver') navigate('/driver/dashboard');
    else if (role === 'company') navigate('/company/dashboard');
    else if (role === 'customer') navigate('/customer/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Left branding panel */}
      <div style={{ flex: 1, backgroundColor: 'var(--color-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Truck size={48} color="var(--color-primary)" />
            <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>VerdiMo</span>
          </div>
          <h1 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '1.5rem', color: 'white' }}>
            The Premium<br/>Green Logistics Network.
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.25rem', maxWidth: '400px' }}>
            Connect with fleets, independent drivers, and manage sustainable cargo deliveries in real-time.
          </p>
        </div>
        {/* Decorative background element */}
        <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', width: '500px', height: '500px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', opacity: 0.1, filter: 'blur(60px)' }}></div>
      </div>

      {/* Right login panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome back</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Sign in to access your platform.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Mock Role Selector just for UI demo purposes */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Login as (Demo)</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', fontFamily: 'inherit' }}
              >
                <option value="customer">Customer / Shipping Client</option>
                <option value="driver">Independent Driver</option>
                <option value="company">Company Manager</option>
                <option value="admin">System Owner (Super Admin)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem', fontSize: '1rem' }}>
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
