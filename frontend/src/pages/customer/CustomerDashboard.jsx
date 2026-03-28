import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { MapPin, Navigation, Package, Truck, LogOut, CheckCircle, Tag, Clock, Settings as SettingsIcon } from 'lucide-react';

const mockAvailableDrivers = [
  { id: 'DRV-101', name: 'Marco Rossi', cargoSpace: 'Full Van capacity', heading: 'Downtown Sector 4', coordinates: [51.505, -0.09], type: 'cargo', distance: '1.2 mi away' },
  { id: 'DRV-102', name: 'Sarah Jenkins', cargoSpace: '2 Seats + Trunk', heading: 'Northside Arena', coordinates: [51.512, -0.095], type: 'cargo_and_ride', distance: '2.5 mi away' },
  { id: 'DRV-133', name: 'John Doe', cargoSpace: 'Empty Cargo Bed', heading: 'Eastside Port', coordinates: [51.501, -0.08], type: 'cargo', distance: '3.0 mi away' },
  { id: 'DRV-145', name: 'Emily Chen', cargoSpace: '3 Passenger Seats', heading: 'Airport Terminal 2', coordinates: [51.49, -0.08], type: 'cargo_and_ride', distance: '4.5 mi away' },
  { id: 'DRV-150', name: 'Michael Smith', cargoSpace: 'Half Box Truck', heading: 'Westside Logistics Hub', coordinates: [51.52, -0.12], type: 'cargo', distance: '0.8 mi away' }
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, cargo, cargo_and_ride
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle -> booked
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Filter listings based on the active tab up top
  const displayedDrivers = useMemo(() => {
    if (activeTab === 'all') return mockAvailableDrivers;
    return mockAvailableDrivers.filter(d => d.type === activeTab);
  }, [activeTab]);

  const handleBook = (driver) => {
    setSelectedDriver(driver);
    setBookingStatus('booked');
  };

  const handleLogout = () => {
    localStorage.removeItem('verdimo_user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Customer Header */}
      <header className="header" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--color-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Truck size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-secondary)' }}>VerdiMo<span style={{color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '0.5rem', fontSize: '1rem'}}>Client Portal</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/customer/settings')} className="btn" style={{ border: 'none', backgroundColor: 'transparent', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            <SettingsIcon size={16} /> Settings
          </button>
          <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'transparent', padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Left Panel: Request Form & Listings */}
        <div style={{ width: '440px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', zIndex: 5, boxShadow: 'var(--shadow-md)' }}>
          <div style={{ padding: '1.5rem', flexGrow: 1, overflowY: 'auto' }}>
            
            {bookingStatus === 'booked' && selectedDriver ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                  <strong>{selectedDriver.name}</strong> has received your request and is heading to your designated pickup location.
                </p>
                
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: '2rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tag size={18} color="var(--color-primary)"/> Pricing Policies
                  </div>
                  <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>All transportation and cargo fees are finalized exclusively between you and the driver.</li>
                    <li>Please discuss fare details directly with <strong>{selectedDriver.name}</strong> upon arrival.</li>
                    <li>VerdiMobility operates as a free matchmaking nexus to reduce empty-vehicle carbon footprints.</li>
                  </ul>
                </div>
                
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setBookingStatus('idle')}>
                  Return to Network
                </button>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>Find Transport Nearby</h1>

                {/* Quick Filters */}
                <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                  <button onClick={() => setActiveTab('all')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'all' ? 'white' : 'transparent', boxShadow: activeTab === 'all' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem' }}>
                    All Vehicles
                  </button>
                  <button onClick={() => setActiveTab('cargo')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'cargo' ? 'white' : 'transparent', boxShadow: activeTab === 'cargo' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem' }}>
                    Cargo Only
                  </button>
                  <button onClick={() => setActiveTab('cargo_and_ride')} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'cargo_and_ride' ? 'white' : 'transparent', boxShadow: activeTab === 'cargo_and_ride' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem' }}>
                    Require Ride
                  </button>
                </div>

                {/* Form Context */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', marginBottom: '2rem' }}>
                  <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }}></div>
                    <input type="text" placeholder="Where are you located?" value={pickup} onChange={(e) => setPickup(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', transition: 'border-color 0.2s' }} />
                  </div>
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', backgroundColor: 'var(--color-primary)' }}></div>
                    <input type="text" placeholder="Optional destination drop-off" value={dropoff} onChange={(e) => setDropoff(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', transition: 'border-color 0.2s' }} />
                  </div>
                </div>

                {/* Live Realtime Listings */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>Live Network Listings</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                    Updating Live
                  </span>
                </div>

                {/* Listing Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {displayedDrivers.map((driver) => (
                    <div key={driver.id} className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)', transition: 'border-color 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}>
                      {/* Type Ribbon */}
                      <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 12px', borderBottomLeftRadius: '8px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'white', backgroundColor: driver.type === 'cargo' ? 'var(--color-primary-dark)' : '#6366F1' }}>
                        {driver.type === 'cargo' ? 'Cargo Space' : 'Passenger & Cargo'}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '1.125rem' }}>{driver.name}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <Clock size={12} /> {driver.distance}
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                          <Package size={16} color="var(--color-primary)" />
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{driver.cargoSpace} Available</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
                          <Navigation size={16} color="var(--color-text-muted)" />
                          <span style={{ fontSize: '0.875rem' }}>Heading to: <strong style={{color: 'var(--color-secondary)'}}>{driver.heading}</strong></span>
                        </div>
                      </div>

                      <button onClick={() => handleBook(driver)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}>
                        Signal Driver & Meet
                      </button>
                    </div>
                  ))}
                  
                  {displayedDrivers.length === 0 && (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                      No drivers match your current filter. Try selecting 'All Vehicles'.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel: Map */}
        <div style={{ flexGrow: 1, position: 'relative' }}>
          {/* Map */}
          <LiveTrackingMap drivers={mockAvailableDrivers} />
          
          {/* Floating Help Banner */}
          <div style={{ position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-surface)', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <MapPin size={16} color="var(--color-primary)" />
            <span>Map showing all live broadcasting drivers in your area</span>
          </div>
        </div>
        
        {/* Pulse Animation Definition */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
        `}} />

      </div>
    </div>
  );
};

export default CustomerDashboard;
