import React from 'react';
import { Stock } from '../types';
import { Trash2, ExternalLink, Calendar, Newspaper, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StockTableProps {
  stocks: Stock[];
  onRemove: (id: string) => void;
}

export const StockTable: React.FC<StockTableProps> = ({ stocks, onRemove }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800/40 shadow-xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4 w-1/4">Stock Symbol</th>
              <th className="px-6 py-4 w-1/4">Date Added</th>
              <th className="px-6 py-4 w-1/4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {stocks.map((stock) => (
              <React.Fragment key={stock.id}>
                {/* Main Row */}
                <tr className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shrink-0">
                        <span className="font-bold text-xs">{stock.symbol.substring(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 text-lg">{stock.symbol}</div>
                        <div className="text-xs text-slate-500">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>
                        {new Date(stock.addedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right align-top">
                    <button
                      onClick={() => onRemove(stock.id)}
                      className="mt-1 p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors inline-flex items-center gap-2"
                      title="Remove Stock"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-xs font-medium">Remove</span>
                    </button>
                  </td>
                </tr>
                
                {/* Merged Details Row */}
                <tr className="bg-slate-900/30">
                  <td colSpan={3} className="px-6 py-4 border-l-[3px] border-l-emerald-500/30">
                    <div className="flex flex-col gap-4">
                      
                      {/* Description Section */}
                      <div className="flex gap-3">
                        <Newspaper className="h-5 w-5 text-slate-500 mt-1 shrink-0" />
                        <div className="w-full">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">News Summary</h4>
                          <div className="prose prose-invert prose-sm max-w-none text-slate-300 text-sm leading-relaxed">
                             <ReactMarkdown components={{
                               ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                               li: ({node, ...props}) => <li className="text-slate-300" {...props} />
                             }}>
                                {stock.newsSummary}
                             </ReactMarkdown>
                          </div>
                        </div>
                      </div>

                      {/* Links Section */}
                      {stock.sources.length > 0 && (
                        <div className="flex gap-3 mt-1 pt-3 border-t border-slate-700/50">
                          <LinkIcon className="h-5 w-5 text-slate-500 mt-1 shrink-0" />
                          <div className="w-full">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sources & Links</h4>
                            <div className="flex flex-wrap gap-2">
                              {stock.sources.map((source, idx) => (
                                <a
                                  key={idx}
                                  href={source.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800/80 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-all group"
                                >
                                  <span className="truncate max-w-[250px]">{source.title}</span>
                                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};