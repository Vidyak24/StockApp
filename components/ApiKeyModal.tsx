import React, { useState, useEffect } from 'react';
import { Key, Save, X } from 'lucide-react';
import { Button } from './Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('GEMINI_API_KEY');
      if (storedKey) setApiKey(storedKey);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
      onSave();
      onClose();
    }
  };

  const handleClear = () => {
      localStorage.removeItem('GEMINI_API_KEY');
      setApiKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2 text-emerald-400">
            <Key className="h-5 w-5" />
            <h3 className="text-lg font-bold text-white">API Key Settings</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-400 mb-6">
            To generate stock news, this app requires a <strong>Google Gemini API Key</strong>. 
            Your key is stored locally in your browser and is never sent to our servers.
          </p>
          
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Your API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Key
              </Button>
               {apiKey && (
                  <button 
                    type="button" 
                    onClick={handleClear}
                    className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium"
                  >
                    Clear
                  </button>
               )}
            </div>
          </form>
          
          <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
             <a 
               href="https://aistudio.google.com/app/apikey" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
             >
               Get a free Gemini API Key here &rarr;
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};
