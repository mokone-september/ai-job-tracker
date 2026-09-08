"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
};

type Credentials = {
  identifier: string;
  password: string;
};

type Registration = {
  username: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (details: Registration) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337/api";
const tokenKey = "ai-job-tracker-token";

async function request(path: string, options: RequestInit = {}) {
  const token = window.localStorage.getItem(tokenKey);
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error?.message ?? "Something went wrong. Please try again.");
  }

  return body;
}

function saveSession(data: { jwt?: string; token?: string; user: User }) {
  const token = data.jwt ?? data.token;
  if (token) {
    window.localStorage.setItem(tokenKey, token);
  }
  return data.user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem(tokenKey);
    if (!token) {
      queueMicrotask(() => setIsLoading(false));
      return;
    }

    request("/users/me")
      .then(setUser)
      .catch(() => window.localStorage.removeItem(tokenKey))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials: Credentials) {
    const data = await request("/auth/local", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(saveSession(data));
  }

  async function register(details: Registration) {
    const data = await request("/auth/local/register", {
      method: "POST",
      body: JSON.stringify(details),
    });
    setUser(saveSession(data));
  }

  async function logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      window.localStorage.removeItem(tokenKey);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
