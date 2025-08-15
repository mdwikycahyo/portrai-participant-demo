"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { PlatformSection } from "../types";
import { PlatformSidebar } from "./PlatformSidebar";
import { PlatformContent } from "./PlatformContent";

interface PlatformTabProps {
  hasReadPlatform: boolean;
  onReadPlatformChange: (checked: boolean) => void;
  activeSection: PlatformSection;
  onSectionChange: (section: PlatformSection) => void;
}

export function PlatformTab({
  hasReadPlatform,
  onReadPlatformChange,
  activeSection,
  onSectionChange,
}: PlatformTabProps) {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2 py-2">
        <h1 className="text-xl font-bold text-gray-800">Platform</h1>
        <div className="max-w-md">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="platform-reading-agreement"
              checked={hasReadPlatform}
              onCheckedChange={(checked) =>
                onReadPlatformChange(checked === true)
              }
              className="h-5 w-5"
            />
            <label
              htmlFor="platform-reading-agreement"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              I have read and understood the platform tutorial
            </label>
          </div>
        </div>
      </div>

      {/* Platform content with sidebar and main area */}
      <div className="flex-grow flex bg-white rounded-lg overflow-hidden border border-gray-200">
        <PlatformSidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <PlatformContent />
      </div>
    </div>
  );
}