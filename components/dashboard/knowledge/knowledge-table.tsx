import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Search } from "lucide-react";
import React from "react";

const KnowledgeTable = ({
  sources,
  onSourceClick,
  isLoading,
}: KnowledgeTableProps) => {
  return (
    <Card className="border border-white/5 bg-[#0a0a0e]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-white">
            Sources
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                className="pl-9 h-9 w-[200px] md:w-[300px] bg-white/2 border-white/10 text-sm"
                placeholder="Search sources.."
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/5 hover:bg-transparent ">
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Name
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Type
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Last Updated
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 bg-white/5" />
                  </TableCell>
                </TableRow>
              ))
            ) : sources.length > 0 ? (
              sources.map((source, index) => <TableRow key={index}></TableRow>)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-zinc-500"
                >
                  No knowledge sources added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default KnowledgeTable;
