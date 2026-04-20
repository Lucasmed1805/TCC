import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "super_admin" | "admin" | "user";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  cadastro: (nome: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  atualizarPerfil: (nome: string, senhaAtual?: string, novaSenha?: string) => Promise<{ ok: boolean; error?: string }>;
};

// ================== CONFIGURAÇÃO DO BACKEND ==================
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }
  return "http://localhost:3001/api";
};

const API = getApiUrl();
// ============================================================

const TOKEN_KEY = "tcc_token";
const USER_KEY = "tcc_user";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Erro ao fazer login." };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      console.error("Erro no login:", err);
      return { ok: false, error: "Não foi possível conectar ao servidor." };
    }
  };

  const cadastro = async (nome: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Erro ao cadastrar." };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      console.error("Erro no cadastro:", err);
      return { ok: false, error: "Não foi possível conectar ao servidor." };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const atualizarPerfil = async (nome: string, senhaAtual?: string, novaSenha?: string) => {
    try {
      const res = await fetch(`${API}/auth/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
        body: JSON.stringify({ nome, senhaAtual, novaSenha }),
      });

      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Erro ao atualizar perfil." };

      const userAtualizado = { ...user!, nome };
      localStorage.setItem(USER_KEY, JSON.stringify(userAtualizado));
      setUser(userAtualizado);
      return { ok: true };
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      return { ok: false, error: "Não foi possível conectar ao servidor." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin" || user?.role === "super_admin",
        isSuperAdmin: user?.role === "super_admin",
        isLoggedIn: !!user,
        login,
        cadastro,
        logout,
        atualizarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}