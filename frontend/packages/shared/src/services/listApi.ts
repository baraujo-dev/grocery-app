import type {
  AddItemRequest,
  CreateListRequest,
  DeleteItemsRequest,
  GroceryItem,
  GroceryListDetail,
  GroceryListSummary,
  ShareRequest,
} from '../index';

type AuthFetch = (url: string, options?: RequestInit) => Promise<Response>;

export const createListApi = (apiRoot: string, authFetch: AuthFetch) => ({
  getAll: async (): Promise<GroceryListSummary[]> => {
    const response = await authFetch(`${apiRoot}/lists`);

    if (!response.ok) {
      throw new Error('Failed to fetch list of All Grocery Lists');
    }

    return response.json();
  },

  getGroceryListById: async (
    groceryListId: string
  ): Promise<GroceryListDetail> => {
    const response = await authFetch(`${apiRoot}/lists/${groceryListId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch list of Grocery List with id: ${groceryListId}`
      );
    }

    return await response.json();
  },

  createList: async (name: string): Promise<GroceryListSummary> => {
    const response = await authFetch(`${apiRoot}/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name } satisfies CreateListRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to create list with name: ${name}`);
    }

    return response.json();
  },

  deleteList: async (id: string): Promise<void> => {
    const response = await authFetch(`${apiRoot}/lists/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete list with id: ${id}`);
    }
  },

  addItem: async (listId: string, name: string): Promise<GroceryItem> => {
    const response = await authFetch(`${apiRoot}/lists/${listId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name } satisfies AddItemRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to add item to list: ${listId}`);
    }

    return response.json();
  },

  reorderItems: async (listId: string, orderedIds: string[]): Promise<void> => {
    const response = await authFetch(`${apiRoot}/lists/${listId}/items/order`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderedIds),
    });

    if (!response.ok) {
      throw new Error('Failed to reorder items');
    }
  },

  shareList: async (listId: string, username: string): Promise<void> => {
    const response = await authFetch(`${apiRoot}/lists/${listId}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username } satisfies ShareRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to share list');
    }
  },

  unshareList: async (listId: string, username: string): Promise<void> => {
    const response = await authFetch(`${apiRoot}/lists/${listId}/unshare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username } satisfies ShareRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to unshare list');
    }
  },

  getSharedUsers: async (listId: string): Promise<string[]> => {
    const response = await authFetch(`${apiRoot}/lists/${listId}/shared`);
    if (!response.ok) {
      throw new Error('Failed to load shared users');
    }
    return response.json();
  },

  toggleComplete: async (id: string): Promise<void> => {
    const response = await authFetch(`${apiRoot}/items/${id}/toggle`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle item: ${id}`);
    }
  },

  deleteItem: async (id: string): Promise<void> => {
    const response = await authFetch(`${apiRoot}/items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${id}`);
    }
  },

  deleteItems: async (ids: string[]): Promise<void> => {
    const response = await authFetch(`${apiRoot}/items/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids satisfies DeleteItemsRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to delete items');
    }
  },
});
