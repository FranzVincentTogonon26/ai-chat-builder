type SourceType = "website" | "docs" | "upload" | "text";
type SourceStatus = "active" | "training" | "error" | "excluded";

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
