import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Menu, FileArchive } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Gallery from './pages/Gallery';
import Downloads from './pages/Downloads';
import RequestPhoto from './pages/RequestPhoto';
import BulkExport from './pages/BulkExport';
import BulkUpload from './pages/BulkUpload';
import Profile from './pages/Profile';
import Login from './pages/Login';

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex">
      {/* Fixed Left Sidebar (Desktop) & Collapsible Drawer (Mobile) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Mobile Top Header */}
        <header className="sticky top-0 z-30 h-16 px-4 bg-[#0e131d]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/5 p-0.5 border border-white/10 flex items-center justify-center shrink-0">
              <img
                src="/logo.jpeg"
                alt="Restro Digital Growth Logo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="font-extrabold text-base text-white">
              Restro <span className="text-[#ff713f]">Digital Growth</span>
            </span>
          </Link>

          <Link
            to="/bulk-export"
            className="p-2 rounded-xl text-slate-300 hover:text-[#ff713f] hover:bg-white/5 transition-colors"
            title="Bulk ZIP Export"
          >
            <FileArchive className="w-5 h-5" />
          </Link>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/request-photo" element={<RequestPhoto />} />
            <Route path="/bulk-export" element={<BulkExport />} />
            <Route path="/bulk-upload" element={<BulkUpload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
