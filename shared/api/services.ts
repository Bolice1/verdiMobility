import { createApiClient } from './client';
import type {
  AdminOverview,
  AdminStats,
  AuthResponse,
  AuthTokens,
  Company,
  ImpactSummary,
  PaginatedResponse,
  Payment,
  Shipment,
  User,
  Vehicle,
  VehicleLocationUpdateInput,
} from '../types';

type TokenBridge = {
  getTokens: () => Promise<Partial<AuthTokens> | null> | Partial<AuthTokens> | null;
  setTokens: (tokens: Partial<AuthTokens> | null) => Promise<void> | void;
  onUnauthorized?: () => Promise<void> | void;
};

export function createVerdiApi(baseUrl: string, bridge: TokenBridge) {
  const client = createApiClient({
    baseUrl,
    getTokens: bridge.getTokens,
    setTokens: bridge.setTokens,
    onUnauthorized: bridge.onUnauthorized,
  });

  return {
    auth: {
      login: (payload: { email: string; password: string }) =>
        client.post<AuthResponse>('/api/auth/login', payload, false),
      register: (payload: {
        name: string;
        email: string;
        password: string;
        role: 'user' | 'company' | 'driver';
        companyName?: string;
        companyEmail?: string;
        licenseNumber?: string;
      }) => client.post<AuthResponse>('/api/auth/register', payload, false),
      refresh: (refreshToken: string) =>
        client.post<AuthTokens>('/api/auth/refresh', { refreshToken }, false),
      forgotPassword: (email: string) =>
        client.post<{ message: string }>('/api/auth/forgot-password', { email }, false),
      resetPassword: (payload: { token: string; password: string }) =>
        client.post<{ message: string }>('/api/auth/reset-password', payload, false),
    },
    users: {
      me: () => client.get<User>('/api/users/me'),
      list: (query?: { limit?: number; offset?: number }) =>
        client.get<PaginatedResponse<User>>('/api/users', query),
    },
    admin: {
      overview: () => client.get<{ success: true; data: AdminOverview }>('/api/admin/overview'),
      stats: (days = 30) =>
        client.get<{ success: true; data: AdminStats }>('/api/admin/stats', { days }),
      companies: (query?: { limit?: number; offset?: number }) =>
        client.get<{ success: true; data: { items: Company[] } }>('/api/admin/companies', query),
      vehicles: (query?: { limit?: number; offset?: number }) =>
        client.get<{ success: true; data: { items: Vehicle[] } }>('/api/admin/vehicles', query),
      shipments: (query?: { limit?: number; offset?: number }) =>
        client.get<{ success: true; data: { items: Shipment[] } }>('/api/admin/shipments', query),
      payments: (query?: { limit?: number; offset?: number }) =>
        client.get<{ success: true; data: { items: Payment[]; summary: Record<string, unknown> } }>(
          '/api/admin/payments',
          query,
        ),
    },
    companies: {
      create: (payload: { name: string; email: string }) =>
        client.post<Company>('/api/companies', payload),
    },
    vehicles: {
      list: (query?: Record<string, string | number | undefined>) =>
        client.get<PaginatedResponse<Vehicle>>('/api/vehicles', query),
      create: (payload: Record<string, unknown>) => client.post<Vehicle>('/api/vehicles', payload),
      update: (id: string, payload: Record<string, unknown>) =>
        client.patch<Vehicle>(`/api/vehicles/${id}`, payload),
      updateLocation: (id: string, payload: VehicleLocationUpdateInput) =>
        client.patch<Vehicle>(`/api/vehicles/${id}/location`, payload),
      marketplace: (query?: Record<string, string | number | undefined>) =>
        client.get<PaginatedResponse<Vehicle>>('/api/marketplace/vehicles', query),
    },
    shipments: {
      list: (query?: Record<string, string | number | undefined>) =>
        client.get<PaginatedResponse<Shipment>>('/api/shipments', query),
      create: (payload: Record<string, unknown>) => client.post<Shipment>('/api/shipments', payload),
      getById: (id: string) => client.get<Shipment>(`/api/shipments/${id}`),
      updateStatus: (id: string, status: Shipment['status']) =>
        client.patch<Shipment>(`/api/shipments/${id}/status`, { status }),
      updateImpact: (id: string, payload: Record<string, unknown>) =>
        client.patch<Shipment>(`/api/shipments/${id}/impact`, payload),
    },
    matching: {
      run: (payload?: { shipmentId?: string; limit?: number }) =>
        client.post<{ processed: number; results: Array<Record<string, unknown>> }>(
          '/api/matching/run',
          payload || {},
        ),
    },
    payments: {
      list: (query?: Record<string, string | number | undefined>) =>
        client.get<PaginatedResponse<Payment>>('/api/payments', query),
      create: (payload: Record<string, unknown>) => client.post<Payment>('/api/payments', payload),
      getById: (id: string) => client.get<Payment>(`/api/payments/${id}`),
      updateStatus: (id: string, payload: Record<string, unknown>) =>
        client.patch<Payment>(`/api/payments/${id}/status`, payload),
      refund: (id: string, payload: { amount: number; reason: string }) =>
        client.post<Payment>(`/api/payments/${id}/refund`, payload),
    },
    analytics: {
      impact: () => client.get<ImpactSummary>('/api/analytics/impact'),
    },
  };
}
