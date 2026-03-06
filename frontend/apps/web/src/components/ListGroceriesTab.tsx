import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import type { GroceryListSummary } from "@grocery/shared";

import {
  useListGroceries,
  useCreateList,
  useDeleteList,
} from "../services/useListGroceries";

interface ListsTabProps {
  onSelectList: (list: GroceryListSummary) => void;
}

export const ListGroceriesTab = ({ onSelectList }: ListsTabProps) => {
  const [newName, setNewName] = useState("");
  const { data: lists = [], isLoading } = useListGroceries();
  const createListMutation = useCreateList();
  const deleteListMutation = useDeleteList();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Your Grocery Lists</h2>

      <div className="flex gap-2 mb-4">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New list name..."
        />
        <Button
          className="list-add-btn"
          onClick={() => {
            if (newName.trim()) {
              createListMutation.mutate(newName.trim());
              setNewName("");
            }
          }}
        >
          Add
        </Button>
      </div>

      <ul className="space-y-2">
        {lists.map((list) => (
          <li
            key={list.id}
            className="flex justify-between items-center p-3 border border-gray-200 rounded-xl cursor-pointer"
          >
            <span onClick={() => onSelectList(list)}>{list.name}</span>
            <Button
              className="list-delete-btn px-3 py-1 text-sm"
              onClick={() => deleteListMutation.mutate(list.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
