import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function analyzeEntry(content: string) {
  if (!genAI) {
    console.warn("Gemini API Key not set");
    return null;
  }

  const prompt = `
    You are an AI assistant for a journaling app called "MyArc".
    Analyze the following journal entry and extract:
    1. "Shorts": Distinct actionable items, realizations, or goals.
    2. "Daily Arc": A single, small, suggested action to build momentum for today based on this entry.
    3. "Sentiment": The overall emotional tone (Positive, Neutral, Negative).
    4. "Tags": 3-5 relevant keywords.

    Return the result as a JSON object with this structure:
    {
      "shorts": [{ "type": "action" | "realization" | "goal", "content": "..." }],
      "dailyArc": { "suggestedAction": "..." },
      "sentiment": "...",
      "tags": ["..."]
    }

    Entry:
    "${content}"
  `;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }]
    });

    // Handling the response structure might vary, adapting to common pattern
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean up potential markdown code blocks
    const cleanText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    if (!cleanText) return null;

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

/**
 * Generate an embedding vector for the given text using Gemini's embedding model.
 * Returns a number array, or null if the API key is not set or the call fails.
 */
export async function embedText(text: string): Promise<number[] | null> {
  if (!genAI) {
    console.warn("Gemini API Key not set — skipping embedding");
    return null;
  }

  try {
    // Truncate to ~8000 chars to stay within model limits
    const truncated = text.slice(0, 8000);

    const result = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: truncated,
      config: {
        outputDimensionality: 512
      }
    });

    return result.embeddings?.[0]?.values || null;
  } catch (error) {
    console.error("Embedding Error:", error);
    return null;
  }
}

/**
 * Compute cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical direction.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude === 0 ? 0 : dot / magnitude;
}
