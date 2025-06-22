import React, { createContext, useState } from 'react';

// 1) Create the context
export const AuthContext = createContext();

// 2) Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
