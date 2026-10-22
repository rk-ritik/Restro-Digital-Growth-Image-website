import React, { useState } from 'react';
import { Download, Flag, Check } from 'lucide-react';
import { downloadFoodImage } from '../utils/downloadImage';
import { useToast } from '../context/ToastContext';
import ReportModal from './ReportModal';

export default function FoodCard({
  food,
  onOpenPreview,
  isSelectable = false,
  isSelected = false,
  onToggleSelect,
  aspectRatio = 'aspect-[4/3]',
}) {
  const [downloading, setDownloading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToast } = useToast();

  const handleDownloadClick = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    const result = await downloadFoodImage(food);
    setDownloading(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Downloaded Image',
        message: `${food.name} saved as ${result.filename}`,
      });
    } else {
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: result.error || 'Failed to download image file',
      });
    }
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    setShowReport(true);
  };

  const handleCardClick = () => {
    if (isSelectable && onToggleSelect) {
      onToggleSelect(food.id);
    } else if (onOpenPreview) {
      onOpenPreview(food);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative flex flex-col rounded-2xl bg-[#141a25] border overflow-hidden cursor-pointer select-none ${
          isSelected
            ? 'border-[#ff713f] ring-2 ring-[#ff713f]/40 shadow-xl shadow-[#ff713f]/15'
            : 'border-white/5'
        }`}
      >
        {/* Top Image Container */}
        <div className={`relative w-full ${aspectRatio} bg-[#0d121c] overflow-hidden`}>
          {/* Skeleton Shimmer while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-800/40 animate-pulse" />
          )}

          <img
            src={food.image}
            alt={food.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.svg';
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-70" />

          {/* Top-Left: Multi-select Checkbox (Bulk Export Mode Only) */}
          {isSelectable && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <label
                onClick={(e) => e.stopPropagation()}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#ff713f] text-white shadow-lg shadow-[#ff713f]/40'
                    : 'bg-black/60 backdrop-blur-md text-transparent border border-white/20 hover:border-white/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect && onToggleSelect(food.id)}
                  className="sr-only"
                  aria-label={`Select ${food.name}`}
                />
                <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100 text-white' : 'opacity-0'}`} />
              </label>
            </div>
          )}

          {/* Top-Right: Download & Report Buttons */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {/* Report Image Button */}
            <button
              onClick={handleReportClick}
              aria-label="Report Image"
              title="Report issue with this image"
              className="w-8 h-8 rounded-xl bg-black/60 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 backdrop-blur-md border border-white/10 hover:border-amber-500/30 flex items-center justify-center transition-all duration-200"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              aria-label={`Download ${food.name}`}
              title="Download original file"
              className="w-8 h-8 rounded-xl bg-[#ff713f] hover:bg-[#fa5c24] text-white shadow-lg shadow-[#ff713f]/30 flex items-center justify-center transition-all duration-200"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Body - Dish Name beneath image */}
        <div className="p-3.5 flex flex-col justify-between flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm text-white line-clamp-1">
              {food.name}
            </h3>
            {food.isPlaceholder && (
              <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Demo
              </span>
            )}
          </div>

          {/* Subtitle / File details */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>{food.resolution || '3840 x 2880'}</span>
            <span className="text-slate-400 font-mono">{food.fileSize || '3.2 MB'}</span>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <ReportModal food={food} onClose={() => setShowReport(false)} />
      )}
    </>
  );
}
