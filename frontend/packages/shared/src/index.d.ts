export const SUGGESTIONS: string[];
export const API_PREFIX_DEFAULT: string;
export const API_TIMEOUT_MS_DEFAULT: number;

export interface AppConfig {
  apiBaseUrl: string;
  apiPrefix?: string;
  apiTimeoutMs?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

export interface CreateListRequest {
  name: string;
}

export interface AddItemRequest {
  name: string;
}

export interface ShareRequest {
  username: string;
}

export type DeleteItemsRequest = string[];

export interface GroceryItem {
  id: string;
  name: string;
  addedAt: Date;
  completedAt?: Date;
  position: number;
}

export interface GroceryListSummary {
  id: string;
  name: string;
}

export interface GroceryListDetail extends GroceryListSummary {
  items: GroceryItem[];
}

export function sortByPosition(items: GroceryItem[]): GroceryItem[];
export function splitByCompleted(items: GroceryItem[]): {
  unchecked: GroceryItem[];
  checked: GroceryItem[];
};
export function reorderWithin(
  list: GroceryItem[],
  fromId: string,
  toId: string
): GroceryItem[];
export function buildOrder(
  unchecked: GroceryItem[],
  checked: GroceryItem[]
): GroceryItem[];
export function reorderByDrag(
  items: GroceryItem[],
  draggingId: string | null,
  targetId: string
): { nextOrder: GroceryItem[]; changed: boolean };
