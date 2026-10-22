import React, { useState } from 'react';
import {
  PlusSquare,
  Send,
  Clock,
  CheckCircle2,
  Camera,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { getPhotoRequests, addPhotoRequest } from '../utils/storage';
import { useToast } from '../context/ToastContext';

export default function RequestPhoto() {
  const [requests, setRequests] = useState(getPhotoRequests());
  const [dishName, setDishName] = useState('');
  const [category, setCategory] = useState('North Indian');
  const [foodType, setFoodType] = useState('veg');
  const [platform, setPlatform] = useState('Zomato & Swiggy');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dishName.trim()) {
      addToast({
        type: 'error',
        title: 'Dish Name Required',
        message: 'Please provide the dish name you would like photographed.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = addPhotoRequest({
        dishName: dishName.trim(),
        category,
        foodType,
        platform,
        priority,
        notes: notes.trim(),
      });

      if (newReq) {
        setRequests(getPhotoRequests());
        addToast({
          type: 'success',
          title: 'Photo Request Submitted!',
          message: `Request for "${dishName}" sent to the Restro Digital Growth studio queue.`,
        });
        setDishName('');
        setNotes('');
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff713f]">
          <PlusSquare className="w-3.5 h-3.5" />
          <span>Studio Custom Shoot</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Request Dish Photography
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Missing a signature dish from your restaurant menu? Request an authentic studio shoot or 3D asset generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Request Form */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141a25] border border-white/5 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#ff713f]/15 text-[#ff713f] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">New Shoot Order</h2>
              <p className="text-xs text-slate-400">
                Turnaround time for Pro subscribers is typically 24-48 hours.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Dish Name *
              </label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Tandoori Soya Chaap, Oreo Waffle Roll..."
                className="w-full h-11 px-3.5 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff713f]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Dietary Classification
                </label>
                <div className="flex items-center gap-2 h-11">
                  <button
                    type="button"
                    onClick={() => setFoodType('veg')}
                    className={`flex-1 h-full rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                      foodType === 'veg'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-[#0e131d] text-slate-400 border-white/10'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoodType('non-veg')}
                    className={`flex-1 h-full rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                      foodType === 'non-veg'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-[#0e131d] text-slate-400 border-white/10'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Non-Veg
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Primary Delivery Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
                >
                  <option value="Zomato & Swiggy">Zomato & Swiggy (Menu Card)</option>
                  <option value="Swiggy Gourmet">Swiggy Gourmet</option>
                  <option value="Zomato Gold Hero">Zomato Gold Banner</option>
                  <option value="Social Media & Instagram">Social Media & Instagram</option>
                  <option value="Print Dine-In Menu">Print Dine-In Menu</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Urgency
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
                >
                  <option value="low">Standard (3-4 Days)</option>
                  <option value="medium">Normal (24-48 Hours)</option>
                  <option value="high">High Priority (24 Hours)</option>
                  <option value="urgent">Urgent Launch (Same Day)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Plating Instructions & Special Garnishes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention desired garnishes, angle (overhead vs 45 degree), dark or rustic background, crockery preference..."
                rows={3}
                className="w-full p-3 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff713f]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#ff713f] to-[#ff4e18] hover:from-[#fa5d24] hover:to-[#e8400b] shadow-xl shadow-[#ff713f]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Queueing Request...' : 'Submit Photo Shoot Request'}</span>
            </button>
          </form>
        </div>

        {/* Requests Queue Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#141a25] border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Your Photo Requests Queue</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                {requests.length} Requests
              </span>
            </h3>

            <div className="space-y-2.5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-[#0e131d] border border-white/5 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-white block">
                      {req.dishName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        req.status === 'Ready for Review'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'In Studio'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                    <span>{req.category}</span>
                    <span>•</span>
                    <span className={req.foodType === 'veg' ? 'text-emerald-400' : 'text-rose-400'}>
                      {req.foodType === 'veg' ? 'Veg' : 'Non-Veg'}
                    </span>
                    <span>•</span>
                    <span>{req.platform}</span>
                  </div>

                  {req.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-white/5 p-1.5 rounded">
                      "{req.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
