"use client";

import { useState, useEffect } from "react";
import { PlatformSection, TabType } from "../types";

export function useScrollDetection(activeTab: TabType) {
  const [activeSection, setActiveSection] = useState<PlatformSection>("home");

  // Scroll detection for platform tab
  useEffect(() => {
    if (activeTab !== "platform") return;

    const handleScroll = () => {
      const container = document.querySelector(".platform-scroll-area") as HTMLElement;
      if (!container) return;

      const sections = [
        "home-section",
        "chat-section",
        "email-section",
        "documents-section",
      ];
      const sectionIds: PlatformSection[] = ["home", "chat", "email", "documents"];

      // Check if scrolled to bottom
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

      if (isAtBottom) {
        setActiveSection("documents");
        return;
      }

      let currentSection: PlatformSection = "home";
      const containerRect = container.getBoundingClientRect();
      const containerMiddle = containerRect.top + containerRect.height / 2;

      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is visible in the container's viewport
          if (rect.top <= containerMiddle && rect.bottom >= containerRect.top) {
            currentSection = sectionIds[index];
          }
        }
      });

      setActiveSection(currentSection);
    };

    const contentArea = document.querySelector(".platform-scroll-area");
    if (contentArea) {
      contentArea.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();

      return () => contentArea.removeEventListener("scroll", handleScroll);
    }
  }, [activeTab]);

  return {
    activeSection,
    setActiveSection,
  };
}