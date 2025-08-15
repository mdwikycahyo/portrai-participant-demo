"use client";

import { useState, useEffect } from "react";

export function useTimer(initialTime: number = 10) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isCheckInEnabled, setIsCheckInEnabled] = useState(false);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsCheckInEnabled(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    timeLeft,
    isCheckInEnabled,
  };
}