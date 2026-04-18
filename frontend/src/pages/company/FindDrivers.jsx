import { useState } from 'react';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { Search, Filter, Truck } from 'lucide-react';

const availableDriversMapData = [
  { id: 'DRV-101', name: 'Marco Rossi', cargoSpace: '500kg Capacity', heading: 'Downtown Sector 4', coordinates: [51.505, -0.09] },
  { id: 'DRV-133', name: 'John Doe', cargoSpace: 'Full Van', heading: 'Northside Warehouse', coordinates: [51.51, -0.1] },
  { id: 'DRV-145', name: 'Emily Chen', cargoSpace: '2 Pallets', heading: 'Airport Cargo Terminal', coordinates: [51.49, -0.08] },
];

const FindDrivers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-between">
        <div>
          <h1>Find Available Carriers</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem' }}>Locate independent drivers with matching cargo space on the live map.</p>
        </div>
      </div>

      <div className="card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 1.5rem 0 1.5rem', marginBottom: '2rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="search-bar" style={{ flexGrow: 1 }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by location, capacity, or driver name..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Layout with Sidebar for List and Map taking rest of space */}
        <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 250px)' }}>
          {/* List of Available Drivers */}
          <div style={{ width: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            {availableDriversMapData.map(driver => (
              <div key={driver.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', transition: 'all 0.2s', cursor: 'pointer' }} className="driver-list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{driver.name}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065F46', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '4px' }}>
                    Available
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  <Truck size={14} /> {driver.cargoSpace}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Heading: <strong style={{color: 'var(--color-secondary)'}}>{driver.heading}</strong>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}>
                  Assign Cargo
                </button>
              </div>
            ))}
          </div>

          {/* Map Component */}
          <div style={{ flexGrow: 1 }}>
            <LiveTrackingMap drivers={availableDriversMapData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDrivers;
