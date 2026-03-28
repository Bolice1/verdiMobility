import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { AuthResponse, User } from '../../../shared/types';
import { createApi, getStoredTokens, setStoredTokens } from '../services/api';
import { logProductEvent } from '../../../shared/utils/eventLogger';

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'company' | 'driver';
  companyName?: string;
  companyEmail?: string;
  licenseNumber?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  api: ReturnType<typeof createApi>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setStoredTokens(null);
    setUser(null);
    logProductEvent('auth.logout');
  };

  const api = useMemo(() => createApi(logout), []);

  useEffect(() => {
    const bootstrap = async () => {
      const tokens = getStoredTokens();
      if (!tokens?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        const profile = await api.users.me();
        setUser(profile);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [api]);

  const persistAuth = (response: AuthResponse) => {
    setStoredTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    setUser(response.user);
  };

  const value: AuthContextValue = {
    user,
    loading,
    api,
    async login(email, password) {
      const response = await api.auth.login({ email, password });
      persistAuth(response);
      logProductEvent('auth.login', { role: response.user.role });
    },
    async register(payload) {
      const response = await api.auth.register(payload);
      persistAuth(response);
      logProductEvent('auth.register', { role: response.user.role });
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
