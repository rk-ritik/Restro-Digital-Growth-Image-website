import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Image as ImageIcon,
  Download,
  PlusSquare,
  FileArchive,
  UploadCloud,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Gallery', path: '/', icon: ImageIcon, badge: null },
    { name: 'Downloads', path: '/downloads', icon: Download, badge: null },
    { name: 'Request Photo', path: '/request-photo', icon: PlusSquare, badge: 'New' },
    { name: 'Bulk Export', path: '/bulk-export', icon: FileArchive, badge: 'ZIP' },
    { name: 'Bulk Upload', path: '/bulk-upload', icon: UploadCloud, badge: null },
    { name: 'Profile', path: '/profile', icon: User, badge: null },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out of your Restro Digital Growth session.',
    });
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#0e131d] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/5 shrink-0">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/5 p-0.5 border border-white/10 shadow-lg shadow-[#ff713f]/10 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <img
                src="/logo.jpeg"
                alt="Restro Digital Growth Logo"
                className="w-full h-full object-cover rounded-[9px]"
              />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-[15px] tracking-tight text-white block leading-tight truncate">
                Restro <span className="text-[#ff713f]">Digital Growth</span>
              </span>
              <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                Food Brands & Assets
              </p>
            </div>
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Asset Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-[#ff713f] to-[#ff561f] text-white font-semibold shadow-lg shadow-[#ff713f]/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#ff713f]'
                          }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive
                            ? 'bg-white/20 text-white'
                            : item.badge === 'ZIP'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-[#ff713f]/20 text-[#ff713f] border border-[#ff713f]/30'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Sign Out Area */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-[#0b0e15]/80">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-transform group-hover:-translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#141a25] border border-white/10 p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Sign out of Restro Digital Growth?</h3>
            <p className="text-sm text-slate-400 mt-1.5">
              You will need to sign in again to access customized restaurant downloads and photo requests.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
