import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { MapPin, Navigation, Package, Truck, LogOut, CheckCircle, Clock, Settings as SettingsIcon, ChevronRight, X } from 'lucide-react';

const mockAvailableDrivers = [
  { id: 'DRV-101', name: 'Marco Rossi', cargoSpace: 'Full Van capacity', heading: 'Downtown Sector 4', coordinates: [51.505, -0.09], type: 'cargo', distance: '1.2 mi away', rating: 4.9 },
  { id: 'DRV-102', name: 'Sarah Jenkins', cargoSpace: '2 Seats + Trunk', heading: 'Northside Arena', coordinates: [51.512, -0.095], type: 'cargo_and_ride', distance: '2.5 mi away', rating: 4.8 },
  { id: 'DRV-133', name: 'John Doe', cargoSpace: 'Empty Cargo Bed', heading: 'Eastside Port', coordinates: [51.501, -0.08], type: 'cargo', distance: '3.0 mi away', rating: 4.5 },
  { id: 'DRV-145', name: 'Emily Chen', cargoSpace: '3 Passenger Seats', heading: 'Airport Terminal 2', coordinates: [51.49, -0.08], type: 'cargo_and_ride', distance: '4.5 mi away', rating: 5.0 },
  { id: 'DRV-150', name: 'Michael Smith', cargoSpace: 'Half Box Truck', heading: 'Westside Logistics Hub', coordinates: [51.52, -0.12], type: 'cargo', distance: '0.8 mi away', rating: 4.7 }
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeTab, setActiveTab] = useState('all'); 
  const [bookingStatus, setBookingStatus] = useState('idle'); 
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const displayedDrivers = useMemo(() => {
    if (activeTab === 'all') return mockAvailableDrivers;
    return mockAvailableDrivers.filter(d => d.type === activeTab);
  }, [activeTab]);

  const handleBook = (driver) => {
    setSelectedDriver(driver);
    setBookingStatus('booked');
    setIsDrawerOpen(false); // Close drawer to show map
  };

  const handleLogout = () => {
    localStorage.removeItem('verdimo_user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-background)' }}>
      
      {/* Absolute Map Background for Ultimate Immersion */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <LiveTrackingMap drivers={mockAvailableDrivers} />
      </div>

      {/* Floating Header Interface */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', zIndex: 20, pointerEvents: 'none' }}>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', pointerEvents: 'auto', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ backgroundColor: 'var(--color-primary)', padding: '0.4rem', borderRadius: '50%' }}>
            <Truck size={16} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-secondary)' }}>VerdiMo</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'auto' }}>
          <button onClick={() => navigate('/customer/settings')} className="glass icon-btn" style={{ width: '40px', height: '40px', backgroundColor: 'white', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }} title="Settings">
            <SettingsIcon size={18} color="var(--color-text)" />
          </button>
          <button onClick={handleLogout} className="glass icon-btn" style={{ width: '40px', height: '40px', backgroundColor: 'white', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }} title="Log Out">
            <LogOut size={18} color="var(--color-text)" />
          </button>
        </div>
      </header>

      {/* Floating Action / Search Panel (Uber-style) */}
      <div style={{ 
        position: 'absolute', top: '5rem', left: '1.5rem', width: '380px', 
        zIndex: 20, display: 'flex', flexDirection: 'column', gap: '1rem',
        maxHeight: 'calc(100vh - 7rem)', pointerEvents: 'none'
      }}>
        
        {/* Booking Confirmation Overlay */}
        {bookingStatus === 'booked' && selectedDriver ? (
          <div className="card" style={{ pointerEvents: 'auto', border: '2px solid var(--color-primary)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <CheckCircle size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Driver En Route!</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <strong>{selectedDriver.name}</strong> has confirmed your request. Discuss pricing upon arrival.
              </p>
              
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Truck size={20} color="var(--color-primary)" />
                  <span style={{ fontWeight: 600 }}>{selectedDriver.cargoSpace}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} /> Arriving in approx 14 mins
                </div>
              </div>
              
              <button className="btn" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }} onClick={() => setBookingStatus('idle')}>
                Cancel / New Request
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search Input Card */}
            <div className="card glass" style={{ pointerEvents: 'auto', padding: '1.25rem', boxShadow: 'var(--shadow-lg)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>Get a Cargo Ride</h2>
              
              <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
                <button onClick={() => setActiveTab('all')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'all' ? 'white' : 'transparent', boxShadow: activeTab === 'all' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem' }}>Any</button>
                <button onClick={() => setActiveTab('cargo')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'cargo' ? 'white' : 'transparent', boxShadow: activeTab === 'cargo' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem' }}>Cargo</button>
                <button onClick={() => setActiveTab('cargo_and_ride')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'cargo_and_ride' ? 'white' : 'transparent', boxShadow: activeTab === 'cargo_and_ride' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem' }}>+ Passenger</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ position: 'absolute', left: '7px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }}></div>
                  <input type="text" placeholder="Current Location" value={pickup} onChange={(e) => setPickup(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#F1F5F9', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }} />
                </div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ position: 'absolute', left: '7px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', backgroundColor: 'var(--color-primary)' }}></div>
                  <input type="text" placeholder="Drop-off Destination" value={dropoff} onChange={(e) => setDropoff(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#F1F5F9', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }} />
                </div>
              </div>
            </div>

            {/* Live Feed List (Scrollable) */}
            {isDrawerOpen && (
              <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="hide-scrollbar">
                {displayedDrivers.map((driver) => (
                  <div key={driver.id} className="card" onClick={() => handleBook(driver)} style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid transparent', transition: 'all 0.2s' }} onMouseDown={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Truck size={24} color={driver.type === 'cargo' ? 'var(--color-primary-dark)' : '#6366F1'} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{driver.cargoSpace}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {driver.distance} &bull; ★ {driver.rating}
                        </span>
                      </div>
                    </div>
                    <div>
                      <ChevronRight size={20} color="var(--color-text-muted)" />
                    </div>
                  </div>
                ))}
                {displayedDrivers.length === 0 && (
                   <div className="card glass" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                     No vehicles match your criteria.
                   </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Hide Scrollbar styling for sleekness */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .card:hover { border-color: var(--color-border); }
      `}} />
    </div>
  );
};

export default CustomerDashboard;
