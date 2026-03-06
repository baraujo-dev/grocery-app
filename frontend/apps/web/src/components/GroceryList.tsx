import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronRight, FaGripVertical, FaTrash } from "react-icons/fa";
import type { GroceryItem } from "@grocery/shared";
import {
  buildOrder,
  reorderByDrag,
  sortByPosition,
  splitByCompleted,
} from "@grocery/shared";
import { GroceryItemRow } from "./GroceryItemRow";

interface Props {
  listId: string;
  items: GroceryItem[];
  onToggleComplete: (id: string) => void;
  onAddItem: (name: string) => Promise<unknown>;
  onDeleteItem: (id: string) => void;
  onDeleteChecked: (ids: string[]) => Promise<unknown>;
  onReorderItems: (orderedIds: string[]) => Promise<unknown>;
}

export const GroceryList = ({
  listId,
  items,
  onToggleComplete,
  onAddItem,
  onDeleteItem,
  onDeleteChecked,
  onReorderItems,
}: Props) => {
  const [draftName, setDraftName] = useState("");
  const [checkedCollapsed, setCheckedCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderedItems, setOrderedItems] = useState<GroceryItem[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [listId]);

  useEffect(() => {
    setOrderedItems(sortByPosition(items));
  }, [items]);

  const handleSubmit = async () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      return;
    }

    try {
      await onAddItem(trimmed);
      setDraftName("");
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch {
      // ignore and keep input so user can retry
    }
  };

  const { unchecked: uncheckedItems, checked: checkedItems } =
    splitByCompleted(orderedItems);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (id: string) => {
    setDragOverId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDrop = async (targetId: string) => {
    const { nextOrder, changed } = reorderByDrag(
      orderedItems,
      draggingId,
      targetId
    );
    if (!changed) {
      handleDragEnd();
      return;
    }

    setOrderedItems(nextOrder);
    handleDragEnd();

    try {
      await onReorderItems(nextOrder.map((item) => item.id));
    } catch {
      setOrderedItems(items);
    }
  };

  const handleDeleteChecked = () => {
    if (checkedItems.length === 0) {
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDeleteChecked = async () => {
    try {
      await onDeleteChecked(checkedItems.map((item) => item.id));
    } catch {
      // ignore failures for now
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-4">
      <ul className="list-none p-0">
        {uncheckedItems.map((item) => (
          <GroceryItemRow
            key={item.id}
            item={item}
            onToggleComplete={onToggleComplete}
            onDelete={onDeleteItem}
            showDeleteOnFocus
            showDragHandle
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragOver={dragOverId === item.id}
          />
        ))}
        <li className="flex items-center py-3 border-b border-gray-200">
          <FaGripVertical className="mr-2 text-gray-300" />
          <input className="h-5 w-5" type="checkbox" checked={false} readOnly />
          <input
            ref={inputRef}
            className="ml-3 flex-1 border-0 outline-none text-gray-800"
            aria-label="Add item"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />
        </li>
      </ul>

      {checkedItems.length > 0 && (
        <div className="pt-2 mt-4 border-t border-gray-100">
          <div className="w-full flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700 flex items-center"
                onClick={() => setCheckedCollapsed((prev) => !prev)}
                aria-expanded={!checkedCollapsed}
                aria-label={checkedCollapsed ? "Show checked items" : "Hide checked items"}
              >
                {checkedCollapsed ? (
                  <FaChevronRight className="h-4 w-4" />
                ) : (
                  <FaChevronDown className="h-4 w-4" />
                )}
              </button>
              <span>{checkedItems.length} checked items</span>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-700"
              aria-label="Delete checked items"
              onClick={handleDeleteChecked}
            >
              <FaTrash />
            </button>
          </div>
          {!checkedCollapsed && (
            <ul className="list-none p-0 mt-2 ml-6">
              {checkedItems.map((item) => (
                <GroceryItemRow
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteItem}
                  showDeleteOnFocus
                  showDragHandle
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragOver={dragOverId === item.id}
                />
              ))}
            </ul>
          )}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">
              Delete checked items?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              This will remove {checkedItems.length} checked{" "}
              {checkedItems.length === 1 ? "item" : "items"} from the list.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                onClick={confirmDeleteChecked}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
