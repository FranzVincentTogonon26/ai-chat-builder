import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";

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
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Name and Description
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Scope
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500 w-1">
                Sources
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Tone
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow
                  key={i}
                  className="border-white/5 hover:!bg-transparent"
                >
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5 hover:bg-white/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5 hover:bg-white/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5 hover:bg-white/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5 hover:bg-white/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5 hover:bg-white/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-15 bg-white/5 hover:bg-white/4" />
                  </TableCell>
                </TableRow>
              ))
            ) : sections.length > 0 ? (
              sections.map((section) => (
                <TableRow
                  key={section.id}
                  className="border border-white/5 hover:bg-white/2 group transition-colors"
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
                  <TableCell className="text-zinc-400 text-sm text-center">
                    {section.sourceCount}
                  </TableCell>
                  <TableCell>{getToneBadge(section.tone)}</TableCell>
                  <TableCell className="capitalize text-zinc-400 text-sm">
                    <Badge
                      variant="default"
                      className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none"
                    >
                      {section.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-zinc-400">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-zinc-400 hover:text-white hover:bg-white/2"
                      onClick={() => onSectionClick(section)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-transparent">
                <TableCell
                  colSpan={6}
                  className="h-32  text-center text-zinc-500"
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
