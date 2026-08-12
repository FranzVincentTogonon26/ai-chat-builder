"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatSimulator from "@/components/dashboard/chatbot/chat-simulator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ApperanceConfig from "@/components/dashboard/chatbot/appearance-config";
import EmbedCodeConfig from "@/components/dashboard/chatbot/embed-code-config";
import toast from "react-hot-toast";

const ChatbotPage = () => {
  const [metadata, setMetadata] = useState<ChatbotMetadata | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    const metaRes = await fetch("/api/chatbot/metadata/fetch");
    const metaData = await metaRes.json();

    const sectionsRes = await fetch("/api/section/fetch");
    const sectionsData = sectionsRes.ok ? await sectionsRes.json() : [];

    return { metaData, sectionsData };
  }, []);

  const applyData = (
    metaData: ChatbotMetadata | null,
    sectionsData: Section[],
  ) => {
    setMetadata(metaData);
    if (metaData) {
      setPrimaryColor(metaData.color || "#4f46e5");
      setWelcomeMessage(
        metaData.welcome_message || "Hi, How can I help you today?",
      );
      setMessages([
        {
          role: "assistant",
          content:
            metaData.welcome_message || "Hi, How can I help you today?",
          isWelcome: true,
          section: null,
        },
      ]);
    }
    setSections(sectionsData || []);
  };

  useEffect(() => {
    let cancelled = false;
    fetchData()
      .then(({ metaData, sectionsData }) => {
        if (cancelled) return;
        applyData(metaData, sectionsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      });

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    // setActiveSection(sectionName)
  };

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

  const handleReset = async () => {
    setActiveSection(null);
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
        isWelcome: true,
        section: null,
      },
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/chatbot/metadata/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          color: primaryColor,
          welcome_message: welcomeMessage,
        }),
      });

      if (res.ok) {
        const { metaData, sectionsData } = await fetchData();
        applyData(metaData, sectionsData);
        toast.success("Metadata successfully updated.");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = metadata
    ? primaryColor !== (metadata.color || "#4f46e5") ||
      welcomeMessage !==
        (metadata.welcome_message || "Hi, How can I help you today?")
    : false;

  return (
    <div className="flex h-dvh flex-col p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Chatbot Playground
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Test your assistant, customize appearance and deploy it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 ">
        <div className="lg:col-span-7 flex flex-col h-full min-h-0 space-y-4">
          <ChatSimulator
            messages={messages}
            primaryColor={primaryColor}
            sections={sections}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
            handleSectionClick={handleSectionClick}
            activeSection={activeSection}
            isTyping={isTyping}
            handleReset={handleReset}
            scrollRef={scrollViewportRef}
          />
        </div>

        <div className="lg:col-span-5 h-full min-h-0 overflow-hidden flex flex-col">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-8">
              <ApperanceConfig
                primaryColor={primaryColor}
                setPrimaryColor={setPrimaryColor}
                welcomeMessage={welcomeMessage}
                setWelcomeMessage={setWelcomeMessage}
                handleSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />

              <EmbedCodeConfig chatbotId={metadata?.id} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
