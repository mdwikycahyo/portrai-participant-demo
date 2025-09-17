"use client";

import { TabType } from "../types";

interface CheckInTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isCompatibilityComplete: boolean;
  hasReadSimulation: boolean;
  hasReadPlatform: boolean;
}

export function CheckInTabs({
  activeTab,
  onTabChange,
  isCompatibilityComplete,
  hasReadSimulation,
  hasReadPlatform,
}: CheckInTabsProps) {
  const tabs = [
    {
      id: "compatibility" as TabType,
      label: "Compatibility",
      isCompleted: isCompatibilityComplete,
    },
    {
      id: "simulation" as TabType,
      label: "Prework",
      isCompleted: hasReadSimulation,
    },
    {
      id: "platform" as TabType,
      label: "Platform",
      isCompleted: hasReadPlatform,
    },
  ];

  return (
    <div className="mb-2">
      <div className="flex border-b border-gray-200 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-4 flex items-center ${
              activeTab === tab.id
                ? "border-b-2 border-purple-500 text-purple-500 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span
              className={`material-icons align-middle mr-2 ${
                tab.isCompleted ? "text-green-500" : ""
              }`}
            >
              {tab.isCompleted ? "check_circle" : "radio_button_unchecked"}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}