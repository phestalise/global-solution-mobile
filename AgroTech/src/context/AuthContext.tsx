import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  register: (name: string, email: string, password: string) => void;
  updateProfile: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);

  function signIn(email: string, password: string) {
    setUser({
      name: 'Paulo Orbit',
      email,
    });
  }

  function register(name: string, email: string, password: string) {
    setUser({
      name,
      email,
    });
  }

  function signOut() {
    setUser(null);
  }
  function updateProfile(name: string, email: string) {
    setUser({
      name,
      email,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}