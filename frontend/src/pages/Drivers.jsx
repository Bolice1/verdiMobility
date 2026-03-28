import { useState } from 'react';
import { Search, UserPlus, Star } from 'lucide-react';

const mockDriversData = [
  { id: 'DRV-101', name: 'Marco Rossi', status: 'active', rating: 4.8, completedTrips: 1250, nextShift: 'Currently Driving' },
  { id: 'DRV-102', name: 'Sarah Jenkins', status: 'active', rating: 4.9, completedTrips: 980, nextShift: 'Currently Driving' },
  { id: 'DRV-133', name: 'John Doe', status: 'off_duty', rating: 4.5, completedTrips: 450, nextShift: 'Tomorow, 08:00 AM' },
  { id: 'DRV-145', name: 'Emily Chen', status: 'off_duty', rating: 4.7, completedTrips: 600, nextShift: 'Today, 14:00 PM' },
  { id: 'DRV-150', name: 'Michael Smith', status: 'training', rating: 4.0, completedTrips: 15, nextShift: 'Today, 16:00 PM' },
];

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = mockDriversData.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex-between">
        <div>
          <h1>Driver Management</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem' }}>Manage driver schedules, ratings, and active statuses.</p>
        </div>
        <button className="btn btn-primary glass">
          <UserPlus size={16} /> Add Driver
        </button>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search drivers by name or ID..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Completed Trips</th>
                <th>Next Shift</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{driver.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        backgroundColor: 'var(--color-primary-dark)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '0.75rem'
                      }}>
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 500 }}>{driver.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${driver.status}`}>
                      {driver.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontWeight: 600 }}>{driver.rating}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{driver.completedTrips.toLocaleString()}</td>
                  <td>{driver.nextShift}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDrivers.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No drivers found matching your search.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Drivers;
