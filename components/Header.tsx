import React from 'react';
import { LogOut, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  username: string;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, username }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400">
          <TrendingUp className="h-6 w-6" />
          <span className="text-xl font-bold text-slate-100 tracking-tight">Sttock</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 hidden sm:block">Welcome, {username}</span>
          <button
            onClick={onLogout}
            className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
