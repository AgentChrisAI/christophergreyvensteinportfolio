/**
 * Server-side Mermaid syntax validation.
 * Uses a regex-based structural check as mermaid.js requires a browser DOM.
 * For production, this could be replaced with a headless browser call.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code: string;
}

const VALID_DIAGRAM_TYPES = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "erDiagram",
  "gantt",
  "pie",
  "gitGraph",
  "journey",
  "mindmap",
  "timeline",
  "quadrantChart",
  "xychart-beta",
  "block-beta",
];

export function validateMermaid(code: string): ValidationResult {
  const trimmed = code.trim();

  if (!trimmed) {
    return { valid: false, error: "Empty diagram code", code: trimmed };
  }

  // Check starts with a valid diagram type
  const firstLine = trimmed.split("\n")[0].trim().toLowerCase();
  const hasValidType = VALID_DIAGRAM_TYPES.some((t) =>
    firstLine.startsWith(t.toLowerCase())
  );

  if (!hasValidType) {
    return {
      valid: false,
      error: `Diagram must start with a valid type (e.g. flowchart TD, graph LR, sequenceDiagram). Got: "${firstLine}"`,
      code: trimmed,
    };
  }

  // Check for unclosed brackets/parens
  const opens = trimmed.split("").filter((c) => c === "[" || c === "(" || c === "{").length;
  const closes = trimmed.split("").filter((c) => c === "]" || c === ")" || c === "}").length;
  if (Math.abs(opens - closes) > 2) {
    return {
      valid: false,
      error: `Mismatched brackets: ${opens} opening vs ${closes} closing`,
      code: trimmed,
    };
  }

  // Check for obvious syntax issues: arrows without nodes
  const lines = trimmed.split("\n").slice(1);
  for (const line of lines) {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith("%%")) continue;
    // Detect dangling arrows
    if (/^-->$|^---$|^==>$/.test(stripped)) {
      return {
        valid: false,
        error: `Dangling arrow on line: "${stripped}"`,
        code: trimmed,
      };
    }
  }

  return { valid: true, code: trimmed };
}

export function extractMermaidBlock(text: string): string | null {
  const match = text.match(/```mermaid\s*([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

export function replaceMermaidBlock(text: string, newCode: string): string {
  return text.replace(/```mermaid\s*([\s\S]*?)```/, "```mermaid\n" + newCode + "\n```");
}
