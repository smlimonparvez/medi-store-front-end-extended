"use client";
import {
  createContext, useContext, useState,
  useEffect, ReactNode,
} from "react";
import { User } from "@/types";
import api from "@/lib/axios";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, isLoading: true, isAuthenticated: false,
  login: () => {}, logout: () => {}, setUser: () => {},
});

const USER_KEY = "medistore_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount (not sensitive — just UI state)
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) setUserState(JSON.parse(saved));
    } catch {
      localStorage.removeItem(USER_KEY);
    }
    setIsLoading(false);
  }, []);

  // Called after successful login — user data comes from API response body
  // Token is handled automatically by the browser (HttpOnly cookie from server)
  const login = (userData: User) => {
    setUserState(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Tell server to clear the HttpOnly token cookie
      await api.post("/auth/logout");
    } catch {
      // If server is unreachable, still clear client state
    }
    setUserState(null);
    localStorage.removeItem(USER_KEY);
  };

  // Used after profile update to refresh UI state
  const setUser = (userData: User) => {
    setUserState(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user,
      login, logout, setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
