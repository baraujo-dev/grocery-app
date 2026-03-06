import { authApi } from "./authApi";
import { tokenStore } from "../auth/tokenStore";

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { token } = await authApi.refresh();
    tokenStore.set(token);
    window.dispatchEvent(new CustomEvent("auth:token", { detail: token }));
    return token;
  } catch {
    return null;
  }
};

const getRefreshedToken = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export const authFetch = async (
  url: string,
  options: RequestInit = {},
  allowRefresh = true
) => {
  const token = tokenStore.get();

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if ((response.status === 401 || response.status === 403) && allowRefresh) {
    const newToken = await getRefreshedToken();
    if (newToken) {
      const retryHeaders = {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      };

      return fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    }
  }

  if (response.status === 401 || response.status === 403) {
    tokenStore.set(null);
    window.dispatchEvent(new Event("auth:logout"));
  }

  return response;
};
