import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Heading } from "../components/Heading";
import { GroceryList } from "../components/GroceryList";
import type { GroceryListSummary } from "@grocery/shared";
import {
  useGroceryList,
  useAddItem,
  useToggleItem,
  useDeleteItem,
  useDeleteItems,
  useReorderItems,
  useShareList,
  useSharedUsers,
  useUnshareList,
} from "../services/useListGroceries";

interface GroceryPageProps {
  grocerySummary: GroceryListSummary;
}

export const GroceryPage = ({ grocerySummary }: GroceryPageProps) => {
  const { data, isLoading, error } = useGroceryList(grocerySummary.id);
  const addItemMutation = useAddItem();
  const toggleMutation = useToggleItem();
  const deleteMutation = useDeleteItem();
  const deleteItemsMutation = useDeleteItems();
  const reorderItemsMutation = useReorderItems();
  const shareListMutation = useShareList();
  const unshareListMutation = useUnshareList();

  const [showMenu, setShowMenu] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareUsername, setShareUsername] = useState("");
  const [shareError, setShareError] = useState<string | null>(null);
  const sharedUsersQuery = useSharedUsers(grocerySummary.id, showShare);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mt-6 mb-6">
        <Heading className="text-center flex-1" level={1}>
          🛒 {data.name || grocerySummary.name}
        </Heading>
      </div>

      <GroceryList
        listId={grocerySummary.id}
        items={data.items}
        onToggleComplete={(id) => toggleMutation.mutate(id)}
        onAddItem={(name) =>
          addItemMutation.mutateAsync({ listId: grocerySummary.id, name })
        }
        onDeleteItem={(id) => deleteMutation.mutate(id)}
        onDeleteChecked={(ids) =>
          deleteItemsMutation.mutateAsync({ listId: grocerySummary.id, ids })
        }
        onReorderItems={(orderedIds) =>
          reorderItemsMutation.mutateAsync({
            listId: grocerySummary.id,
            orderedIds,
          })
        }
      />

      <div className="fixed bottom-14 left-0 right-0 z-30 flex justify-center px-4">
        <div className="w-[var(--phone-width)]">
          <div className="flex items-center justify-end rounded-t-xl border-t border-l border-r border-gray-100 bg-[var(--surface)]/90 px-3 py-2 shadow-sm backdrop-blur">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setShowMenu(true)}
              aria-label="List options"
            >
              <FaEllipsisV />
            </button>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <button
            type="button"
            className="absolute inset-0 w-full h-full"
            onClick={() => setShowMenu(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-1/2 w-[var(--phone-width)] -translate-x-1/2 rounded-t-3xl bg-white p-4 shadow-xl">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-200" />
            <button
              type="button"
              className="w-full rounded-lg px-4 py-3 text-left text-gray-400"
              disabled
            >
              Send (coming soon)
            </button>
            <button
              type="button"
              className="mt-2 w-full rounded-lg px-4 py-3 text-left text-gray-800 hover:bg-gray-50"
              onClick={() => {
                setShowMenu(false);
                setShowShare(true);
                setShareError(null);
              }}
            >
              Share
            </button>
          </div>
        </div>
      )}

      {showShare && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <button
            type="button"
            className="absolute inset-0 w-full h-full"
            onClick={() => setShowShare(false)}
            aria-label="Close share"
          />
          <div className="absolute bottom-0 left-1/2 w-[var(--phone-width)] -translate-x-1/2 rounded-t-3xl bg-white p-4 shadow-xl">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-200" />
            <h3 className="text-base font-semibold text-gray-900">
              Share list
            </h3>
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Shared with
              </p>
              {sharedUsersQuery.isLoading && (
                <p className="mt-2 text-sm text-gray-500">Loading...</p>
              )}
              {sharedUsersQuery.isError && (
                <p className="mt-2 text-sm text-red-500">
                  {sharedUsersQuery.error?.message ??
                    "Failed to load shared users."}
                </p>
              )}
              {!sharedUsersQuery.isLoading && !sharedUsersQuery.isError && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(sharedUsersQuery.data ?? []).length === 0 && (
                    <span className="text-sm text-gray-500">
                      Not shared yet
                    </span>
                  )}
                  {(sharedUsersQuery.data ?? []).map((username) => (
                    <span
                      key={username}
                      className="relative rounded-full bg-gray-100 px-3 py-1 pr-6 text-sm text-gray-700"
                    >
                      {username}
                      <button
                        type="button"
                        className="absolute right-1 top-1 text-gray-400 hover:text-gray-600"
                        aria-label={`Unshare ${username}`}
                        onClick={async () => {
                          try {
                            await unshareListMutation.mutateAsync({
                              listId: grocerySummary.id,
                              username,
                            });
                            sharedUsersQuery.refetch();
                          } catch {
                            setShareError("Failed to unshare user.");
                          }
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Enter the username to share this list with.
            </p>
            <input
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 outline-none focus:border-gray-400"
              placeholder="Username"
              value={shareUsername}
              onChange={(event) => setShareUsername(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const trimmed = shareUsername.trim();
                  if (!trimmed) {
                    setShareError("Please enter a username.");
                    return;
                  }
                  shareListMutation
                    .mutateAsync({
                      listId: grocerySummary.id,
                      username: trimmed,
                    })
                    .then(() => {
                      sharedUsersQuery.refetch();
                      setShareUsername("");
                      setShareError(null);
                    })
                    .catch(() => {
                      setShareError("User not found or cannot share.");
                    });
                }
              }}
            />
            {shareError && (
              <p className="mt-2 text-sm text-red-500">{shareError}</p>
            )}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => setShowShare(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800"
                onClick={async () => {
                  const trimmed = shareUsername.trim();
                  if (!trimmed) {
                    setShareError("Please enter a username.");
                    return;
                  }
                  try {
                    await shareListMutation.mutateAsync({
                      listId: grocerySummary.id,
                      username: trimmed,
                    });
                    sharedUsersQuery.refetch();
                    setShareUsername("");
                    setShareError(null);
                  } catch {
                    setShareError("User not found or cannot share.");
                  }
                }}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
