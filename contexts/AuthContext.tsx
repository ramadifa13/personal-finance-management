import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  pin: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (pin: string) => boolean;
  logout: () => void;
  setPin: (pin: string, name: string, email: string) => void;
  hasUser: () => boolean;
  deleteUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('financeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const hasUser = () => {
    return !!localStorage.getItem('financeUser');
  };

  const setPin = (pin: string, name: string, email: string) => {
    const newUser = { pin, name, email };
    localStorage.setItem('financeUser', JSON.stringify(newUser));
    setUser(newUser);
  };

  const login = (pin: string) => {
    if (user && user.pin === pin) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const deleteUser = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('financeUser');
    localStorage.removeItem('isAuthenticated');
    // Optionally clear all finance data
    localStorage.removeItem('financeTransactions');
    localStorage.removeItem('financeGoals');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        setPin,
        hasUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};