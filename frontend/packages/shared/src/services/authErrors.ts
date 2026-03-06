export type AuthErrorContext = 'login' | 'refresh' | 'logout';

export const AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS';
export const AUTH_REFRESH_EXPIRED = 'AUTH_REFRESH_EXPIRED';
export const AUTH_LOGOUT_FAILED = 'AUTH_LOGOUT_FAILED';
export const AUTH_REQUEST_FAILED = 'AUTH_REQUEST_FAILED';
export const AUTH_NETWORK_ERROR = 'AUTH_NETWORK_ERROR';

export class AuthError extends Error {
  code: string;
  status?: number;

  constructor(code: string, status?: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export const isAuthError = (error: unknown): error is AuthError =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  typeof (error as AuthError).code === 'string';

export const mapAuthError = (
  error: unknown,
  context: AuthErrorContext
): string => {
  if (error instanceof AuthError) {
    if (context === 'login' && error.status === 401) {
      return AUTH_INVALID_CREDENTIALS;
    }
    if (context === 'refresh' && error.status === 401) {
      return AUTH_REFRESH_EXPIRED;
    }
  }
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    String((error as Error).message).toLowerCase().includes('network')
  ) {
    return AUTH_NETWORK_ERROR;
  }
  if (context === 'login') {
    return AUTH_INVALID_CREDENTIALS;
  }
  if (context === 'refresh') {
    return AUTH_REFRESH_EXPIRED;
  }
  if (context === 'logout') {
    return AUTH_LOGOUT_FAILED;
  }
  return AUTH_REQUEST_FAILED;
};
