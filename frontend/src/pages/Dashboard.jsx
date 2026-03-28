import { Activity, AlertTriangle, Truck, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '08:00', deliveries: 12, range: 40 },
  { name: '10:00', deliveries: 25, range: 45 },
  { name: '12:00', deliveries: 45, range: 50 },
  { name: '14:00', deliveries: 30, range: 60 },
  { name: '16:00', deliveries: 55, range: 55 },
  { name: '18:00', deliveries: 70, range: 65 },
  { name: '20:00', deliveries: 40, range: 50 },
];

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <div className="flex-between" style={{ gridColumn: 'span 12' }}>
        <div>
          <h1>VerdiMo Live Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem' }}>
            Real-time analytics for your green mobility fleet.
          </p>
        </div>
        <button className="btn btn-primary glass">
          <Zap size={16} /> Update Status
        </button>
      </div>

      <div className="kpi-cards">
        <div className="card kpi-card">
          <div className="kpi-icon primary">
            <Truck size={24} />
          </div>
          <div className="kpi-details">
            <h3>Active Evs</h3>
            <div className="value">142</div>
            <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 500 }}>
              ↑ 12 online
            </span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon warning">
            <Activity size={24} />
          </div>
          <div className="kpi-details">
            <h3>Deliveries Today</h3>
            <div className="value">1,845</div>
            <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 500 }}>
              ↑ 4% vs yesterday
            </span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon danger">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-details">
            <h3>Critical Alerts</h3>
            <div className="value">3</div>
            <span style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 500 }}>
              Action Required
            </span>
          </div>
        </div>
        
        <div className="card kpi-card">
          <div className="kpi-icon info">
            <Zap size={24} />
          </div>
          <div className="kpi-details">
            <h3>Energy Saved</h3>
            <div className="value">4.2 MW</div>
            <span style={{ color: '#2563EB', fontSize: '0.75rem', fontWeight: 500 }}>
              ~150kg CO2 offset
            </span>
          </div>
        </div>
      </div>

      <div className="card chart-section">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h2>Delivery Performance & Range Info</h2>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
            />
            <Area type="monotone" dataKey="deliveries" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorDeliveries)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card activity-section">
        <h2>Live Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-circle"></div>
            <div className="activity-content">
              <h4>Vehicle EV-042 Arrived</h4>
              <p>Downtown Distribution Center.</p>
              <span>Just now</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-circle" style={{ backgroundColor: '#D97706' }}></div>
            <div className="activity-content">
              <h4>Low Battery Alert</h4>
              <p>EV-108 reported &lt;15% battery. Re-routing to station.</p>
              <span>5 mins ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-circle"></div>
            <div className="activity-content">
              <h4>Driver Shift Completed</h4>
              <p>Sarah Jenkins completed Route 7.</p>
              <span>12 mins ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-circle" style={{ backgroundColor: '#2563EB' }}></div>
            <div className="activity-content">
              <h4>System Maintenance</h4>
              <p>Fleet tracking optimized remotely.</p>
              <span>1 hr ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
