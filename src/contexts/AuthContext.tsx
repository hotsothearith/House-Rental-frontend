
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthResponse } from '@/types/api';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  token: string | null;
  login: (userType: UserRole, credentials: any) => Promise<void>;
  register: (userType: UserRole, userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUserRole = localStorage.getItem('user_role') as UserRole;
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUserRole && storedUser) {
      setToken(storedToken);
      setUserRole(storedUserRole);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userType: UserRole, credentials: any) => {
    try {
      const response: AuthResponse = await apiClient.login(
        userType === 'house_owner' ? 'house-owner' : userType === 'administrator' ? 'admin' : userType,
        credentials
      );

      // Handle different response formats from your backend
      const accessToken = response.access_token || response.token;
      const { tenant, house_owner, administrator } = response;
      const userData = tenant || house_owner || administrator;

      if (userData && accessToken) {
        setToken(accessToken);
        setUserRole(userType);
        setUser(userData);

        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('user_role', userType);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userType: UserRole, userData: any) => {
    // Prevent administrator registration
    if (userType === 'administrator') {
      throw new Error('Administrator registration is not allowed');
    }

    try {
      const response: AuthResponse = await apiClient.register(
        userType === 'house_owner' ? 'house-owner' : userType,
        userData
      );

      const accessToken = response.access_token || response.token;
      const { tenant, house_owner } = response;
      const userInfo = tenant || house_owner;

      if (userInfo && accessToken) {
        setToken(accessToken);
        setUserRole(userType);
        setUser(userInfo);

        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('user_role', userType);
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    if (userRole) {
      apiClient.logout(userRole === 'house_owner' ? 'house-owner' : userRole === 'administrator' ? 'admin' : userRole).catch(console.error);
    }

    setUser(null);
    setUserRole(null);
    setToken(null);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    userRole,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
