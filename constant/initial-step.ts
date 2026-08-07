import { Briefcase, Building2, FileText } from "lucide-react";

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
