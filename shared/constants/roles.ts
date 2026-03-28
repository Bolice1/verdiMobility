export const USER_ROLES = ['admin', 'company', 'user', 'driver'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  company: 'Company',
  user: 'User',
  driver: 'Driver',
};
