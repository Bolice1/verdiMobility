import { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle, MoreVertical } from 'lucide-react';

const mockSystemUsers = [
  { id: 'USR-882', name: 'Marco Rossi', email: 'marco@example.com', role: 'driver', status: 'active', joined: 'Oct 12, 2025' },
  { id: 'USR-883', name: 'Logistics Co.', email: 'admin@logisco.com', role: 'company', status: 'active', joined: 'Oct 14, 2025' },
  { id: 'USR-884', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'customer', status: 'active', joined: 'Nov 02, 2025' },
  { id: 'USR-885', name: 'FastDeliveries Inc', email: 'ops@fastdel.com', role: 'company', status: 'suspended', joined: 'Nov 18, 2025' },
  { id: 'USR-886', name: 'John Doe', email: 'j.doe@example.com', role: 'driver', status: 'active', joined: 'Dec 01, 2025' },
];

const SystemUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockSystemUsers);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cycleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  return (
    <>
      <div className="flex-between">
        <div>
          <h1>System User Management</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem' }}>Global CRM table to audit, suspend, and view all registered platform actors.</p>
        </div>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div className="search-bar" style={{ width: '380px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users by name, email, or ID..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <Filter size={16} /> Filter by Role
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name / Organization</th>
                <th>Email Address</th>
                <th>System Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{user.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ 
                      backgroundColor: user.role === 'customer' ? '#F3E8FF' : user.role === 'driver' ? '#E0E7FF' : '#FEF3C7',
                      color: user.role === 'customer' ? '#7E22CE' : user.role === 'driver' ? '#4338CA' : '#B45309',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.status === 'active' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontWeight: 500, fontSize: '0.875rem' }}>
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#DC2626', fontWeight: 500, fontSize: '0.875rem' }}>
                        <ShieldAlert size={14} /> Suspended
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{user.joined}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => cycleStatus(user.id)}
                        style={{ border: 'none', background: 'transparent', color: user.status === 'active' ? '#DC2626' : '#059669', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', padding: '0.5rem', borderRadius: '4px' }}
                        className={user.status === 'active' ? 'hover-red' : 'hover-green'}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                      <button style={{ border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No users found matching that criteria.
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-red:hover { background-color: #FEE2E2; }
        .hover-green:hover { background-color: #D1FAE5; }
      `}} />
    </>
  );
};

export default SystemUsers;
