import {
  ArrowRight,
  Check,
  FileText,
  Globe,
  Loader2,
  MoreHorizontal,
  Plus,
  Upload,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import EmbedCodeConfig from "./chatbot/embed-code-config";

type SectionSummary = {
  name: string;
  sourceCount: number;
  tone: string;
};

type OverviewData = {
  botId: string | null;
  knowledge: { website: number; uploads: number; text: number; total: number };
  sections: { total: number; list: SectionSummary[] };
  chats: { title: string; snippet: string; time: string }[];
  counts: { knowledge: number; sections: number; conversations: number };
};

const DashboardOverview = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/overview")
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching overview data:", err);
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center text-zinc-500 h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { knowledge, sections, chats, counts } = data;

  const setupSteps = [
    {
      label: "Website Scanned",
      complete: true,
      href: "#",
    },
    {
      label: "Knowledge Added",
      complete: counts.knowledge > 0,
      href: "/dashboard/knowledge",
    },
    {
      label: "Sections Configured",
      complete: counts.sections > 0,
      href: "/dashboard/sections",
    },
    {
      label: "Widget Installed",
      complete: counts.conversations > 0,
      href: "#widget",
    },
  ];

  return (
    <div className="flex h-dvh flex-col p-6 md:p-8 space-y-8 max-w-7xl mx-auto ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            An intelligent chatbot designed to understand customer needs and
            provide fast, relevant, and helpful answers.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 max-w-7xl animate-in fade-in duration-500">
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-white">Setup Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {setupSteps.map((step, i) => (
              <Link key={i} href={step.href} className="block group">
                <Card
                  className={cn(
                    "border-white/5 bg-white/2 hover:bg-white/4 transition-colors",
                    step.complete
                      ? "opacity-60"
                      : "border border-indigo-500/30 hover:bg-indigo-500/10",
                  )}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        step.complete ? "text-zinc-500" : "text-white",
                      )}
                    >
                      {step.label}
                    </span>
                    {step.complete ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-white/5 bg-[#0A0A0E]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium text-white">
                  Knowledge Base
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/12"
                >
                  <Link href={"/dashboard/knowledge"}>Manage Sources</Link>
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-zinc-500 font-medium">
                      Pages
                    </span>
                  </div>
                  <span className="text-2xl font-semibold text-white">
                    {knowledge.website || 0}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-zinc-500 font-medium">
                      Manual Texts
                    </span>
                  </div>
                  <span className="text-2xl font-semibold text-white">
                    {knowledge.text || 0}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-zinc-500 font-medium">
                      Uploads
                    </span>
                  </div>
                  <span className="text-2xl font-semibold text-white">
                    {knowledge.uploads || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-[#0A0A0E] min-h-90">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium text-white">
                    Sections
                  </CardTitle>
                  <CardDescription className="">
                    Configure behavior for different topics
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-white text-black hover:bg-zinc-200"
                >
                  <Link
                    href={"/dashboard/sections"}
                    className="flex justify-center items-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    Create Section
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {sections.list.length === 0 ? (
                    <div className="p-6 text-center text-sm text-zinc-500">
                      No sections configured yet.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-white/2 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                        <div className="col-span-5">Name</div>
                        <div className="col-span-3">Sources</div>
                        <div className="col-span-3">Tone</div>
                        <div className="col-span-1"></div>
                      </div>
                      {sections.list.map((section: SectionSummary, i: number) => (
                        <div
                          key={i}
                          className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 items-center hover:bg-white/2 transition-colors last:border-0 group"
                        >
                          <div className="col-span-5 text-sm font-medium text-zinc-200">
                            {section.name}
                          </div>
                          <div className="col-span-3 text-sm text-zinc-500">
                            {section.sourceCount} sources
                          </div>
                          <div className="col-span-3">
                            <Badge
                              variant="secondary"
                              className="bg-white/5 text-zinc-400 hover:bg-white/10 border-white/5 rounded-md font-normal"
                            >
                              {section.tone}
                            </Badge>
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => router.push("/dashboard/sections")}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border border-white/5 bg-[#0A0A0E] min-h-80">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-white">
                    Recent Chats
                  </CardTitle>
                  <Link
                    href={"/dashboard/conversations"}
                    className="text-xs text-zinc-500 hover:text-white flex justify-center items-center gap-3 transition-colors"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <div className="space-y-1">
                  {chats.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">
                      No chats yet..
                    </div>
                  ) : (
                    chats.map((chat, i: number) => (
                      <Link
                        key={i}
                        href={"/dashboard/conversations"}
                        className="block p-3 rounded-lg hover:bg-white/3 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                            {chat.title}
                          </span>
                          <span className="text-[10px] text-zinc-600 whitespace-nowrap ml-2">
                            {chat.time}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-1">
                          {chat.snippet}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <EmbedCodeConfig chatbotId={data.botId ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
