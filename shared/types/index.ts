import type { UserRole } from '../constants/roles';

export type ApiError = {
  error: string;
  code: string;
  requestId?: string;
  details?: unknown;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
};

export type AuthResponse = AuthTokens & {
  user: User;
};

export type PaginationMeta = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type Company = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  vehicleCount?: number;
};

export type Vehicle = {
  id: string;
  companyId: string;
  driverId?: string | null;
  plateNumber: string;
  capacity: number;
  status: 'available' | 'busy' | 'maintenance' | 'inactive';
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  currentLocationLabel?: string | null;
  availableCargoSpace?: number | null;
  lastLocationUpdatedAt?: string | null;
  companyName?: string;
  activeDestination?: string | null;
  activePickupLocation?: string | null;
};

export type Shipment = {
  id: string;
  senderId: string;
  vehicleId?: string | null;
  pickupLocation: string;
  destination: string;
  weight: number;
  distanceKm?: number | null;
  baselineDistanceKm?: number | null;
  fuelSavedLiters?: number | null;
  co2SavedKg?: number | null;
  status: 'pending' | 'matched' | 'in_transit' | 'delivered' | 'cancelled';
  price: number;
  createdAt: string;
};

export type Payment = {
  id: string;
  shipmentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider?: string | null;
  externalReference?: string | null;
  providerReference?: string | null;
  status:
    | 'pending'
    | 'authorized'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'partially_refunded'
    | 'refunded';
  refundedAmount?: number;
  failureCode?: string | null;
  failureMessage?: string | null;
  refundReason?: string | null;
  metadata?: Record<string, unknown>;
  processedAt?: string | null;
  refundedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminOverview = {
  total_users: number;
  total_companies: number;
  total_vehicles: number;
  total_shipments: number;
  total_revenue: number;
  active_vehicles: number;
  available_vehicles: number;
};

export type AdminStats = {
  shipments_per_day: Array<{ date: string; count: number }>;
  revenue_per_day: Array<{ date: string; revenue: number }>;
  most_active_routes: Array<{ route_from: string; route_to: string; shipment_count: number }>;
  vehicle_utilization_rate: number;
  periodDays: number;
};

export type ImpactSummary = {
  totalShipments: number;
  deliveredShipments: number;
  co2SavedKg: number;
  fuelSavedLiters: number;
  distanceKm: number;
};
