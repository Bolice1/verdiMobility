import type { UserRole } from './roles';

export type NavigationItem = {
  label: string;
  path: string;
  roles: UserRole[];
};

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'company', 'user', 'driver'] },
  { label: 'Fleet', path: '/fleet', roles: ['admin', 'company'] },
  { label: 'Tracking', path: '/tracking', roles: ['admin', 'company', 'user', 'driver'] },
  { label: 'Shipments', path: '/shipments', roles: ['admin', 'company', 'user', 'driver'] },
  { label: 'Marketplace', path: '/marketplace', roles: ['admin', 'company', 'user', 'driver'] },
  { label: 'Transactions', path: '/payments', roles: ['admin', 'company', 'user'] },
  { label: 'Profile', path: '/profile', roles: ['admin', 'company', 'user', 'driver'] },
];
