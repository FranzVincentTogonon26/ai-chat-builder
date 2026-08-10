"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatSimulator from "@/components/dashboard/chatbot/chat-simulator";

const ChatbotPage = () => {
  const [metadata, setMetadata] = useState<ChatbotMetadata | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {};
  const handleKeyDown = async () => {};
  const handleSectionClick = async () => {};
  const handleReset = async () => {};

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 ">
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
      </div>
    </div>
  );
};

export default ChatbotPage;
