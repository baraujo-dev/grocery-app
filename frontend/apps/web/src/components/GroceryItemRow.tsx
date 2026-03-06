import { FaGripVertical } from "react-icons/fa";
import type { GroceryItem } from "@grocery/shared";

interface Props {
  item: GroceryItem;
  onToggleComplete: (id: string) => void;
  onDelete?: (id: string) => void;
  showDeleteOnFocus?: boolean;
  showDragHandle?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (id: string) => void;
  onDrop?: (id: string) => void;
  isDragOver?: boolean;
}

export const GroceryItemRow = ({
  item,
  onToggleComplete,
  onDelete,
  showDeleteOnFocus = false,
  showDragHandle = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver = false,
}: Props) => {
  const completed = item.completedAt !== null;

  return (
    <li
      className={`flex items-center py-3 border-b border-gray-200 group ${
        isDragOver ? "bg-gray-50" : ""
      }`}
      onDragEnd={() => onDragEnd?.()}
      onDragOver={(event) => {
        if (!onDragOver) {
          return;
        }
        event.preventDefault();
        onDragOver(item.id);
      }}
      onDrop={(event) => {
        if (!onDrop) {
          return;
        }
        event.preventDefault();
        onDrop(item.id);
      }}
    >
      {showDragHandle && (
        <span
          className="mr-2 text-gray-300 hover:text-gray-500 cursor-grab select-none"
          aria-label="Drag to reorder"
          role="button"
          tabIndex={0}
          draggable
          onDragStart={(event) => {
            if (!onDragStart) {
              return;
            }
            event.dataTransfer.effectAllowed = "move";
            onDragStart(item.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
            }
          }}
        >
          <FaGripVertical />
        </span>
      )}
      <input
        className="h-5 w-5"
        type="checkbox"
        checked={completed}
        onChange={() => onToggleComplete(item.id)}
      />
      <span
        className={`ml-3 flex-1 ${
          completed ? "line-through text-gray-400" : ""
        }`}
      >
        {item.name}
      </span>
      {onDelete && (
        <button
          type="button"
          className={`ml-3 text-gray-300 hover:text-gray-600 ${
            showDeleteOnFocus
              ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
              : ""
          }`}
          aria-label={`Delete ${item.name}`}
          onClick={() => onDelete(item.id)}
        >
          ×
        </button>
      )}
    </li>
  );
};
