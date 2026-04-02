import { NextRequest } from "next/server";
import { classifyMode, getModeInstruction, MODE_LABELS } from "@/lib/prompts/modes";
import { buildSystemPromptWithContext } from "@/lib/prompts/system";
import { queryKB, formatKBContext } from "@/lib/pinecone";
import {
  validateMermaid,
  extractMermaidBlock,
  replaceMermaidBlock,
} from "@/lib/mermaid-validator";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const REASONING_MODEL = "anthropic/claude-3.5-haiku";
const STRUCTURED_MODEL = "openai/gpt-4o-mini";

const RAG_MODES = new Set(["career", "process_breakdown", "general"]);
const STRUCTURED_MODES = new Set(["test_cases", "impact_estimator"]);
const MAX_MERMAID_RETRIES = 3;

interface TraceEntry {
  step: string;
  detail?: string;
  ts: number;
}

async function callLLM(
  model: string,
  messages: { role: string; content: string }[],
  stream = false
): Promise<string> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://chabtot.vercel.app",
      "X-Title": "Chabtot Career Agent",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM call failed (${model}): ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function fixMermaid(
  badCode: string,
  error: string,
  model: string
): Promise<string> {
  const fixPrompt = `You must fix the following Mermaid diagram syntax error.

Error: ${error}

Original code:
\`\`\`mermaid
${badCode}
\`\`\`

Return ONLY the corrected Mermaid code block. No explanation. No other text. Just the fixed \`\`\`mermaid ... \`\`\` block.`;

  const result = await callLLM(model, [
    { role: "user", content: fixPrompt },
  ]);

  const extracted = extractMermaidBlock(result);
  return extracted ?? result.replace(/```mermaid\s*|\s*```/g, "").trim();
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const trace: TraceEntry[] = [];

  const addTrace = (step: string, detail?: string) => {
    trace.push({ step, detail, ts: Date.now() - startTime });
  };

  try {
    const body = await req.json();
    const messages: { role: string; content: string }[] = body.messages || [];
    const latestMessage = messages[messages.length - 1]?.content ?? "";

    // 1. Classify mode
    const mode = classifyMode(latestMessage);
    addTrace("mode_classify", `Detected: ${mode}`);

    // 2. Select model
    const model = STRUCTURED_MODES.has(mode) ? STRUCTURED_MODEL : REASONING_MODEL;
    addTrace("model_select", `Using: ${model}`);

    // 3. RAG retrieval
    let kbContext = "";
    let pineconeHits = 0;
    if (RAG_MODES.has(mode)) {
      addTrace("rag_query", "Querying Pinecone knowledge base...");
      const chunks = await queryKB(latestMessage, 5);
      pineconeHits = chunks.length;
      kbContext = formatKBContext(chunks);
      addTrace("rag_result", `Retrieved ${pineconeHits} chunks`);
    }

    // 4. Build prompt
    const systemPrompt = buildSystemPromptWithContext(kbContext);
    const modeInstruction = getModeInstruction(mode);

    const systemWithMode = `${systemPrompt}

## Current Interaction Mode: ${MODE_LABELS[mode]}
${modeInstruction}`;

    const llmMessages = [
      { role: "system", content: systemWithMode },
      ...messages.slice(-6), // Last 6 messages for context window efficiency
    ];

    // 5. LLM call
    addTrace("llm_call", `Calling ${model}...`);
    let responseText = await callLLM(model, llmMessages);
    addTrace("llm_response", `Received ${responseText.length} chars`);

    // 6. Mermaid validate + fix loop
    let diagramCode: string | null = null;
    let diagramValid = false;
    let mermaidRetries = 0;

    const rawDiagram = extractMermaidBlock(responseText);
    if (rawDiagram) {
      addTrace("mermaid_extract", "Found Mermaid block");
      let currentCode = rawDiagram;

      for (let attempt = 1; attempt <= MAX_MERMAID_RETRIES; attempt++) {
        const validation = validateMermaid(currentCode);
        if (validation.valid) {
          diagramCode = validation.code;
          diagramValid = true;
          addTrace("mermaid_valid", `Valid on attempt ${attempt}`);
          break;
        } else {
          addTrace(
            `mermaid_fix_${attempt}`,
            `Error: ${validation.error} — retrying...`
          );
          mermaidRetries++;
          try {
            currentCode = await fixMermaid(currentCode, validation.error!, model);
          } catch {
            addTrace(`mermaid_fix_${attempt}_failed`, "Fix call failed");
            break;
          }
        }
      }

      if (!diagramValid && mermaidRetries > 0) {
        // Strip the broken diagram from the response
        responseText = responseText.replace(/```mermaid[\s\S]*?```/g, "").trim();
        responseText +=
          "\n\n*(Diagram generation encountered a syntax error and was removed from this response.)*";
        addTrace("mermaid_strip", "Diagram removed after max retries");
      } else if (diagramValid && diagramCode) {
        // Replace with validated/fixed code
        responseText = replaceMermaidBlock(responseText, diagramCode);
      }
    }

    const totalLatency = Date.now() - startTime;
    addTrace("complete", `Total: ${totalLatency}ms`);

    return Response.json({
      text: responseText,
      diagram: diagramCode
        ? {
            code: diagramCode,
            valid: diagramValid,
            retries: mermaidRetries,
          }
        : null,
      trace: {
        mode,
        modeLabel: MODE_LABELS[mode],
        modelUsed: model,
        pineconeHits,
        diagramRetries: mermaidRetries,
        latencyMs: totalLatency,
        steps: trace,
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    addTrace("error", error);
    return Response.json(
      {
        text: "I encountered an error processing your request. Please try again.",
        diagram: null,
        trace: { steps: trace, error },
      },
      { status: 500 }
    );
  }
}
