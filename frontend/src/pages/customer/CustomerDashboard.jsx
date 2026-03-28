import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { MapPin, Navigation, Package, Search, Truck, LogOut, CheckCircle } from 'lucide-react';

const mockAvailableDrivers = [
  { id: 'DRV-101', name: 'Marco Rossi', cargoSpace: 'Full Van capacity', heading: 'Downtown Sector 4', coordinates: [51.505, -0.09] },
  { id: 'DRV-102', name: 'Sarah Jenkins', cargoSpace: '2 Seats + Trunk', heading: 'Northside Arena', coordinates: [51.512, -0.095] },
  { id: 'DRV-133', name: 'John Doe', cargoSpace: 'Empty Cargo Bed', heading: 'Eastside Port', coordinates: [51.501, -0.08] },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [needType, setNeedType] = useState('cargo'); // 'cargo' or 'cargo_and_ride'
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle -> searching -> booked
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setBookingStatus('searching');
  };

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
      <header className="header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck size={24} color="var(--color-primary)" />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-secondary)' }}>VerdiMo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 500, display: 'none' }} className="user-name">Client Portal</span>
          <button onClick={handleLogout} className="icon-btn" title="Log Out">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Left Panel: Request Form */}
        <div style={{ width: '400px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', zIndex: 5, boxShadow: 'var(--shadow-md)' }}>
          <div style={{ padding: '1.5rem', flexGrow: 1, overflowY: 'auto' }}>
            
            {bookingStatus === 'booked' && selectedDriver ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Driver Secured!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                  {selectedDriver.name} has accepted your request and is heading to the pickup location.
                </p>
                <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: '2rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Pricing Details</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    As per VerdiMobility policy, please discuss and finalize the cargo fee directly with your driver upon arrival.
                  </p>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setBookingStatus('idle')}>
                  Book Another Ride
                </button>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Where to?</h1>

                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  {/* Need Type Selector */}
                  <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: 'var(--radius-lg)' }}>
                    <button 
                      type="button"
                      onClick={() => setNeedType('cargo')}
                      style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: needType === 'cargo' ? 'white' : 'transparent', boxShadow: needType === 'cargo' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Package size={16} /> Send Cargo
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNeedType('cargo_and_ride')}
                      style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: 'var(--radius-md)', backgroundColor: needType === 'cargo_and_ride' ? 'white' : 'transparent', boxShadow: needType === 'cargo_and_ride' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Navigation size={16} /> Cargo + Ride
                    </button>
                  </div>

                  {/* Location Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }}></div>
                      <input 
                        type="text" 
                        placeholder="Pickup location" 
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        required
                        style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', transition: 'border-color 0.2s' }}
                      />
                    </div>
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', backgroundColor: 'var(--color-primary)' }}></div>
                      <input 
                        type="text" 
                        placeholder="Drop-off destination" 
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        required
                        style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', transition: 'border-color 0.2s' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1rem' }}>
                    Find Available Drivers
                  </button>
                </form>

                {/* Driver Results */}
                {bookingStatus === 'searching' && (
                  <div>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Available Nearby</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {mockAvailableDrivers.map((driver) => (
                        <div key={driver.id} className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ fontWeight: 600 }}>{driver.name}</div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065F46', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '4px' }}>
                              Available
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Package size={14} /> Capacity: {driver.cargoSpace}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Heading: {driver.heading}
                          </p>
                          <button onClick={() => handleBook(driver)} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.875rem' }}>
                            Request Booking
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            <span>Map shows live driver availability</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
