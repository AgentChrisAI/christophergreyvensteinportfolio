export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  tags: string[];
  summary: string;
  metric?: ProjectMetric;
  problem: string;
  decisions: string[];
  solution: string[];
  controls: string[];
  outcome: string[];
  process: { inputs: string; outputs: string; steps: string[] };
  stack: string[];
}

export const projects: Project[] = [
  {
    id: "cooper-all-aces",
    name: "Lead Capture & Communication System",
    client: "All Aces Cleaning & Restoration",
    tags: ["Voice AI", "Email Automation", "Lead Capture", "Revenue Operations"],
    summary:
      "Captured all after-hours enquiries and converted missed calls into booked revenue. The business was losing inbound leads outside operating hours — this system ensured no enquiry went unhandled.",
    metric: { value: "$60k", label: "Additional revenue, month 1" },
    problem:
      "The business was missing a significant number of enquiries outside operating hours, resulting in lost leads and revenue the team had no visibility over.",
    decisions: [
      "Prioritise full coverage across both phone and email channels",
      "Ensure no enquiry is lost, delayed, or ignored",
      "Maintain communication quality consistent with a human response",
      "Design for real-time response with structured follow-up",
    ],
    solution: [
      "Built a multi-channel system integrating a voice agent (Vapi), email automation, and enquiry routing logic",
      "Implemented structured data parsing to extract lead details from both channels",
      "Introduced fallback handling for edge cases and unresolved queries",
      "All enquiries feed into a tracked pipeline with logging and status visibility",
    ],
    controls: [
      "Output parsing before any routing decisions are made",
      "Deterministic logic controlling response paths",
      "Error logging and notification workflows",
      "Human fallback triggered for enquiries that cannot be resolved automatically",
    ],
    outcome: [
      "$60,000 in additional booked jobs in the first month",
      "100% after-hours enquiry coverage across voice and email",
      "Zero missed inbound opportunities during the coverage window",
    ],
    process: {
      inputs: "Inbound calls and emails",
      outputs: "Qualified leads and booked jobs",
      steps: [
        "Mapped existing enquiry flow and identified where leads were dropping",
        "Defined inputs, outputs, and business response rules",
        "Designed voice call logic and email response structure",
        "Built and tested voice agent with structured routing",
        "Built email automation with classification and lead capture",
        "Connected both channels into unified pipeline with logging",
        "Tested end-to-end against real enquiry scenarios before go-live",
      ],
    },
    stack: ["n8n", "Vapi", "ElevenLabs", "OpenAI", "Airtable"],
  },
  {
    id: "bb-advocates-dva",
    name: "AI Email Operations System",
    client: "B&B Advocates",
    tags: ["Legal", "Email Automation", "RAG", "Custom API"],
    summary:
      "Automated high-volume structured client communications for a legal firm, reducing manual workload while maintaining accuracy and compliance with DVA correspondence requirements.",
    metric: { value: "20h/wk", label: "Staff time reclaimed across 3 staff" },
    problem:
      "High volume of structured email communication required manual handling, consuming significant staff time and creating delays across the team.",
    decisions: [
      "Avoid broad tool integrations to reduce hallucination risk",
      "Build a lean, controlled API layer rather than relying on general LLM knowledge",
      "Prioritise reliability and consistency over flexibility",
    ],
    solution: [
      "Built a custom email agent system with a tailored API tool layer (POST/GET endpoints)",
      "Integrated Pinecone for structured semantic retrieval against case documents",
      "Designed system to handle routine check-ins, coordination, and escalations",
      "Human-in-the-loop approval step before any email is sent",
    ],
    controls: [
      "Structured output validation before responses are generated",
      "Confidence-based routing for uncertain cases",
      "Human review triggered for low-confidence or sensitive responses",
      "Retrieval validation before any response is drafted",
    ],
    outcome: [
      "Reduced manual communication workload by 20+ hours per week across 3 staff",
      "Improved response consistency across all client communications",
      "Hallucination rate reduced by approximately 20%",
      "Retrieval accuracy improved by approximately 25%",
    ],
    process: {
      inputs: "Incoming client emails",
      outputs: "Structured, accurate responses",
      steps: [
        "Mapped existing communication patterns and identified sources of inconsistency",
        "Designed custom API tool layer to ground responses in real case data",
        "Vectorised case documents into Pinecone for semantic retrieval",
        "Built orchestration workflow with structured prompt chain",
        "Implemented human-in-the-loop approval step before send",
        "Tested against historical cases and iterated on output quality",
      ],
    },
    stack: ["n8n", "OpenAI", "Pinecone", "Supabase", "Custom REST API"],
  },
  {
    id: "noah-fusion-insure",
    name: "Insurance Document Processing System",
    client: "Fusion Insure",
    tags: ["Insurance", "Document Automation", "SQL Logging", "Compliance"],
    summary:
      "Automated the processing of broker submissions into structured NBI documents. Reduced a multi-step manual workflow to one where 90% of cases are handled end-to-end without human intervention.",
    metric: { value: "80%", label: "Reduction in processing time" },
    problem:
      "Broker submissions required manual review and transformation into structured NBI documents, causing delays and creating audit gaps.",
    decisions: [
      "Maintain strict validation before any processing occurs",
      "Ensure the system communicates errors clearly to users",
      "Track all actions for auditability from the start",
    ],
    solution: [
      "Built an email-triggered automation system that intercepts and processes broker submissions",
      "Extracted and structured document data using LLM with defined output schemas",
      "Generated NBI outputs automatically against required templates",
      "Implemented SQL-based logging for full transaction traceability",
    ],
    controls: [
      "Multi-step validation gates before AI processing begins",
      "File type and size validation at ingestion",
      "Structured error responses sent back to users for invalid submissions",
      "Full logging of every system action for audit purposes",
    ],
    outcome: [
      "80% reduction in processing time per submission",
      "90% of the workflow automated end-to-end",
      "Increased reliability and consistency across all submissions",
      "Clear, queryable audit trail for all operations",
    ],
    process: {
      inputs: "Broker submissions via email",
      outputs: "Structured NBI documents",
      steps: [
        "Documented the existing multi-step manual process in full",
        "Redesigned the workflow from first principles — what needs to happen, not how it was done",
        "Designed validation-first architecture before any AI processing",
        "Built SQL logging table schema for reporting and audit",
        "Built orchestration workflow with structured output validation",
        "Defined edge case routing and human review queue criteria",
        "Ran component, integration, and E2E tests against historical submissions",
      ],
    },
    stack: ["n8n", "OpenAI", "SQL / Supabase", "Email APIs"],
  },
  {
    id: "bx-bunka",
    name: "Booking & Data System Redesign",
    client: "BX Bunka",
    tags: ["Database Design", "OCR", "Scope Management", "Data Pipelines"],
    summary:
      "Inherited a poorly scoped system with inconsistent data and evolving requirements. Rebuilt the database and automation architecture from the ground up while managing ongoing scope changes.",
    metric: { value: "6mo", label: "Delivered under sustained scope change" },
    problem:
      "The existing system was poorly scoped, with inconsistent data structures and requirements that continued to change throughout the engagement.",
    decisions: [
      "Redesign the system rather than patch the existing one",
      "Clean and restructure the data before applying any automation",
      "Adapt systematically to ongoing requirement changes without losing progress",
    ],
    solution: [
      "Rebuilt the database structure to support reliable automation",
      "Implemented OCR-based document processing for purchase order ingestion",
      "Introduced vectorisation for structured data handling",
      "Created a booking automation system on top of the new data foundation",
    ],
    controls: [
      "Data validation at ingestion before processing",
      "Structured data pipelines with clear state tracking",
      "Controlled output generation with defined schemas",
      "Incremental rollout to reduce risk across phases",
    ],
    outcome: [
      "Delivered the full system despite sustained scope change over 6 months",
      "Significantly improved data quality and usability",
      "Established a reliable, scalable foundation for future automation",
    ],
    process: {
      inputs: "Purchase orders and booking data",
      outputs: "Structured bookings and system state",
      steps: [
        "Audited the existing system to identify data inconsistencies and logic gaps",
        "Designed a new database schema to support structured automation",
        "Rebuilt the data layer before touching automation",
        "Implemented OCR processing for document ingestion",
        "Built booking automation on the new foundation",
        "Managed scope changes through structured backlog and milestone tracking",
      ],
    },
    stack: ["n8n", "Supabase", "OpenAI", "OCR tooling", "Pinecone"],
  },
  {
    id: "qbd-books",
    name: "Customer Service Voice Agent",
    client: "QBD Books",
    tags: ["Voice AI", "API Integration", "Customer Service", "Real-Time"],
    summary:
      "Built a real-time voice agent to handle customer enquiries across order tracking, store information, and book availability — reducing load on staff while maintaining quality of service.",
    metric: { value: "24/7", label: "Automated customer service coverage" },
    problem:
      "High volumes of routine customer enquiries over the phone were creating wait times, inconsistent responses, and operational load on staff.",
    decisions: [
      "Design for real-time voice interaction, not delayed or async responses",
      "Integrate directly with internal APIs for accurate, live data",
      "Introduce verification before sharing sensitive information",
      "Ensure clean escalation to human agents when needed",
    ],
    solution: [
      "Built a modular voice agent capable of understanding natural language queries and retrieving structured data via API",
      "Integrated Vapi for call handling, ElevenLabs for voice synthesis, and an LLM for intent and response generation",
      "Implemented an MCP server to enable real-time API interaction during calls",
      "Designed full conversation flow covering order tracking, availability, and store information",
    ],
    controls: [
      "Real-time verification before exposing any sensitive order or account data",
      "Fallback logic for queries the agent cannot resolve",
      "Escalation to human agents for complex or sensitive cases",
      "Full interaction logging and metadata tracking for every call",
    ],
    outcome: [
      "Reduced routine customer support load on staff",
      "Improved response speed and consistency across enquiry types",
      "Enabled scalable voice-based customer service without additional headcount",
      "Human fallback maintained for edge cases",
    ],
    process: {
      inputs: "Voice queries and live API data",
      outputs: "Spoken responses and resolved queries",
      steps: [
        "Mapped customer service flows and categorised enquiry types",
        "Designed conversational logic for each enquiry category",
        "Integrated voice stack: Vapi, ElevenLabs, LLM",
        "Built API connections for live data retrieval during calls",
        "Implemented verification and escalation logic",
        "Tested across enquiry scenarios and edge cases before deployment",
      ],
    },
    stack: ["Vapi", "ElevenLabs", "OpenAI", "n8n", "REST APIs"],
  },
  {
    id: "bda-claims",
    name: "Claims Documentation Automation",
    client: "Better Days Ahead",
    tags: ["Document Automation", "CRM Integration", "Compliance", "Google Workspace"],
    summary:
      "Automated the end-to-end claims documentation process — from meeting transcripts through to completed documents and CRM updates — eliminating manual data entry and reducing processing time.",
    metric: { value: "100%", label: "Manual data entry eliminated" },
    problem:
      "Claims documentation required manual transcription, data extraction, document creation, and CRM updates — creating delays, inconsistency, and significant manual workload.",
    decisions: [
      "Use the meeting transcript as the single source of truth for all downstream outputs",
      "Extract structured data via LLM with defined output schemas",
      "Ensure all outputs align with compliance templates before any CRM update",
      "Integrate directly into the CRM to eliminate re-entry entirely",
    ],
    solution: [
      "Built a workflow that captures Google Meet transcripts, extracts structured claim data using an LLM, and generates completed claim documents",
      "Integrated directly with Zoho CRM to update records automatically from extracted data",
      "Used Gemini for structured extraction with schema-based output validation",
      "Documents generated against standardised compliance templates",
    ],
    controls: [
      "Schema-based extraction with structured output validation",
      "Low-confidence cases routed to human review before CRM update",
      "Standardised document templates to ensure compliance consistency",
      "Full data traceability from transcript through to document and CRM record",
    ],
    outcome: [
      "Eliminated manual data entry from the claims documentation process",
      "Increased speed of claim processing end-to-end",
      "Improved documentation consistency and compliance",
      "Significantly reduced operational workload for the claims team",
    ],
    process: {
      inputs: "Meeting transcripts and session metadata",
      outputs: "Completed claim documents and CRM updates",
      steps: [
        "Mapped the existing manual claims process from transcript to CRM",
        "Designed structured extraction schema aligned with claim document requirements",
        "Built transcript capture and processing workflow",
        "Implemented LLM extraction with structured output validation",
        "Integrated document generation against compliance templates",
        "Built Zoho CRM update logic with human review routing for low-confidence cases",
      ],
    },
    stack: ["n8n", "Gemini", "Google Workspace (Meet, Drive, Docs)", "Zoho CRM"],
  },
];
