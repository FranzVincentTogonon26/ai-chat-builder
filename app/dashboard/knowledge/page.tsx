"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuickActions from "@/components/dashboard/knowledge/quick-actions";
import AddKnowledgeModal from "@/components/dashboard/knowledge/add-knowledge-modal";
import KnowledgeTable from "@/components/dashboard/knowledge/knowledge-table";
import SourceDetailsSheet from "@/components/dashboard/knowledge/source-details-sheet";

const KnowledgePage = () => {
  const [defaultTab, setDefaultTab] = useState("website");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [knowledgeStoringLoader, setKnowledgeStoringLoader] = useState(false);
  const [knowledgeSourcesLoader, setKnowledgeSourcesLoader] = useState(true);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    [],
  );
  const [selectedSource, setSelectedSource] = useState<KnowledgeSource | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSources = async () => {
      try {
        const res = await fetch("/api/knowledge/fetch");
        if (!res.ok) throw new Error("Failed to load sources");
        const data = await res.json();
        if (isMounted) setKnowledgeSources(data.sources ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setKnowledgeSourcesLoader(false);
      }
    };

    fetchSources();

    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (tab: string) => {
    setDefaultTab(tab);
    setIsAddOpen(true);
  };

  const handleImportSource = async (
    data: ImportData,
  ): Promise<string | null> => {
    setKnowledgeStoringLoader(true);

    try {
      let response;

      if (data.type === "upload" && data.file) {
        const formData = new FormData();
        formData.append("type", "upload");
        formData.append("file", data.file);

        response = await fetch("/api/knowledge/store", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/knowledge/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        let message = "Failed to store source";
        try {
          const body = await response.json();
          if (body?.error) message = body.error;
        } catch {
          // ignore parse failures
        }
        return message;
      }

      const res = await fetch("/api/knowledge/fetch");
      if (!res.ok) return "Failed to refresh knowledge sources";

      const newData = await res.json();

      setKnowledgeSources(newData.sources ?? []);
      setIsAddOpen(false);
      return null;
    } catch (error) {
      console.error(error);
      return "Failed to store source. Please try again.";
    } finally {
      setKnowledgeStoringLoader(false);
    }
  };

  const handleSourceClick = (source: KnowledgeSource) => {
    setSelectedSource(source);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your website, documents, and uploads here.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openModal("website")}
            className="bg-white text-black hover:bg-zinc-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Knowledge
          </Button>
        </div>
      </div>

      <QuickActions onOpenModal={openModal} />

      <KnowledgeTable
        sources={knowledgeSources}
        onSourceClick={handleSourceClick}
        isLoading={knowledgeSourcesLoader}
      />

      <AddKnowledgeModal
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
        onImport={handleImportSource}
        isLoading={knowledgeStoringLoader}
        existingSources={knowledgeSources}
      />

      <SourceDetailsSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        selectedSource={selectedSource}
      />
    </div>
  );
};

export default KnowledgePage;
