import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  tenantId: number;
  tenantName: string;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/auth/me");
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.error) {
      throw new Error(data.error);
    }

    await fetchMe();
    return data;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    restaurantName: string,
  ) => {
    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, restaurantName }),
    });

    if (data.error) {
      throw new Error(data.error);
    }

    await fetchMe();
    return data;
  };

  const logout = async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { auth: user, loading, login, register, logout };
};
