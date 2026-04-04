import { useState, useEffect } from 'react';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { MapPin, Navigation, Package, DollarSign, Bell, Truck, Settings as SettingsIcon, Power, LogOut, ChevronRight, User, CircleDot } from 'lucide-react';

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [cargoSpace, setCargoSpace] = useState('');
  const [destination, setDestination] = useState('');
  const [hasJob, setHasJob] = useState(false);
  
  const driverMapData = [
    { id: 'SELF', name: 'Your Vehicle', cargoSpace: isAvailable ? cargoSpace || 'Available' : 'Offline', coordinates: [51.505, -0.09], heading: destination || 'N/A' }
  ];

  const activeJob = {
    id: 'JOB-9421',
    pickup: 'Warehouse A (Northside)',
    dropoff: '124 Green St. Downtown',
    status: 'en_route',
    distance: '3.2 mi',
    timeEst: '14 mins',
    client: 'Sarah Jenkins',
    payout: '$45.00'
  };

  const handleToggleOnline = (e) => {
    e.preventDefault();
    if (!cargoSpace && !isAvailable) {
      alert("Please enter your available capacity first!");
      return;
    }
    
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    
    if (newStatus) {
      setTimeout(() => {
        setHasJob(true);
      }, 3500);
    } else {
      setHasJob(false);
    }
  };

  const completeJob = () => {
    setHasJob(false);
    setIsAvailable(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', top: 0, left: 0, position: 'fixed', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
      
      {/* Absolute Map Layer */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1, filter: isAvailable ? 'none' : 'grayscale(1) opacity(0.8)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <LiveTrackingMap drivers={driverMapData} />
        {isAvailable && !hasJob && (
           <div className="radar-pulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.4)', zIndex: 1000, pointerEvents: 'none' }}></div>
        )}
      </div>

      {/* Top HUD (Heads Up Display) */}
      <div style={{ position: 'absolute', top: 'env(safe-area-inset-top, 1rem)', left: '1rem', right: '1rem', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Brand & Status Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', pointerEvents: 'auto', boxShadow: 'var(--shadow-md)', backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isAvailable ? '#10B981' : '#94A3B8', boxShadow: isAvailable ? '0 0 10px #10B981' : 'none', transition: 'all 0.3s' }}></div>
            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-secondary)' }}>VerdiMo Driver</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', pointerEvents: 'auto' }}>
             <button className="icon-btn glass" style={{ backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: 'var(--shadow-md)' }} onClick={() => window.location.href='/driver/settings'}>
               <User size={18} color="var(--color-secondary)" />
             </button>
             {isAvailable && (
               <div className="glass" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', boxShadow: 'var(--shadow-md)' }}>
                 <Bell size={18} color="var(--color-primary)" />
               </div>
             )}
          </div>
        </div>

        {/* Earnings Widget */}
        <div className="glass" style={{ width: 'fit-content', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto', boxShadow: 'var(--shadow-md)' }}>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>Earnings Today</span>
             <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center' }}>
               <DollarSign size={16} color="var(--color-primary)" /> 142.50
             </span>
           </div>
           <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>Completed</span>
             <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-secondary)', textAlign: 'center' }}>4</span>
           </div>
        </div>

      </div>

      {/* Floating Gradient Shadow to make bottom controls pop */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40vh', background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }}></div>

      {/* Floating Bottom Control Center */}
      <div style={{ position: 'absolute', bottom: 'calc(4rem + env(safe-area-inset-bottom))', left: '1rem', right: '1rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {hasJob ? (
          /* Active Job Card */
          <div className="card job-card" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: 'none' }}>
            {/* Header */ }
            <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div className="pulse-dot-white"></div>
                 <span style={{ fontWeight: 700 }}>New Cargo Matched!</span>
               </div>
               <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeJob.payout}</span>
            </div>
            
            {/* Body */}
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: '50%' }}>
                   <Package size={24} color="var(--color-primary-dark)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Distance: {activeJob.distance}</div>
                  <div style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: '1.125rem' }}>{activeJob.client}</div>
                </div>
              </div>

              {/* Route Trajectory */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '17px', top: '16px', bottom: '16px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2 }}>
                   <CircleDot size={18} color="var(--color-text-muted)" style={{ backgroundColor: 'white' }} />
                   <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{activeJob.pickup}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2, marginTop: '1rem' }}>
                   <MapPin size={18} color="var(--color-primary)" style={{ backgroundColor: 'white' }} />
                   <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{activeJob.dropoff}</span>
                </div>
              </div>

              {/* Action Button */}
              <button onClick={completeJob} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', borderRadius: 'var(--radius-full)', fontWeight: 800, boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)' }}>
                Complete Transport
              </button>
            </div>
          </div>
        ) : (
          /* Offline / Online Status Card */
          <div className="card" style={{ padding: '1.5rem', boxShadow: 'var(--shadow-xl)', border: isAvailable ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                 {isAvailable ? (
                   <>
                     <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>You are Online</span>
                     <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Scanning network for client requests...</span>
                   </>
                 ) : (
                   <>
                     <span style={{ fontWeight: 800 }}>Currently Offline</span>
                     <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Input your cargo capacity to begin</span>
                   </>
                 )}
               </h2>
            </div>

            {/* Hidden forms when online for cleaner UI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: isAvailable ? '0px' : '200px', opacity: isAvailable ? 0 : 1, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ position: 'relative' }}>
                <Package size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Cargo Space Available (e.g. 50%)" 
                  value={cargoSpace}
                  onChange={(e) => setCargoSpace(e.target.value)}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 2.8rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#F1F5F9', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', fontWeight: 600 }} 
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Navigation size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="General Heading (Optional)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 2.8rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#F1F5F9', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', fontWeight: 600 }} 
                />
              </div>
            </div>

            <button 
              onClick={handleToggleOnline}
              style={{ 
                width: '100%', padding: '1.25rem', fontSize: '1.125rem', fontWeight: 800, 
                borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
                backgroundColor: isAvailable ? '#EF4444' : 'var(--color-primary)', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: isAvailable ? '0 10px 15px -3px rgba(239, 68, 68, 0.4)' : '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              <Power size={20} />
              {isAvailable ? 'Go Offline' : 'GO ONLINE'}
            </button>
          </div>
        )}

      </div>
      
      {/* Root Standard Navigation Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '0.75rem', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0.5rem))', borderTop: '1px solid var(--color-border)' }}>
        <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-primary)', cursor: 'pointer' }}>
          <Truck size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 700 }}>Drive</span>
        </button>
        <button onClick={() => window.location.href='/driver/settings'} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <SettingsIcon size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Settings</span>
        </button>
        <button onClick={() => { localStorage.removeItem('verdimo_user'); window.location.href='/login'; }} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <LogOut size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Logout</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .radar-pulse {
          animation: radar 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @keyframes radar {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .job-card {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .pulse-dot-white {
          width: 8px; height: 8px; border-radius: 50%; background-color: white; 
          box-shadow: 0 0 10px white;
          animation: simplePulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes simplePulse {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0.5; transform: scale(1.5); }
        }
      `}} />
    </div>
  );
};

export default DriverDashboard;
