import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Box, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Save, 
  Check,
  MessageCircle,
  Undo2,
  Redo2,
  Ruler,
  FileText
} from 'lucide-react';
import { DesignState, ViewAngleId, StudioModeId, MotifTemplateId, CollarStyleId } from '../types';
import { JerseyCanvas2D } from './JerseyCanvas2D';
import { JerseyCanvas3D } from './JerseyCanvas3D';
import { StudioSidebar } from './StudioSidebar';
import { SizeChartModal } from './SizeChartModal';
import { PrintGuidelinesModal } from './PrintGuidelinesModal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const STORAGE_KEY = 'riza_apparel_studio_design_v4';

const DEFAULT_STATE: DesignState = {
  mode: '2d',
  viewSide: 'front',
  baseColor: '#881337',
  motifTemplate: 'ende-diamond',
  secondaryColor: '#F59E0B',
  accentColor: '#FFFFFF',
  collarColor: '#F59E0B',
  nameColor: '#FFFFFF',
  numberColor: '#F59E0B',
  numberStrokeColor: '#111827',
  sponsorColor: '#FFFFFF',
  collarStyle: 'v-neck',
  
  // Typography
  playerName: 'EUGENIO',
  playerNumber: '10',
  fontFamily: 'Teko',
  nameFontSize: 19,
  numberFontSize: 82,
  fontWeight: '900',
  isItalic: false,
  isUnderline: false,
  textAlignment: 'center',
  letterSpacing: 2,
  strokeWidth: 2,
  strokeColor: '#0F172A',
  elementOpacity: 100,
  hasTextOutline: true,

  // Sponsor
  sponsorLogoPosition: 'chest',
  sponsorText: 'RIZA SPORT',
  sponsorScale: 1.0,

  // Sizing
  jerseySize: 'L',

  // Motif scale
  customPatternScale: 60,

  // Layers
  layers: [
    { id: 'collar', label: 'Model & Kerah Jersey', visible: true },
    { id: 'typography', label: 'Nama & Nomor Pemain', visible: true },
    { id: 'sponsor', label: 'Logo Sponsor & Emblem Tim', visible: true },
    { id: 'motif', label: 'Motif & Template Desain', visible: true },
    { id: 'base', label: 'Bahan & Warna Dasar Jersey', visible: true },
  ],

  quantity: 12,
  zoomLevel: 1.0,
};

interface DesignStudioProps {
  isDark?: boolean;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({ isDark = true }) => {
  const [design, setDesign] = useState<DesignState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('SessionStorage load fallback');
    }
    return DEFAULT_STATE;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isPrintGuidelinesOpen, setIsPrintGuidelinesOpen] = useState(false);

  // Undo & Redo History Management
  const [history, setHistory] = useState<DesignState[]>([design]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(design));
    } catch (e) {
      console.warn('SessionStorage save error');
    }
  }, [design]);

  const handleUpdateDesign = (updates: Partial<DesignState>) => {
    setDesign((prev) => {
      const next = { ...prev, ...updates };
      setHistory((prevHist) => {
        const sliced = prevHist.slice(0, historyIndex + 1);
        const updated = [...sliced, next];
        if (updated.length > 30) updated.shift();
        return updated;
      });
      setHistoryIndex((prevIdx) => Math.min(prevIdx + 1, 29));
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setDesign(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setDesign(history[newIndex]);
    }
  };

  const handleReset = () => {
    setDesign(DEFAULT_STATE);
    setHistory([DEFAULT_STATE]);
    setHistoryIndex(0);
  };

  const syncOrderToFirestore = async (actionType: 'saved' | 'whatsapp') => {
    try {
      await addDoc(collection(db, 'customOrders'), {
        customerName: design.playerName?.trim() || 'Pelanggan Riza Apparel',
        whatsapp: '6281246917740',
        teamName: design.sponsorText?.trim() || 'Custom Team',
        jerseyType: `${design.motifTemplate} (${design.mode.toUpperCase()})`,
        quantity: design.quantity || 12,
        notes: `Aksi: ${actionType}, Kerah: ${design.collarStyle}, Nomor: ${design.playerNumber}, Warna: ${design.baseColor}/${design.secondaryColor}, Ukuran: ${design.jerseySize}`,
        status: 'new',
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }
  };

  const handleSaveSession = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(design));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      syncOrderToFirestore('saved');
    } catch (e) {
      console.warn('Save failed');
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    setDesign((prev) => {
      let newZoom = prev.zoomLevel;
      if (direction === 'in') newZoom = Math.min(1.4, prev.zoomLevel + 0.1);
      if (direction === 'out') newZoom = Math.max(0.7, prev.zoomLevel - 0.1);
      if (direction === 'reset') newZoom = 1.0;
      return { ...prev, zoomLevel: Number(newZoom.toFixed(1)) };
    });
  };

  // WhatsApp Format URL with all customized parameters
  const generateWhatsAppLink = () => {
    const motifLabels: Record<string, string> = {
      'ende-diamond': 'Ende Diamond Zawo',
      'ende-zawo': 'Ende Zawo Ikat',
      'flores-wave': 'Flores Ocean Waves',
      'flores-waves': 'Flores Ocean Waves',
      'kelimutu-crater': 'Kelimutu Tri-Crater',
      'athletic-minimal': 'Athletic Speed Slash',
      'modern-stripes': 'Modern Speed Stripes',
      'abstract-geo': 'Abstract Geometric',
      'camo-sport': 'Contemporary Sport Camo',
      'sash-diagonal': 'Sash Diagonal Stripes',
      'gradient-fade': 'Sublimation Gradient Fade',
      'halftone-dots': 'Halftone Tech Dots',
      'solid-clean': 'Solid Clean Minimal',
      'custom-upload': 'Custom Uploaded Motif / Pattern',
    };

    const collarLabels: Record<string, string> = {
      'v-neck': 'V-Neck Klasik',
      'o-neck': 'O-Neck Bulat',
      'polo': 'Polo Kerah',
      'stand-up': 'Stand-up Collar',
    };

    const text = `Halo RIZA APPAREL, saya ingin konsultasi pesanan custom jersey dari Studio Desain:
- Mode Tampilan: ${design.mode.toUpperCase()} (${design.viewSide})
- Template / Motif: ${motifLabels[design.motifTemplate] || design.motifTemplate}
- Warna Dasar: ${design.baseColor}
- Warna Trim / Sekunder: ${design.secondaryColor}
- Warna Aksen: ${design.accentColor}
- Model Kerah: ${collarLabels[design.collarStyle] || design.collarStyle}
- Font Jersey: ${design.fontFamily || 'Teko'} (${design.fontWeight || '900'}${design.isItalic ? ', Italic' : ''})
- Nama Punggung: ${design.playerName || '-'} (Ukuran: ${design.nameFontSize || 19}px, Warna: ${design.nameColor || '#FFFFFF'})
- Nomor Punggung: ${design.playerNumber || '-'} (Ukuran: ${design.numberFontSize || 82}px, Warna: ${design.numberColor || design.accentColor})
- Sponsor: ${design.sponsorText || (design.sponsorLogoUrl ? 'File Logo Terlampir' : '-')} (Posisi: ${design.sponsorLogoPosition || 'Dada'})
${design.referenceNote ? `- Catatan Khusus: ${design.referenceNote}` : ''}
${design.customPatternUrl ? '- Motif Kustom: Menggunakan file gambar motif sendiri' : ''}
${design.referenceImageUrl ? '- Media Referensi: Mengunggah foto rujukan model jersey' : ''}

Mohon bantuan pengecekan slot produksi dan validasi file cetak sublimasi. Terima kasih!`;

    return `https://wa.me/6281246917740?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="studio-2d" className={`py-12 md:py-20 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white' : 'bg-gradient-to-b from-slate-100 via-gray-50 to-slate-200 text-gray-900'
    }`}>
      
      {/* Background Subtle Pattern & Ambient Glows */}
      <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-heritage-zawo/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Studio Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-3 ${
            isDark ? 'bg-brand-600/20 border-brand-500/30 text-brand-300' : 'bg-brand-50 border-brand-200 text-brand-700 shadow-xs'
          }`}>
            <Sparkles className="w-4 h-4 text-heritage-zawo" />
            <span>Dual-Engine 2D Vector & 3D Orbit Studio</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Studio Desain <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-heritage-zawo to-rose-500">2D & 3D Interactive</span>
          </h2>
          <p className={`mt-2.5 text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Rancang jersey Drifit Milano tim Anda secara leluasa. Beralih instan antara mode kanvas vektor 2D presisi dan simulasi orbit 3D 360° interaktif.
          </p>
        </div>

        {/* TOP ACTION BAR & DUAL MODE SWITCHER */}
        <div className={`border rounded-2xl p-3 mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-slate-800/90 backdrop-blur-xl border-slate-700/80' : 'bg-white/90 backdrop-blur-xl border-gray-200 shadow-md'
        }`}>
          
          {/* Mode Switcher Pills (2D Flat Vector vs 3D Orbit) */}
          <div className={`inline-flex p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
            <button
              type="button"
              onClick={() => setDesign((p) => ({ ...p, mode: '2d' }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all min-h-[40px] ${
                design.mode === '2d'
                  ? 'bg-brand-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>2D Studio Vector</span>
            </button>
            <button
              type="button"
              onClick={() => setDesign((p) => ({ ...p, mode: '3d' }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all min-h-[40px] ${
                design.mode === '3d'
                  ? 'bg-heritage-zawo text-slate-950 shadow-md font-black'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>3D Orbit View</span>
            </button>
          </div>

          {/* Canvas Tool Actions: Undo / Redo next to Zoom, plus Save & Reset */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Undo & Redo Stack Controls right next to Zoom */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
              <button
                type="button"
                disabled={historyIndex <= 0}
                onClick={handleUndo}
                title="Undo Perubahan (Kembali)"
                className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                  historyIndex <= 0
                    ? 'opacity-30 cursor-not-allowed text-slate-500'
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Undo2 className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] font-bold">Undo</span>
              </button>
              <div className="w-[1px] h-4 bg-slate-700/60" />
              <button
                type="button"
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                title="Redo Perubahan (Maju)"
                className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                  historyIndex >= history.length - 1
                    ? 'opacity-30 cursor-not-allowed text-slate-500'
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Redo2 className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] font-bold">Redo</span>
              </button>
            </div>

            {/* Zoom In / Zoom Out Controls */}
            {design.mode === '2d' && (
              <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <button
                  type="button"
                  onClick={() => handleZoom('in')}
                  title="Zoom In"
                  className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className={`text-[11px] font-mono px-1 font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{Math.round(design.zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => handleZoom('out')}
                  title="Zoom Out"
                  className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Size Chart Modal Shortcut */}
            <button
              type="button"
              onClick={() => setIsSizeChartOpen(true)}
              className={`hidden md:flex items-center gap-1.5 border px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                isDark ? 'bg-slate-900 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-brand-400" />
              <span>Panduan Ukuran</span>
            </button>

            {/* Save & Reset Session */}

            <button
              type="button"
              onClick={handleSaveSession}
              className={`flex items-center gap-2 border px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                isDark ? 'bg-slate-900 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800 shadow-xs'
              }`}
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Draf'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reset Konfigurasi"
              className={`p-2.5 border rounded-xl transition-all min-h-[40px] ${
                isDark ? 'bg-slate-900 hover:bg-slate-700 border-slate-700 text-slate-400 hover:text-white' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-600 hover:text-gray-900 shadow-xs'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* MAIN CANVAS + CONTROL PANEL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: CANVAS DISPLAY & CITITEX 4-ANGLE SWITCHER (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`border rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-between transition-colors ${
              isDark ? 'bg-slate-800/80 backdrop-blur-xl border-slate-700/60' : 'bg-white border-gray-200 text-gray-900 shadow-xl'
            }`}>
              
              {/* CITITEX BENCHMARK MULTI-ANGLE SWITCHER THUMBNAILS (Front, Back, Left Sleeve, Right Sleeve) */}
              <div className={`w-full flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b ${isDark ? 'border-slate-700/60' : 'border-gray-200'}`}>
                <span className={`text-xs uppercase font-bold tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Angle Pandang:</span>
                
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'front', label: 'Depan' },
                    { id: 'back', label: 'Belakang' },
                    { id: 'sleeve-left', label: 'Lengan Kiri' },
                    { id: 'sleeve-right', label: 'Lengan Kanan' },
                  ].map((angle) => (
                    <button
                      key={angle.id}
                      type="button"
                      onClick={() => setDesign((p) => ({ ...p, viewSide: angle.id as ViewAngleId }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all min-h-[38px] ${
                        design.viewSide === angle.id
                          ? 'bg-brand-600 text-white shadow-md border border-brand-500'
                          : isDark
                          ? 'bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-slate-200'
                          : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {angle.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DUAL MODE ENGINE DISPLAY CONTAINER */}
              <div className="w-full aspect-[4/4.8] max-w-md mx-auto relative flex items-center justify-center overflow-hidden">
                {design.mode === '2d' ? (
                  <JerseyCanvas2D design={design} />
                ) : (
                  <JerseyCanvas3D design={design} />
                )}
              </div>

              {/* Canvas Bottom Trust Pill */}
              <div className={`mt-4 w-full rounded-2xl p-3 border flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDark ? 'bg-slate-900/90 border-slate-700/80 text-slate-300' : 'bg-slate-50 border-gray-200 text-gray-700'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Drifit Milano Sublimasi Anti-Luntur</span>
                </div>
                <div className="flex items-center gap-2 text-heritage-zawo font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Format URL WhatsApp Resmi +6281246917740</span>
                </div>
              </div>

            </div>

            {/* DIRECT WHATSAPP CONSULTATION CARD */}
            <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl transition-all ${
              isDark 
                ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700/80' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Sudah Puas dengan Desain Anda?
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Kirim langsung konfigurasi ke admin WhatsApp RIZA APPAREL untuk validasi file cetak & slot produksi.
                  </p>
                </div>
              </div>

              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => syncOrderToFirestore('whatsapp')}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white font-extrabold py-3 px-5 rounded-xl shadow-lg hover:shadow-glow-emerald transition-all duration-200 flex items-center justify-center gap-2 text-xs min-h-[44px] whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Desain ke Admin via WhatsApp</span>
              </a>
            </div>

          </div>

          {/* RIGHT: DEDICATED DESIGN TOOLS SIDEBAR (5 Cols) */}
          <div className="lg:col-span-5 w-full">
            <StudioSidebar 
              design={design} 
              onUpdateDesign={handleUpdateDesign} 
              onOpenSizeChart={() => setIsSizeChartOpen(true)}
              onOpenPrintGuidelines={() => setIsPrintGuidelinesOpen(true)}
              isDark={isDark} 
            />
          </div>

        </div>

      </div>

      {/* MODALS: SIZE CHART & PRINT GUIDELINES */}
      <SizeChartModal 
        isOpen={isSizeChartOpen} 
        onClose={() => setIsSizeChartOpen(false)} 
        isDark={isDark} 
      />

      <PrintGuidelinesModal 
        isOpen={isPrintGuidelinesOpen} 
        onClose={() => setIsPrintGuidelinesOpen(false)} 
        isDark={isDark} 
      />
    </section>
  );
};

