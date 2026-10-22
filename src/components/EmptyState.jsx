import React from 'react';
import { SearchX, RotateCcw, PlusSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ searchQuery, category, onReset }) {
  return (
    <div className="w-full py-16 px-4 rounded-3xl bg-[#141a25]/60 border border-white/5 flex flex-col items-center justify-center text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff713f]/20 to-amber-500/10 border border-[#ff713f]/30 flex items-center justify-center mb-4 text-[#ff713f]">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">
        No Matching Food Images Found
      </h3>

      <p className="text-sm text-slate-400 mt-2 max-w-md">
        {searchQuery
          ? `We couldn't find any dishes matching "${searchQuery}". Try checking your spelling or search for broader keywords like "shake", "biryani", or "chicken".`
          : `There are currently no items under category "${category}".`}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#ff713f] hover:bg-[#fa5d24] shadow-lg shadow-[#ff713f]/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        )}

        <Link
          to="/request-photo"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-all"
        >
          <PlusSquare className="w-4 h-4 text-[#ff713f]" />
          <span>Request This Photo</span>
        </Link>
      </div>
    </div>
  );
}
