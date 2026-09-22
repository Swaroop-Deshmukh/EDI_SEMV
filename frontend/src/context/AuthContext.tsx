'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, MOCK_USERS, CURRENT_USER } from '@/mock/auth';

interface AuthContextType {
  currentUser: User;
  isAuthenticated: boolean;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    // Check saved role or session in localStorage
    const savedRole = localStorage.getItem('gov_auditor_role') as UserRole | null;
    if (savedRole) {
      const match = MOCK_USERS.find(u => u.role === savedRole);
      if (match) setCurrentUser(match);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    const match = MOCK_USERS.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
      localStorage.setItem('gov_auditor_role', role);
    }
  };

  const login = (email: string, role?: UserRole) => {
    const match = MOCK_USERS.find(u => (role ? u.role === role : u.email.toLowerCase() === email.toLowerCase()));
    if (match) {
      setCurrentUser(match);
      setIsAuthenticated(true);
      localStorage.setItem('gov_auditor_role', match.role);
      return true;
    }
    // Default fallback
    setCurrentUser(CURRENT_USER);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeRole: currentUser.role,
        switchRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
