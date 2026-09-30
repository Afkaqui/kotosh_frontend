'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  User,
  AuthResponse,
  getStoredToken,
  getStoredUser,
  storeAuth,
  storeUser,
  clearAuth,
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  can: (...roles: User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getStoredToken();
    const saved = getStoredUser();
    if (!token || !saved) {
      setIsLoading(false);
      return;
    }
    setUser(saved);
    setIsLoading(false);
    // Refresh the profile so role changes made by an admin show up without re-login.
    api
      .get<User>('/auth/profile')
      .then(({ data }) => {
        storeUser(data);
        setUser(data);
      })
      .catch(() => {});
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
      storeAuth(data);
      queryClient.clear();
      setUser(data.user);
      router.replace('/dashboard');
    },
    [router, queryClient],
  );

  const logout = useCallback(() => {
    clearAuth();
    queryClient.clear();
    setUser(null);
    router.replace('/login');
  }, [router, queryClient]);

  const can = useCallback(
    (...roles: User['role'][]) => !!user && roles.includes(user.role),
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
