// Define component states
export type ComponentStatus = "pending" | "checking" | "compatible";

export interface ComponentState {
  camera: ComponentStatus;
  mic: ComponentStatus;
  speaker: ComponentStatus;
  os: ComponentStatus;
  browser: ComponentStatus;
}

export type TabType = "compatibility" | "simulation" | "platform";

export type PlatformSection = "home" | "chat" | "email" | "documents";

export interface ComponentDisplay {
  icon: string;
  statusText: string;
  statusColor: string;
  iconColor: string;
}