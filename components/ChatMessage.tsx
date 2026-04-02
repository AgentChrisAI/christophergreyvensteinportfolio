"use client";

import { useMemo } from "react";
import MermaidRenderer from "./MermaidRenderer";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  index: number;
}

function parseContent(content: string): Array<{ type: "text" | "mermaid"; value: string }> {
  const parts: Array<{ type: "text" | "mermaid"; value: string }> = [];
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "mermaid", value: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}

function renderMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-slate-200 mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-slate-100 mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-5 mb-2">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    // Bullet points
    .replace(/^[-•] (.+)$/gm, '<li class="ml-4 text-slate-300 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-slate-300 list-decimal">$2</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, "<br/>");
}

export default function ChatMessage({ role, content, index }: ChatMessageProps) {
  const parts = useMemo(() => parseContent(content), [content]);

  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-violet-600/20 border border-violet-500/30 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-slate-200 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
        CG
      </div>
      <div className="flex-1 min-w-0">
        {parts.map((part, i) => {
          if (part.type === "mermaid") {
            return (
              <MermaidRenderer
                key={i}
                code={part.value}
                id={`${index}-${i}`}
              />
            );
          }
          return (
            <div
              key={i}
              className="text-slate-300 text-sm leading-relaxed prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: `<p class="mb-2">${renderMarkdown(part.value)}</p>`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
