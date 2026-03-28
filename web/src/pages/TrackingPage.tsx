import { GoogleMap, LoadScript, MarkerClustererF, MarkerF } from '@react-google-maps/api';

import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { useVehicleRealtimeFeed } from '../hooks/useVehicleRealtimeFeed';
import { Card } from '../components/ui/Card';

const mapContainerStyle = {
  width: '100%',
  height: '520px',
};

const defaultCenter = { lat: -1.9441, lng: 30.0619 };

export function TrackingPage() {
  const { api } = useAuth();
  const fleet = useAsyncData(() => api.vehicles.marketplace({ limit: 100 }), []);
  const liveVehicles = useVehicleRealtimeFeed(fleet.data?.data || []);

  return (
    <div className="page-stack">
      <Card title="Vehicle Tracking Map" subtitle="Live fleet positions with route and capacity context.">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={8}>
            <MarkerClustererF>
              {(clusterer) => (
                <>
                  {liveVehicles.map((vehicle) => (
                    <MarkerF
                      key={vehicle.id}
                      clusterer={clusterer}
                      position={{
                        lat: Number(vehicle.currentLatitude),
                        lng: Number(vehicle.currentLongitude),
                      }}
                      title={`${vehicle.plateNumber} · ${vehicle.activeDestination ?? 'Open route'} · ${
                        vehicle.availableCargoSpace ?? vehicle.capacity
                      } kg`}
                    />
                  ))}
                </>
              )}
            </MarkerClustererF>
          </GoogleMap>
        </LoadScript>
      </Card>
    </div>
  );
}
