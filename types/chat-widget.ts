/**
 * Chat Widget Configuration Interface
 *
 * Props for configuring the reusable chat widget component.
 * Supports custom branding for Hashtag Tech and Devmate Solutions.
 */
export interface ChatWidgetConfig {
  /** Company name displayed in the widget header */
  companyName: string;
  /** Company logo URL (optional - defaults to Hashtag Tech logo) */
  companyLogo?: string;
  /** Primary brand color (hex or CSS color) - defaults to Hashtag Tech red */
  primaryColor?: string;
  /** Agent/Support representative name */
  agentName: string;
  /** Agent avatar URL */
  agentAvatar: string;
  /** Welcome message displayed when chat opens */
  welcomeMessage: string;
  /** Whether video call button is enabled (default: false) */
  enableVideoCall?: boolean;
  /** Video call URL (if enabled) */
  videoCallUrl?: string;
}

/**
 * Chat Message Interface
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: "agent" | "user";
  timestamp: Date;
}

/**
 * Default Hashtag Tech chat configuration
 */
export const defaultHashtagTechConfig: ChatWidgetConfig = {
  companyName: "Hashtag Tech",
  companyLogo: "/logo-horizontal.webp",
  primaryColor: "#F26B6B",
  agentName: "Sarah",
  agentAvatar: "/images/agents/sarah.jpg",
  welcomeMessage: "Hi! How can I help you today?",
  enableVideoCall: false,
};

/**
 * Default Devmate Solutions chat configuration
 */
export const defaultDevmateConfig: ChatWidgetConfig = {
  companyName: "Devmate Solutions",
  companyLogo: "/logo-horizontal.webp",
  primaryColor: "#F26B6B",
  agentName: "Alex",
  agentAvatar: "/images/agents/alex.jpg",
  welcomeMessage: "Welcome to Devmate Solutions! How can we assist you?",
  enableVideoCall: false,
};
