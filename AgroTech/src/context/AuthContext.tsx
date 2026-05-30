import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produtor } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  produtor: Produtor | null;
  login: (produtor: Produtor) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  produtor: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [produtor, setProdutor] = useState<Produtor | null>(null);

  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem('produtor');
      if (json) {
        setProdutor(JSON.parse(json));
        setIsAuthenticated(true);
      }
    };
    load();
  }, []);

  const login = async (p: Produtor) => {
    await AsyncStorage.setItem('produtor', JSON.stringify(p));
    setProdutor(p);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('produtor');
    setProdutor(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, produtor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);