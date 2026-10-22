import React, { useState } from 'react';
import { Flag, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ReportModal({ food, onClose }) {
  const [reason, setReason] = useState('category');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  if (!food) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Report Received',
      message: `Thank you for reporting "${food.name}". Our studio QA team will review it.`,
    });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-[#141a25] border border-white/10 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-slate-400 mt-1">
              Thank you for keeping Restro Digital Growth asset standards high.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Report Food Image</h3>
                <p className="text-xs text-slate-400 truncate max-w-[260px]">
                  {food.name} ({food.category})
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                What is the issue with this photograph?
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'category', label: 'Wrong category or cuisine label' },
                  { id: 'foodType', label: 'Incorrect Veg / Non-Veg classification' },
                  { id: 'quality', label: 'Blurry, low resolution, or distorted' },
                  { id: 'dishName', label: 'Dish looks different from the name' },
                  { id: 'copyright', label: 'Watermark or licensing concern' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                      reason === item.id
                        ? 'bg-[#ff713f]/10 border-[#ff713f]/40 text-white font-medium'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={item.id}
                      checked={reason === item.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-[#ff713f]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe how this photo or tag should be corrected..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff713f]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/25 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
