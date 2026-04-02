"use client";

import Link from "next/link";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { projects } from "@/data/projects";

// ─── Data ────────────────────────────────────────────────────────────────────

const METRICS = [
  { value: "$60k", label: "Additional monthly revenue", sub: "Multi-channel AI enquiry system" },
  { value: "80%",  label: "Process time reduction",     sub: "Insurance document automation" },
  { value: "20h+", label: "Staff hours saved weekly",   sub: "Across 3 staff at a legal firm" },
  { value: "15+",  label: "AI agents delivered",        sub: "Across 10+ clients" },
];

const HOW_I_WORK = [
  {
    step: "01",
    title: "Define Inputs & Outputs",
    body: "Every system starts with clarity. I identify what comes into the system and what must come out — anchoring the solution in real business outcomes before any tools are considered.",
  },
  {
    step: "02",
    title: "Map the Real Business Process",
    body: "I work with stakeholders to understand how work is actually done, not how it's documented. This surfaces bottlenecks, inefficiencies, and logic gaps that automation needs to account for.",
  },
  {
    step: "03",
    title: "Translate to System Logic",
    body: "Business steps become structured logic — triggers, conditions, state changes, and data flows. This is where business thinking becomes system design.",
  },
  {
    step: "04",
    title: "Design Controlled Automation",
    body: "AI is powerful but unreliable without constraints. I design systems where AI operates within defined boundaries, outputs are validated, and deterministic logic controls outcomes.",
  },
  {
    step: "05",
    title: "Validate & Pressure Test",
    body: "Before building, I stress-test the design against edge cases and failure scenarios. This significantly reduces debugging in production.",
  },
  {
    step: "06",
    title: "Build, Deploy & Iterate",
    body: "I implement the system, deploy it into production, and refine it based on real-world usage and feedback.",
  },
];

const RELIABILITY_ITEMS = [
  "Validation layers before any processing begins",
  "Structured JSON outputs with schema enforcement",
  "Deterministic routing logic — not left to the model",
  "Confidence scoring and human-in-the-loop approval",
  "Retry logic and fallback paths for every failure mode",
  "Error logging and notification workflows",
  "Escalation routes for edge cases",
];

const SKILLS = [
  {
    category: "Process & Analysis",
    items: ["As-Is / To-Be mapping", "Discovery & stakeholder interviews", "PRD & technical specification", "Test case design (component, integration, E2E)", "First-principles methodology"],
  },
  {
    category: "AI & Automation",
    items: ["n8n (production workflows)", "LLM integration (OpenAI, Claude, Gemini)", "RAG systems & vector search (Pinecone)", "Structured output design", "Prompt engineering & context management"],
  },
  {
    category: "Data & Integration",
    items: ["SQL (table design, queries, reporting)", "Supabase, Airtable", "REST APIs & webhooks", "Google Workspace APIs", "Dokploy / DigitalOcean / Doppler"],
  },
  {
    category: "Delivery",
    items: ["Sprint management & backlog prioritisation", "Risk identification & mitigation", "Client communication & status reporting", "Training & documentation", "Change management & adoption"],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-white text-[#19191D] font-sans antialiased">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-[#19191D]">
            Christopher Greyvenstein
          </span>
          <div className="flex items-center gap-5">
            <a href="#how-i-work" className="hidden md:block text-sm text-zinc-400 hover:text-[#19191D] transition-colors">
              How I work
            </a>
            <a href="#systems" className="hidden md:block text-sm text-zinc-400 hover:text-[#19191D] transition-colors">
              Systems
            </a>
            <a href="#skills" className="hidden md:block text-sm text-zinc-400 hover:text-[#19191D] transition-colors">
              Skills
            </a>
            <Link
              href="/chat"
              className="text-sm px-4 py-1.5 rounded-lg bg-[#19191D] text-white hover:bg-[#31343E] transition-colors"
            >
              Chat with my agent →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#2CB463]" />
              <span className="text-xs text-zinc-500 font-medium">
                Available for new opportunities · Brisbane, QLD
              </span>
            </div>

            <h1 className="text-5xl md:text-[64px] font-light tracking-[-2px] leading-[1.05] mb-6 text-[#19191D]">
              I design and build systems
              <br />
              <span className="bg-gradient-to-r from-[#19191D] to-[#5a5c66] bg-clip-text text-transparent">
                that turn manual processes
              </span>
              <br />
              into reliable operations.
            </h1>

            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mb-10">
              From discovery and process mapping through to deployment and iteration — I focus on building controlled systems that reduce operational risk, improve efficiency, and deliver measurable outcomes.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#systems"
                className="px-6 py-3 rounded-xl bg-[#19191D] text-white text-sm font-medium hover:bg-[#31343E] transition-colors"
              >
                View systems
              </a>
              <Link
                href="/chat"
                className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-zinc-600 hover:border-gray-300 hover:text-[#19191D] transition-colors"
              >
                Talk to my AI agent
              </Link>
              <a
                href="mailto:chris@copilothq.co"
                className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-zinc-600 hover:border-gray-300 hover:text-[#19191D] transition-colors"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="py-14 px-5 md:px-8 border-y border-gray-100"
        style={{ background: "radial-gradient(92.09% 126.39% at 50% 100%, #DDE2EE 0%, #f8f9fc 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {METRICS.map((m) => (
              <div key={m.value}>
                <div className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D] mb-1">
                  {m.value}
                </div>
                <div className="text-sm font-medium text-[#19191D] mb-0.5">{m.label}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How I Work ── */}
      <section id="how-i-work" className="py-24 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
            Methodology
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D] mb-4">
            How I design systems
          </h2>
          <p className="text-zinc-500 max-w-xl mb-14">
            Every engagement follows the same structured approach — because the quality of a system is determined long before the first workflow is built.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_I_WORK.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
              >
                <span className="text-xs font-bold tracking-widest text-zinc-300 mb-3 block">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-[#19191D] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Systems ── */}
      <section id="systems" className="py-24 px-5 md:px-8 bg-gray-50/60">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
              Work
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D]">
                Systems designed & deployed
              </h2>
              <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                A selection of production systems across different industries. Click any card to see the full breakdown — problem, decisions, solution, controls, and outcome.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl border border-dashed border-gray-200 bg-white/50">
            <p className="text-sm text-zinc-400 text-center leading-relaxed">
              <span className="font-medium text-zinc-500">Additional work available on request.</span>
              {" "}Including lead generation agents, document OCR pipelines, internal tooling, and further voice AI deployments.
            </p>
          </div>
        </div>
      </section>

      {/* ── Reliability ── */}
      <section className="py-24 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
                Reliability
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D] mb-6 leading-snug">
                How I build systems
                <br />
                that hold up in production.
              </h2>
              <p className="text-zinc-500 leading-relaxed mb-4">
                AI is not reliable on its own. The systems I build treat AI as a capable but bounded component — not as the single point of control.
              </p>
              <p className="text-zinc-500 leading-relaxed">
                Every system includes structured controls from the start. The goal is predictable, controllable behaviour at scale — not demos that fail under real conditions.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-8">
              <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-5">
                Standard control patterns
              </p>
              <ul className="space-y-3">
                {RELIABILITY_ITEMS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#19191D] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact ── */}
      <section
        className="py-20 px-5 md:px-8 border-y border-gray-100"
        style={{ background: "radial-gradient(92.09% 126.39% at 50% 100%, #DDE2EE 0%, #f8f9fc 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
            Impact
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D] mb-10">
            Delivered outcomes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: "15+",  l: "AI agents delivered" },
              { v: "20+",  l: "Workflows deployed" },
              { v: "10+",  l: "Clients across industries" },
              { v: "90%",  l: "Automation rate achieved (NOAH)" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur p-5">
                <div className="text-3xl font-light tracking-tight text-[#19191D] mb-1">{s.v}</div>
                <div className="text-sm text-zinc-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="py-24 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4">
            Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D] mb-12">
            Skills & stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {SKILLS.map((group) => (
              <div
                key={group.category}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <h3 className="text-sm font-semibold text-[#19191D] mb-4">{group.category}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-500">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-400 mb-4 font-medium tracking-widest uppercase">
            Tools & technologies
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "n8n","Claude / Claude Code","OpenAI","Gemini","Pinecone","Supabase","Airtable",
              "Vapi","ElevenLabs","Dokploy","DigitalOcean","Doppler","Excalidraw","Miro",
              "SQL","REST APIs","Webhooks","Google Workspace APIs","Microsoft Power Platform",
              "Azure","Composio","Apify","Zoho CRM",
            ].map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 text-zinc-600 bg-white hover:border-gray-300 transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agent CTA ── */}
      <section className="py-24 px-5 md:px-8"
        style={{ background: "radial-gradient(92.09% 126.39% at 50% 100%, #DDE2EE 0%, #f8f9fc 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white/80 backdrop-blur mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2CB463] animate-pulse" />
              <span className="text-xs text-zinc-500 font-medium">
                Live — Claude & Pinecone RAG
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D] mb-4 leading-snug">
              Explore how I think.
            </h2>
            <p className="text-zinc-500 mb-3 leading-relaxed">
              This assistant demonstrates how I approach system design, automation, and problem-solving. It's built on my career knowledge base and can generate process breakdowns, system architectures, risk analyses, and more.
            </p>
            <p className="text-sm text-zinc-400 mb-8">
              Ask it about my experience, or give it a real problem to break down.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#19191D] text-white text-sm font-medium hover:bg-[#31343E] transition-colors"
            >
              Open the agent →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-5 md:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#19191D] mb-4 leading-snug">
              Let's build something
              <br />
              that actually works.
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-8">
              If you're looking to design and implement reliable automation systems, I'd be glad to have a conversation.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:chris@copilothq.co"
                className="px-6 py-3 rounded-xl bg-[#19191D] text-white text-sm font-medium hover:bg-[#31343E] transition-colors"
              >
                Get in touch
              </a>
              <a
                href="https://linkedin.com/in/christopher-greyvenstein-1593a428a"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-zinc-600 hover:border-gray-300 hover:text-[#19191D] transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-5 md:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            Christopher Greyvenstein · AI & Automation Specialist · Brisbane, QLD
          </p>
          <p className="text-xs text-zinc-300">
            Built with Next.js · Claude claude-sonnet-4-6 · Pinecone RAG
          </p>
        </div>
      </footer>
    </div>
  );
}
