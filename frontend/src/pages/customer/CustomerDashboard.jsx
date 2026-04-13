import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { MapPin, Navigation, Package, Truck, LogOut, CheckCircle, Clock, Settings as SettingsIcon, ChevronRight, X, Star } from 'lucide-react';

const mockAvailableDrivers = [
  { id: 'DRV-101', name: 'Marco Rossi', avatar: 'https://i.pravatar.cc/150?u=marco', cargoSpace: 'Full Van capacity', heading: 'Downtown Sector 4', coordinates: [51.505, -0.09], type: 'cargo', distance: '1.2 mi away', rating: 4.9 },
  { id: 'DRV-102', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarahj', cargoSpace: '2 Seats + Trunk', heading: 'Northside Arena', coordinates: [51.512, -0.095], type: 'cargo_and_ride', distance: '2.5 mi away', rating: 4.8 },
  { id: 'DRV-133', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=johnd', cargoSpace: 'Empty Cargo Bed', heading: 'Eastside Port', coordinates: [51.501, -0.08], type: 'cargo', distance: '3.0 mi away', rating: 4.5 },
  { id: 'DRV-145', name: 'Emily Chen', avatar: 'https://i.pravatar.cc/150?u=emilyc', cargoSpace: '3 Passenger Seats', heading: 'Airport Terminal 2', coordinates: [51.49, -0.08], type: 'cargo_and_ride', distance: '4.5 mi away', rating: 5.0 },
  { id: 'DRV-150', name: 'Michael Smith', avatar: 'https://i.pravatar.cc/150?u=michaels', cargoSpace: 'Half Box Truck', heading: 'Westside Logistics Hub', coordinates: [51.52, -0.12], type: 'cargo', distance: '0.8 mi away', rating: 4.7 }
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeTab, setActiveTab] = useState('all'); 
  const [bookingStatus, setBookingStatus] = useState('idle'); 
  const [selectedDriver, setSelectedDriver] = useState(null);

  const displayedDrivers = useMemo(() => {
    if (activeTab === 'all') return mockAvailableDrivers;
    return mockAvailableDrivers.filter(d => d.type === activeTab);
  }, [activeTab]);

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setBookingStatus('idle'); // When clicking a new driver, reset status
  };

  const handleBook = () => {
    setBookingStatus('booked');
  };

  const handleLogout = () => {
    localStorage.removeItem('verdimo_user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
      
      {/* -------------------- SIDEBAR -------------------- */}
      <div style={{ width: '420px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(0,0,0,0.1)', zIndex: 10, position: 'relative', boxShadow: '5px 0 25px rgba(0,0,0,0.05)' }}>
        
        {/* Sidebar Header */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: 'var(--color-primary)', padding: '0.4rem', borderRadius: '50%' }}>
              <Truck size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-secondary)' }}>VerdiMo Customer</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/customer/settings')} title="Settings">
               <SettingsIcon size={22} color="var(--color-text-muted)" />
             </button>
             <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleLogout} title="Log Out">
               <LogOut size={22} color="var(--color-text-muted)" />
             </button>
          </div>
        </div>

        {/* Search Input Card */}
        <div style={{ padding: '1.5rem', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>Browse Cargo Rides</h2>
          
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
            <button onClick={() => setActiveTab('all')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'all' ? 'white' : 'transparent', boxShadow: activeTab === 'all' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem' }}>Any</button>
            <button onClick={() => setActiveTab('cargo')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'cargo' ? 'white' : 'transparent', boxShadow: activeTab === 'cargo' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem' }}>Cargo</button>
            <button onClick={() => setActiveTab('cargo_and_ride')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'cargo_and_ride' ? 'white' : 'transparent', boxShadow: activeTab === 'cargo_and_ride' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem' }}>+ Passenger</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ position: 'absolute', left: '7px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }}></div>
              <input type="text" placeholder="Current Location" value={pickup} onChange={(e) => setPickup(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }} />
            </div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ position: 'absolute', left: '7px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', backgroundColor: 'var(--color-primary)' }}></div>
              <input type="text" placeholder="Drop-off Destination" value={dropoff} onChange={(e) => setDropoff(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }} />
            </div>
          </div>
        </div>

        {/* Live Feed List (Scrollable) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '1rem 1.5rem', backgroundColor: '#F8FAFC' }} className="hide-scrollbar">
          <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Available Nearby</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {displayedDrivers.map((driver) => (
              <div key={driver.id} className="zoom-on-hover" onClick={() => handleSelectDriver(driver)} style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: selectedDriver?.id === driver.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', backgroundColor: 'white', borderRadius: '1rem', boxShadow: selectedDriver?.id === driver.id ? '0 4px 15px rgba(16,185,129,0.15)' : '0 2px 5px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={driver.avatar} alt={driver.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{driver.cargoSpace}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <Clock size={12} /> {driver.distance} &bull; <Star size={12} fill="#EAB308" color="#EAB308"/> {driver.rating}
                    </span>
                  </div>
                </div>
                <div>
                  <ChevronRight size={20} color={selectedDriver?.id === driver.id ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                </div>
              </div>
            ))}
            {displayedDrivers.length === 0 && (
               <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                 No vehicles match your criteria.
               </div>
            )}
          </div>
        </div>
      </div>

      {/* -------------------- MAP AREA & RIGHT PANEL FLYOUT -------------------- */}
      <div style={{ flex: 1, position: 'relative', height: '100%', backgroundColor: '#E2E8F0' }}>
        <LiveTrackingMap drivers={mockAvailableDrivers} />

        {/* The Target Panel Flyout (Right side of sidebar) */}
        {selectedDriver && (
          <div className="slide-right" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '380px', zIndex: 10 }}>
            {bookingStatus === 'booked' ? (
              <div className="card glass-card" style={{ padding: '1.5rem', pointerEvents: 'auto', border: '2px solid var(--color-primary)', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}>
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <CheckCircle size={56} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>Driver En Route!</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    <strong>{selectedDriver.name}</strong> has confirmed your request. Discuss pricing upon arrival.
                  </p>
                  
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '1rem', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Truck size={20} color="var(--color-primary)" />
                      <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{selectedDriver.cargoSpace}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <Clock size={16} /> Arriving in approx {(Math.random() * 10 + 5).toFixed(0)} mins
                    </div>
                  </div>
                  
                  <button className="btn" style={{ width: '100%', padding: '1rem', backgroundColor: '#F1F5F9', border: 'none', color: 'var(--color-secondary)', fontWeight: 800, borderRadius: '0.75rem', cursor: 'pointer' }} onClick={() => setSelectedDriver(null)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="card glass-card" style={{ padding: 0, overflow: 'hidden', pointerEvents: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                
                {/* Header */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Selected Driver</span>
                    <h3 style={{ margin: '0.25rem 0 0 0', fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-secondary)' }}>{selectedDriver.name}</h3>
                  </div>
                  <button onClick={() => setSelectedDriver(null)} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer' }}>
                    <X size={16} color="var(--color-text-muted)" />
                  </button>
                </div>

                {/* Details */}
                <div style={{ padding: '1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <img src={selectedDriver.avatar} alt="Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{selectedDriver.cargoSpace}</div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#EAB308' }}><Star size={14} fill="#EAB308"/> {selectedDriver.rating}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}><Clock size={14} /> {selectedDriver.distance}</span>
                        </div>
                      </div>
                   </div>

                   {/* Stats Area */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Heading Towards</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{selectedDriver.heading}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Status</span>
                        <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Available</span>
                      </div>
                   </div>

                   {/* Actions */}
                   <button onClick={handleBook} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', borderRadius: '1rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                     <Package size={20} /> Request Booking
                   </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .slide-right { animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideRight {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .zoom-on-hover { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .zoom-on-hover:active { transform: scale(0.98); }
        .glass-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
};

export default CustomerDashboard;
