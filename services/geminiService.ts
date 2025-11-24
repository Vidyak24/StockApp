import { GoogleGenAI } from "@google/genai";
import { Source } from "../types";

// Ensure API Key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("Missing API_KEY in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

interface StockNewsResult {
  summary: string;
  sources: Source[];
}

export const fetchStockNews = async (stockSymbol: string): Promise<StockNewsResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

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
    throw new Error("Failed to fetch news from Gemini.");
  }
};