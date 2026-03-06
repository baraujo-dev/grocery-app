import { authFetch } from "../api/authFetch";
import config from "../config";
import { createListApi } from "@grocery/shared/src/services/listApi";

const API_ROOT = `${config.apiBaseUrl}${config.apiPrefix}`;

export const listGroceriesApi = createListApi(API_ROOT, authFetch);
