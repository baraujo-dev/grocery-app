import type { AppConfig } from '@grocery/shared';
import { API_TIMEOUT_MS_DEFAULT } from '@grocery/shared';

const config: AppConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:8080',
  apiTimeoutMs: API_TIMEOUT_MS_DEFAULT,
};

export default config;
