import { Stock } from "../types";

const STORAGE_KEY = 'sttock_collection_data';

export const getStoredStocks = (): Stock[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load stocks", e);
    return [];
  }
};

export const saveStock = (stock: Stock): void => {
  const current = getStoredStocks();
  const updated = [stock, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const removeStock = (id: string): void => {
  const current = getStoredStocks();
  const updated = current.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
