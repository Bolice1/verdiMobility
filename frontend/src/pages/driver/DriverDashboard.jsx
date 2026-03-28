import { useState } from 'react';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { MapPin, Navigation, Package, CheckCircle, Bell, Truck, Settings as SettingsIcon, Power, LogOut } from 'lucide-react';

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [cargoSpace, setCargoSpace] = useState('');
  const [destination, setDestination] = useState('');
  const [hasJob, setHasJob] = useState(false); // Simulate receiving a job
  
  // Custom mock map data to show the driver where they are
  const driverMapData = [
    { id: 'SELF', name: 'You', cargoSpace: isAvailable ? cargoSpace || 'Available' : 'En Route', coordinates: [51.505, -0.09], heading: destination }
  ];

  const activeJob = {
    id: 'JOB-9421',
    pickup: 'Warehouse A (Northside)',
    dropoff: '124 Green St. Downtown',
    status: 'en_route',
    distance: '3.2 mi',
    timeEst: '14 mins',
    client: 'Sarah Jenkins'
  };

  const handleToggleOnline = (e) => {
    e.preventDefault();
    if (!cargoSpace) {
      alert("Please enter your empty capacity first!");
      return;
    }
    setIsAvailable(!isAvailable);
    
    // Simulate getting a job 3 seconds after going online for demo interactivity
    if (!isAvailable) {
      setTimeout(() => {
        setHasJob(true);
      }, 3000);
    } else {
      setHasJob(false);
    }
  };

  const completeJob = () => {
    setHasJob(false);
    setIsAvailable(true); // Back online automatically
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: 'var(--color-surface)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Immersive Map Background */}
      <div style={{ flexGrow: 1, position: 'relative', zIndex: 1, filter: isAvailable ? 'none' : 'grayscale(0.8) opacity(0.6)', transition: 'all 0.5s ease' }}>
        <LiveTrackingMap drivers={driverMapData} />
        {isAvailable && !hasJob && (
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '2px solid rgba(16, 185, 129, 0.5)', zIndex: 1000, pointerEvents: 'none', animation: 'radarPulse 2s infinite' }}></div>
        )}
      </div>

      {/* Top Floating App Details */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', zIndex: 10, pointerEvents: 'none' }}>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', pointerEvents: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <Truck size={18} color="var(--color-primary)" />
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>VerdiMo</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
          <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem', color: isAvailable ? 'var(--color-primary-dark)' : 'var(--color-text-muted)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isAvailable ? 'var(--color-primary)' : 'var(--color-text-muted)' }}></div>
            {isAvailable ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Bottom Sheet Drawer Interface */}
      <div style={{ zIndex: 20, backgroundColor: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', maxHeight: '60vh', transition: 'all 0.3s ease' }}>
        
        {/* Drawer Drag Handle indicator */}
        <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', margin: '12px auto', flexShrink: 0 }}></div>

        <div style={{ padding: '1rem 1.5rem 2rem 1.5rem', overflowY: 'auto' }}>
          
          {hasJob ? (
            <div className="job-alert-animation">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>New Cargo Match!</span>
                <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{activeJob.distance}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--color-text-muted)' }}></div>
                    <div style={{ width: '2px', height: '30px', backgroundColor: 'var(--color-border)' }}></div>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-primary)' }}></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{activeJob.pickup}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pickup Client: {activeJob.client}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{activeJob.dropoff}</div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={completeJob}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', fontWeight: 700, borderRadius: 'var(--radius-lg)' }}
              >
                Complete Delivery
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--color-secondary)' }}>
                {isAvailable ? 'Broadcasting Space...' : 'Ready to earn?'}
              </h2>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', opacity: isAvailable ? 0.5 : 1, pointerEvents: isAvailable ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
                <div style={{ position: 'relative' }}>
                  <Package size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Available Free Space (e.g. 50% capacity)" 
                    value={cargoSpace}
                    onChange={(e) => setCargoSpace(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} 
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Navigation size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Heading Towards (Optional)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} 
                  />
                </div>
              </form>

              <button 
                onClick={handleToggleOnline}
                style={{ 
                  width: '100%', padding: '1.25rem', fontSize: '1.125rem', fontWeight: 700, 
                  borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
                  backgroundColor: isAvailable ? '#EF4444' : 'var(--color-primary)', 
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: isAvailable ? 'none' : '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s'
                }}
              >
                <Power size={20} />
                {isAvailable ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          )}
        </div>
        
        {/* Bottom Nav Bar */}
        <div style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', justifyContent: 'space-around', padding: '0.75rem', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-primary)', cursor: 'pointer' }}>
            <MapPin size={22} />
            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 600 }}>Drive</span>
          </button>
          <button onClick={() => window.location.href='/driver/settings'} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <SettingsIcon size={22} />
            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Settings</span>
          </button>
          <button onClick={() => { localStorage.removeItem('verdimo_user'); window.location.href='/login'; }} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <LogOut size={22} />
            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Logout</span>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes radarPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .job-alert-animation {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default DriverDashboard;
