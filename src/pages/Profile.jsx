import React, { useState } from 'react';
import {
  User,
  Building2,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../utils/storage';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const [profile, setProfile] = useState(getUserProfile());
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  const handleFieldChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      saveUserProfile(profile);
      setIsSaving(false);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your restaurant visual branding profile has been saved.',
      });
    }, 300);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff713f]">
          <User className="w-3.5 h-3.5" />
          <span>Restaurant Account Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Brand & Chef Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your restaurant details, culinary branding preferences, and default download settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Identity & Avatar */}
        <div className="p-6 rounded-3xl bg-[#141a25] border border-white/5 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
            <User className="w-4 h-4 text-[#ff713f]" />
            <span>Profile Identity</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-[#ff713f]/40 shadow-xl shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';
                }}
              />
            </div>

            <div className="flex-1 w-full space-y-1 text-center sm:text-left">
              <span className="font-bold text-white text-base block">{profile.fullName}</span>
              <span className="text-xs text-slate-400 block">{profile.role}</span>
              <span className="text-xs text-[#ff713f] font-medium block">
                {profile.restaurantName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Restaurant & Kitchen Details */}
        <div className="p-6 rounded-3xl bg-[#141a25] border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
            <Building2 className="w-4 h-4 text-[#ff713f]" />
            <span>Restaurant Brand Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Restaurant / Brand Name
              </label>
              <input
                type="text"
                value={profile.restaurantName}
                onChange={(e) => handleFieldChange('restaurantName', e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => handleFieldChange('role', e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Culinary Bio & Kitchen Concept
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
            />
          </div>
        </div>

        {/* Card 3: Download & Output Preferences */}
        <div className="p-6 rounded-3xl bg-[#141a25] border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
            <Sliders className="w-4 h-4 text-[#ff713f]" />
            <span>Asset Export Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Download Format
              </label>
              <select
                value={profile.defaultDownloadFormat || 'original'}
                onChange={(e) => handleFieldChange('defaultDownloadFormat', e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#0e131d] border border-white/10 text-xs text-white focus:outline-none focus:border-[#ff713f]"
              >
                <option value="original">Original Ultra-HD 4K (3840 x 2880)</option>
                <option value="web">Web-Optimized 1080p (Zomato Recommended)</option>
                <option value="square">Square 1:1 (Swiggy Item Card)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e131d] border border-white/10 self-end">
              <div>
                <span className="text-xs font-bold text-white block">Commercial License Included</span>
                <span className="text-[11px] text-slate-400 block">
                  Royalty-free for food aggregators
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#ff713f] to-[#ff4e18] hover:from-[#fa5d24] hover:to-[#e8400b] shadow-xl shadow-[#ff713f]/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
