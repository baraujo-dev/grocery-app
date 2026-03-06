import { AuthError } from './authErrors';

export const createAuthCore = (apiBaseUrl: string) => {
  const postJson = async <T>(
    path: string,
    body?: unknown,
    includeCredentials?: boolean
  ): Promise<T> => {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: includeCredentials ? 'include' : 'omit',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new AuthError('AUTH_REQUEST_FAILED', response.status);
    }

    return response.json();
  };

  return { postJson };
};
