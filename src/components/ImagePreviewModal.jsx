import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  Share2,
  Check,
  Flag,
  Sparkles,
  Info,
  Maximize2,
  Layers,
  FileCheck,
} from 'lucide-react';
import { downloadFoodImage } from '../utils/downloadImage';
import { useToast } from '../context/ToastContext';
import ReportModal from './ReportModal';

export default function ImagePreviewModal({ food, onClose, onDownloadSuccess }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState('original');
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !showReport) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showReport]);

  if (!food) return null;

  const handleDownload = async () => {
    setDownloading(true);
    const result = await downloadFoodImage(food, selectedResolution);
    setDownloading(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Downloaded Successfully',
        message: `${food.name} saved as ${result.filename} for your menu upload!`,
      });
      if (onDownloadSuccess) onDownloadSuccess(food);
    } else {
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: result.error || 'Could not download image file.',
      });
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + food.image;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Direct image asset link copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row rounded-3xl bg-[#121722] border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-colors"
            aria-label="Close preview modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: High-Res Image Display */}
          <div className="relative md:w-3/5 bg-[#090d14] flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px]">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-contain max-h-[60vh] md:max-h-[85vh] transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.svg';
              }}
            />

            {/* Placeholder Indicator */}
            {food.isPlaceholder && (
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Placeholder Asset</span>
              </div>
            )}
          </div>

          {/* Right: Asset Metadata & Download Control */}
          <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-[#141a26]">
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Veg / Non-Veg Official Badge */}
                {food.foodType === 'veg' ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    <span className="w-3 h-3 border-2 border-emerald-500 rounded-sm flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Vegetarian
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                    <span className="w-3 h-3 border-2 border-rose-500 rounded-sm flex items-center justify-center">
                      <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500" />
                    </span>
                    Non-Vegetarian
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                  {food.category}
                </span>

                {food.rating && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-xs font-bold flex items-center gap-1">
                    ★ {food.rating}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                  {food.name}
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {food.description ||
                    `Premium food photography asset optimized for high-conversion menu cards on Zomato, Swiggy, and direct digital ordering platforms.`}
                </p>
              </div>

              {/* Specifications Card */}
              <div className="p-3.5 rounded-xl bg-[#0e131d] border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Asset Specifications
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Resolution</span>
                    <span className="text-slate-200 font-medium">{food.resolution || '3840 x 2880'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">File Size</span>
                    <span className="text-slate-200 font-medium">{food.fileSize || '3.2 MB'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Format</span>
                    <span className="text-slate-200 font-medium">JPEG (Full RGB)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">License</span>
                    <span className="text-emerald-400 font-medium">Commercial Ready</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {food.tags && food.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tags & Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {food.tags.slice(0, 6).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-slate-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              {/* Primary Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#ff713f] to-[#ff4e18] hover:from-[#fa5d24] hover:to-[#e8400b] shadow-xl shadow-[#ff713f]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Preparing Download...' : `Download Image (${food.fileSize || '3.2 MB'})`}</span>
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share Asset'}</span>
                </button>

                <button
                  onClick={() => setShowReport(true)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-400 bg-white/5 hover:bg-amber-500/10 border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReport && (
        <ReportModal food={food} onClose={() => setShowReport(false)} />
      )}
    </>
  );
}
