// path: apps/web/context/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import * as api from '@/lib/api';
import { User, LoginCredentials, SignUpCredentials } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (details: SignUpCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Session invalid, logging out');
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const userData = await api.loginUser(credentials);
    localStorage.setItem('authToken', userData.token);
    setUser(userData.user);
    router.push('/dashboard');
  };

  const signup = async (details: SignUpCredentials) => {
    const userData = await api.registerUser(details);
    localStorage.setItem('authToken', userData.token);
    setUser(userData.user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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