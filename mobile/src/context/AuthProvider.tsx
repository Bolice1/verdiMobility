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
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await setStoredTokens(null);
    setUser(null);
  };

  const api = useMemo(() => createApi(() => void logout()), []);

  useEffect(() => {
    const bootstrap = async () => {
      const tokens = await getStoredTokens();
      if (!tokens?.accessToken) {
        setLoading(false);
        return;
      }
      try {
        const profile = await api.users.me();
        setUser(profile);
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [api]);

  const persistAuth = async (response: AuthResponse) => {
    await setStoredTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        api,
        async login(email, password) {
          const response = await api.auth.login({ email, password });
          await persistAuth(response);
        },
        async register(payload) {
          const response = await api.auth.register(payload);
          await persistAuth(response);
        },
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
