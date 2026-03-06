import { useState } from "react";

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface BottomTabsProps {
  tabs: Tab[];
  onTabChange?: (key: string) => void;
  initialTab?: string;
}

export const BottomTabs = ({
  tabs,
  onTabChange,
  initialTab,
}: BottomTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0].key);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    onTabChange?.(key);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center">
      <div className="w-[var(--phone-width)] bg-white flex justify-around px-4 py-2 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`
                    flex flex-col items-center justify-center
                    text-sm
                    ${activeTab === tab.key ? "text-blue-500 font-semibold" : "text-gray-500"}
                `}
          >
            {tab.icon && <span className="mb-1">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
