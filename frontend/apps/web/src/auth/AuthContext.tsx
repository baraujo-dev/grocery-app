import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { tokenStore } from "./tokenStore";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { token } = await authApi.refresh();
        tokenStore.set(token);
        setToken(token);
      } catch {
        tokenStore.set(null);
        setToken(null);
      }
    };
    void init();
  }, []);

  const login = (token: string) => {
    tokenStore.set(token);
    setToken(token);
  };

  const logout = () => {
    void authApi.logout();
    tokenStore.set(null);
    setToken(null);
  };

  useEffect(() => {
    const handleAuthLogout = () => {
      tokenStore.set(null);
      setToken(null);
    };

    const handleAuthToken = (event: Event) => {
      const detail = (event as CustomEvent<string | null>).detail;
      tokenStore.set(detail ?? null);
      setToken(detail ?? null);
    };

    window.addEventListener("auth:logout", handleAuthLogout as EventListener);
    window.addEventListener("auth:token", handleAuthToken as EventListener);

    return () => {
      window.removeEventListener(
        "auth:logout",
        handleAuthLogout as EventListener
      );
      window.removeEventListener("auth:token", handleAuthToken as EventListener);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
