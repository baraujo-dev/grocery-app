import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listGroceriesApi } from "./listGroceriesApi";
import type {
  GroceryListSummary,
  GroceryListDetail,
  GroceryItem,
} from "@grocery/shared";

export const useListGroceries = () => {
  return useQuery({
    queryKey: ["listGroceries"],
    queryFn: listGroceriesApi.getAll,
  });
};

export const useGroceryList = (groceryListId: string) => {
  return useQuery<GroceryListDetail, Error>({
    queryKey: ["listGroceries", groceryListId],
    queryFn: async () => {
      return listGroceriesApi.getGroceryListById(groceryListId);
    },    
    enabled: !!groceryListId,
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation<
    GroceryListSummary, // success type
    Error,              // error type
    string              // variables type
  >({
    mutationFn: (name: string) => listGroceriesApi.createList(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries"] });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    string
  >({
    mutationFn: (id: string) => listGroceriesApi.deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries"] });
    },
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    GroceryItem,
    Error,
    { listId: string, name: string }
  >({
    mutationFn: ({ listId, name }) => listGroceriesApi.addItem(listId, name),
    onSuccess: (_item, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries", listId] });
    },
  });
};

export const useToggleItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listGroceriesApi.toggleComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listGroceriesApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries"] });
    },
  });
};

export const useDeleteItems = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { listId: string; ids: string[] }
  >({
    mutationFn: async ({ ids }) => {
      await listGroceriesApi.deleteItems(ids);
    },
    onSuccess: (_data, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries", listId] });
    },
  });
};

export const useReorderItems = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { listId: string; orderedIds: string[] }
  >({
    mutationFn: ({ listId, orderedIds }) =>
      listGroceriesApi.reorderItems(listId, orderedIds),
    onSuccess: (_data, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries", listId] });
    },
  });
};

export const useShareList = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { listId: string; username: string }
  >({
    mutationFn: ({ listId, username }) =>
      listGroceriesApi.shareList(listId, username),
    onSuccess: (_data, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries", listId] });
    },
  });
};

export const useUnshareList = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { listId: string; username: string }
  >({
    mutationFn: ({ listId, username }) =>
      listGroceriesApi.unshareList(listId, username),
    onSuccess: (_data, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["listGroceries", listId, "shared-users"] });
    },
  });
};

export const useSharedUsers = (listId: string, enabled: boolean) => {
  return useQuery<string[], Error>({
    queryKey: ["listGroceries", listId, "shared-users"],
    queryFn: () => listGroceriesApi.getSharedUsers(listId),
    enabled: !!listId && enabled,
  });
};
