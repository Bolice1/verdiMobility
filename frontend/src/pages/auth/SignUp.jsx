import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, User, Mail, Lock } from 'lucide-react';

const SignUp = () => {
  const [role, setRole] = useState('driver'); // Default to Independent Driver
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    // Here we would call backend POST /register endpoint
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={32} color="var(--color-primary)" />
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>VerdiMo</span>
            </div>
          </div>

          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create an Account</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Join the sustainable logistics network.</p>
          
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Role Tab Selection */}
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: 'var(--radius-lg)', gap: '0.25rem' }}>
              <button 
                type="button"
                onClick={() => setRole('customer')}
                style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: role === 'customer' ? 'white' : 'transparent', boxShadow: role === 'customer' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem' }}
              >
                Customer
              </button>
              <button 
                type="button"
                onClick={() => setRole('driver')}
                style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: role === 'driver' ? 'white' : 'transparent', boxShadow: role === 'driver' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem' }}
              >
                Driver
              </button>
              <button 
                type="button"
                onClick={() => setRole('company')}
                style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: role === 'company' ? 'white' : 'transparent', boxShadow: role === 'company' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem' }}
              >
                Company
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" placeholder="Jane" required style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Last Name</label>
                <input type="text" placeholder="Doe" required style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" placeholder="jane@example.com" required style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
              </div>
            </div>

            {role === 'driver' ? (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Vehicle Type</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', fontFamily: 'inherit' }}>
                  <option>Electric Cargo Van</option>
                  <option>Electric Box Truck</option>
                  <option>e-Cargo Bike</option>
                </select>
              </div>
            ) : role === 'company' ? (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Company Name</label>
                <input type="text" placeholder="Logistics Co." required style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Customer Needs</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', fontFamily: 'inherit' }}>
                  <option>Occasional Cargo Only</option>
                  <option>Frequent Cargo Shipping</option>
                  <option>Cargo + Ride Alongside</option>
                </select>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem', fontSize: '1rem' }}>
              Create Account
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
