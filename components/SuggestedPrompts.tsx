"use client";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  { label: "Experience", text: "What experience does Christopher have with AI automation?" },
  { label: "Process Breakdown", text: "How would you solve automating invoice processing end to end?" },
  { label: "System Design", text: "Design a system to automate customer support for an e-commerce business" },
  { label: "Risk Analysis", text: "What are the failure modes of an AI email automation system?" },
  { label: "Impact Estimator", text: "Manual process: 3 staff, 10 hours per week on data entry. What's the impact of automating it?" },
  { label: "Test Cases", text: "Generate a test suite for a customer support AI agent" },
  { label: "Explain Simply", text: "Explain how a RAG system works for a non-technical manager" },
  { label: "Why This Design?", text: "Why would you use deterministic routing instead of letting the AI decide everything?" },
];

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {PROMPTS.map((p) => (
        <button
          key={p.label}
          onClick={() => onSelect(p.text)}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-violet-600/50 hover:bg-violet-900/20 transition-all"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
