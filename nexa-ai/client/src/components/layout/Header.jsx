import React from 'react';
import { Menu, Sparkles, Bot } from 'lucide-react';

export const Header = ({ title, onToggleSidebar }) => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#0E131F]/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <h1 className="text-sm font-medium text-slate-200 truncate">
            {title || 'New Conversation'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Nexa Intelligence</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
