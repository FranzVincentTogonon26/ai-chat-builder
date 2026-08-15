"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle, Bot, MessageCircle, Send, User, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const EmbedPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [metadata, setMetadata] = useState<ChatbotMetadata | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const primaryColor = metadata?.color || "#4f46e5";

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    document.documentElement.style.backgroundColor = "transparent";

    if (typeof window !== "undefined") {
      window.parent.postMessage(
        {
          type: "resize",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
        },
        "*",
      );
    }
  }, []);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      window.parent.postMessage(
        {
          type: "resize",
          width: "380px",
          height: "520px",
          borderRadius: "12px",
        },
        "*",
      );
    } else {
      window.parent.postMessage(
        {
          type: "resize",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
        },
        "*",
      );
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/widget/config?token=${token}`);
        if (!res.ok) throw new Error("Failed to load Widget configurations");

        const data = await res.json();
        setMetadata(data.metadata);
        setSections(data.sections || []);

        setMessages([
          {
            role: "assistant",
            content: data.metadata.welcome_message || "Hi! How can I help you?",
            isWelcome: true,
            section: null,
          },
        ]);
      } catch (error) {
        console.error(error);
        setError("Unable to load chat. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [token]);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSectionClick = async (sectionName: string) => {
    setActiveSection(sectionName);
    const userMsg: ChatMessage = {
      role: "user",
      content: sectionName,
      section: null,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: `You can ask me any question related to "${sectionName}"`,
        section: sectionName,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentSection = sections.find((s) => s.name === activeSection);
    const sourceIds = currentSection?.source_ids || [];

    const userMsg: ChatMessage = {
      role: "user",
      content: input,
      section: activeSection,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messagesRef.current, userMsg],
          knowledge_source_ids: sourceIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            section: null,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please try again.",
            section: null,
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#050509] text-red-600 border border-red-600 p-10 rounded-lg">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Missing session token</p>
      </div>
    );
  }

  if (loading) return null;
  if (error && isOpen) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#050509] text-red-600 border border-red-600 p-10 rounded-lg">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        style={{ backgroundColor: primaryColor }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition-all text-white"
        onClick={toggleOpen}
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0E] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0E0E12] shadow-sm shrink-0 z-20 gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8" />
            </div>
            <div className="absolute bottom-0 -right-0.5 w-2.5 h-2.5 bg-emerald-600 rounded-full border border-white"></div>
          </div>
          <div className="flex flex-col leading-none space-y-1">
            <h1 className="text-sm font-semibold text-white leading-none">
              Support
            </h1>
            <span className="text-[11px] text-emerald-400 font-medium">
              Online
            </span>
          </div>
        </div>
        <button
          onClick={toggleOpen}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Minimize Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <ScrollArea className="min-h-0 flex-1 p-6 relative bg-zinc-950/30">
        <div className="space-y-6 pb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                `flex w-full flex-col`,
                msg.role === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  `flex max-w-[80%] gap-3 `,
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    `w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5`,
                    msg.role === "user" ? "bg-zinc-800" : "text-white",
                  )}
                  style={
                    msg.role !== "user" ? { backgroundColor: primaryColor } : {}
                  }
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="absolute bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full  border border-white"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className={cn(
                      `p-4 rounded-xl text-sm leading-relaxed shadow-sm `,
                      msg.role === "user"
                        ? "bg-zinc-800 text-zinc-200 rounded-tr-xs"
                        : "bg-white text-zinc-900 rounded-tl-xs ",
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.isWelcome && sections.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section.name)}
                          className="px-3 py-1.5 rounded-full border border-zinc-600 text-white text-xs bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          {section.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[80%] gap-3 flex-row">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="absolute bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full  border border-white"></div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white text-zinc-900 rounded-tl-sm shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollViewportRef} />
        </div>
      </ScrollArea>
      <div className="p-4 bg-[#0A0A0E] border-t border-white/5">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!activeSection}
            placeholder={
              activeSection
                ? "Type a message.."
                : "Select a category to start.."
            }
            className="min-h-12.5 max-h-37.5 pr-12 outline-none  border-white/5 bg-[#0A0A0E] disabled:bg-[#0A0A0E] text-white resize-none overflow-hidden"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!activeSection || !input.trim() || isTyping}
            className={cn(
              `absolute right-2 bottom-2 h-8 w-8 transition-colors`,
              !activeSection || !input.trim() || isTyping
                ? "bg-zinc-800 text-zinc-500"
                : "",
            )}
            style={
              activeSection && input.trim() && !isTyping
                ? { backgroundColor: primaryColor }
                : {}
            }
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 text-center">
          <Link
            href={"/"}
            className="text-[10px] text-zinc-600 font-medium hover:text-zinc-500 transition-colors"
          >
            Powered by Chatbot Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EmbedPage />
    </Suspense>
  );
}
