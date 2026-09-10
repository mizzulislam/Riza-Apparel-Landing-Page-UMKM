import React, { useState } from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Maximize2, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Droplet, 
  Sliders, 
  Group, 
  Ungroup, 
  Layers, 
  Sparkles,
  RefreshCw,
  Move,
  Check,
  X
} from 'lucide-react';
import { 
  DesignState, 
  InspectorElementId, 
  ElementPositionConfig, 
  TextAlignment 
} from '../types';

interface ElementInspectorPanelProps {
  design: DesignState;
  onUpdateDesign: (updates: Partial<DesignState>) => void;
  isDark?: boolean;
}

export const ElementInspectorPanel: React.FC<ElementInspectorPanelProps> = ({
  design,
  onUpdateDesign,
  isDark = true,
}) => {
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const activeTarget: InspectorElementId = design.activeInspectorElement || 'typography';

  // Get active position config based on active target
  const getActiveConfig = (): ElementPositionConfig => {
    if (activeTarget === 'sponsor') {
      return design.sponsorPosition || { x: 0, y: 0, rotation: 0, flipH: false, flipV: false, opacity: 100 };
    }
    if (activeTarget === 'motif') {
      return design.customMotifPosition || { x: 0, y: 0, rotation: 0, flipH: false, flipV: false, opacity: 100 };
    }
    // Default typography (Name & Number)
    return design.namePosition || { x: 0, y: 0, rotation: 0, flipH: false, flipV: false, opacity: 100 };
  };

  const currentConfig = getActiveConfig();

  // Helper to update active position
  const updateCurrentConfig = (updates: Partial<ElementPositionConfig>) => {
    const updated = { ...currentConfig, ...updates };
    if (activeTarget === 'sponsor') {
      onUpdateDesign({ sponsorPosition: updated });
    } else if (activeTarget === 'motif') {
      onUpdateDesign({ customMotifPosition: updated });
    } else if (activeTarget === 'all') {
      onUpdateDesign({
        namePosition: updated,
        numberPosition: updated,
        sponsorPosition: updated,
        customMotifPosition: updated,
      });
    } else {
      // typography
      onUpdateDesign({ 
        namePosition: updated,
        numberPosition: { ...design.numberPosition, ...updates }
      });
    }
  };

  // Alignment handlers
  const handleAlign = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    let newX = currentConfig.x || 0;
    let newY = currentConfig.y || 0;

    if (type === 'left') {
      newX = -35;
      onUpdateDesign({ textAlignment: 'left' });
    } else if (type === 'center') {
      newX = 0;
      onUpdateDesign({ textAlignment: 'center' });
    } else if (type === 'right') {
      newX = 35;
      onUpdateDesign({ textAlignment: 'right' });
    } else if (type === 'top') {
      newY = -25;
    } else if (type === 'middle') {
      newY = 0;
    } else if (type === 'bottom') {
      newY = 25;
    }

    updateCurrentConfig({ x: newX, y: newY });
  };

  // Quick Nudge Handler (+/- pixels)
  const handleNudge = (dx: number, dy: number) => {
    const newX = (currentConfig.x || 0) + dx;
    const newY = (currentConfig.y || 0) + dy;
    updateCurrentConfig({ x: newX, y: newY });
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 space-y-5 transition-colors ${
      isDark ? 'bg-slate-900/95 border-slate-700/80 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
    }`}>
      
      {/* 1. TARGET ELEMENT SELECTOR TABS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Pilih Elemen yang Diedit
          </label>
          <button
            type="button"
            onClick={() => onUpdateDesign({ isGrouped: !design.isGrouped })}
            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all border ${
              design.isGrouped
                ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                : isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {design.isGrouped ? <Group className="w-3 h-3" /> : <Ungroup className="w-3 h-3" />}
            <span>{design.isGrouped ? 'Terkunci Group' : 'Kunci Group'}</span>
          </button>
        </div>

        <div className={`grid grid-cols-3 p-1 rounded-xl border text-xs font-bold ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => onUpdateDesign({ activeInspectorElement: 'typography' })}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTarget === 'typography'
                ? 'bg-brand-600 text-white font-extrabold shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teks Pemain
          </button>
          <button
            type="button"
            onClick={() => onUpdateDesign({ activeInspectorElement: 'sponsor' })}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTarget === 'sponsor'
                ? 'bg-brand-600 text-white font-extrabold shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Logo Sponsor
          </button>
          <button
            type="button"
            onClick={() => onUpdateDesign({ activeInspectorElement: 'motif' })}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTarget === 'motif'
                ? 'bg-brand-600 text-white font-extrabold shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Motif / Pola
          </button>
        </div>
      </div>

      {/* 2. POSITION & ALIGNMENT SECTION */}
      <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <h4 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <Move className="w-3.5 h-3.5 text-brand-400" />
            <span>Posisi & Perataan (Position)</span>
          </h4>
          <span className="text-[10px] text-brand-400 font-bold font-mono">
            X: {currentConfig.x || 0}px | Y: {currentConfig.y || 0}px
          </span>
        </div>

        {/* Alignment Control Toolbar */}
        <div className="space-y-1.5">
          <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Perataan Cepat (Align)
          </span>
          <div className="grid grid-cols-7 gap-1">
            <button
              type="button"
              onClick={() => handleAlign('left')}
              title="Rata Kiri (-35px)"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all min-h-[38px] ${
                design.textAlignment === 'left'
                  ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign('center')}
              title="Rata Tengah Horizontal (0px)"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all min-h-[38px] ${
                design.textAlignment === 'center' || !design.textAlignment
                  ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign('right')}
              title="Rata Kanan (+35px)"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all min-h-[38px] ${
                design.textAlignment === 'right'
                  ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign('top')}
              title="Rata Atas (-25px)"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all min-h-[38px] ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign('middle')}
              title="Tengah Vertikal (0px)"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all min-h-[38px] font-bold text-xs ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ┼
            </button>
            <button
              type="button"
              onClick={() => handleAlign('bottom')}
              title="Rata Bawah (+25px)"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all min-h-[38px] ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => updateCurrentConfig({ x: 0, y: 0, rotation: 0 })}
              title="Reset ke Posisi Awal (0, 0)"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all min-h-[38px] ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:text-amber-300 hover:bg-slate-700' 
                  : 'bg-slate-50 border-slate-200 text-amber-600 hover:bg-slate-100'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Directional Nudge Pad & Numeric Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Nudge Buttons */}
          <div className={`p-2 rounded-xl border flex items-center justify-around ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Geser ±5px:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNudge(-5, 0)}
                title="Geser Kiri 5px"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(5, 0)}
                title="Geser Kanan 5px"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(0, -5)}
                title="Geser Atas 5px"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(0, 5)}
                title="Geser Bawah 5px"
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Numeric Coordinate Inputs */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className={`flex items-center rounded-xl border px-2.5 py-1.5 focus-within:border-brand-500 ${
              isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-white border-slate-300'
            }`}>
              <span className="text-xs font-bold text-slate-400 mr-1.5">X:</span>
              <input
                type="number"
                value={currentConfig.x || 0}
                onChange={(e) => updateCurrentConfig({ x: Number(e.target.value) })}
                className={`w-full bg-transparent text-xs font-mono font-bold focus:outline-none ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              />
              <span className="text-[10px] text-slate-400">px</span>
            </div>

            <div className={`flex items-center rounded-xl border px-2.5 py-1.5 focus-within:border-brand-500 ${
              isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-white border-slate-300'
            }`}>
              <span className="text-xs font-bold text-slate-400 mr-1.5">Y:</span>
              <input
                type="number"
                value={currentConfig.y || 0}
                onChange={(e) => updateCurrentConfig({ y: Number(e.target.value) })}
                className={`w-full bg-transparent text-xs font-mono font-bold focus:outline-none ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              />
              <span className="text-[10px] text-slate-400">px</span>
            </div>
          </div>
        </div>

        {/* Rotation & Flip Controls */}
        <div className="space-y-1.5 pt-1">
          <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Rotasi & Balik (Transform)
          </span>
          <div className="grid grid-cols-12 gap-2 items-center">
            {/* Rotation Angle Input */}
            <div className={`col-span-6 flex items-center rounded-xl border px-3 py-1.5 focus-within:border-brand-500 ${
              isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-white border-slate-300'
            }`}>
              <span className="text-xs font-bold text-slate-400 mr-2">Sudut</span>
              <input
                type="number"
                min="-180"
                max="180"
                value={currentConfig.rotation || 0}
                onChange={(e) => updateCurrentConfig({ rotation: Number(e.target.value) })}
                className={`w-full bg-transparent text-xs font-mono font-bold focus:outline-none ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              />
              <span className="text-[10px] text-slate-400">°</span>
            </div>

            {/* Quick 90 deg rotate */}
            <button
              type="button"
              onClick={() => updateCurrentConfig({ rotation: ((currentConfig.rotation || 0) + 90) % 360 })}
              title="Putar 90 Derajat Searah Jarum Jam"
              className={`col-span-2 p-2 rounded-xl border flex items-center justify-center transition-colors min-h-[38px] ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Flip Horizontal */}
            <button
              type="button"
              onClick={() => updateCurrentConfig({ flipH: !currentConfig.flipH })}
              title="Cerminkan Horizontal (Flip H)"
              className={`col-span-2 p-2 rounded-xl border text-center flex items-center justify-center transition-all min-h-[38px] ${
                currentConfig.flipH
                  ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>

            {/* Flip Vertical */}
            <button
              type="button"
              onClick={() => updateCurrentConfig({ flipV: !currentConfig.flipV })}
              title="Cerminkan Vertikal (Flip V)"
              className={`col-span-2 p-2 rounded-xl border text-center flex items-center justify-center transition-all min-h-[38px] ${
                currentConfig.flipV
                  ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FlipVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. LAYOUT & DIMENSIONS SECTION */}
      <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <h4 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          <Maximize2 className="w-3.5 h-3.5 text-brand-400" />
          <span>Dimensi, Skala & Spasi (Layout)</span>
        </h4>

        {/* Scale & Dimensions */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`flex items-center rounded-xl border px-3 py-1.5 ${
            isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-white border-slate-300'
          }`}>
            <span className="text-xs font-bold text-slate-400 mr-2">Ukuran:</span>
            <input
              type="number"
              min="10"
              max="200"
              value={activeTarget === 'sponsor' ? Math.round((design.sponsorScale || 1) * 100) : (design.nameFontSize || 19)}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (activeTarget === 'sponsor') {
                  onUpdateDesign({ sponsorScale: Math.max(0.2, val / 100) });
                } else {
                  onUpdateDesign({ nameFontSize: val });
                }
              }}
              className={`w-full bg-transparent text-xs font-mono font-bold focus:outline-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            />
            <span className="text-[10px] text-slate-400">{activeTarget === 'sponsor' ? '%' : 'px'}</span>
          </div>

          <div className={`flex items-center rounded-xl border px-3 py-1.5 ${
            isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-white border-slate-300'
          }`}>
            <span className="text-xs font-bold text-slate-400 mr-2">Nomor:</span>
            <input
              type="number"
              min="10"
              max="200"
              value={design.numberFontSize || 82}
              onChange={(e) => onUpdateDesign({ numberFontSize: Number(e.target.value) })}
              className={`w-full bg-transparent text-xs font-mono font-bold focus:outline-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            />
            <span className="text-[10px] text-slate-400">px</span>
          </div>
        </div>

        {/* Letter Spacing Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Jarak Antar Huruf (Kerning):</span>
            <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {design.letterSpacing ?? 2}px
            </span>
          </div>
          <input
            type="range"
            min="-2"
            max="16"
            step="1"
            value={design.letterSpacing ?? 2}
            onChange={(e) => onUpdateDesign({ letterSpacing: Number(e.target.value) })}
            className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          />
        </div>
      </div>

      {/* 4. APPEARANCE (STROKE & OPACITY) SECTION */}
      <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <h4 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <Droplet className="w-3.5 h-3.5 text-brand-400" />
            <span>Stroke Outline & Transparansi (Opacity)</span>
          </h4>
        </div>

        {/* Opacity Control */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Transparansi Elemen:</span>
            <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {design.elementOpacity ?? 100}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={design.elementOpacity ?? 100}
              onChange={(e) => onUpdateDesign({ elementOpacity: Number(e.target.value) })}
              className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            />
            <div className={`w-14 px-2 py-1 rounded-lg border text-right text-xs font-mono font-bold ${
              isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}>
              {design.elementOpacity ?? 100}%
            </div>
          </div>
        </div>

        {/* Stroke / Outline Width & Color */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Ketebalan Garis Tepi (Stroke Outline):</span>
            <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {design.strokeWidth ?? (design.hasTextOutline !== false ? 2 : 0)}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={design.strokeWidth ?? (design.hasTextOutline !== false ? 2 : 0)}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateDesign({ 
                  strokeWidth: val,
                  hasTextOutline: val > 0 
                });
              }}
              className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            />
            <div className="flex items-center gap-1.5 shrink-0 relative">
              <button
                type="button"
                onClick={() => setShowStrokePicker(!showStrokePicker)}
                title="Pilih Warna Stroke"
                className="w-8 h-8 rounded-full border border-black/15 dark:border-white/20 shadow-xs cursor-pointer hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative focus:outline-none"
                style={{ backgroundColor: design.strokeColor || design.numberStrokeColor || '#0F172A' }}
              >
                <div className="w-2 h-2 rounded-full bg-white/70 shadow-2xs" />
              </button>

              {showStrokePicker && (
                <div className={`absolute right-0 bottom-10 z-50 p-3 rounded-2xl border shadow-xl w-48 space-y-2.5 animate-fadeIn ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>Warna Stroke Outline</span>
                    <button
                      type="button"
                      onClick={() => setShowStrokePicker(false)}
                      className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['#000000', '#FFFFFF', '#0F172A', '#D97706', '#881337', '#0284C7', '#DC2626', '#475569'].map((hex) => {
                      const isSel = (design.strokeColor || design.numberStrokeColor || '#0F172A').toLowerCase() === hex.toLowerCase();
                      return (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => {
                            onUpdateDesign({ strokeColor: hex, numberStrokeColor: hex });
                            setShowStrokePicker(false);
                          }}
                          style={{ backgroundColor: hex }}
                          className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                            isSel
                              ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105'
                              : 'border-black/15 dark:border-white/15 hover:scale-110'
                          }`}
                        >
                          {isSel && (
                            <Check className={`w-3 h-3 ${hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
