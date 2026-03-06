import { useState } from "react";
import { FaList, FaCog } from "react-icons/fa";

import { ListGroceriesTab } from "../components/ListGroceriesTab";
import { GroceryPage } from "./GroceryPage";
import { SettingsPage } from "./SettingsPage";
import { BottomTabs } from "../components/BottomTabs";
import type { GroceryListSummary } from "@grocery/shared";

export const MainPage = () => {
  const [selectedGroceryList, setSelectedGroceryList] =
    useState<GroceryListSummary | null>(null);
  const [currentTab, setCurrentTab] = useState("lists");

  const handleSelectList = (list: GroceryListSummary) => {
    setSelectedGroceryList(list);
    setCurrentTab("current");
  };

  const renderTab = () => {
    if (currentTab === "lists") {
      return <ListGroceriesTab onSelectList={handleSelectList} />;
    }

    if (currentTab === "current" && selectedGroceryList) {
      return <GroceryPage grocerySummary={selectedGroceryList} />;
    }

    if (currentTab === "settings") {
      return <SettingsPage />;
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full relative pb-16 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
        <h1 className="text-lg font-semibold">Grocery Lists</h1>
      </div>
      {renderTab()}

      <BottomTabs
        tabs={[
          { key: "lists", label: "Lists", icon: <FaList /> },
          { key: "current", label: "Current", icon: "🛒" },
          { key: "settings", label: "Settings", icon: <FaCog /> },
        ]}
        onTabChange={setCurrentTab}
        initialTab="lists"
      />
    </div>
  );
};
