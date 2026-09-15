'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { User, RoleType } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: RoleType | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async (savedToken: string) => {
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      localStorage.removeItem('bp_token');
      localStorage.removeItem('bp_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('bp_token');
    const savedUser = localStorage.getItem('bp_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Login failed');
    }

    const { token: receivedToken, user: receivedUser } = res.data.data;
    localStorage.setItem('bp_token', receivedToken);
    localStorage.setItem('bp_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('bp_token');
    localStorage.removeItem('bp_user');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
