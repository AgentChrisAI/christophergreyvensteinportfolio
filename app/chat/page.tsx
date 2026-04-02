"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import ChatMessage from "@/components/ChatMessage";
import ObservabilityPanel from "@/components/ObservabilityPanel";
import SuggestedPrompts from "@/components/SuggestedPrompts";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TraceData {
  mode?: string;
  modeLabel?: string;
  modelUsed?: string;
  pineconeHits?: number;
  diagramRetries?: number;
  latencyMs?: number;
  steps?: { step: string; detail?: string; ts: number }[];
  error?: string;
}

const WELCOME_MESSAGE = `## Hey, I'm Christopher's AI Systems Assistant.

I'm here to show you how Christopher thinks, designs, and validates automation systems — not just what he's built.

**A few things I can help with:**
- **Career questions** — projects, experience, outcomes
- **Process Breakdown** — break any problem into inputs, outputs, business process, and automation plan
- **System Design** — architecture, tools, workflow logic for any automation challenge
- **Risk Analysis** — failure modes, hallucination risks, control mechanisms
- **Impact Estimator** — ROI, time saved, cost impact
- **Test Case Generator** — component, integration, and E2E test suites
- **Plain English Explainer** — translate technical systems for stakeholders

Try one of the prompts below, or ask me anything.`;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [trace, setTrace] = useState<TraceData | null>(null);
  const [showObs, setShowObs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMessage: Message = { role: "user", content: text };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setTrace(data.trace);
        setMessages([
          ...nextMessages,
          { role: "assistant", content: data.text },
        ]);
        setShowObs(true);
      } catch {
        setMessages([
          ...nextMessages,
          {
            role: "assistant",
            content: "Something went wrong on my end. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const showWelcome = messages.length === 1 && messages[0].role === "assistant";

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors text-xs mr-1">
              ← Portfolio
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              CG
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                Christopher Greyvenstein
              </h1>
              <p className="text-xs text-slate-500">
                AI & Automation Specialist — Career Intelligence Agent
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowObs(!showObs)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              showObs
                ? "border-violet-600/60 bg-violet-900/20 text-violet-400"
                : "border-slate-700 text-slate-500 hover:text-slate-300"
            }`}
          >
            {showObs ? "Hide" : "Show"} Trace
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 flex flex-col gap-4 pb-4">
        {/* Observability panel */}
        {showObs && (
          <div className="mt-4">
            <ObservabilityPanel trace={trace} />
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 pt-4">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              index={i}
            />
          ))}

          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                CG
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts on welcome state */}
        {showWelcome && (
          <div className="py-2">
            <SuggestedPrompts onSelect={(p) => sendMessage(p)} />
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 pt-2 pb-4 bg-slate-950">
          <div className="flex gap-2 items-end rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur px-4 py-3 focus-within:border-violet-600/50 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Christopher's experience, or describe a process to analyse..."
              rows={1}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none outline-none leading-relaxed max-h-40"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-center text-slate-700 text-[10px] mt-2">
            Powered by Claude & GPT-4o via OpenRouter · Pinecone RAG · Built by Christopher Greyvenstein
          </p>
        </div>
      </div>
    </div>
  );
}
