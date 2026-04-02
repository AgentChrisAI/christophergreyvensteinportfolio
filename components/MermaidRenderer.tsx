"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidRendererProps {
  code: string;
  id: string;
}

export default function MermaidRenderer({ code, id }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current || !code) return;

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#1e293b",
            primaryTextColor: "#e2e8f0",
            primaryBorderColor: "#334155",
            lineColor: "#64748b",
            secondaryColor: "#0f172a",
            tertiaryColor: "#1e293b",
            background: "#0f172a",
            mainBkg: "#1e293b",
            nodeBorder: "#334155",
            clusterBkg: "#0f172a",
            titleColor: "#e2e8f0",
            edgeLabelBackground: "#1e293b",
            fontSize: "14px",
          },
          flowchart: { htmlLabels: true, curve: "basis" },
          securityLevel: "loose",
        });

        const uniqueId = `mermaid-${id}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, code);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG responsive
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
          setRendered(true);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Render error");
          setRendered(false);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-950/20 p-4 text-sm">
        <p className="text-red-400 font-medium mb-2">Diagram render error</p>
        <pre className="text-red-300/70 text-xs overflow-auto">{error}</pre>
        <details className="mt-2">
          <summary className="text-slate-400 text-xs cursor-pointer">Show raw code</summary>
          <pre className="mt-2 text-slate-300 text-xs overflow-auto bg-slate-900 rounded p-2">{code}</pre>
        </details>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 my-3 overflow-auto">
      {!rendered && (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
          <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
          Rendering diagram...
        </div>
      )}
      <div ref={containerRef} className={rendered ? "" : "hidden"} />
    </div>
  );
}
