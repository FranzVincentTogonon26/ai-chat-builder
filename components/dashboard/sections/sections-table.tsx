import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getToneBadge = (tone: Tone) => {
  const styles = {
    strict: "bg-red-500/10 text-red-500 border-red-500/20",
    neutral: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    friendly: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    empathetic: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  return (
    <Badge
      variant="secondary"
      className={`capitalize shadow-none ${styles[tone]}`}
    >
      {tone}
    </Badge>
  );
};

const SectionsTable = ({
  sections,
  onSectionClick,
  isLoading,
}: SectionsTableProps) => {
  return (
    <Card className="border border-white/5 bg-[#0A0A0E]">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-white">
          Sections
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Name
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Scope
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Sources
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Tone
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-12 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 bg-white/5" />
                  </TableCell>
                </TableRow>
              ))
            ) : sections.length > 0 ? (
              sections.map((section) => (
                <TableRow
                  key={section.id}
                  className="border-b border-white/5 hover:bg-transparent cursor-pointer group transition-colors"
                  onClick={() => onSectionClick(section)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-200 group-hover:text-white">
                        {section.name}
                      </span>
                      <span className="text-xs text-zinc-500 font-normal truncate max-w-[24rem]">
                        {section.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">
                    {section.scopeLabel}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">
                    {section.sourceCount}
                  </TableCell>
                  <TableCell>{getToneBadge(section.tone)}</TableCell>
                  <TableCell className="capitalize text-zinc-400 text-sm">
                    {section.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-transparent">
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-zinc-500"
                >
                  No sections yet. Create one to define AI behavior for a topic.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SectionsTable;
