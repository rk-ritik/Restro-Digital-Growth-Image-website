import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function CategoryFilters({ selectedCategory, onSelectCategory, countsByCategory = {} }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full group/nav">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left categories"
        className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#131924]/90 hover:bg-[#1a2232] text-slate-300 hover:text-white border border-white/10 items-center justify-center shadow-lg transition-all opacity-0 group-hover/nav:opacity-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Categories Horizontal Scroll Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
      >
        {CATEGORIES.map((cat) => {
          const isSelected =
            (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all' || selectedCategory === 'All')) ||
            selectedCategory === cat.name ||
            selectedCategory === cat.id;

          const count = cat.id === 'all' ? countsByCategory.total : countsByCategory[cat.name] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === 'all' ? 'All' : cat.name)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#ff713f] to-[#ff521a] text-white shadow-lg shadow-[#ff713f]/25 scale-[1.02]'
                  : 'bg-[#141a25] text-slate-300 hover:text-white hover:bg-[#1c2436] border border-white/5 hover:border-white/15'
              }`}
            >
              <span>{cat.name}</span>
              {typeof count === 'number' && count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right categories"
        className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#131924]/90 hover:bg-[#1a2232] text-slate-300 hover:text-white border border-white/10 items-center justify-center shadow-lg transition-all opacity-0 group-hover/nav:opacity-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
