import React, { useState, useEffect, useMemo } from 'react';
import { 
  RotateCw, 
  Send, 
  Palette, 
  Layers, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { DesignState, MotifTemplateId, CollarStyleId } from '../types';

const STORAGE_KEY = 'riza_apparel_studio_design_v2';

const DRIFIT_FABRIC_SWATCHES = [
  { id: 'onyx', name: 'Hitam Onyx', hex: '#111827' },
  { id: 'navy', name: 'Navy Samudera', hex: '#0F172A' },
  { id: 'maroon', name: 'Merah Marun', hex: '#881337' },
  { id: 'white', name: 'Putih Bersih', hex: '#FFFFFF' },
  { id: 'forest', name: 'Forest Green', hex: '#064E3B' },
  { id: 'orange', name: 'Oranye Flores', hex: '#D97706' },
];

const PRESET_MOTIF_COLORS = [
  { name: 'Zawo Gold', hex: '#F59E0B' },
  { name: 'Ocean Cyan', hex: '#06B6D4' },
  { name: 'Crisp White', hex: '#FFFFFF' },
  { name: 'Charcoal Black', hex: '#1F2937' },
  { name: 'Crimson Glow', hex: '#F43F5E' },
];

const DEFAULT_STATE: DesignState = {
  mode: '2d',
  viewSide: 'front',
  baseColor: '#881337', // Merah Marun default
  motifTemplate: 'ende-diamond',
  secondaryColor: '#F59E0B', // Zawo Gold
  accentColor: '#FFFFFF',
  playerName: 'EUGENIO',
  playerNumber: '10',
  sponsorLogoPosition: 'chest',
  sponsorText: 'RIZA SPORT',
  collarStyle: 'v-neck',
  quantity: 12,
  zoomLevel: 1.0,
};

export const DesignStudio2D: React.FC = () => {
  // S07: State Persistence with sessionStorage
  const [design, setDesign] = useState<DesignState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('SessionStorage load fallback to default state');
    }
    return DEFAULT_STATE;
  });

  const [isRotating, setIsRotating] = useState(false);

  // Sync state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(design));
    } catch (e) {
      console.warn('SessionStorage save failed');
    }
  }, [design]);

  // S09: Dynamic Indicative Price Calculation
  const priceCalculation = useMemo(() => {
    let baseUnit = 90000; // Base Jersey Rp90.000
    
    // Collar options price adjustment
    let collarAddon = 0;
    if (design.collarStyle === 'polo') collarAddon = 10000;
    
    // Motif custom option
    let motifAddon = 0;
    if (design.motifTemplate !== 'solid-clean') motifAddon = 15000;

    // Custom Name & Number: Rp0 Free Promo!
    const customNameNumberAddon = 0;

    const unitTotal = baseUnit + collarAddon + motifAddon + customNameNumberAddon;
    
    // Promo Beli 2 Bonus 1 calculation
    const freeItems = Math.floor(design.quantity / 3);
    const payableItems = Math.max(1, design.quantity - freeItems);
    const finalEstimatedTotal = unitTotal * payableItems;

    return {
      pricePerUnit: unitTotal,
      collarAddon,
      motifAddon,
      customNameNumberAddon,
      freeItems,
      finalEstimatedTotal,
    };
  }, [design]);

  // Reset design handler
  const handleReset = () => {
    setDesign(DEFAULT_STATE);
  };

  // Toggle Front / Back View with transition effect (S02)
  const handleToggleView = (side?: 'front' | 'back') => {
    setIsRotating(true);
    setTimeout(() => {
      setDesign((prev) => ({
        ...prev,
        viewSide: side ? side : prev.viewSide === 'front' ? 'back' : 'front',
      }));
      setIsRotating(false);
    }, 150);
  };

  // S08: Format WhatsApp URL conforming to PRD exact template
  const generateWhatsAppLink = () => {
    const motifNames: Partial<Record<MotifTemplateId, string>> = {
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
      'custom-upload': 'Custom Uploaded Pattern',
    };

    const colorMatch = DRIFIT_FABRIC_SWATCHES.find((s) => s.hex.toLowerCase() === design.baseColor.toLowerCase());
    const baseColorName = colorMatch ? colorMatch.name : `Hex (${design.baseColor})`;

    const collarNames: Partial<Record<CollarStyleId, string>> = {
      'v-neck': 'V-Neck Klasik',
      'o-neck': 'O-Neck Bulat',
      'polo': 'Polo Kerah',
      'stand-up': 'Stand-up Collar',
    };

    const text = `Halo RIZA APPAREL, saya ingin konsultasi pesanan custom jersey dari Studio 2D:
- Tipe Motif: ${motifNames[design.motifTemplate] || design.motifTemplate}
- Warna Dasar: ${baseColorName}
- Model Kerah: ${collarNames[design.collarStyle] || design.collarStyle}
- Nama Punggung: ${design.playerName || '-'}
- Nomor: ${design.playerNumber || '-'}
- Estimasi Indikatif: Rp ${priceCalculation.finalEstimatedTotal.toLocaleString('id-ID')}

Mohon info ketersediaan slot produksi dan validasi file. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/6281246917740?text=${encoded}`;
  };

  return (
    <section id="studio-2d" className="py-12 md:py-20 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Subtle Accent Grids */}
      <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-heritage-zawo/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-heritage-zawo" />
            <span>Studio Desain 2D Vector Engine (UC-15)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Studio Desain <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-heritage-zawo to-rose-300">2D Sportswear</span>
          </h2>
          <p className="mt-2.5 text-slate-300 text-sm sm:text-base">
            Kustomisasi jersey Drifit Milano tim Anda secara langsung dengan anatomi vektor presisi dan motif warisan NTT Ende.
          </p>
        </div>

        {/* Main Canvas + Control Grid (S10: Mobile Vertical Stack, Sticky Canvas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Ergonomic SVG Jersey Preview Canvas (7 Cols - Sticky on Mobile S10) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between shadow-2xl relative">
            
            {/* View Switcher Toggle Header (S02) */}
            <div className="w-full flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400 hidden sm:inline">Kanvas Vektor:</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-600/30 text-brand-300 border border-brand-500/30">
                  {design.viewSide === 'front' ? 'Tampak Depan (Front)' : 'Tampak Belakang (Back)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleView()}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md min-h-[44px]"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                  <span>Putar Tampilan</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset Konfigurasi"
                  className="p-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* HIGH-PRECISION REALISTIC SVG JERSEY ANATOMY CANVAS */}
            <div className={`w-full aspect-[4/4.8] max-w-md mx-auto relative flex items-center justify-center transition-all duration-300 ${isRotating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
              <svg
                viewBox="0 0 500 580"
                className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* CLIPPING MASK FOR JERSEY TORSO & RAGLAN SLEEVES */}
                  <clipPath id="jersey-clip">
                    <path d="M 160 85 C 200 115, 300 115, 340 85 L 435 140 C 455 155, 475 190, 440 250 L 390 220 L 390 515 C 390 535, 110 535, 110 515 L 110 220 L 60 250 C 25 190, 45 155, 65 140 Z" />
                  </clipPath>

                  {/* TORSO ONLY CLIP PATH FOR PATTERNS */}
                  <clipPath id="torso-clip">
                    <path d="M 160 85 L 125 190 L 125 530 L 375 530 L 375 190 L 340 85 Z" />
                  </clipPath>

                  {/* ENDE DIAMOND ZAWO PATTERN */}
                  <pattern id="ende-diamond-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 60 30 L 30 60 L 0 30 Z" fill="none" stroke={design.secondaryColor} strokeWidth="2.5" opacity="0.75" />
                    <path d="M 30 10 L 50 30 L 30 50 L 10 30 Z" fill={design.secondaryColor} opacity="0.3" />
                    <circle cx="30" cy="30" r="4" fill={design.accentColor} />
                    <path d="M 0 0 L 15 15 M 45 15 L 60 0 M 60 60 L 45 45 M 15 45 L 0 60" stroke={design.secondaryColor} strokeWidth="1.5" opacity="0.4" />
                  </pattern>

                  {/* FLORES OCEAN WAVES PATTERN */}
                  <pattern id="flores-wave-pattern" width="90" height="45" patternUnits="userSpaceOnUse">
                    <path d="M 0 22.5 Q 22.5 5, 45 22.5 T 90 22.5" fill="none" stroke={design.secondaryColor} strokeWidth="3.5" opacity="0.8" />
                    <path d="M 0 32.5 Q 22.5 15, 45 32.5 T 90 32.5" fill="none" stroke={design.accentColor} strokeWidth="2" opacity="0.6" />
                  </pattern>

                  {/* KELIMUTU TRI-CRATER VOLCANO PATTERN */}
                  <pattern id="kelimutu-crater-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                    <polygon points="35,5 65,60 5,60" fill="none" stroke={design.secondaryColor} strokeWidth="2.5" opacity="0.7" />
                    <circle cx="35" cy="40" r="12" fill={design.secondaryColor} opacity="0.25" />
                    <circle cx="35" cy="40" r="4" fill={design.accentColor} />
                  </pattern>

                  {/* ATHLETIC SPEED SLASH PATTERN */}
                  <pattern id="athletic-slash-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="40" x2="40" y2="0" stroke={design.secondaryColor} strokeWidth="9" opacity="0.4" />
                  </pattern>
                </defs>

                {/* 1. BASE JERSEY SILHOUETTE WITH ERGONOMIC CURVATURE */}
                <g id="main-jersey-silhouette">
                  {/* Full Base Body Path */}
                  <path
                    d="M 160 85 C 200 115, 300 115, 340 85 
                       L 435 140 C 460 155, 470 190, 440 250 
                       L 390 220 L 390 515 C 390 530, 110 530, 110 515 
                       L 110 220 L 60 250 C 30 190, 40 155, 65 140 Z"
                    fill={design.baseColor}
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* RAGLAN SLEEVE LEFT SEAM & ACCENT */}
                  <path d="M 65 140 L 160 85 L 125 190 Z" fill={design.baseColor} />
                  <path d="M 65 140 L 44 235 L 85 255 L 110 220 Z" fill={design.baseColor} />
                  <path d="M 44 235 L 85 255 L 92 240 L 51 220 Z" fill={design.secondaryColor} />

                  {/* RAGLAN SLEEVE RIGHT SEAM & ACCENT */}
                  <path d="M 435 140 L 340 85 L 375 190 Z" fill={design.baseColor} />
                  <path d="M 435 140 L 456 235 L 415 255 L 390 220 Z" fill={design.baseColor} />
                  <path d="M 456 235 L 415 255 L 408 240 L 449 220 Z" fill={design.secondaryColor} />

                  {/* 2. MOTIF OVERLAY (CLIPPED TO TORSO) */}
                  <g clipPath="url(#torso-clip)">
                    {design.motifTemplate === 'ende-diamond' && (
                      <rect x="0" y="0" width="500" height="580" fill="url(#ende-diamond-pattern)" />
                    )}

                    {design.motifTemplate === 'flores-wave' && (
                      <rect x="0" y="0" width="500" height="580" fill="url(#flores-wave-pattern)" />
                    )}

                    {design.motifTemplate === 'kelimutu-crater' && (
                      <rect x="0" y="0" width="500" height="580" fill="url(#kelimutu-crater-pattern)" />
                    )}

                    {design.motifTemplate === 'athletic-minimal' && (
                      <rect x="0" y="0" width="500" height="580" fill="url(#athletic-slash-pattern)" />
                    )}
                  </g>

                  {/* SIDE MESH BREATHABLE PANELS */}
                  <path d="M 110 220 L 130 220 L 130 515 L 110 515 Z" fill={design.secondaryColor} opacity="0.75" />
                  <path d="M 390 220 L 370 220 L 370 515 L 390 515 Z" fill={design.secondaryColor} opacity="0.75" />

                  {/* SUBTLE SEAMLINES (OPACITY 20% OVERLAY STROKES FOR REALISM) */}
                  {/* Raglan Shoulder Seamline Left */}
                  <path d="M 160 85 L 125 190" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="5 3" />
                  {/* Raglan Shoulder Seamline Right */}
                  <path d="M 340 85 L 375 190" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="5 3" />
                  {/* Side Seamline Left */}
                  <path d="M 130 220 L 130 515" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                  {/* Side Seamline Right */}
                  <path d="M 370 220 L 370 515" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                  {/* Bottom Hem Seamline */}
                  <path d="M 110 505 C 110 520, 390 520, 390 505" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeDasharray="4 2" />

                  {/* 3. DYNAMIC FLEXIBLE COLLAR RIB RENDERING */}
                  {/* V-NECK KLASIK */}
                  {design.collarStyle === 'v-neck' && (
                    <g id="v-neck-collar">
                      <path
                        d="M 195 90 C 215 145, 285 145, 305 90 L 285 85 C 270 120, 230 120, 215 85 Z"
                        fill={design.secondaryColor}
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                      <path d="M 250 135 L 250 148" stroke={design.accentColor} strokeWidth="2" />
                    </g>
                  )}

                  {/* O-NECK BULAT */}
                  {design.collarStyle === 'o-neck' && (
                    <g id="o-neck-collar">
                      <path
                        d="M 190 90 C 205 130, 295 130, 310 90 L 295 82 C 280 115, 220 115, 205 82 Z"
                        fill={design.secondaryColor}
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}

                  {/* POLO KERAH WITH COLLAR FLAPS & PLACKET */}
                  {design.collarStyle === 'polo' && (
                    <g id="polo-collar">
                      {/* Button Placket */}
                      <rect x="238" y="110" width="24" height="60" rx="3" fill={design.secondaryColor} stroke="#111827" strokeWidth="1" />
                      <circle cx="250" cy="125" r="3" fill="#FFFFFF" stroke="#111827" strokeWidth="0.8" />
                      <circle cx="250" cy="145" r="3" fill="#FFFFFF" stroke="#111827" strokeWidth="0.8" />
                      
                      {/* Left Collar Flap */}
                      <path d="M 200 85 L 248 130 L 245 110 L 210 82 Z" fill={design.secondaryColor} stroke="#111827" strokeWidth="1.5" />
                      {/* Right Collar Flap */}
                      <path d="M 300 85 L 252 130 L 255 110 L 290 82 Z" fill={design.secondaryColor} stroke="#111827" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* AUTHENTIC DRIFIT FABRIC LABEL AT BOTTOM */}
                  <rect x="125" y="485" width="40" height="20" rx="4" fill="#111827" stroke={design.secondaryColor} strokeWidth="1" />
                  <text x="145" y="498" fill="#FFFFFF" fontSize="8" fontWeight="800" textAnchor="middle">DRIFIT</text>
                </g>

                {/* FRONT VIEW SPECIFIC ELEMENTS */}
                {design.viewSide === 'front' && (
                  <g id="front-elements">
                    {/* Brand Emblem Logo (Chest Right) */}
                    <g transform="translate(190, 160)">
                      <circle cx="0" cy="0" r="14" fill="#111827" stroke={design.secondaryColor} strokeWidth="1.5" />
                      <text x="0" y="4" fill={design.secondaryColor} fontSize="9" fontWeight="900" textAnchor="middle">RA</text>
                    </g>

                    {/* Regional / Crest Badge (Chest Left) */}
                    <g transform="translate(310, 160)">
                      <polygon points="0,-14 12,0 0,14 -12,0" fill={design.secondaryColor} stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="5" fill="#111827" />
                    </g>

                    {/* Sponsor Logo / Text Center */}
                    {design.sponsorLogoPosition === 'chest' && (
                      <g transform="translate(250, 275)">
                        <rect x="-85" y="-22" width="170" height="44" rx="8" fill="#111827" opacity="0.85" stroke={design.secondaryColor} strokeWidth="2" />
                        <text
                          x="0"
                          y="6"
                          fill={design.accentColor}
                          fontSize="17"
                          fontWeight="900"
                          letterSpacing="2"
                          textAnchor="middle"
                        >
                          {design.sponsorText || 'RIZA SPORT'}
                        </text>
                      </g>
                    )}

                    {design.sponsorLogoPosition === 'sleeve' && (
                      <g transform="translate(75, 200)">
                        <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#111827" stroke="#FFFFFF" strokeWidth="1" />
                        <text x="0" y="3" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">SPONSOR</text>
                      </g>
                    )}
                  </g>
                )}

                {/* BACK VIEW SPECIFIC ELEMENTS (ATHLETIC TYPOGRAPHY PERSPECTIVE) */}
                {design.viewSide === 'back' && (
                  <g id="back-elements">
                    {/* Player Name Typography */}
                    <text
                      x="250"
                      y="205"
                      fill={design.accentColor}
                      stroke="#111827"
                      strokeWidth="1.5"
                      fontSize="26"
                      fontWeight="900"
                      letterSpacing="3"
                      textAnchor="middle"
                      style={{ fontStyle: 'italic' }}
                    >
                      {design.playerName.toUpperCase() || 'PLAYER NAME'}
                    </text>

                    {/* Player Number Typography with Dual Stroke Shadow */}
                    <text
                      x="250"
                      y="350"
                      fill={design.accentColor}
                      stroke="#111827"
                      strokeWidth="6"
                      fontSize="115"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      {design.playerNumber || '10'}
                    </text>
                    <text
                      x="250"
                      y="350"
                      fill={design.accentColor}
                      fontSize="115"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      {design.playerNumber || '10'}
                    </text>

                    {/* Lower Back Heritage Tag */}
                    <text x="250" y="475" fill={design.secondaryColor} fontSize="10" fontWeight="800" letterSpacing="2" textAnchor="middle">
                      ENDE HERITAGE SERIES • NTT
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Quick Canvas Badge Indicator */}
            <div className="mt-4 w-full bg-slate-900/90 rounded-2xl p-3 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Drifit Milano Sublimasi Anti-Luntur</span>
              </div>
              <div className="flex items-center gap-2 text-heritage-zawo font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Pengerjaan Presisi Ende NTT</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Customization Control Panel (5 Cols - Touch Targets >= 44px S10) */}
          <div className="lg:col-span-5 space-y-6">

            {/* 1. DRIFIT MILANO FABRIC SWATCH SELECTOR (S03) */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3.5 text-brand-300 font-bold text-sm">
                <Palette className="w-4 h-4 text-brand-400" />
                <span>1. WARNA KAIN DRIFIT MILANO (S03)</span>
              </div>

              <label className="block text-xs font-semibold text-slate-300 mb-2.5">Pilih Warna Dasar Fabric:</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-4">
                {DRIFIT_FABRIC_SWATCHES.map((swatch) => {
                  const isActive = design.baseColor.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setDesign((p) => ({ ...p, baseColor: swatch.hex }))}
                      className={`min-h-[44px] rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center p-1 relative ${
                        isActive
                          ? 'border-brand-500 scale-105 ring-4 ring-brand-500/50 shadow-glow-brand'
                          : 'border-slate-600 hover:border-slate-400 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    >
                      <span className={`text-[10px] font-extrabold ${swatch.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`}>
                        {swatch.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Picker Option */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <span className="text-xs font-medium text-slate-400">Custom Hex Code:</span>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full border border-white/20 shadow-xs relative flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: design.baseColor }}
                  >
                    <input
                      type="color"
                      value={design.baseColor}
                      onChange={(e) => setDesign((p) => ({ ...p, baseColor: e.target.value }))}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      title="Pilih Custom Hex"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase">{design.baseColor}</span>
                </div>
              </div>
            </div>

            {/* 2. HERITAGE MOTIF & COLLAR STYLE SELECTION */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3.5 text-heritage-zawo font-bold text-sm">
                <Layers className="w-4 h-4 text-heritage-zawo" />
                <span>2. TEMPLATE MOTIF HERITAGE & KERAH</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  { id: 'ende-diamond', title: 'Ende Diamond Zawo', desc: 'Tenun Autentik Ende NTT' },
                  { id: 'flores-wave', title: 'Flores Ocean Waves', desc: 'Ombak Coastal Nusa Bunga' },
                  { id: 'kelimutu-crater', title: 'Kelimutu Tri-Crater', desc: 'Geometris Kawah 3 Warna' },
                  { id: 'athletic-minimal', title: 'Athletic Speed Slash', desc: 'Sporty Dynamic Modern' },
                  { id: 'solid-clean', title: 'Solid Clean Minimal', desc: 'Klasik Tanpa Motif' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDesign((p) => ({ ...p, motifTemplate: item.id as any }))}
                    className={`p-3 rounded-2xl border text-left transition-all min-h-[48px] flex flex-col justify-center ${
                      design.motifTemplate === item.id
                        ? 'border-heritage-zawo bg-heritage-zawo/15 text-white font-bold shadow-md'
                        : 'border-slate-700 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wide font-extrabold">{item.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Dynamic Collar Style Rib Selector (V-Neck, O-Neck, Polo) */}
              <div className="space-y-2 pt-3 border-t border-slate-700/60">
                <label className="block text-xs font-semibold text-slate-300">Model Kerah Jersey:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'v-neck', label: 'V-Neck Klasik' },
                    { id: 'o-neck', label: 'O-Neck Bulat' },
                    { id: 'polo', label: 'Polo Kerah (+10rb)' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setDesign((p) => ({ ...p, collarStyle: c.id as any }))}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center ${
                        design.collarStyle === c.id
                          ? 'bg-brand-600 text-white shadow-md border border-brand-500'
                          : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. REAL-TIME PLAYER NAME & NUMBER INPUTS */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3 text-emerald-400 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>3. NAMA PEMAIN & SPONSOR</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  FREE Custom Print Promo!
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Punggung:</label>
                  <input
                    type="text"
                    value={design.playerName}
                    onChange={(e) => setDesign((p) => ({ ...p, playerName: e.target.value }))}
                    placeholder="EUGENIO"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 uppercase tracking-wider font-bold min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">No Punggung:</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={design.playerNumber}
                    onChange={(e) => setDesign((p) => ({ ...p, playerNumber: e.target.value }))}
                    placeholder="10"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 text-center font-black min-h-[44px]"
                  />
                </div>
              </div>

              {/* Sponsor Position */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <label className="text-xs font-semibold text-slate-300">Posisi Sponsor:</label>
                <select
                  value={design.sponsorLogoPosition}
                  onChange={(e) => setDesign((p) => ({ ...p, sponsorLogoPosition: e.target.value as any }))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 min-h-[40px]"
                >
                  <option value="chest">Dada Depan (Chest)</option>
                  <option value="sleeve">Lengan (Sleeve)</option>
                  <option value="none">Tanpa Sponsor</option>
                </select>
              </div>
            </div>

            {/* 4. REAL-TIME INDICATIVE PRICE SUMMARY & WA CONVERSION (S08 / S09) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 border-2 border-brand-500/40 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-heritage-zawo" />
                  <span>ESTIMASI HARGA INDIKATIF (S09)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Promo Beli 2 Bonus 1
                </span>
              </div>

              {/* Quantity Controller */}
              <div className="flex items-center justify-between my-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-xs font-medium text-slate-300">Estimasi Jumlah Pesanan Tim:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDesign((p) => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold flex items-center justify-center text-sm min-h-[36px]"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-white w-6 text-center">{design.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setDesign((p) => ({ ...p, quantity: p.quantity + 1 }))}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold flex items-center justify-center text-sm min-h-[36px]"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-400">pcs</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span>Base Jersey Drifit:</span>
                  <span className="font-semibold text-white">Rp 90.000</span>
                </div>
                {priceCalculation.collarAddon > 0 && (
                  <div className="flex justify-between">
                    <span>Opsi Polo Kerah:</span>
                    <span className="font-semibold text-white">+Rp 10.000</span>
                  </div>
                )}
                {priceCalculation.motifAddon > 0 && (
                  <div className="flex justify-between">
                    <span>Opsi Custom Motif Sublim:</span>
                    <span className="font-semibold text-white">+Rp 15.000</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-400">
                  <span>Custom Nama & Nomor Punggung:</span>
                  <span className="font-bold">Rp 0 (FREE PROMO)</span>
                </div>
                {priceCalculation.freeItems > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                    <span>Bonus Pcs Gratis (Beli 2 Bonus 1):</span>
                    <span>+{priceCalculation.freeItems} pcs GRATIS</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2.5 border-t border-slate-700/60">
                  <span className="text-sm font-extrabold text-white">Total Estimasi Indikatif:</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-heritage-zawo via-amber-300 to-emerald-400">
                      Rp {priceCalculation.finalEstimatedTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button to WhatsApp conforming strictly to S08 URL encoding */}
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white font-extrabold py-4 px-6 rounded-xl shadow-lg hover:shadow-glow-emerald transition-all duration-200 flex items-center justify-center gap-2.5 text-sm min-h-[48px]"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Draf Desain ke Admin (WhatsApp)</span>
              </a>

              <p className="text-[10px] text-amber-300/90 text-center mt-2.5 italic">
                *Estimasi Indikatif (Bukan Pembayaran Final). Validasi slot produksi & harga final akan dikonfirmasi oleh admin RIZA APPAREL via WhatsApp.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
