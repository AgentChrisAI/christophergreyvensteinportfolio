import { Pinecone } from "@pinecone-database/pinecone";

async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: [text],
      dimensions: 512,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding failed: ${err}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

export async function queryKB(
  query: string,
  topK = 5
): Promise<{ text: string; section: string; score: number }[]> {
  try {
    const vector = await embed(query);
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc
      .index(process.env.PINECONE_INDEX!)
      .namespace(process.env.PINECONE_NAMESPACE!);

    const results = await index.query({
      vector,
      topK,
      includeMetadata: true,
    });

    return (results.matches || [])
      .filter((m) => (m.score ?? 0) > 0.3)
      .map((m) => ({
        text: String(m.metadata?.text ?? ""),
        section: String(m.metadata?.section ?? ""),
        score: m.score ?? 0,
      }));
  } catch (err) {
    console.error("Pinecone query error:", err);
    return [];
  }
}

export function formatKBContext(
  chunks: { text: string; section: string; score: number }[]
): string {
  if (chunks.length === 0) return "";
  return chunks
    .map((c) => `[${c.section}]\n${c.text}`)
    .join("\n\n---\n\n");
}
