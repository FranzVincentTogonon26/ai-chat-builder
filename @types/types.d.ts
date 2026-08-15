type SourceType = "website" | "docs" | "upload" | "text";
type SourceStatus = "active" | "training" | "error" | "excluded";

// Knowledge

interface KnowledgeSource {
  id: string;
  user_email: string;
  type: string;
  name: string;
  status: string;
  source_url: string | null;
  content: string | null;
  meta_data: string | null;
  last_updated: string | null;
  created_at: string | null;
}

type ImportData = {
  type: string;
  url?: string;
  title?: string;
  content?: string;
  file?: File;
};

interface KnowledgeTableProps {
  sources: KnowledgeSource[];
  onSourceClick: (source: KnowledgeSource) => void;
  isLoading: boolean;
}

// Sections

type SectionStatus = "active" | "draft" | "disabled";
type Tone = "strict" | "neutral" | "friendly" | "empathetic";

interface Section {
  id: string;
  name: string;
  description: string;
  sourceCount: number;
  source_ids?: string[];
  tone: Tone;
  scopeLabel: string;
  allowed_topics?: string[];
  blocked_topics?: string[];
  status: SectionStatus;
}

interface SectionRecord {
  id: string;
  name: string;
  description: string;
  source_ids: string[] | null;
  tone: string;
  allowed_topics: string[] | null;
  blocked_topics: string[] | null;
  status: string;
}

interface SectionsTableProps {
  sections: Section[];
  onSectionClick: (section: Section) => void;
  isLoading: boolean;
}

interface SectionKnowledgeSource {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface FormDataSection {
  name: string;
  description: string;
  tone: Tone;
  allowedTopics: string;
  blockedTopics: string;
  fallbackBehavior: string;
}

// Chatbot

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
  isWelcome?: boolean;
  section: string | null;
}

interface ChatbotMetadata {
  id: string;
  user_email: string;
  color: string;
  welcome_message: string;
  created_at: string;
  source_ids: string[];
}

// Settings

interface OrganizationData {
  id: string;
  business_name: string;
  website_url: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  user_email: string;
  image?: string;
  role?: string;
  status?: string;
}

//  Conversations

interface Conversation {
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  email?: string;
  visitor_ip?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}
