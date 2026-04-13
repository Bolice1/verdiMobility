import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Simulate backend recognizing the role via API based on email string
    let resolvedRole = 'customer'; // Default fallback
    const lowerEmail = email.toLowerCase();
    
    if (lowerEmail.includes('admin')) resolvedRole = 'admin';
    else if (lowerEmail.includes('driver')) resolvedRole = 'driver';
    else if (lowerEmail.includes('company')) resolvedRole = 'company';

    localStorage.setItem('verdimo_user', JSON.stringify({ email, role: resolvedRole, name: 'Verified User' }));
    
    // Redirect based on role
    if (resolvedRole === 'driver') navigate('/driver/dashboard');
    else if (resolvedRole === 'company') navigate('/company/dashboard');
    else if (resolvedRole === 'customer') navigate('/customer/dashboard');
    else navigate('/admin/overview');
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
          
          <p style={{ textAlign: 'center', color: 'var(--color-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
            <strong>Demo Tip:</strong> Use an email containing <br/><code>driver</code>, <code>admin</code>, or <code>company</code> to login as those roles. All others default to <strong>Customer</strong>.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
