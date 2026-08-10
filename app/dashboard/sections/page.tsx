"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import SectionFormFields from "@/components/dashboard/sections/section-form-fields";
import SectionsTable from "@/components/dashboard/sections/sections-table";
import ConfirmDialog from "@/components/ui/confirm-dialog";

const INITIAL_FORM_DATA: FormDataSection = {
  name: "",
  description: "",
  tone: "neutral",
  allowedTopics: "",
  blockedTopics: "",
  fallbackBehavior: "escalate",
};

const transformSectionRecord = (section: SectionRecord): Section => ({
  id: section.id,
  name: section.name,
  description: section.description,
  sourceCount: section.source_ids?.length || 0,
  source_ids: section.source_ids || [],
  tone: section.tone as Tone,
  scopeLabel: section.allowed_topics?.join(", ") || "General",
  allowed_topics: section.allowed_topics || [],
  blocked_topics: section.blocked_topics || [],
  status: section.status as SectionStatus,
});

const SectionPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [knowledgeSources, setKnowledgeSources] = useState<
    SectionKnowledgeSource[]
  >([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [formData, setFormData] = useState<FormDataSection>(INITIAL_FORM_DATA);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchKnowledgeSources = async () => {
      try {
        const res = await fetch("/api/knowledge/fetch");
        const data = await res.json();
        setKnowledgeSources(data.sources || []);
      } catch (error) {
        console.error("Failed to fetch knowledge sources:", error);
      } finally {
        setIsLoadingSources(false);
      }
    };

    fetchKnowledgeSources();
  }, []);

  const handleCreateSection = () => {
    setSelectedSection({
      id: "new",
      name: "",
      description: "",
      sourceCount: 0,
      tone: "neutral",
      scopeLabel: "",
      status: "draft",
    });
    setSelectedSources([]);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(true);
  };

  const handleViewSection = (section: Section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      description: section.description,
      tone: section.tone,
      allowedTopics: section.allowed_topics?.join(", ") || "",
      blockedTopics: section.blocked_topics?.join(", ") || "",
      fallbackBehavior: "escalate",
    });
    setSelectedSources(section.source_ids || []);
    setIsSheetOpen(true);
  };

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/section/fetch");
      if (!res.ok) throw new Error("Failed to load sections");
      const data: SectionRecord[] = await res.json();

      setSections(data.map(transformSectionRecord));
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setIsLoadingSections(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSections = async () => {
      try {
        const res = await fetch("/api/section/fetch");
        if (!res.ok) throw new Error("Failed to load sections");
        const data: SectionRecord[] = await res.json();
        if (isMounted) setSections(data.map(transformSectionRecord));
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      } finally {
        if (isMounted) setIsLoadingSections(false);
      }
    };

    loadSections();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSection = async () => {
    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) {
      toast.error("Please enter a section name.");
      return;
    }

    if (!description) {
      toast.error("Please enter a description.");
      return;
    }

    if (selectedSources.length === 0) {
      toast.error("Please select at least one knowledge source.");
      return;
    }

    setIsSaving(true);

    try {
      const sectionData = {
        ...formData,
        name,
        description,
        sourceIds: selectedSources,
        status: "active",
      };

      const response = await fetch("/api/section/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sectionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to create section.");
      }

      await fetchSections();

      setIsSheetOpen(false);
      toast.success("Section created successfully.");
    } catch (error) {
      console.error("Failed to save section:", error);
      toast.error("Failed to create section. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = async () => {
    setIsConfirmOpen(false);

    if (!selectedSection || selectedSection.id === "new") return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/section/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedSection.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to delete section.");
      }

      await fetchSections();

      setIsSheetOpen(false);
      toast.success("Section deleted successfully.");
    } catch (error) {
      console.error("Failed to delete section:", error);
      toast.error("Failed to delete section. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isPreviewMode = selectedSection?.id !== "new";
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Sections
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Define behavior and tone for different topics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateSection}
            className="bg-white text-black hover:bg-zinc-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Section
          </Button>
        </div>
      </div>

      <SectionsTable
        sections={sections}
        onSectionClick={handleViewSection}
        isLoading={isLoadingSections}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl border-l border-white/10 bg-[#0A0A0E] p-0 shadow-2xl flex flex-col h-full">
          {selectedSection && (
            <>
              <SheetHeader className="p-6 border-b border-white/5">
                <SheetTitle className="text-xl text-white">
                  {selectedSection.id === "new"
                    ? "Create Section"
                    : "View Section"}
                </SheetTitle>
                <SheetDescription className="text-zinc-500">
                  {selectedSection.id === "new"
                    ? "Configure how the AI behaves for this specific topic."
                    : "Review section configuration and data sources."}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-8  scroll-fade scrollbar-none  scroll-fade-none">
                <SectionFormFields
                  formData={formData}
                  setFormData={setFormData}
                  selectedSources={selectedSources}
                  setSelectedSources={setSelectedSources}
                  knowledgeSources={knowledgeSources}
                  isLoadingSources={isLoadingSources}
                  isDisabled={isPreviewMode}
                />
              </div>

              {selectedSection.id === "new" && (
                <div className="p-6 border-t border-white/5">
                  <Button
                    className={`w-full bg-white cursor-pointer font-semibold h-10 text-black hover:bg-zinc-200 ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleSaveSection}
                    disabled={isSaving}
                  >
                    {isSaving ? "Creating..." : "Create Section"}
                  </Button>
                </div>
              )}

              {selectedSection.id !== "new" && (
                <div className="p-6 bg-red-500/5 border-t border-red-500/10">
                  <h5 className="text-sm font-medium text-red-400 mb-1">
                    Danger Zone
                  </h5>
                  <p className="text-xs text-red-500/70 mb-3">
                    Deleting this section will remove all associated routing
                    rules.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={isSaving}
                    className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 shadow-none h-10"
                  >
                    {isSaving ? "Deleting..." : "Delete Section"}
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={`Delete section "${selectedSection?.name}"?`}
        description="This action cannot be undone. It will remove all associated routing rules."
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isSaving}
        onConfirm={handleDeleteSection}
      />
    </div>
  );
};

export default SectionPage;
