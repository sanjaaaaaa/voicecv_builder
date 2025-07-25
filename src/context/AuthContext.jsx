// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  // Mock authentication state as Firebase is removed
  const [currentUser, setCurrentUser] = useState({ uid: "demo-user-id-12345", displayName: "Demo User", email: "demo@example.com" });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Mock login and logout functions
  const login = useCallback(async () => {
    setLoadingAuth(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    setCurrentUser({ uid: "demo-user-id-12345", displayName: "Demo User", email: "demo@example.com" });
    setLoadingAuth(false);
    setAuthError(null);
    console.log("Mock login successful.");
  }, []);

  const logout = useCallback(async () => {
    setLoadingAuth(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    setCurrentUser(null);
    setLoadingAuth(false);
    setAuthError(null);
    console.log("Mock logout successful.");
  }, []);

  const value = {
    currentUser,
    loadingAuth,
    authError,
    login, // Mocked login
    logout, // Mocked logout
    userId: currentUser ? currentUser.uid : null, // Provide userId directly
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};