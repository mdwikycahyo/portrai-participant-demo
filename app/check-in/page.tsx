"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TabType } from "./types";
import { CheckInHeader } from "./components/CheckInHeader";
import { CheckInTabs } from "./components/CheckInTabs";
import { CompatibilityTab } from "./components/CompatibilityTab";
import { SimulationTab } from "./components/SimulationTab";
import { PlatformTab } from "./components/PlatformTab";
import { useDeviceChecking } from "./hooks/useDeviceChecking";
import { useTimer } from "./hooks/useTimer";
import { useScrollDetection } from "./hooks/useScrollDetection";
import { AssessmentAssistantProvider } from "@/contexts/assessment-assistant-context";

export default function CheckInPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("compatibility");
  const [hasReadSimulation, setHasReadSimulation] = useState(false);
  const [hasReadPlatform, setHasReadPlatform] = useState(false);

  // Custom hooks
  const { timeLeft, isCheckInEnabled } = useTimer(10);
  const {
    isChecking,
    componentStates,
    isCompatibilityComplete,
    handleCheckDevice,
  } = useDeviceChecking();
  const { activeSection, setActiveSection } = useScrollDetection(activeTab);

  // Check if all tabs are completed
  const allTabsCompleted = isCompatibilityComplete && hasReadSimulation && hasReadPlatform;

  const handleCheckIn = () => {
    // Only allow check-in if timer has finished and all tabs are completed
    if (!isCheckInEnabled || !allTabsCompleted) return;
    // Simulate starting the assessment by navigating to the home page
    router.push("/home");
  };

  // Auto-start checking on page load
  useEffect(() => {
    // Start compatibility checking automatically
    handleCheckDevice();
  }, [handleCheckDevice]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "compatibility":
        return (
          <CompatibilityTab
            componentStates={componentStates}
            isChecking={isChecking}
            onCheckDevice={handleCheckDevice}
          />
        );
      case "simulation":
        return (
          <SimulationTab
            hasReadSimulation={hasReadSimulation}
            onReadSimulationChange={setHasReadSimulation}
          />
        );
      case "platform":
        return (
          <PlatformTab
            hasReadPlatform={hasReadPlatform}
            onReadPlatformChange={setHasReadPlatform}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AssessmentAssistantProvider>
      <div className="flex flex-col h-screen mx-auto px-6 py-6 bg-gray-50">
        <CheckInHeader
          timeLeft={timeLeft}
          isCheckInEnabled={isCheckInEnabled}
          allTabsCompleted={allTabsCompleted}
          onCheckIn={handleCheckIn}
        />

        <CheckInTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCompatibilityComplete={isCompatibilityComplete}
          hasReadSimulation={hasReadSimulation}
          hasReadPlatform={hasReadPlatform}
        />

        {/* Main content */}
        <main className="flex-grow bg-white rounded-lg shadow-sm p-4 flex flex-col">
          {renderTabContent()}
        </main>
      </div>
    </AssessmentAssistantProvider>
  );
}