import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Trash2,
  Calendar,
  HardDrive,
  FileText,
  Search,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import { getDownloadHistory, clearDownloadHistory } from '../utils/storage';
import { downloadFoodImage } from '../utils/downloadImage';
import { useToast } from '../context/ToastContext';

export default function Downloads() {
  const [history, setHistory] = useState(getDownloadHistory());
  const [filterQuery, setFilterQuery] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    const handleUpdate = () => setHistory(getDownloadHistory());
    window.addEventListener('foodimager:history-updated', handleUpdate);
    return () => window.removeEventListener('foodimager:history-updated', handleUpdate);
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your local download history?')) {
      clearDownloadHistory();
      addToast({
        type: 'info',
        title: 'History Cleared',
        message: 'Your local download log has been reset.',
      });
    }
  };

  const handleReDownload = async (item) => {
    const res = await downloadFoodImage(item);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'File Downloaded Again',
        message: `${item.name} has been saved to your downloads folder.`,
      });
    }
  };

  const filteredHistory = useMemo(() => {
    if (!filterQuery.trim()) return history;
    const q = filterQuery.toLowerCase().trim();
    return history.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.filename?.toLowerCase().includes(q)
    );
  }, [history, filterQuery]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff713f]">
            <Download className="w-3.5 h-3.5" />
            <span>Asset Download History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Downloaded Images
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track and re-download all food photographs saved to this machine.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Download History</span>
          </button>
        )}
      </div>

      {/* Honest Local Storage Notice */}
      <div className="p-4 rounded-2xl bg-[#141a25] border border-amber-500/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-amber-300 block mb-0.5">
            Local Device Storage Notice
          </span>
          Your download history is recorded securely in your browser's <code className="text-amber-300 font-mono">localStorage</code>. This data does not synchronize across separate computers or mobile phones. To persist assets to cloud accounts, connect a backend authentication provider.
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#141a25] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff713f]/15 text-[#ff713f] flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Downloads</span>
            <span className="text-xl font-bold text-white">{history.length} Files</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141a25] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Estimated Storage</span>
            <span className="text-xl font-bold text-white">
              {(history.length * 3.2).toFixed(1)} MB
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141a25] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">License Rights</span>
            <span className="text-xl font-bold text-white">Commercial OK</span>
          </div>
        </div>
      </div>

      {/* Search Filter for History */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter past downloads by dish name or category..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#131924] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff713f]"
          />
        </div>
      )}

      {/* Download History Table / Cards */}
      {filteredHistory.length > 0 ? (
        <div className="rounded-2xl bg-[#141a25] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f141f] border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Dish Asset</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Downloaded</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.svg';
                          }}
                        />
                        <div>
                          <span className="font-bold text-white group-hover:text-[#ff713f] transition-colors block">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.resolution || '3840 x 2880'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.foodType === 'veg' ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Veg
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Non-Veg
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {item.filename}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(item.downloadedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleReDownload(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#ff713f] hover:bg-[#fa5c24] shadow-md shadow-[#ff713f]/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-[#141a25]/60 border border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Downloads Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {filterQuery
              ? `No download history matches "${filterQuery}".`
              : `Browse the gallery and click the orange download icon on any food image to download high-resolution photos.`}
          </p>
        </div>
      )}
    </div>
  );
}
