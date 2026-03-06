/**
 * @typedef {import('../../index').LoginRequest} LoginRequest
 * @typedef {import('../../index').AuthResponse} AuthResponse
 */

/**
 * @param {string} apiBaseUrl
 */
import { createAuthClient } from '../authClient';
import { mapAuthError } from '../authErrors';
import { clearRefreshToken, getRefreshToken, setRefreshToken } from './storage';

export const createAuthService = (apiBaseUrl) => {
  const client = createAuthClient({
    apiBaseUrl,
    mode: 'mobile',
    getRefreshToken,
    setRefreshToken,
    clearRefreshToken,
  });

  return {
  /**
   * @param {LoginRequest} request
   * @returns {Promise<AuthResponse>}
   */
  loginMobile: async ({ username, password }) => {
    try {
      return await client.login({ username, password });
    } catch (error) {
      throw new Error(mapAuthError(error, 'login'));
    }
  },

  /**
   * @param {string} refreshToken
   * @returns {Promise<AuthResponse | null>}
   */
  refreshMobile: async (refreshToken) => {
    try {
      if (refreshToken) {
        await setRefreshToken(refreshToken);
      }
      return await client.refresh();
    } catch (error) {
      throw new Error(mapAuthError(error, 'refresh'));
    }
  },

  /**
   * @param {string | null} refreshToken
   * @returns {Promise<void>}
   */
  logoutMobile: async (refreshToken) => {
    try {
      if (refreshToken) {
        await setRefreshToken(refreshToken);
      }
      await client.logout();
    } catch (error) {
      throw new Error(mapAuthError(error, 'logout'));
    }
  },
  };
};
