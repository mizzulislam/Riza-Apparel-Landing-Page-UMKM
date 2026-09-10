import React from 'react';
import { X, FileCheck2, AlertCircle, Sparkles, CheckCircle2, ShieldCheck, Download, HelpCircle } from 'lucide-react';

interface PrintGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const PrintGuidelinesModal: React.FC<PrintGuidelinesModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Standar & Persyaratan File Cetak Sublimasi
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Pedoman file untuk hasil cetak tajam, warna akurat, dan tidak pecah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          
          {/* Main 4 Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Format File */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2`}>
              <div className="flex items-center gap-2 text-brand-500 font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">1</span>
                <span>Format File yang Diterima</span>
              </div>
              <ul className={`space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Format Vektor (Sangat Direkomendasikan):</strong> SVG, PDF, AI, EPS, CDR. Bebas pecah saat di-zoom ukuran jumbo.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Format Raster / Gambar:</strong> PNG (latar belakang transparan) atau JPG/TIFF resolusi tinggi.</span>
                </li>
              </ul>
            </div>

            {/* 2. Resolusi & DPI */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2`}>
              <div className="flex items-center gap-2 text-brand-500 font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">2</span>
                <span>Resolusi & Kerapatan Titik (DPI)</span>
              </div>
              <ul className={`space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Minimal 300 DPI</strong> pada ukuran skala cetak 1:1.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Mesin sublimasi digital Epson SureColor kami mencetak hingga <strong>1440 DPI</strong> dengan tinta UltraChrome original.</span>
                </li>
              </ul>
            </div>

            {/* 3. Profil Warna */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2`}>
              <div className="flex items-center gap-2 text-brand-500 font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">3</span>
                <span>Profil Warna (Color Mode)</span>
              </div>
              <ul className={`space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Gunakan mode warna <strong>CMYK (FOGRA39 / Japan Color)</strong> atau <strong>sRGB</strong> standar.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Hindari warna neon glow sintetis tanpa profil warna agar hasil transfer heat-press presisi dengan layar.</span>
                </li>
              </ul>
            </div>

            {/* 4. Area Aman & Bleed */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2`}>
              <div className="flex items-center gap-2 text-brand-500 font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">4</span>
                <span>Area Aman (Safe Zone) & Bleed</span>
              </div>
              <ul className={`space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Beri jarak batas aman <strong>minimal 2.5 - 3 cm</strong> dari tepi jahitan leher, ketiak, dan keliman pinggang.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Pola latar belakang dibuat melebihi batas potong (bleed +1.5 cm) untuk menghindari tepi putih tak sengaja.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Complimentary Redraw Service Notice */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark 
              ? 'bg-gradient-to-r from-brand-950/80 to-amber-950/40 border-brand-500/30' 
              : 'bg-gradient-to-r from-brand-50 to-amber-50 border-brand-200'
          }`}>
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-500 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Belum Memiliki File Vektor Siap Cetak?
              </h4>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Jangan khawatir! Jika Anda hanya memiliki foto kaos lama, sketsa di kertas, atau logo beresolusi rendah, <strong>tim desain grafis RIZA APPAREL siap membantu redrawing (vektorisasi ulang) secara GRATIS</strong> untuk setiap pemesanan jersey tim.
              </p>
            </div>
          </div>

          {/* Tips for Best Sublimation */}
          <div className={`flex items-center justify-between p-3 rounded-lg border text-[11px] ${
            isDark 
              ? 'bg-slate-800/40 border-slate-700/60 text-slate-400' 
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Maksimum ukuran unggahan file langsung di website: <strong>25 MB</strong>
            </span>
            <span className="font-semibold text-emerald-500">Tinta Anti-Luntur Bergaransi</span>
          </div>

        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'}`}>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>RIZA APPAREL Ende Production Standard</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
