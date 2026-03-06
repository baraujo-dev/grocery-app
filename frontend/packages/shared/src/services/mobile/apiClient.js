import { createAuthService } from './authService';
import { getRefreshToken, setRefreshToken } from './storage';

export const createApiClient = ({ apiBaseUrl, getAccessToken, setAccessToken }) => {
  const authService = createAuthService(apiBaseUrl);

  const refreshAccessToken = async () => {
    const storedRefreshToken = await getRefreshToken();
    if (!storedRefreshToken) {
      return null;
    }
    let data = null;
    try {
      data = await authService.refreshMobile(storedRefreshToken);
    } catch {
      return null;
    }
    if (!data) {
      return null;
    }
    if (data?.refreshToken) {
      await setRefreshToken(data.refreshToken);
    }
    if (data?.token) {
      setAccessToken(data.token);
    }
    return data?.token ?? null;
  };

  const authFetch = async (url, options = {}) => {
    const token = getAccessToken();
    const headers = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        const retryHeaders = {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        };
        return fetch(url, { ...options, headers: retryHeaders });
      }
    }
    return response;
  };

  return { authFetch, refreshAccessToken };
};
