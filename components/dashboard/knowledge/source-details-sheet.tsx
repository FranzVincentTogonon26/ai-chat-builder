import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getStatusBadge, getTypeIcon } from "./knowledge-table";
import { Button } from "@/components/ui/button";

interface SourceDetailsSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSource: KnowledgeSource | null;
}

const SourceDetailsSheet = ({
  isOpen,
  setIsOpen,
  selectedSource,
}: SourceDetailsSheetProps) => {
  if (!selectedSource) return null;
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-3xl border-l border-white/10 bg-[#0A0A0E] p-0 shadow-2xl flex flex-col h-full">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-white/5">
            <SheetTitle className="text-xl text-white flex items-center gap-2">
              {getTypeIcon(selectedSource.type as SourceType)}
              {selectedSource.name}
            </SheetTitle>
            <SheetDescription className="text-zinc-500">
              {selectedSource.source_url || "Manual entry"}
            </SheetDescription>
            <div className="pt-3 flex gap-2 items-center ">
              {getStatusBadge(selectedSource.status as SourceStatus)}
              <span className="text-zinc-500  text-xs py-1 ">
                Updated{" "}
                {selectedSource.last_updated &&
                  new Date(selectedSource.last_updated).toLocaleDateString()}
              </span>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-zinc-300 text-sm font-medium uppercase tracking-wide">
                Content Preview
              </h4>
              <div className="p-4 rounded-lg border border-white/5 bg-black/40 font-mono text-xs overflow-hidden text-zinc-400 overflow-y-auto leading-relaxed">
                {selectedSource.content ||
                  `# ${selectedSource.name}\n\n ( No content preview available)`}
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-white/5 bg-[#050509] ">
            <Button
              variant="destructive"
              className="w-full bg-red-500/10  text-red-500 hover:bg-red-500/20 hover:text-red-300 h-10"
            >
              Disconnect Source
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SourceDetailsSheet;
