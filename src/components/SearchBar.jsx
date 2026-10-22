import React, { useRef, useEffect } from 'react';
import { Search, X, Command, Sparkles } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, onClear }) {
  const inputRef = useRef(null);

  // Global hotkey: press "/" or "Ctrl+K" to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickPicks = ['Paneer Tikka', 'Biryani', 'Chilli Potato', 'Momos', 'Waffles', 'Thali', 'Maggi', 'Butter Naan'];

  return (
    <div className="w-full space-y-2.5">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4.5 pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-slate-400" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by dish name, category, cuisine, or tag (e.g. 'Oreo Shake', 'Paneer Chilli', 'Biryani')..."
          className="w-full h-14 pl-12 pr-24 rounded-2xl bg-[#131924] border border-white/10 text-white placeholder-slate-400 text-base font-medium focus:outline-none focus:border-[#ff713f] focus:ring-4 focus:ring-[#ff713f]/15 shadow-xl transition-all"
        />

        {/* Right actions */}
        <div className="absolute right-3.5 flex items-center gap-2">
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                if (onClear) onClear();
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-slate-400">
              <Command className="w-3 h-3" />
              <span>/</span>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Quick Searches */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 pt-0.5">
        <span className="flex items-center gap-1 font-semibold text-slate-400">
          <Sparkles className="w-3 h-3 text-[#ff713f]" />
          Popular:
        </span>
        {quickPicks.map((pick) => (
          <button
            key={pick}
            onClick={() => setSearchQuery(pick)}
            className={`px-2.5 py-1 rounded-lg transition-colors border ${
              searchQuery.toLowerCase() === pick.toLowerCase()
                ? 'bg-[#ff713f]/20 text-[#ff713f] border-[#ff713f]/40 font-semibold'
                : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/15 hover:text-white'
            }`}
          >
            {pick}
          </button>
        ))}
      </div>
    </div>
  );
}
