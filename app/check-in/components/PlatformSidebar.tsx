"use client";

import { PlatformSection } from "../types";

interface PlatformSidebarProps {
  activeSection: PlatformSection;
  onSectionChange: (section: PlatformSection) => void;
}

export function PlatformSidebar({
  activeSection,
  onSectionChange,
}: PlatformSidebarProps) {
  const handleSectionClick = (sectionId: PlatformSection, elementId: string) => {
    onSectionChange(sectionId);
    const element = document.getElementById(elementId);
    const container = document.querySelector(
      ".platform-scroll-area"
    ) as HTMLElement;
    if (element && container) {
      const elementTop = element.offsetTop - container.offsetTop;
      container.scrollTo({
        top: elementTop - 20,
        behavior: "smooth",
      });
    }
  };

  const sections = [
    { id: "home" as PlatformSection, label: "Home", elementId: "home-section" },
    { id: "chat" as PlatformSection, label: "Chat", elementId: "chat-section" },
    { id: "email" as PlatformSection, label: "Email", elementId: "email-section" },
    { id: "documents" as PlatformSection, label: "Documents", elementId: "documents-section" },
  ];

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-8">
        <nav className="space-y-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id, section.elementId)}
              className={`w-full text-left px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm hover:border hover:border-gray-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}