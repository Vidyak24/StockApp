import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Stock } from '../types';
import { fetchStockNews } from '../services/geminiService';
import { getStoredStocks, saveStock, removeStock } from '../services/storageService';
import { StockTable } from './StockTable';
import { Button } from './Button';
import { Header } from './Header';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const data = await getStoredStocks();
      setStocks(data);
    } catch (e) {
      console.error("Failed to load stocks", e);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockSymbol.trim()) return;

    // Check if already exists (optimistic check)
    if (stocks.some(s => s.symbol.toUpperCase() === newStockSymbol.toUpperCase())) {
      setError("This stock is already in your collection.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { summary, sources } = await fetchStockNews(newStockSymbol);

      const newStock: Stock = {
        id: crypto.randomUUID(),
        symbol: newStockSymbol.toUpperCase(),
        name: newStockSymbol.toUpperCase(),
        addedAt: new Date().toISOString(),
        newsSummary: summary,
        sources: sources
      };

      await saveStock(newStock);
      
      // Refresh list or optimistic update
      setStocks(prev => [newStock, ...prev]);
      setNewStockSymbol('');
    } catch (err) {
      console.error(err);
      setError("Failed to fetch news or save data. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStock = async (id: string) => {
    // Optimistic UI update
    const previousStocks = [...stocks];
    setStocks(prev => prev.filter(s => s.id !== id));
    
    try {
      await removeStock(id);
    } catch (e) {
      // Revert on failure
      setStocks(previousStocks);
      setError("Failed to delete stock.");
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header onLogout={onLogout} username={username} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Add Stock Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Stock</h2>
            <form onSubmit={handleAddStock} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={newStockSymbol}
                  onChange={(e) => setNewStockSymbol(e.target.value)}
                  placeholder="Enter symbol (e.g., RELIANCE, TCS)"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-lg leading-5 bg-slate-900/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" isLoading={isLoading} className="sm:w-32">
                 <Plus className="h-5 w-5 mr-1" />
                 Track
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
                {error}
              </div>
            )}
             <p className="mt-4 text-xs text-center text-slate-500">
                Powered by Gemini AI. Fetches real-time news from Moneycontrol via Google Search.
              </p>
          </div>
        </section>

        {/* Stock List Section */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-200">Your Collection</h2>
            <span className="text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
              {stocks.length} Stock{stocks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {stocks.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
              <div className="mx-auto h-12 w-12 text-slate-600 mb-4">
                <TrendingUpIconPlaceholder />
              </div>
              <p className="text-slate-400 text-lg">Your collection is empty.</p>
              <p className="text-slate-600">Add a stock symbol above to get started.</p>
            </div>
          ) : (
            <StockTable stocks={stocks} onRemove={handleRemoveStock} />
          )}
        </section>
      </main>
    </div>
  );
};

// Simple Icon component for empty state
const TrendingUpIconPlaceholder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);