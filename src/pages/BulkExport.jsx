import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import {
  FileArchive,
  CheckSquare,
  Square,
  DownloadCloud,
  Check,
  Search,
  AlertCircle,
  Sparkles,
  Loader2,
  Filter,
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import FoodTypeFilter from '../components/FoodTypeFilter';
import { INITIAL_FOODS, generateExpandedCatalog } from '../data/foods';
import { getCustomUploads, addDownloadRecord, incrementDownloadCount } from '../utils/storage';
import { CATEGORIES } from '../data/categories';
import { useToast } from '../context/ToastContext';

export default function BulkExport() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFoodType, setSelectedFoodType] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0, text: '' });
  const { addToast } = useToast();

  const allFoods = useMemo(() => {
    const custom = getCustomUploads();
    return [...custom, ...INITIAL_FOODS];
  }, []);

  // Filtered dataset
  const filteredFoods = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const qWords = q ? q.split(/\s+/).filter(Boolean) : [];

    return allFoods.filter((item) => {
      const matchCat =
        selectedCategory === 'All' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchType =
        selectedFoodType === 'all' || item.foodType === selectedFoodType;

      let matchSearch = true;
      if (q) {
        const name = item.name?.toLowerCase() || '';
        const cat = item.category?.toLowerCase() || '';
        const filename = item.filename?.toLowerCase() || '';
        const tags = item.tags?.join(' ').toLowerCase() || '';
        const haystack = `${name} ${cat} ${filename} ${tags}`;
        matchSearch = haystack.includes(q) || qWords.every((w) => haystack.includes(w));
      }

      return matchCat && matchType && matchSearch;
    });
  }, [allFoods, selectedCategory, selectedFoodType, searchQuery]);

  // Compute Veg/Non-Veg counts
  const typeCounts = useMemo(() => {
    const tMap = { all: allFoods.length, veg: 0, nonVeg: 0 };
    allFoods.forEach((item) => {
      if (item.foodType === 'veg') tMap.veg += 1;
      if (item.foodType === 'non-veg') tMap.nonVeg += 1;
    });
    return tMap;
  }, [allFoods]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const currentFilteredIds = filteredFoods.map((f) => f.id);
    const allSelected = currentFilteredIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Deselect filtered
      setSelectedIds((prev) => prev.filter((id) => !currentFilteredIds.includes(id)));
    } else {
      // Add all filtered to selection
      const union = Array.from(new Set([...selectedIds, ...currentFilteredIds]));
      setSelectedIds(union);
    }
  };

  const areAllFilteredSelected =
    filteredFoods.length > 0 &&
    filteredFoods.every((item) => selectedIds.includes(item.id));

  const handleExportZip = async () => {
    if (selectedIds.length === 0) {
      addToast({
        type: 'info',
        title: 'No Images Selected',
        message: 'Please choose at least one dish to package into ZIP.',
      });
      return;
    }

    const selectedItems = allFoods.filter((f) => selectedIds.includes(f.id));
    setIsExporting(true);
    setExportProgress({ current: 0, total: selectedItems.length, text: 'Initializing ZIP archive...' });

    try {
      const zip = new JSZip();
      const folder = zip.folder('RestroDigitalGrowth_Assets');

      let completedCount = 0;
      let failureCount = 0;

      for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        setExportProgress({
          current: i + 1,
          total: selectedItems.length,
          text: `Fetching ${item.name} (${i + 1}/${selectedItems.length})...`,
        });

        try {
          const response = await fetch(item.image);
          if (!response.ok) throw new Error('Fetch failed');
          const blob = await response.blob();

          const cleanName = item.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          const ext = item.filename?.split('.').pop() || 'jpg';
          const filename = `${cleanName}.${ext}`;

          folder.file(filename, blob);
          addDownloadRecord(item);
          incrementDownloadCount();
          completedCount++;
        } catch (fetchErr) {
          console.warn(`Could not add ${item.name} to zip:`, fetchErr);
          failureCount++;
        }
      }

      setExportProgress({
        current: selectedItems.length,
        total: selectedItems.length,
        text: 'Compressing archive...',
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const dateStr = new Date().toISOString().split('T')[0];
      const zipFilename = `RestroDigitalGrowth_Batch_${dateStr}.zip`;
      saveAs(zipBlob, zipFilename);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ff713f', '#10b981', '#f59e0b'],
      });

      addToast({
        type: 'success',
        title: 'Bulk Export Complete',
        message: `Packed ${completedCount} food images into ${zipFilename}!`,
      });

      setSelectedIds([]);
    } catch (err) {
      console.error('ZIP export error:', err);
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: err.message || 'An error occurred during ZIP compression.',
      });
    } finally {
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0, text: '' });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff713f]">
            <FileArchive className="w-3.5 h-3.5" />
            <span>Multi-Asset Batch Export</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Bulk ZIP Export
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Select multiple food photography assets and download them simultaneously as a compressed ZIP file.
          </p>
        </div>

        {/* Selected Count & Download Action */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#141a25] border border-white/10 text-xs text-slate-300">
            Selected: <span className="text-[#ff713f] font-bold">{selectedIds.length}</span> images
          </div>

          <button
            onClick={handleExportZip}
            disabled={selectedIds.length === 0 || isExporting}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#ff713f] to-[#ff4e18] hover:from-[#fa5d24] hover:to-[#e8400b] shadow-lg shadow-[#ff713f]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting ZIP...</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4" />
                <span>Download ZIP ({selectedIds.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export Progress Bar Overlay */}
      {isExporting && (
        <div className="p-4 rounded-2xl bg-[#141a25] border border-[#ff713f]/40 shadow-xl space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#ff713f] animate-spin" />
              {exportProgress.text}
            </span>
            <span className="text-[#ff713f] font-mono font-bold">
              {Math.round((exportProgress.current / (exportProgress.total || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff713f] to-amber-400 rounded-full transition-all duration-300"
              style={{
                width: `${(exportProgress.current / (exportProgress.total || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Control Bar: Select All / Search / Category Filter */}
      <div className="p-4 rounded-2xl bg-[#141a25] border border-white/5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAllFiltered}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                areAllFilteredSelected
                  ? 'bg-[#ff713f] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {areAllFilteredSelected ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>
                {areAllFilteredSelected ? 'Deselect All Filtered' : 'Select All Filtered'}
              </span>
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes to select..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#0e131d] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff713f]"
            />
          </div>
        </div>

        {/* Secondary Category & Veg Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <FoodTypeFilter
            selectedType={selectedFoodType}
            onSelectType={setSelectedFoodType}
            counts={typeCounts}
          />
        </div>
      </div>

      {/* Gallery with Checkboxes */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              isSelectable={true}
              isSelected={selectedIds.includes(food.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-[#141a25]/60 border border-white/5">
          <p className="text-xs text-slate-400">No dishes match your selection filters.</p>
        </div>
      )}
    </div>
  );
}
