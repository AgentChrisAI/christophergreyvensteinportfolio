"use client";

import { useState } from "react";
import { type Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

type LabelColor = "rose" | "violet" | "blue" | "amber" | "emerald" | "slate";

const SECTION_CONFIG: { key: keyof Project; label: string; color: LabelColor; type: "text" | "list" }[] = [
  { key: "problem", label: "Problem", color: "rose", type: "text" },
  { key: "decisions", label: "Decisions", color: "violet", type: "list" },
  { key: "solution", label: "Solution", color: "blue", type: "list" },
  { key: "controls", label: "Controls", color: "amber", type: "list" },
  { key: "outcome", label: "Outcome", color: "emerald", type: "list" },
];

const COLOR_CLASSES: Record<LabelColor, string> = {
  rose:    "text-rose-600    bg-rose-50    border-rose-200",
  violet:  "text-violet-600  bg-violet-50  border-violet-200",
  blue:    "text-blue-600    bg-blue-50    border-blue-200",
  amber:   "text-amber-600   bg-amber-50   border-amber-200",
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
  slate:   "text-slate-600   bg-slate-50   border-slate-200",
};

const STEP_COLORS = [
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-blue-100   text-blue-700   border-blue-200",
  "bg-cyan-100   text-cyan-700   border-cyan-200",
  "bg-teal-100   text-teal-700   border-teal-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100  text-amber-700  border-amber-200",
  "bg-rose-100   text-rose-700   border-rose-200",
];

export default function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
        expanded
          ? "border-gray-200 shadow-lg"
          : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
      }`}
    >
      {/* ── Collapsed header ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 md:p-8"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-0.5 rounded-full border border-gray-200 text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Name + client byline */}
            <h3 className="text-xl md:text-2xl font-light tracking-tight text-[#19191D] mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-zinc-400 mb-2">{project.client}</p>

            {/* Summary */}
            <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
              {project.summary}
            </p>
          </div>

          {/* Metric + expand toggle */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            {project.metric && (
              <div className="text-right">
                <div className="text-2xl font-light tracking-tight text-[#19191D]">
                  {project.metric.value}
                </div>
                <div className="text-xs text-zinc-400">{project.metric.label}</div>
              </div>
            )}
            <div
              className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-200 ${
                expanded ? "rotate-45" : ""
              }`}
            >
              <span className="text-zinc-400 text-lg leading-none select-none">+</span>
            </div>
          </div>
        </div>
      </button>

      {/* ── Expanded content ── */}
      {expanded && (
        <div className="border-t border-gray-100 px-6 md:px-8 pb-10">
          <div className="pt-8 grid md:grid-cols-2 gap-10">

            {/* Left — PDSC + Outcome */}
            <div className="space-y-7">
              {SECTION_CONFIG.map(({ key, label, color, type }) => {
                const value = project[key];
                return (
                  <div key={key}>
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded border mb-3 ${COLOR_CLASSES[color]}`}
                    >
                      {label}
                    </span>
                    {type === "text" || typeof value === "string" ? (
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {String(value)}
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {(value as string[]).map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 leading-relaxed">
                            <span className="mt-2 w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right — Process + Stack */}
            <div className="space-y-8">

              {/* Process */}
              <div>
                <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
                  Process
                </p>

                {/* I/O strip */}
                <div className="flex gap-3 mb-5">
                  <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-0.5">Inputs</p>
                    <p className="text-xs text-zinc-600">{project.process.inputs}</p>
                  </div>
                  <div className="flex items-center text-zinc-300 text-sm">→</div>
                  <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-0.5">Outputs</p>
                    <p className="text-xs text-zinc-600">{project.process.outputs}</p>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  {project.process.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          STEP_COLORS[i % STEP_COLORS.length]
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-zinc-600 leading-relaxed pt-0.5">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              {project.stack.length > 0 && (
                <div>
                  <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-3">
                    Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-zinc-500 bg-gray-50"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
