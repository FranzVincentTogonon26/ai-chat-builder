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
  allowed_topics?: string;
  blocked_topics?: string;
  status: SectionStatus;
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