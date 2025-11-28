import { Stock } from "../types";
import { supabase } from "./supabaseClient";

/**
 * Fetch stocks from Supabase 'stocks' table.
 * Assumes a table structure: id, symbol, name, added_at, news_summary, sources (jsonb), user_id
 */
export const getStoredStocks = async (): Promise<Stock[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }

    // Map DB snake_case to App camelCase
    return (data || []).map((item: any) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      addedAt: item.added_at,
      newsSummary: item.news_summary,
      sources: item.sources || []
    }));
  } catch (e) {
    console.error("Failed to load stocks", e);
    return [];
  }
};

export const saveStock = async (stock: Stock): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Map App camelCase to DB snake_case
  const dbPayload = {
    id: stock.id,
    user_id: user.id,
    symbol: stock.symbol,
    name: stock.name,
    added_at: stock.addedAt,
    news_summary: stock.newsSummary,
    sources: stock.sources
  };

  const { error } = await supabase
    .from('stocks')
    .insert([dbPayload]);

  if (error) {
    console.error("Supabase save error:", error);
    throw new Error("Failed to save to database");
  }
};

export const removeStock = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('stocks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error("Failed to remove from database");
  }
};