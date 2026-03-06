import { API_PREFIX_DEFAULT, API_TIMEOUT_MS_DEFAULT } from "@grocery/shared";
import type { AppConfig } from "@grocery/shared";

const config: AppConfig = {
  apiBaseUrl: "http://localhost:8080",
  apiPrefix: API_PREFIX_DEFAULT,
  apiTimeoutMs: API_TIMEOUT_MS_DEFAULT,
};

export default config;
