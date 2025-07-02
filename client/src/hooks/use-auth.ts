import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { getStoredUser, setStoredUser } from "../lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setStoredUser(userData);
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };
}
