"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { SIDEBAR_ITEMS } from "@/constant";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

interface Metadata {
  business_name: string;
}

const Sidebar = () => {
  const pathname = usePathname();
  const { email } = useUser();

  const [metadata, setMetadata] = useState<Metadata>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/metadata/fetch");

        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }

        const result = await response.json();
        setMetadata(result.data);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/5 bg-[#050509]">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-white/5 px-6">
        <Link href={"/"} className="flex items-center gap-2">
          {/* Logo */}
          <div className="h-7 w-7 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              aria-label="agent robot"
              viewBox="0 0 170 154"
              className="h-full w-full"
            >
              <path d="M76.4 10.4c-2.9 2.9-3.4 4.1-3.4 7.9 0 4.9 3.2 10 7 11.2 1.8.6 2 1.6 2 8.5v7.9l-20.8.3-20.9.3-4.9 3a24 24 0 0 0-11.1 17.8c-.5 5.3-.7 5.5-3.8 6q-7.2 1.2-10.6 8c-1.8 3.4-2 5.5-1.7 14.8.2 9 .6 11.2 2.4 13.6 2.8 3.8 8.1 7.3 11 7.3 2.2 0 2.4.4 2.4 5.1 0 10.2 4.3 17.9 12.3 22.2 4.1 2.2 5.1 2.2 45.2 2.5 46.2.4 48.9.1 55.5-5.5 5.6-4.8 8-10.2 8-17.9v-6.1l3.8-.7c4.6-.7 8.6-3.6 11-7.9 2.6-4.9 2.4-23-.3-27.6a16 16 0 0 0-10.6-8c-3.3-.7-3.4-.8-4.1-6.8-.8-7-2.4-10.6-6.5-14.5-5.2-5-9.6-5.8-31.4-5.8H87v-7.8c0-7.4.1-7.9 2.5-9 3.2-1.5 6.5-6.8 6.5-10.5 0-3.6-2.3-8.1-5.2-10.1-1.2-.9-4.2-1.6-6.6-1.6-3.7 0-5 .6-7.8 3.4M89 14c5.8 5.8-3.1 14.9-9.2 9.3-2.2-2-2.3-7-.1-9.5 2.1-2.4 6.8-2.3 9.3.2m42 39.2a14 14 0 0 1 6.8 6.8c2.1 4.3 2.2 5.2 2.2 36.1 0 20.1-.4 32.8-1.1 34.6q-2.4 6.1-9.4 9.4c-3.7 1.7-7.3 1.9-45 1.9s-41.3-.2-45-1.9a15 15 0 0 1-9-9.4c-1.2-3-1.5-9-1.5-34.2 0-33.2.2-34.7 5.6-39.6 6.5-6 5.3-5.8 50.4-5.9 41.2 0 41.6 0 46 2.2M24 95.1v17.1l-2.7-.6c-1.6-.4-4-2-5.5-3.7-2.7-2.8-2.8-3.4-2.8-13V84.8l3.4-3.4c1.9-1.9 4.3-3.4 5.5-3.4 2.1 0 2.1.4 2.1 17.1m129.3-14.2c3.4 3.4 4.8 15.6 2.6 23.4-1.1 3.9-5.6 7.7-9.1 7.7-1.6 0-1.8-1.5-1.8-17.1V77.7l3.2.7c1.8.4 4.1 1.5 5.1 2.5" />
              <path d="M52.3 79c-4.1 2.5-5.3 4.8-5.3 10.5 0 4 .5 5.2 3.4 8.1s4.1 3.4 8.3 3.4c5.5 0 8.6-1.7 10.8-6a12.1 12.1 0 0 0-17.2-16M64 84c1.2 1.2 2 3.3 2 5.3 0 8.3-11.1 9.8-14.1 1.9-1-2.5 1-7.6 3.3-8.5 2.9-1.2 6.9-.6 8.8 1.3m39.2-5a13 13 0 0 0-5.7 12.6c.9 4.8 6.5 9.4 11.6 9.4q8.3 0 11.4-6.6 3.8-8-3-14.2-6.5-5.8-14.3-1.2m11.5 5.2c3.8 3.6 2.9 8.9-1.9 11.4-3.5 1.8-6.1 1.1-8.8-2.3-2.5-3.3-2.5-5.4.1-8.7s7.3-3.5 10.6-.4m-51.5 36 .3 2.3h42l.3-2.3.3-2.2H62.9z" />
            </svg>
          </div>

          <span className="text-center text-base font-medium tracking-tight text-white/90">
            Chatbot Support
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/5 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />

              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Workspace */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="group flex w-full items-center gap-3 rounded-md transition-colors hover:bg-white/5">
          {/* Avatar */}
          <div className="flex h-8 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800">
            <span className="text-xs text-zinc-400 transition-colors group-hover:text-white">
              {metadata?.business_name?.slice(0, 2).toUpperCase() || "</>"}
            </span>
          </div>

          {/* Workspace information */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="block truncate text-sm font-medium text-zinc-300">
              {isLoading
                ? "Loading..."
                : `${metadata?.business_name || "Workspace"}'s Workspace`}
            </span>

            <span className="block truncate text-xs text-zinc-500">
              {email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
