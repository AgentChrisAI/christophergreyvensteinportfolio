export type InteractionMode =
  | "career"
  | "process_breakdown"
  | "system_design"
  | "risk_analysis"
  | "test_cases"
  | "explain_simple"
  | "impact_estimator"
  | "multi_model"
  | "observability"
  | "why_design"
  | "general";

export const MODE_LABELS: Record<InteractionMode, string> = {
  career: "Career & Capability",
  process_breakdown: "Process Breakdown",
  system_design: "System Design Generator",
  risk_analysis: "Risk & Failure Analysis",
  test_cases: "Test Case Generator",
  explain_simple: "Plain English Explainer",
  impact_estimator: "Impact Estimator",
  multi_model: "Multi-Model Architecture",
  observability: "Observability",
  why_design: "Why This Design?",
  general: "General",
};

export function classifyMode(message: string): InteractionMode {
  const lower = message.toLowerCase();

  if (
    /\b(experience|background|project|skill|tool|what (can|does) christopher|who is|tell me about (him|christopher)|work(ed)? on|achiev|deliver|client|role|career|history|portfolio)\b/.test(lower)
  )
    return "career";

  if (
    /\b(how would (you|christopher) (solve|approach|handle|deal with)|break (it|this|down|that)|breakdown|process breakdown|approach to|how to solve)\b/.test(lower)
  )
    return "process_breakdown";

  if (
    /\b(design (a |the )?system|system (design|architecture)|automate|build (a |an )?system|architecture for|workflow for|how (to|would you) automate)\b/.test(lower)
  )
    return "system_design";

  if (
    /\b(risk|failure|fail|what could go wrong|failure mode|vulnerability|weakness|problem|issue|edge case|flaw|danger)\b/.test(lower)
  )
    return "risk_analysis";

  if (
    /\b(test (case|suite|plan)|testing|qa|quality assurance|acceptance criteria|component test|integration test|end.to.end|e2e)\b/.test(lower)
  )
    return "test_cases";

  if (
    /\b(explain (this|it|the)|in simple terms|non.technical|layman|plain english|what does (this|it) (mean|do)|for a (manager|stakeholder|non.technical))\b/.test(lower)
  )
    return "explain_simple";

  if (
    /\b(roi|return on investment|time saved|cost|hours|staff|savings|impact|how much|benefit|efficiency|value|manual process|week(ly)?)\b/.test(lower)
  )
    return "impact_estimator";

  if (
    /\b(why (claude|gpt|openai|model|llm)|multi.model|model routing|which model|model selection|routing logic)\b/.test(lower)
  )
    return "multi_model";

  if (
    /\b(log|trace|execution|observ|monitor|debug|what happened|show (me )?the|decision)\b/.test(lower)
  )
    return "observability";

  if (
    /\b(why (did you|this|that|choose|design|pick|use)|trade.off|alternative|constraint|decision|rationale)\b/.test(lower)
  )
    return "why_design";

  return "general";
}

export function getModeInstruction(mode: InteractionMode): string {
  switch (mode) {
    case "process_breakdown":
      return `The user wants a process breakdown. Structure your response as follows:
1. **Inputs** — what enters the system
2. **Outputs** — what the system produces
3. **Business Process** — the human/operational steps
4. **Technical System** — the automation/AI layer
5. **Risks** — what could go wrong
6. **Automation Plan** — how to automate this step-by-step at a high level

Then generate a Mermaid flowchart (flowchart TD) showing the end-to-end process.`;

    case "system_design":
      return `The user wants a system design. Structure your response as:
1. **System Overview** — what this system does
2. **Architecture Components** — the key building blocks
3. **Tools & Technologies** — recommended stack (high-level)
4. **Workflow Steps** — the sequence of operations
5. **Validation Layers** — how correctness is ensured
6. **Failure Handling** — fallbacks and error paths

Then generate a Mermaid diagram (graph LR or flowchart TD) showing the system architecture.`;

    case "risk_analysis":
      return `The user wants a risk and failure mode analysis. Structure your response as:
1. **Failure Points** — where the system can break
2. **Data Risks** — data quality, consistency, privacy concerns
3. **AI/LLM Risks** — hallucination, drift, confidence issues
4. **Control Mechanisms** — how to detect and handle each risk
5. **Fallback Strategies** — what happens when things fail

Then generate a Mermaid flowchart showing the risk decision tree with fallbacks.`;

    case "test_cases":
      return `The user wants a test case suite. Generate a structured test plan with:
1. **Component Tests** — individual unit/function level tests
2. **Integration Tests** — tests across connected systems
3. **End-to-End Tests** — full workflow simulations

For each test include: ID, Objective, Input, Expected Output, Pass/Fail Criteria.
Format as a clean structured table or list. Optionally generate a Mermaid diagram showing the test coverage layers.`;

    case "explain_simple":
      return `The user wants a plain-English explanation. Structure your response as:
1. **What it does** — one sentence
2. **How it works** — explained like talking to a smart non-technical manager
3. **Business impact** — what changed and why it matters
4. **What to watch for** — any ongoing considerations

Then generate a simple Mermaid flowchart showing the key steps in plain language (no technical jargon in the diagram labels).`;

    case "impact_estimator":
      return `The user wants an impact estimate. Structure your response as:
1. **Current State** — the manual process cost (time, people, errors)
2. **Estimated Time Saved** — hours per week/month
3. **Cost Impact** — rough financial value (use $50/hr as default if not specified)
4. **ROI Estimate** — payback period at typical automation build cost
5. **Scalability Gains** — what becomes possible at scale
6. **Confidence Level** — how reliable this estimate is

Then generate a Mermaid diagram (graph LR) showing before vs after state.`;

    case "multi_model":
      return `The user is asking about multi-model routing or model selection. Explain:
1. **Why multiple models** — different models have different strengths
2. **Routing logic** — how to decide which model handles what
3. **Christopher's approach** — Claude for reasoning, GPT-4o for structured output, fallback logic
4. **Trade-offs** — cost, latency, reliability

Then generate a Mermaid flowchart showing the model routing architecture.`;

    case "why_design":
      return `The user wants to understand design rationale. Structure your response as:
1. **The decision** — what was chosen
2. **Why this approach** — the reasoning
3. **Alternatives considered** — what else was on the table
4. **Trade-offs** — what was gained and what was sacrificed
5. **Constraints** — what forced this decision

Be honest about trade-offs. This is senior-level thinking.`;

    case "career":
      return `The user is asking about Christopher's background, experience, or capabilities. Answer directly from the retrieved knowledge base context. Be specific — reference actual projects, metrics, and outcomes. Do not be generic.`;

    default:
      return `Answer helpfully. If relevant, generate a Mermaid diagram to visualise any system, process, or concept you describe.`;
  }
}
