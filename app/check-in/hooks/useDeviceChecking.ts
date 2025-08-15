"use client";

import { useState, useCallback, useRef } from "react";
import { ComponentState } from "../types";

export function useDeviceChecking() {
  const [isChecking, setIsChecking] = useState(false);
  const [componentStates, setComponentStates] = useState<ComponentState>({
    camera: "pending",
    mic: "pending",
    speaker: "pending",
    os: "pending",
    browser: "pending",
  });
  const [isCompatibilityComplete, setIsCompatibilityComplete] = useState(false);
  const checkingRef = useRef(false);

  const handleCheckDevice = useCallback(async () => {
    if (checkingRef.current) return; // Prevent multiple simultaneous checks
    
    checkingRef.current = true;
    setIsChecking(true);
    setIsCompatibilityComplete(false);

    // Reset all components to pending
    setComponentStates({
      camera: "pending",
      mic: "pending",
      speaker: "pending",
      os: "pending",
      browser: "pending",
    });

    // Start all components checking simultaneously
    const components = ["camera", "mic", "speaker", "os", "browser"] as const;

    // Set all components to checking state immediately
    setComponentStates({
      camera: "checking",
      mic: "checking",
      speaker: "checking",
      os: "checking",
      browser: "checking",
    });

    // Create parallel promises for each component with different completion times
    const componentPromises = components.map((component) => {
      // Stagger completion times slightly (1-3 seconds) for visual variety
      const completionTime = 1000 + Math.random() * 2000; // 1-3 seconds

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setComponentStates((prev) => ({
            ...prev,
            [component]: "compatible",
          }));
          resolve();
        }, completionTime);
      });
    });

    // Wait for all components to complete
    await Promise.all(componentPromises);

    checkingRef.current = false;
    setIsChecking(false);
    setIsCompatibilityComplete(true);
  }, []);

  return {
    isChecking,
    componentStates,
    isCompatibilityComplete,
    handleCheckDevice,
  };
}