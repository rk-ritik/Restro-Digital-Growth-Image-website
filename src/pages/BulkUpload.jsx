import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileImage,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { addCustomUploads } from '../utils/storage';
import { useToast } from '../context/ToastContext';

export default function BulkUpload() {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleFiles = (files) => {
    const validImageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (validImageFiles.length === 0) {
      addToast({
        type: 'error',
        title: 'Invalid Files',
        message: 'Please choose JPEG, PNG, or WebP image files.',
      });
      return;
    }

    const newItems = validImageFiles.map((file, idx) => {
      // Auto-clean filename for dish title
      const baseName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        id: `upload-${Date.now()}-${idx}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: baseName,
        category: 'North Indian',
        foodType: 'veg',
        tags: 'custom, menu-item, fresh',
        filename: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        resolution: 'Uploaded Native',
        downloads: 0,
        isPlaceholder: false,
      };
    });

    setStagedFiles((prev) => [...prev, ...newItems]);
    addToast({
      type: 'info',
      title: 'Files Added to Queue',
      message: `${validImageFiles.length} images staged for metadata review.`,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (id, field, value) => {
    setStagedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemove = (id) => {
    setStagedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePublishToGallery = () => {
    if (stagedFiles.length === 0) return;

    // Convert staged items to gallery schema
    const formatted = stagedFiles.map((item) => ({
      id: item.id,
      name: item.name.trim() || 'Untitled Dish',
      image: item.previewUrl,
      category: item.category,
      foodType: item.foodType,
      tags: item.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      filename: item.filename,
      resolution: item.resolution,
      fileSize: item.fileSize,
      downloads: 0,
      isPlaceholder: false,
      rating: 5.0,
      description: `Custom restaurant upload of ${item.name}.`,
    }));

    addCustomUploads(formatted);

    addToast({
      type: 'success',
      title: 'Added to Gallery!',
      message: `Successfully merged ${formatted.length} new dishes into your live local gallery!`,
    });

    setStagedFiles([]);
    navigate('/');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff713f]">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Restaurant Asset Intake</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Bulk Food Photo Upload
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Stage multiple food photographs, assign menu metadata, and preview them live in the gallery.
        </p>
      </div>

      {/* Honest Prototype Storage Limitation Notice */}
      <div className="p-4 rounded-2xl bg-[#141a25] border border-amber-500/25 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-amber-300 block mb-0.5">
            Storage Limitation Disclaimer (Frontend Prototype)
          </span>
          Browser-selected files and metadata are previewed via temporary in-memory Object URLs and preserved in your browser's local session. In this frontend prototype, images are <strong>not</strong> permanently hosted on a cloud storage bucket (e.g. AWS S3, Cloudinary, or Supabase). To enable permanent cross-user uploads, connect a storage backend via an API endpoint.
        </div>
      </div>

      {/* Drag & Drop Filezone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-[#ff713f] bg-[#ff713f]/10 scale-[1.01]'
            : 'border-white/10 hover:border-white/20 bg-[#121722]'
        }`}
      >
        <input
          type="file"
          id="fileUploadInput"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="w-16 h-16 rounded-2xl bg-[#ff713f]/15 text-[#ff713f] flex items-center justify-center mx-auto mb-4 pointer-events-none">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-white pointer-events-none">
          Choose Food Photos or Drag & Drop Here
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 pointer-events-none max-w-sm mx-auto">
          Supports JPEG, PNG, and WebP studio images. Select multiple files at once.
        </p>

        <label
          htmlFor="fileUploadInput"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#ff713f] hover:bg-[#fa5d24] shadow-lg shadow-[#ff713f]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Browse Files on Computer</span>
        </label>
      </div>

      {/* Staged Upload Items Review */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Review Staged Photos</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ff713f]/20 text-[#ff713f] text-xs font-bold">
                {stagedFiles.length}
              </span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStagedFiles([])}
                className="text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 transition-colors"
              >
                Discard All
              </button>

              <button
                onClick={handlePublishToGallery}
                className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Add All to Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {stagedFiles.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#141a25] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all"
              >
                {/* Thumbnail Preview */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
                  {/* Dish Name */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                      placeholder="e.g. Butter Paneer"
                      className="w-full h-9 px-3 rounded-lg bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Category *
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => handleInputChange(item.id, 'category', e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Food Type */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Dietary Type
                    </label>
                    <div className="flex items-center gap-1.5 h-9">
                      <button
                        type="button"
                        onClick={() => handleInputChange(item.id, 'foodType', 'veg')}
                        className={`flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border ${
                          item.foodType === 'veg'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-[#0e131d] text-slate-400 border-white/10'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange(item.id, 'foodType', 'non-veg')}
                        className={`flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border ${
                          item.foodType === 'non-veg'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : 'bg-[#0e131d] text-slate-400 border-white/10'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Non-Veg
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Keywords / Tags
                    </label>
                    <input
                      type="text"
                      value={item.tags}
                      onChange={(e) => handleInputChange(item.id, 'tags', e.target.value)}
                      placeholder="spicy, cheese, starter"
                      className="w-full h-9 px-3 rounded-lg bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
                    />
                  </div>
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors self-end md:self-center"
                  title="Remove photo"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
