import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryFilters from '../components/CategoryFilters';
import FoodTypeFilter from '../components/FoodTypeFilter';
import DisplayToggle from '../components/DisplayToggle';
import FoodCard from '../components/FoodCard';
import ImagePreviewModal from '../components/ImagePreviewModal';
import EmptyState from '../components/EmptyState';
import { INITIAL_FOODS } from '../data/foods';
import { getCustomUploads } from '../utils/storage';

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFoodType, setSelectedFoodType] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [displayMode, setDisplayMode] = useState('standard'); // 'standard' | 'compact' | 'large'
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'name'
  const [activeModalFood, setActiveModalFood] = useState(null);
  const [visibleCount, setVisibleCount] = useState(16);
  const [customUploads, setCustomUploads] = useState(getCustomUploads());

  // Listen to custom upload events
  useEffect(() => {
    const handleUploadsUpdate = () => {
      setCustomUploads(getCustomUploads());
    };
    window.addEventListener('foodimager:uploads-updated', handleUploadsUpdate);
    return () => window.removeEventListener('foodimager:uploads-updated', handleUploadsUpdate);
  }, []);

  // Combined master catalog of all 1,760+ user food images
  const masterCatalog = useMemo(() => {
    return [...customUploads, ...INITIAL_FOODS];
  }, [customUploads]);

  // Reset visible count when filters or search changes
  useEffect(() => {
    setVisibleCount(32);
  }, [searchQuery, selectedCategory, selectedFoodType, sortBy]);

  // Compute Category Counts & Food Type Counts for badges
  const { countsByCategory, typeCounts } = useMemo(() => {
    const catMap = { total: masterCatalog.length };
    const tMap = { all: masterCatalog.length, veg: 0, nonVeg: 0 };

    masterCatalog.forEach((item) => {
      catMap[item.category] = (catMap[item.category] || 0) + 1;
      if (item.foodType === 'veg') tMap.veg += 1;
      if (item.foodType === 'non-veg') tMap.nonVeg += 1;
    });

    return { countsByCategory: catMap, typeCounts: tMap };
  }, [masterCatalog]);

  // Filtered & Sorted Dishes
  const filteredFoods = useMemo(() => {
    let result = [...masterCatalog];

    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'all') {
      result = result.filter(
        (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Food Type Filter (Veg / Non-Veg / All)
    if (selectedFoodType === 'veg') {
      result = result.filter((item) => item.foodType === 'veg');
    } else if (selectedFoodType === 'non-veg') {
      result = result.filter((item) => item.foodType === 'non-veg');
    }

    // 3. Search Query (Case-insensitive across Name, Category, Tags, Filename)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qWords = q.split(/\s+/).filter(Boolean);
      result = result.filter((item) => {
        const name = item.name?.toLowerCase() || '';
        const cat = item.category?.toLowerCase() || '';
        const filename = item.filename?.toLowerCase() || '';
        const tags = item.tags?.join(' ').toLowerCase() || '';
        const haystack = `${name} ${cat} ${filename} ${tags}`;
        return haystack.includes(q) || qWords.every((word) => haystack.includes(word));
      });
    }

    // 4. Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [masterCatalog, selectedCategory, selectedFoodType, searchQuery, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFoodType('all');
    setSortBy('popular');
  };

  // Grid column classes based on display mode
  const gridClasses = useMemo(() => {
    if (displayMode === 'compact') {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5';
    }
    if (displayMode === 'large') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    }
    // Standard: 4 on large, 3 on md, 2 on sm, 1 on xs
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5';
  }, [displayMode]);

  const displayedFoods = filteredFoods.slice(0, visibleCount);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn pt-1">

      {/* Large Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* Category Chips Bar (32 categories) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Categories ({countsByCategory.total} total)</span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-[#ff713f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Category
            </button>
          )}
        </div>
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          countsByCategory={countsByCategory}
        />
      </div>

      {/* Sub-Filters: Veg/Non-Veg + Display Toggle + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-b border-white/5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Veg / Non-Veg / All Tabs */}
          <FoodTypeFilter
            selectedType={selectedFoodType}
            onSelectType={setSelectedFoodType}
            counts={typeCounts}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort dishes"
              className="px-2.5 py-1.5 rounded-xl bg-[#131924] border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff713f] cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Compact Display Toggle */}
          <DisplayToggle
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
          />
        </div>
      </div>

      {/* Image Gallery Grid */}
      {displayedFoods.length > 0 ? (
        <div className={`grid ${gridClasses}`}>
          {displayedFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onOpenPreview={setActiveModalFood}
              aspectRatio={displayMode === 'large' ? 'aspect-[16/10]' : 'aspect-[4/3]'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          searchQuery={searchQuery}
          category={selectedCategory}
          onReset={handleResetFilters}
        />
      )}

      {/* Pagination / Load More Button for 1,000+ Scalability */}
      {filteredFoods.length > visibleCount && (
        <div className="pt-8 flex flex-col items-center justify-center gap-3">
          <p className="text-xs text-slate-400">
            Showing <span className="text-white font-semibold">{visibleCount}</span> of{' '}
            <span className="text-white font-semibold">{filteredFoods.length}</span> images
          </p>

          <button
            onClick={() => setVisibleCount((prev) => prev + 16)}
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#161c28] hover:bg-[#1e2638] border border-white/10 hover:border-[#ff713f]/40 shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
          >
            <span>Load More Food Photos</span>
            <span className="text-[#ff713f] group-hover:translate-y-0.5 transition-transform">↓</span>
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {activeModalFood && (
        <ImagePreviewModal
          food={activeModalFood}
          onClose={() => setActiveModalFood(null)}
        />
      )}
    </div>
  );
}
