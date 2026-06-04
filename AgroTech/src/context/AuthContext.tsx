import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Produtor } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  produtor: Produtor | null;
  user: Produtor | null;                  // ← ALIAS adicionado
  login: (produtor: Produtor) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const isWeb = typeof window !== "undefined";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [produtor, setProdutor] = useState<Produtor | null>(null);

  useEffect(() => {
    const load = async () => {
      if (isWeb) return;

      const json = await AsyncStorage.getItem("produtor");
      if (json) {
        const data = JSON.parse(json);
        setProdutor(data);
        setIsAuthenticated(true);
      }
    };

    load();
  }, []);

  const login = async (p: Produtor) => {
    if (!isWeb) {
      await AsyncStorage.setItem("produtor", JSON.stringify(p));
    }

    setProdutor(p);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (!isWeb) {
      await AsyncStorage.removeItem("produtor");
    }

    setProdutor(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        produtor,
        user: produtor,          // ← alias para compatibilidade
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);