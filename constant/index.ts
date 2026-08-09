import {
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  FileText,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";

export interface InitialData {
  businessName: string;
  industry: string;
  description: string;
}

export const STEPS = [
  {
    id: "name",
    label: "Business name",
    question: "What is the name of your business?",
    description: "This will be the identity of your AI assistant",
    icon: Building2,
    placeholder: "e.g. Apple Corp.",
    type: "text",
    field: "businessName" as keyof InitialData,
  },
  {
    id: "industry",
    label: "Business industry",
    question: "What industry is your business in?",
    description: "This helps your AI assistant understand your business",
    icon: Briefcase,
    placeholder: "e.g. Technology, Healthcare, Finance",
    type: "text",
    field: "industry" as keyof InitialData,
  },
  {
    id: "description",
    label: "Business description",
    question: "What does your business do?",
    description: "Give your AI assistant some context about your business",
    icon: FileText,
    placeholder: "e.g. We build AI-powered software for businesses",
    type: "text",
    field: "description" as keyof InitialData,
  },
];

export const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Sections", href: "/dashboard/sections", icon: Layers },
  { label: "Chatbot", href: "/dashboard/chatbot", icon: Bot },
  {
    label: "Conversations",
    href: "/dashboard/conversations",
    icon: MessageSquare,
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const TONE_OPTIONS = [
  {
    value: "strict",
    label: "Strict",
    badge: "Fact-based",
    description: "Only answer if fully confident. No small talk.",
  },
  {
    value: "neutral",
    label: "Neutral",
    description: "Professional, concise, and direct.",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm and conversational. Good for general FAQ.",
  },
  {
    value: "empathetic",
    label: "Empathetic",
    description: "Support-first, apologetic, and calming.",
  },
];
