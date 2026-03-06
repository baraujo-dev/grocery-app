import type { AuthResponse, LoginRequest } from '../index';
import { createAuthCore } from './authCore';

type AuthClientOptions =
  | {
      mode: 'web';
      apiBaseUrl: string;
    }
  | {
      mode: 'mobile';
      apiBaseUrl: string;
      getRefreshToken: () => Promise<string | null>;
      setRefreshToken: (token: string) => Promise<void>;
      clearRefreshToken: () => Promise<void>;
    };

export const createAuthClient = (options: AuthClientOptions) => {
  const { postJson } = createAuthCore(options.apiBaseUrl);

  const login = async (request: LoginRequest): Promise<AuthResponse> => {
    if (options.mode === 'web') {
      return postJson<AuthResponse>('/auth/login', request, true);
    }

    const data = await postJson<AuthResponse>(
      '/auth/login-mobile',
      request,
      false
    );
    if (data?.refreshToken) {
      await options.setRefreshToken(data.refreshToken);
    }
    return data;
  };

  const refresh = async (): Promise<AuthResponse | null> => {
    if (options.mode === 'web') {
      return postJson<AuthResponse>('/auth/refresh', undefined, true);
    }

    const refreshToken = await options.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const data = await postJson<AuthResponse>(
        '/auth/refresh-mobile',
        { refreshToken },
        false
      );
      if (data?.refreshToken) {
        await options.setRefreshToken(data.refreshToken);
      }
      return data;
    } catch {
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    if (options.mode === 'web') {
      await postJson<void>('/auth/logout', undefined, true);
      return;
    }

    const refreshToken = await options.getRefreshToken();
    if (refreshToken) {
      try {
        await postJson<void>(
          '/auth/logout-mobile',
          { refreshToken },
          false
        );
      } catch {
        // ignore
      }
    }
    await options.clearRefreshToken();
  };

  return { login, refresh, logout };
};
