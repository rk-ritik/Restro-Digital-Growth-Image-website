import React from 'react';
import { LayoutGrid, Grid3X3, Grid2X2 } from 'lucide-react';

export default function DisplayToggle({ displayMode, setDisplayMode }) {
  const options = [
    { id: 'standard', label: 'Standard', icon: LayoutGrid, tooltip: 'Standard 4-Column Grid' },
    { id: 'compact', label: 'Compact', icon: Grid3X3, tooltip: 'Dense 5-Column Grid' },
    { id: 'large', label: 'Large', icon: Grid2X2, tooltip: 'Large 3-Column Studio Grid' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131924] border border-white/5 shadow-inner">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = displayMode === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setDisplayMode(opt.id)}
            title={opt.tooltip}
            aria-label={opt.label}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#1e2638] text-[#ff713f] shadow-md border border-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
