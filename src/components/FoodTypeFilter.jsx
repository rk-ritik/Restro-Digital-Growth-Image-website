import React from 'react';

export default function FoodTypeFilter({ selectedType, onSelectType, counts = {} }) {
  const options = [
    { id: 'all', label: 'All Dishes', count: counts.all },
    { id: 'veg', label: 'Veg Only', count: counts.veg, isVeg: true },
    { id: 'non-veg', label: 'Non-Veg', count: counts.nonVeg, isNonVeg: true },
  ];

  return (
    <div className="flex items-center p-1 rounded-xl bg-[#131924] border border-white/5 shadow-inner">
      {options.map((opt) => {
        const isSelected = selectedType === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelectType(opt.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-[#1e2638] text-white shadow-md border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {/* Authentic FSSAI Veg Symbol */}
            {opt.isVeg && (
              <span className="w-3.5 h-3.5 border-2 border-emerald-500 rounded-sm flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
            )}

            {/* Authentic FSSAI Non-Veg Symbol */}
            {opt.isNonVeg && (
              <span className="w-3.5 h-3.5 border-2 border-rose-500 rounded-sm flex items-center justify-center shrink-0">
                <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500" />
              </span>
            )}

            <span>{opt.label}</span>

            {typeof opt.count === 'number' && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
