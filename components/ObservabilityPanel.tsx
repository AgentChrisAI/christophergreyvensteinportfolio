"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TraceStep {
  step: string;
  detail?: string;
  ts: number;
}

interface TraceData {
  mode?: string;
  modeLabel?: string;
  modelUsed?: string;
  pineconeHits?: number;
  diagramRetries?: number;
  latencyMs?: number;
  steps?: TraceStep[];
  error?: string;
}

interface ObservabilityPanelProps {
  trace: TraceData | null;
}

const MODEL_SHORT: Record<string, string> = {
  "anthropic/claude-sonnet-4-5": "Claude Sonnet",
  "anthropic/claude-3.5-haiku": "Claude Haiku",
  "anthropic/claude-opus-4": "Claude Opus",
  "openai/gpt-4o": "GPT-4o",
  "openai/gpt-4o-mini": "GPT-4o Mini",
};

export default function ObservabilityPanel({ trace }: ObservabilityPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (!trace) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
        <p className="text-slate-600 text-xs text-center">No execution trace yet</p>
      </div>
    );
  }

  const modelShort = trace.modelUsed
    ? MODEL_SHORT[trace.modelUsed] ?? trace.modelUsed.split("/")[1]
    : "—";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 text-xs">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-900/50 rounded-t-xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400 font-medium">Execution Trace</span>
          {trace.latencyMs && (
            <span className="text-slate-600">{trace.latencyMs}ms</span>
          )}
        </div>
        <span className="text-slate-600">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-2 px-3 pb-3">
        {trace.modeLabel && (
          <Badge variant="outline" className="border-violet-700/50 text-violet-400 text-[10px]">
            {trace.modeLabel}
          </Badge>
        )}
        {trace.modelUsed && (
          <Badge variant="outline" className="border-blue-700/50 text-blue-400 text-[10px]">
            {modelShort}
          </Badge>
        )}
        {trace.pineconeHits !== undefined && trace.pineconeHits > 0 && (
          <Badge variant="outline" className="border-emerald-700/50 text-emerald-400 text-[10px]">
            KB: {trace.pineconeHits} hits
          </Badge>
        )}
        {trace.diagramRetries !== undefined && trace.diagramRetries > 0 && (
          <Badge variant="outline" className="border-amber-700/50 text-amber-400 text-[10px]">
            Diagram: {trace.diagramRetries} fix{trace.diagramRetries > 1 ? "es" : ""}
          </Badge>
        )}
        {trace.error && (
          <Badge variant="outline" className="border-red-700/50 text-red-400 text-[10px]">
            Error
          </Badge>
        )}
      </div>

      {/* Expanded decision trace */}
      {expanded && trace.steps && (
        <div className="border-t border-slate-800 px-3 pb-3 pt-2">
          <p className="text-slate-600 mb-2 font-medium">Decision trace</p>
          <div className="space-y-1">
            {trace.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-700 font-mono w-12 shrink-0 text-right">
                  {step.ts}ms
                </span>
                <span className="text-slate-500">→</span>
                <div>
                  <span className="text-slate-300 font-mono">{step.step}</span>
                  {step.detail && (
                    <span className="text-slate-600 ml-2">{step.detail}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
