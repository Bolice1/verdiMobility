import { useState } from 'react';
import { Filter, Search, Plus } from 'lucide-react';

const mockFleetData = [
  { id: 'EV-001', type: 'Electric Van', battery: '85%', status: 'active', driver: 'Marco Rossi', location: 'Uptown' },
  { id: 'EV-042', type: 'Cargo Bike', battery: '42%', status: 'en_route', driver: 'Sarah Jenkins', location: 'Midtown' },
  { id: 'EV-087', type: 'Electric Truck', battery: '15%', status: 'maintenance', driver: 'Unassigned', location: 'Depot A' },
  { id: 'EV-102', type: 'Electric Van', battery: '95%', status: 'available', driver: 'Unassigned', location: 'Depot B' },
  { id: 'EV-155', type: 'Mini EV', battery: '10%', status: 'offline', driver: 'John Doe', location: 'Workshop' },
];

const Fleet = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFleet = mockFleetData.filter(vehicle => 
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex-between">
        <div>
          <h1>Fleet Status</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem' }}>Manage and monitor your green vehicles.</p>
        </div>
        <button className="btn btn-primary glass">
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Type</th>
                <th>Battery Life</th>
                <th>Status</th>
                <th>Current Driver</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredFleet.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{vehicle.id}</td>
                  <td>{vehicle.type}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '40px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: vehicle.battery, 
                          height: '100%', 
                          backgroundColor: parseInt(vehicle.battery) > 20 ? 'var(--color-primary)' : '#EF4444' 
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{vehicle.battery}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${vehicle.status}`}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{vehicle.driver}</td>
                  <td>{vehicle.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFleet.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No vehicles found matching your search.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Fleet;
