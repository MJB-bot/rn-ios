import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface Admin {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('jwt_token');
        if (stored) {
          setToken(stored);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res: any = await authAPI.login(username, password);
    const { token: jwtToken, admin: adminData } = res.data;
    await AsyncStorage.setItem('jwt_token', jwtToken);
    setToken(jwtToken);
    setAdmin(adminData);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('jwt_token');
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
