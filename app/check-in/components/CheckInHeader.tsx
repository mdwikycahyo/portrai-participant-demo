"use client";

import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";

interface CheckInHeaderProps {
  timeLeft: number;
  isCheckInEnabled: boolean;
  allTabsCompleted: boolean;
  onCheckIn: () => void;
}

export function CheckInHeader({
  timeLeft,
  isCheckInEnabled,
  allTabsCompleted,
  onCheckIn,
}: CheckInHeaderProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <header className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        {/* Timer icon */}
        <div className="text-blue-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">Assessment starts in:</p>
          <p
            className={`text-2xl font-mono font-bold tracking-wider ${
              timeLeft === 0 ? "text-green-600" : "text-gray-900"
            }`}
          >
            00:00:{formatTime(timeLeft).split(":")[1]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onCheckIn}
          disabled={!isCheckInEnabled || !allTabsCompleted}
          className={`font-semibold py-2 px-6 rounded-lg transition-colors ${
            isCheckInEnabled && allTabsCompleted
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          Mulai Assessment
        </Button>
        {/* Vertical separator */}
        <div className="h-8 w-px bg-gray-300"></div>
        <UserProfileDropdown
          showWorkHourBanner={false}
          onToggleWorkHourBanner={() => {}}
          showAssessmentReminderBanner={false}
          onToggleAssessmentReminderBanner={() => {}}
        />
      </div>
    </header>
  );
}