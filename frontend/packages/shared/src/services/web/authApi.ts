import type { AuthResponse, LoginRequest } from '../../index';
import { createAuthClient } from '../authClient';
import { mapAuthError } from '../authErrors';

export const createAuthApi = (apiBaseUrl: string) => ({
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const client = createAuthClient({ apiBaseUrl, mode: 'web' });
    try {
      return await client.login(request);
    } catch (error) {
      throw new Error(mapAuthError(error, 'login'));
    }
  },
  refresh: async (): Promise<AuthResponse> => {
    const client = createAuthClient({ apiBaseUrl, mode: 'web' });
    try {
      return await client.refresh();
    } catch (error) {
      throw new Error(mapAuthError(error, 'refresh'));
    }
  },
  logout: async (): Promise<void> => {
    const client = createAuthClient({ apiBaseUrl, mode: 'web' });
    try {
      await client.logout();
    } catch (error) {
      throw new Error(mapAuthError(error, 'logout'));
    }
  },
});
