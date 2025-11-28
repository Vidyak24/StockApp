import { GoogleGenAI } from "@google/genai";
import { Source } from "../types";

// Function to retrieve the API key dynamically
export const getApiKey = (): string | null => {
  // 1. Check local storage first (User provided key via Settings Modal)
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) return storedKey;
  }

  // 2. Check Environment Variable (Set this in your AWS/Vercel dashboard)
  // Note: In Vite, this is usually import.meta.env.VITE_API_KEY, but we stick to process.env for compatibility with this setup
  if (process.env.API_KEY) return process.env.API_KEY;

  return null;
};

interface StockNewsResult {
  summary: string;
  sources: Source[];
}

export const fetchStockNews = async (stockSymbol: string): Promise<StockNewsResult> => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'DUMMY_KEY_FOR_BUILD') {
    // This specific error message triggers the Settings Modal in Dashboard.tsx
    throw new Error("API_KEY_MISSING");
  }

  // Initialize AI instance per request with the current key
  const ai = new GoogleGenAI({ apiKey });

  try {
    // Prompt specifically asks for a short description and uses Moneycontrol as context
    const prompt = `Search for the 2 most recent and significant news stories about "${stockSymbol}" from Moneycontrol.
    
    Provide a short description of these events. 
    Format the output as a concise bulleted list (max 2 bullets).
    Focus on the key facts.
    Do not add introductory or concluding text, just the bullets.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No summary available.";
    
    // Extract grounding chunks for sources to serve as "links to news"
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: Source[] = groundingChunks
      .map((chunk) => {
        if (chunk.web) {
          return {
            title: chunk.web.title || "Read Full Story",
            uri: chunk.web.uri || "#",
          };
        }
        return null;
      })
      .filter((source): source is Source => source !== null);

    // Remove duplicates based on URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return {
      summary: text,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Error fetching stock news:", error);
    throw error;
  }
};