import { create } from 'zustand';

const previewUsers = {
  admin: {
    id: 'demo-admin',
    name: 'Operations Lead',
    email: 'ops@verdimobility.com',
    role: 'admin',
  },
  company: {
    id: 'demo-company',
    name: 'Fleet Coordinator',
    email: 'fleet@verdimobility.com',
    role: 'company',
  },
  driver: {
    id: 'demo-driver',
    name: 'Driver Michael',
    email: 'driver@verdimobility.com',
    role: 'driver',
  },
  user: {
    id: 'demo-user',
    name: 'Client Desk',
    email: 'client@verdimobility.com',
    role: 'user',
  },
};

const initialUser = previewUsers.admin;

export const useAuthStore = create((set) => ({
  token: null,
  user: initialUser,
  loading: false,
  error: null,
  setAuthLoading: (loading) => set({ loading }),
  setAuthError: (error) => set({ error }),
  setSession: ({ token, user }) => set({ token, user, error: null }),
  setRolePreview: (role) =>
    set((state) => ({
      user: state.token ? { ...state.user, role } : previewUsers[role] ?? previewUsers.user,
      error: null,
    })),
  logout: () => set({ token: null, user: null, error: null }),
}));
