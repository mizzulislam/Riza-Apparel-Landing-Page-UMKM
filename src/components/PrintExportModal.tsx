import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileCheck, 
  Printer, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck,
  FileCode
} from 'lucide-react';
import { DesignState, ViewAngleId } from '../types';
import { renderJerseyToCanvas, downloadCanvasImage, downloadSVGVectorFile } from '../lib/print-exporter';
import { trackEvent } from '../lib/analytics';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: DesignState;
  isDark?: boolean;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  design,
  isDark = true,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'png' | 'svg' | 'specs'>('png');
  const [exportProgress, setExportProgress] = useState<string>('');
  const [completedAngles, setCompletedAngles] = useState<string[]>([]);

  if (!isOpen) return null;

  const angles: { id: ViewAngleId; label: string; fileSuffix: string }[] = [
    { id: 'front', label: 'Tampak Depan (Front)', fileSuffix: 'depan' },
    { id: 'back', label: 'Tampak Belakang (Back)', fileSuffix: 'belakang' },
    { id: 'sleeve-left', label: 'Lengan Kiri (Left Sleeve)', fileSuffix: 'lengan-kiri' },
    { id: 'sleeve-right', label: 'Lengan Kanan (Right Sleeve)', fileSuffix: 'lengan-kanan' },
  ];

  const handleExportSinglePNG = async (angle: ViewAngleId, label: string) => {
    try {
      setIsExporting(true);
      setExportProgress(`Mengolah file resolusi tinggi ${label}...`);
      
      const canvas = await renderJerseyToCanvas(design, angle, 5); // 5x scale => 3000x3400px (≥150 DPI)
      const cleanName = (design.playerName || 'JERSEY').toLowerCase().replace(/[^a-z0-9]/g, '_');
      downloadCanvasImage(canvas, `riza_apparel_150dpi_${cleanName}_${angle}.png`, 'image/png');
      
      setCompletedAngles((prev) => [...prev, angle]);
      trackEvent('export_design_png', { angle, dpi: 150 });
    } catch (e) {
      console.error('Error exporting PNG:', e);
      alert('Gagal mengekspor file cetak. Silakan coba kembali.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handleExportAllPNGBundle = async () => {
    try {
      setIsExporting(true);
      setCompletedAngles([]);
      const cleanName = (design.playerName || 'JERSEY').toLowerCase().replace(/[^a-z0-9]/g, '_');

      for (const item of angles) {
        setExportProgress(`Mengolah ${item.label} (3000px, 150+ DPI)...`);
        const canvas = await renderJerseyToCanvas(design, item.id, 5);
        downloadCanvasImage(canvas, `riza_apparel_150dpi_${cleanName}_${item.fileSuffix}.png`, 'image/png');
        setCompletedAngles((prev) => [...prev, item.id]);
        await new Promise((r) => setTimeout(r, 400));
      }

      trackEvent('export_design_bundle', { total: angles.length });
    } catch (e) {
      console.error('Error exporting bundle:', e);
      alert('Gagal mengekspor paket file cetak.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handleExportSVGVector = async (angle: ViewAngleId) => {
    try {
      setIsExporting(true);
      setExportProgress(`Meng-generate vektor SVG layer ${angle}...`);
      
      const cleanName = (design.playerName || 'JERSEY').toLowerCase().replace(/[^a-z0-9]/g, '_');
      await downloadSVGVectorFile(design, angle, `riza_apparel_vector_${cleanName}_${angle}.svg`);
      
      trackEvent('export_design_svg', { angle });
    } catch (e) {
      console.error('Error exporting SVG:', e);
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-colors max-h-[90vh] ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600/20 text-brand-500 border border-brand-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ekspor File Siap Cetak Sublimasi (≥150 DPI)
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Format High-Res 3000px & Lapisan Vektor SVG untuk Industri Konveksi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Tabs */}
        <div className={`px-5 pt-3 border-b flex items-center gap-2 ${
          isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('png')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'png'
                ? 'border-brand-500 text-brand-500 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>High-Res PNG (150+ DPI)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('svg')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'svg'
                ? 'border-brand-500 text-brand-500 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Layer Vektor SVG (FR-D2)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'specs'
                ? 'border-brand-500 text-brand-500 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Spesifikasi Produksi</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

          {/* TAB 1: PNG 150+ DPI */}
          {activeTab === 'png' && (
            <div className="space-y-5">
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isDark ? 'bg-brand-950/30 border-brand-500/30 text-slate-300' : 'bg-brand-50 border-brand-200 text-slate-800'
              }`}>
                <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-extrabold block text-brand-500">Standar Cetak Industri Sublimasi RIZA APPAREL</span>
                  <p className="leading-relaxed">
                    Setiap file dirender pada resolusi 3000 x 3400 piksel dengan ketajaman warna HSL terkalibrasi. Siap langsung di-print pada kertas transfer sublimasi Drifit Milano 160GSM.
                  </p>
                </div>
              </div>

              {/* Progress status if working */}
              {isExporting && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-pulse ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 animate-spin text-brand-500" />
                    <span className="text-xs font-bold">{exportProgress}</span>
                  </div>
                </div>
              )}

              {/* Bundle Download CTA */}
              <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg ${
                isDark ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h4 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Download Bundle 4-Sudah Pandang (Semua Angle)
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Depan, Belakang, Lengan Kiri, Lengan Kanan sekaligus dalam 1 klik
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExportAllPNGBundle}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 active:scale-[0.98] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] whitespace-nowrap disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Paket Bundle 4 PNG</span>
                </button>
              </div>

              {/* Individual Angle Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {angles.map((item) => {
                  const isDone = completedAngles.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                        isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                      }`}
                    >
                      <div>
                        <span className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {item.label}
                        </span>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          3000 x 3400px (PNG)
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={() => handleExportSinglePNG(item.id, item.label)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                          isDone
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                            : isDark ? 'border-slate-700 hover:border-slate-600 bg-slate-900 text-slate-300' : 'border-slate-300 bg-slate-100 text-slate-800'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{isDone ? 'Tersimpan' : 'Download'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SVG VECTOR LAYERS */}
          {activeTab === 'svg' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isDark ? 'bg-slate-800/70 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}>
                <FileCode className="w-5 h-5 text-heritage-zawo shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-extrabold block text-heritage-zawo">Lapisan Vektor SVG Siap Cetak (FR-D2)</span>
                  <p className="leading-relaxed">
                    File SVG mengandung seluruh kurva vektor motif Ende Zawo, Flores Waves, tipografi nama, serta emblem sponsor yang dapat dibuka di CorelDRAW, Adobe Illustrator, atau Inkscape.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {angles.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        SVG Vector ({item.label})
                      </span>
                      <span className="text-[10px] text-brand-400 font-mono">Format Vektor Scalable</span>
                    </div>
                    <button
                      type="button"
                      disabled={isExporting}
                      onClick={() => handleExportSVGVector(item.id)}
                      className="py-2 px-3 rounded-xl bg-heritage-zawo hover:bg-amber-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shrink-0 min-h-[38px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>SVG Vektor</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTION SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Rincian Lembar Kerja Produksi (Job Sheet)</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Nama Pemain</span>
                    <span className="font-extrabold text-white">{design.playerName || 'EUGENIO'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Nomor Punggung</span>
                    <span className="font-extrabold text-white">{design.playerNumber || '10'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Model Kerah</span>
                    <span className="font-extrabold text-white">{design.collarStyle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Motif Utama</span>
                    <span className="font-extrabold text-white">{design.motifTemplate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Warna Utama Hex</span>
                    <span className="font-extrabold font-mono text-white">{design.baseColor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Warna Sekunder Hex</span>
                    <span className="font-extrabold font-mono text-white">{design.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isDark ? 'bg-slate-800/40 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <span className="font-bold text-white block">Catatan Konveksi:</span>
                <p>• Kain: Drifit Milano High-Grade (160 GSM, Anti-Bakteri & Quick-Dry)</p>
                <p>• Cetak: Sublimasi Full-Print (Tinta Epson UltraChrome DS Anti-Luntur)</p>
                <p>• Jahitan: Overdeck 3-Jarum Presisi Standar Jersey Kompetisi</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-end ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Tutup Modal
          </button>
        </div>

      </div>
    </div>
  );
};
