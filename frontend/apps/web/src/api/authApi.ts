import config from "../config";
import { createAuthApi } from "@grocery/shared/src/services/web/authApi";

export const authApi = createAuthApi(config.apiBaseUrl);
