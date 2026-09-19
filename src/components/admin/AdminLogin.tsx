import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Lock, Mail, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
  isDark?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
  isDark = true,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Validasi admin email allowlist (opsional jika dikonfigurasi)
      if (userCred.user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('Email atau kata sandi admin tidak cocok.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMsg('Akun admin tidak terdaftar.');
      } else {
        setErrorMsg('Gagal masuk ke panel admin: ' + (err.message || 'Error tidak diketahui'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${
      isDark ? 'bg-[#0B0F19] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 ${
        isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-700/60">
          <button
            type="button"
            onClick={onBackToSite}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Situs Utama</span>
          </button>

          <span className="bg-brand-600/20 text-brand-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-brand-500/30 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Portal CMS Admin
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-heritage-zawo p-0.5 mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Login Portal Admin Riza Apparel</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Masukkan kredensial pemilik/admin untuk mengelola CMS & CRM.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2 animate-slide-up">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className={`text-xs font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Admin
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rizaapparel.web.app"
                className={`w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-brand-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-brand-600'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Kata Sandi Admin
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-brand-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-brand-600'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>{isLoading ? 'Memverifikasi Access...' : 'Masuk ke Dashboard Admin'}</span>
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500">
          Akses terbatas hanya untuk Pemilik Riza Apparel Ende, NTT 🇮🇩
        </p>
      </div>
    </div>
  );
};
