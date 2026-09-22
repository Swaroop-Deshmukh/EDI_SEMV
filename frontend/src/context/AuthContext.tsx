'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, MOCK_USERS, CURRENT_USER } from '@/mock/auth';

interface AuthContextType {
  currentUser: User;
  isAuthenticated: boolean;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  login: (idOrEmail: string, role?: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check saved session in localStorage
    const savedAuth = localStorage.getItem('gov_auditor_auth');
    const savedRole = localStorage.getItem('gov_auditor_role') as UserRole | null;
    const savedUserId = localStorage.getItem('gov_auditor_user_id');

    if (savedAuth === 'true') {
      let match: User | undefined;
      if (savedUserId) {
        match = MOCK_USERS.find(u => u.id === savedUserId || u.employeeId === savedUserId);
      }
      if (!match && savedRole) {
        match = MOCK_USERS.find(u => u.role === savedRole);
      }
      if (match) {
        setCurrentUser(match);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const switchRole = (role: UserRole) => {
    const match = MOCK_USERS.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
      localStorage.setItem('gov_auditor_role', role);
      localStorage.setItem('gov_auditor_user_id', match.id);
    }
  };

  const login = (idOrEmail: string, role?: UserRole) => {
    const query = idOrEmail.trim().toLowerCase();
    let match = MOCK_USERS.find(u =>
      u.employeeId.toLowerCase() === query ||
      u.email.toLowerCase() === query ||
      u.name.toLowerCase().includes(query)
    );

    if (!match && role) {
      match = MOCK_USERS.find(u => u.role === role);
    }

    if (!match) {
      // Default to selected role or senior auditor
      match = role ? MOCK_USERS.find(u => u.role === role) || CURRENT_USER : CURRENT_USER;
    }

    setCurrentUser(match);
    setIsAuthenticated(true);
    localStorage.setItem('gov_auditor_auth', 'true');
    localStorage.setItem('gov_auditor_role', match.role);
    localStorage.setItem('gov_auditor_user_id', match.id);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gov_auditor_auth');
    localStorage.removeItem('gov_auditor_role');
    localStorage.removeItem('gov_auditor_user_id');
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
