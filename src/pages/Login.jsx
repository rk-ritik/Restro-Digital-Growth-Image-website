import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Destination route after login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!loginId.trim()) {
      setError('Please enter your Login ID or Email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your Password.');
      return;
    }

    setIsLoading(true);

    // Simulate crisp auth response
    setTimeout(() => {
      const result = login(loginId, password, rememberMe);
      setIsLoading(false);

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: 'Successfully signed in to Restro Digital Growth.',
        });
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Invalid credentials.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-[#090c13] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#ff713f] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#ff713f]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="rounded-3xl bg-[#101521]/90 backdrop-blur-2xl border border-white/10 p-7 sm:p-9 shadow-2xl shadow-black/70">
          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-7">
            <div className="inline-flex p-1 rounded-2xl bg-gradient-to-br from-[#ff713f]/30 to-emerald-500/20 border border-white/15 shadow-xl shadow-[#ff713f]/10">
              <div className="w-16 h-14 rounded-[14px] overflow-hidden bg-black/40 flex items-center justify-center p-0.5">
                <img
                  src="/logo.jpeg"
                  alt="Restro Digital Growth"
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight leading-tight">
                Restro <span className="text-[#ff713f]">Digital Growth</span>
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-400 mt-1 font-medium">
                Food Brands & Photography Asset Library
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authorized Access Portal</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login ID Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Login ID / Username
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your Login ID or Email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-[#0c1017] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff713f] focus:ring-2 focus:ring-[#ff713f]/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-[#0c1017] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff713f] focus:ring-2 focus:ring-[#ff713f]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-[#0c1017] text-[#ff713f] focus:ring-[#ff713f] focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff713f] to-[#e85b27] hover:from-[#ff7f52] hover:to-[#f06835] text-white font-bold text-sm shadow-lg shadow-[#ff713f]/25 hover:shadow-[#ff713f]/40 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Library</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-500 mt-5">
          &copy; {new Date().getFullYear()} Restro Digital Growth &bull; All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
