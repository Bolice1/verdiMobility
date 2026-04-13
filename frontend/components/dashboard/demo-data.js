export const adminDemo = {
  overview: {
    totalShipments: 25067,
    pending: 20215,
    averageOrderCost: 15,
    movingToDestination: 1960,
    successRate: 82,
    returnRate: 18,
    totalRevenue: 272980,
    activeVehicles: 89,
    availableVehicles: 42,
    totalCompanies: 24,
    totalUsers: 172,
  },
  shipments: [
    { id: 'AU-019', sender: 'Delta Foods', status: 'delivered', route: 'Cairo to Giza', price: 9000, driver: 'Truck 478', date: 'Mar 28' },
    { id: 'AU-018', sender: 'Green Valley', status: 'pending', route: 'Alex to Minya', price: 6500, driver: 'Truck 910', date: 'Mar 28' },
    { id: 'AU-017', sender: 'Myanex', status: 'delivered', route: 'Tanta to Suez', price: 8200, driver: 'Truck 519', date: 'Mar 27' },
    { id: 'AU-016', sender: 'Acron', status: 'in_transit', route: 'Luxor to Qena', price: 11000, driver: 'Truck 478', date: 'Mar 27' },
    { id: 'AU-015', sender: 'Bungar', status: 'matched', route: 'Aswan to Cairo', price: 9300, driver: 'Truck 816', date: 'Mar 26' },
  ],
  companies: [
    { name: 'Edit-Trans', vehicles: 18, status: 'active' },
    { name: 'Nile Freight', vehicles: 14, status: 'active' },
    { name: 'Vertex Cargo', vehicles: 11, status: 'active' },
  ],
  payments: {
    totalPending: 15000,
    completed: 272980,
  },
};

export const companyDemo = {
  shipments: [
    { id: 'CMP-2201', customer: 'Helio Food', status: 'in_transit', destination: 'Port Said', vehicle: 'VD-2105', price: 5400 },
    { id: 'CMP-2199', customer: 'Northline Labs', status: 'matched', destination: 'Mansoura', vehicle: 'VD-1182', price: 4200 },
    { id: 'CMP-2191', customer: 'GlassPoint', status: 'delivered', destination: 'Giza', vehicle: 'VD-4471', price: 3100 },
    { id: 'CMP-2180', customer: 'CargoLane', status: 'pending', destination: 'Asyut', vehicle: 'Unassigned', price: 7600 },
  ],
  vehicles: [
    { plateNumber: 'VD-2105', status: 'busy', capacity: 8000, usage: 91, route: 'Cairo to Port Said' },
    { plateNumber: 'VD-1182', status: 'available', capacity: 6200, usage: 0, route: 'Standby at hub' },
    { plateNumber: 'VD-4471', status: 'maintenance', capacity: 7000, usage: 0, route: 'Workshop inspection' },
    { plateNumber: 'VD-5300', status: 'busy', capacity: 9000, usage: 74, route: 'Alex to Tanta' },
  ],
  drivers: [
    { name: 'Adam Solfier', rating: 4.9, vehicle: 'VD-2105', jobs: 16 },
    { name: 'Maya Nasser', rating: 4.7, vehicle: 'VD-1182', jobs: 11 },
    { name: 'Rami Adel', rating: 4.8, vehicle: 'VD-5300', jobs: 19 },
  ],
};

export const driverDemo = {
  jobs: [
    { id: 'DRV-781', route: 'Cairo to Alexandria', status: 'in_transit', progress: 64, eta: '03:35 AM', customer: 'Nile Freight' },
    { id: 'DRV-768', route: 'Giza to Beni Suef', status: 'matched', progress: 22, eta: '05:10 PM', customer: 'Delta Foods' },
    { id: 'DRV-749', route: 'Tanta to Port Said', status: 'delivered', progress: 100, eta: 'Completed', customer: 'Acron' },
  ],
};

export const userDemo = {
  shipments: [
    { id: 'USR-1008', pickupLocation: 'Nasr City', destination: 'Port Said', status: 'in_transit', price: 4800, createdAt: '2026-03-28T08:00:00Z' },
    { id: 'USR-1007', pickupLocation: '6th October', destination: 'Alexandria', status: 'matched', price: 3100, createdAt: '2026-03-27T10:00:00Z' },
    { id: 'USR-1004', pickupLocation: 'Helwan', destination: 'Mansoura', status: 'delivered', price: 5200, createdAt: '2026-03-26T14:00:00Z' },
  ],
};

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function statusTone(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'delivered' || normalized === 'completed' || normalized === 'available' || normalized === 'active') {
    return 'success';
  }
  if (normalized === 'in_transit' || normalized === 'matched' || normalized === 'busy') {
    return 'dark';
  }
  if (normalized === 'pending' || normalized === 'maintenance') {
    return 'warning';
  }
  return 'info';
}

export function titleCaseStatus(status) {
  return String(status || '').replaceAll('_', ' ');
}
