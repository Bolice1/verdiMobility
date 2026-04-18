import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;

const customIcon = new L.DivIcon({
  html: renderToStaticMarkup(<div style={{ color: '#10B981', background: 'white', borderRadius: '50%', padding: '4px', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={16} /></div>),
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const LiveTrackingMap = ({ drivers = [] }) => {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {drivers.map(driver => (
          <Marker key={driver.id} position={driver.coordinates} icon={customIcon}>
            <Popup>
              <div style={{ padding: '0.25rem' }}>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-secondary)' }}>{driver.name}</strong>
                <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', margin: '4px 0' }}>
                  {driver.cargoSpace} Available
                </span>
                <p style={{ margin: '4px 0', color: 'var(--color-text-muted)' }}>Heading: {driver.heading}</p>
                <button className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', marginTop: '0.5rem' }}>Assign Cargo</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;
