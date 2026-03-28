import { useState } from 'react';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { Activity, Users, Truck, Globe, TrendingUp } from 'lucide-react';

// Mock system-wide drivers spanning multiple companies/independents
const globalDriversData = [
  { id: 'DRV-101', name: 'Marco Rossi', cargoSpace: 'Full Van capacity', heading: 'Downtown Sector 4', coordinates: [51.505, -0.09] },
  { id: 'DRV-133', name: 'John Doe', cargoSpace: 'Empty Cargo Bed', heading: 'Eastside Port', coordinates: [51.501, -0.08] },
  { id: 'FLT-004', name: 'Logistics Co. Truck 4', cargoSpace: 'En Route', heading: 'Warehouse B', coordinates: [51.51, -0.1] },
  { id: 'FLT-012', name: 'Logistics Co. Van 2', cargoSpace: 'Delivering', heading: 'Uptown', coordinates: [51.515, -0.07] },
  { id: 'DRV-145', name: 'Emily Chen', cargoSpace: 'Available - 2 Pallets', heading: 'Airport Cargo Terminal', coordinates: [51.49, -0.08] },
];

const GlobalDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Global System Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem' }}>
            Super Admin omniscience. Monitoring all companies, drivers, and clients.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Status: <strong style={{ color: '#10B981' }}>All Systems Nominal</strong></span>
          <button className="btn btn-primary glass">
            <Activity size={16} /> Generate Master Report
          </button>
        </div>
      </div>

      {/* Top System KPIs */}
      <div className="kpi-cards" style={{ marginBottom: '1.5rem' }}>
        <div className="card kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
            <Users size={24} />
          </div>
          <div className="kpi-details">
            <h3>Total Registered Users</h3>
            <div className="value">4,892</div>
            <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 500 }}>↑ 124 this week</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon warning">
            <Truck size={24} />
          </div>
          <div className="kpi-details">
            <h3>Active Vehicles Now</h3>
            <div className="value">1,204</div>
            <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: 500 }}>45 Independents, 1159 Co.</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon primary">
            <Globe size={24} />
          </div>
          <div className="kpi-details">
            <h3>Free Cargo Broadcasts</h3>
            <div className="value">89</div>
            <span style={{ color: 'var(--color-primary-dark)', fontSize: '0.75rem', fontWeight: 500 }}>Waiting for matches</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#FCE7F3', color: '#BE185D' }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-details">
            <h3>Gross System Matches</h3>
            <div className="value">14,204</div>
            <span style={{ color: '#BE185D', fontSize: '0.75rem', fontWeight: 500 }}>Lifetime</span>
          </div>
        </div>
      </div>

      {/* Massive Map taking remaining space */}
      <div className="card" style={{ flexGrow: 1, padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', zIndex: 10 }}>
          <h2 style={{ fontSize: '1.125rem', margin: 0 }}>Global Fleet Activity Map</h2>
        </div>
        <div style={{ flexGrow: 1 }}>
          <LiveTrackingMap drivers={globalDriversData} />
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
