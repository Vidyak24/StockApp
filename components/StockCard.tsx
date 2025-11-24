import React from 'react';
import { Stock } from '../types';
import { Trash2, ExternalLink, Calendar, Newspaper, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StockCardProps {
  stock: Stock;
  onRemove: (id: string) => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onRemove }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 shadow-lg shadow-slate-900/50 flex flex-col h-full">
      {/* Card Header: Symbol and Date */}
      <div className="p-5 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{stock.symbol}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Stock
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400" title="Date of Entry">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(stock.addedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemove(stock.id)}
          className="group p-2 rounded-lg hover:bg-red-500/10 transition-colors"
          title="Remove from collection"
        >
          <Trash2 className="h-4.5 w-4.5 text-slate-500 group-hover:text-red-400 transition-colors" />
        </button>
      </div>

      {/* Card Body: Short Description */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-6 flex-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Newspaper className="h-3.5 w-3.5" />
                Short Description
            </h4>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed text-sm">
               <ReactMarkdown>{stock.newsSummary}</ReactMarkdown>
            </div>
        </div>

        {/* Card Footer: Links to News */}
        {stock.sources.length > 0 && (
          <div className="mt-auto pt-4 border-t border-slate-700/50">
            <h5 className="text-xs font-bold text-slate-500 mb-3 uppercase flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                News Links
            </h5>
            <div className="flex flex-col gap-2">
              {stock.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-700 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-200"
                >
                  <div className="flex flex-col overflow-hidden mr-3">
                    <span className="text-xs text-emerald-400 font-medium truncate group-hover:text-emerald-300 transition-colors">
                      {source.title}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate mt-0.5">
                        {new URL(source.uri).hostname.replace('www.', '')}
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-600 group-hover:text-emerald-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};