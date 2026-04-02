/**
 * Knowledge Base Ingestion Script
 * Chunks the career KB, embeds via OpenRouter, upserts to Pinecone
 * Run: node scripts/ingest-kb.mjs
 */

import { readFileSync } from "fs";
import { Pinecone } from "@pinecone-database/pinecone";

const OPENROUTER_API_KEY =
  "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";
const PINECONE_API_KEY =
  "pcsk_2CSsUC_NAu6gnBMKW7MNsX9Y9GiNKGtrZWiikj5JejPYsjzxZaTcB9tfBxN31g4cpXQoVg";
const PINECONE_INDEX = "cvbot";
const PINECONE_NAMESPACE = "career";

async function embed(texts) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let res;
  try {
    res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/text-embedding-3-small",
        input: texts,
        dimensions: 512,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding failed: ${err}`);
  }

  const data = await res.json();
  return data.data.map((d) => d.embedding);
}

function chunkMarkdown(content) {
  // Split on ## headers (major sections)
  const sections = content.split(/\n## /);
  const chunks = [];

  sections.forEach((section, i) => {
    const text = i === 0 ? section : `## ${section}`;
    const lines = text.trim().split("\n");
    const header = lines[0].replace(/^#+\s*/, "");

    // Further split long sections on ### subheaders
    const subsections = text.split(/\n### /);
    if (subsections.length > 1) {
      subsections.forEach((sub, j) => {
        const subText = j === 0 ? sub : `### ${sub}`;
        if (subText.trim().length > 50) {
          chunks.push({
            text: subText.trim(),
            section: header,
          });
        }
      });
    } else {
      if (text.trim().length > 50) {
        chunks.push({ text: text.trim(), section: header });
      }
    }
  });

  return chunks;
}

async function main() {
  console.log("📚 Reading knowledge base...");
  const content = readFileSync("knowledge-base/career-kb.md", "utf-8");
  const chunks = chunkMarkdown(content);
  console.log(`✂️  Split into ${chunks.length} chunks`);

  console.log("🔢 Generating embeddings via OpenRouter...");
  const texts = chunks.map((c) => c.text);

  // Batch in groups of 10
  const allEmbeddings = [];
  for (let i = 0; i < texts.length; i += 10) {
    const batch = texts.slice(i, i + 10);
    const embeddings = await embed(batch);
    allEmbeddings.push(...embeddings);
    console.log(`  Embedded ${Math.min(i + 10, texts.length)}/${texts.length}`);
  }

  console.log("📌 Upserting to Pinecone...");
  const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
  const index = pc.index(PINECONE_INDEX).namespace(PINECONE_NAMESPACE);

  const vectors = chunks.map((chunk, i) => ({
    id: `chunk_${i}_${chunk.section.replace(/\s+/g, "_").toLowerCase().slice(0, 40)}`,
    values: allEmbeddings[i],
    metadata: {
      text: chunk.text,
      section: chunk.section,
    },
  }));

  // Upsert in batches of 100 (v7 SDK requires { records: [...] })
  for (let i = 0; i < vectors.length; i += 100) {
    await index.upsert({ records: vectors.slice(i, i + 100) });
  }

  console.log(`✅ Ingested ${vectors.length} vectors into ${PINECONE_INDEX}/${PINECONE_NAMESPACE}`);
}

main().catch(console.error);
