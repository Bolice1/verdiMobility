import { useState } from 'react';
import { MapPin, Navigation, Package, CheckCircle, Bell, Truck, Settings as SettingsIcon } from 'lucide-react';

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [cargoSpace, setCargoSpace] = useState('');
  const [destination, setDestination] = useState('');
  
  // Mock current active job
  const activeJob = isAvailable ? null : {
    id: 'JOB-9421',
    pickup: 'Warehouse A (Northside)',
    dropoff: '124 Green St. Downtown',
    status: 'en_route',
    distance: '3.2 mi',
    timeEst: '14 mins'
  };

  const handlePostAvailability = (e) => {
    e.preventDefault();
    setIsAvailable(true);
    // Real app: API call to broadcast location and availability to companies
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      {/* Mobile Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck size={24} color="var(--color-primary)" />
          <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>VerdiMo Driver</span>
        </div>
        <button className="icon-btn">
          <Bell size={20} />
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Hello, Marco.</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>You are currently <strong style={{ color: isAvailable ? 'var(--color-primary-dark)' : 'var(--color-text)' }}>{isAvailable ? 'Available for Cargo' : 'On a Route'}</strong></p>
      </div>

      {activeJob && !isAvailable ? (
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)', fontSize: '0.875rem' }}>ACTIVE ROUTE</span>
            <span style={{ fontWeight: 600 }}>{activeJob.id}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <MapPin size={20} color="var(--color-text-muted)" />
                <div style={{ width: '2px', height: '24px', backgroundColor: 'var(--color-border)', margin: '4px 0' }}></div>
                <Navigation size={20} color="var(--color-primary)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Pickup</div>
                  <div style={{ fontWeight: 500 }}>{activeJob.pickup}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Dropoff</div>
                  <div style={{ fontWeight: 500 }}>{activeJob.dropoff}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Est. Time</div>
              <div style={{ fontWeight: 600 }}>{activeJob.timeEst}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Distance</div>
              <div style={{ fontWeight: 600 }}>{activeJob.distance}</div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            onClick={() => setIsAvailable(true)}
          >
            <CheckCircle size={20} /> Complete Delivery
          </button>
        </div>
      ) : (
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Announce Free Cargo Space</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Broadcast your availability to companies. We will ping your live GPS location to the network.
          </p>

          <form onSubmit={handlePostAvailability} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Available Space / Capacity</label>
              <div style={{ position: 'relative' }}>
                <Package size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. 500kg or Half Truck" 
                  value={cargoSpace}
                  onChange={(e) => setCargoSpace(e.target.value)}
                  required 
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Heading Towards (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Navigation size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Downtown Sector 4"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              Broadcast Availability Now
            </button>
          </form>
        </div>
      )}
      
      {/* Absolute Mobile Nav Bar (Bottom) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-around', padding: '1rem', zIndex: 10 }}>
        <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-primary)' }}>
          <Truck size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 600 }}>Trips</span>
        </button>
        <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)' }}>
          <MapPin size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Map</span>
        </button>
        <button 
          onClick={() => window.location.href='/driver/settings'}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <SettingsIcon size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Settings</span>
        </button>
        <button 
          onClick={() => { localStorage.removeItem('verdimo_user'); window.location.href='/login'; }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <Bell size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Logout</span>
        </button>
      </div>

    </div>
  );
};

export default DriverDashboard;
