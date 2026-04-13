import { ShieldCheck, UserPlus, Truck, Package, Activity } from 'lucide-react';

const mockSystemAuditLogs = [
  { id: 'LOG-001', time: '10:45 AM', type: 'MATCH', description: 'Driver DRV-101 matched with Customer USR-884 for Cargo Transfer.', user: 'System Matcher', icon: Package, color: '#10B981', bg: '#D1FAE5' },
  { id: 'LOG-002', time: '10:32 AM', type: 'BROADCAST', description: 'Driver DRV-145 broadcasted "Available - 2 Pallets" free space.', user: 'Emily Chen (Independent)', icon: Activity, color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'LOG-003', time: '10:15 AM', type: 'FLEET', description: 'Company FastDeliveries Inc suspended by Global Admin.', user: 'System Owner', icon: ShieldCheck, color: '#EF4444', bg: '#FEE2E2' },
  { id: 'LOG-004', time: '09:50 AM', type: 'USER_JOIN', description: 'New Customer registered: "John Smith".', user: 'Registration Auth', icon: UserPlus, color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'LOG-005', time: '09:22 AM', type: 'FLEET', description: 'Company Logistics Co. added EV-155 [Mini EV] to fleet.', user: 'Admin User (Logistics Co.)', icon: Truck, color: '#F59E0B', bg: '#FEF3C7' },
];

const SystemAudit = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-between">
        <div>
          <h1>Global System Audit Log</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1rem' }}>Unalterable chronological feed of all cross-ecosystem events.</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem', flexGrow: 1 }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Event Timeline - Today</h2>
          <button className="btn" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Export Logs (CSV)</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {mockSystemAuditLogs.map((log, index) => (
            <div key={log.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0', borderBottom: index === mockSystemAuditLogs.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
              {/* Time Column */}
              <div style={{ width: '80px', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500, flexShrink: 0 }}>
                {log.time}
              </div>
              
              {/* Icon / Timeline Pipe */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: log.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <log.icon size={20} color={log.color} />
                </div>
                {index !== mockSystemAuditLogs.length - 1 && (
                  <div style={{ position: 'absolute', top: '40px', bottom: '-24px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                )}
              </div>
              
              {/* Event Content */}
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: log.color, backgroundColor: log.bg, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                    {log.type}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Initiator: <strong style={{ color: 'var(--color-text)' }}>{log.user}</strong></span>
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--color-secondary)', fontWeight: 500 }}>
                  {log.description}
                </div>
                <div style={{ marginTop: '0.5rem', color: '#94A3B8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  Ref: {log.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAudit;
