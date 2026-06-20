"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, isLoading: true,
  isAuthenticated: false,
  login: () => {}, logout: () => {}, setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("medistore_token");
    const savedUser  = Cookies.get("medistore_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUserState(JSON.parse(savedUser));
      } catch {
        Cookies.remove("medistore_token");
        Cookies.remove("medistore_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, userToken: string) => {
    setUserState(userData);
    setToken(userToken);
    Cookies.set("medistore_token", userToken, { expires: 7 });
    Cookies.set("medistore_user", JSON.stringify(userData), { expires: 7 });
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
    Cookies.remove("medistore_token");
    Cookies.remove("medistore_user");
  };

  // Update user in state + cookie (used after profile update)
  const setUser = (userData: User) => {
    setUserState(userData);
    Cookies.set("medistore_user", JSON.stringify(userData), { expires: 7 });
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, isAuthenticated: !!user,
      login, logout, setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
