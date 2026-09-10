import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  List,
  X,
  Pipette,
  Plus,
  Palette,
  Image as ImageIcon,
  Check,
  Bookmark,
  Sparkles,
  Sliders,
  Copy,
  Layers,
} from 'lucide-react';
import { DesignState, CollarStyleId } from '../types';

export type ColorTarget = 'base' | 'secondary' | 'accent' | 'collar' | 'typography';

interface CanvaColorPickerProps {
  design: DesignState;
  onUpdateDesign: (updates: Partial<DesignState>) => void;
  isDark: boolean;
  onClose?: () => void;
}

// -------------------------------------------------------------
// Mathematical Color Conversion Helpers
// -------------------------------------------------------------
function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '').trim();
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  } else {
    return false;
  }
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const sat = s / 100;
  const val = v / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((g + m) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return { h: 210, s: 80, v: 60 };
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : Math.round((d / max) * 100);
  const v = Math.round(max * 100);
  return { h, s, v };
}

// Generate 7 harmonic tints and shades for a selected color (Figma/Canva style)
function generateTonalPalette(hex: string): { hex: string; name: string }[] {
  const hsv = hexToHsv(hex);
  const stops = [
    { s: Math.max(12, hsv.s * 0.25), v: 97, name: 'Sangat Terang' },
    { s: Math.max(25, hsv.s * 0.5), v: 90, name: 'Terang' },
    { s: Math.max(45, hsv.s * 0.75), v: 80, name: 'Sedang Terang' },
    { s: hsv.s, v: hsv.v, name: 'Warna Asal' },
    { s: Math.min(100, hsv.s * 1.1), v: Math.max(30, hsv.v * 0.75), name: 'Sedang Gelap' },
    { s: Math.min(100, hsv.s * 1.15), v: Math.max(20, hsv.v * 0.5), name: 'Gelap' },
    { s: 100, v: Math.max(12, hsv.v * 0.25), name: 'Sangat Gelap' },
  ];

  return stops.map((stop) => {
    const [r, g, b] = hsvToRgb(hsv.h, Math.round(stop.s), Math.round(stop.v));
    return {
      hex: rgbToHex(r, g, b),
      name: stop.name,
    };
  });
}

// 7 columns x 4 rows default solid colors
const DEFAULT_SOLID_COLORS = [
  // Row 1: Grayscale & Monochromes
  [
    { hex: '#000000', name: 'Hitam Pekat' },
    { hex: '#374151', name: 'Abu Arang' },
    { hex: '#6B7280', name: 'Abu Menengah' },
    { hex: '#9CA3AF', name: 'Abu Perak' },
    { hex: '#D1D5DB', name: 'Abu Lembut' },
    { hex: '#F3F4F6', name: 'Putih Tulang' },
    { hex: '#FFFFFF', name: 'Putih Bersih' },
  ],
  // Row 2: Reds, Pinks, Violets & Purples
  [
    { hex: '#DC2626', name: 'Merah Cabai' },
    { hex: '#EF4444', name: 'Merah Terang' },
    { hex: '#F43F5E', name: 'Merah Mawar' },
    { hex: '#E879F9', name: 'Merah Muda' },
    { hex: '#A855F7', name: 'Ungu Anggrek' },
    { hex: '#7C3AED', name: 'Ungu Elektrik' },
    { hex: '#4338CA', name: 'Nila Pekat' },
  ],
  // Row 3: Cyans & Blues
  [
    { hex: '#0891B2', name: 'Biru Toska' },
    { hex: '#06B6D4', name: 'Biru Cyan' },
    { hex: '#38BDF8', name: 'Biru Langit' },
    { hex: '#3B82F6', name: 'Biru Kobalt' },
    { hex: '#2563EB', name: 'Biru Atletik' },
    { hex: '#1D4ED8', name: 'Biru Laut' },
    { hex: '#0F172A', name: 'Biru Navy Pekat' },
  ],
  // Row 4: Greens, Yellows & Oranges
  [
    { hex: '#059669', name: 'Hijau Zamrud' },
    { hex: '#16A34A', name: 'Hijau Daun' },
    { hex: '#84CC16', name: 'Hijau Stabilo' },
    { hex: '#FACC15', name: 'Kuning Terang' },
    { hex: '#EAB308', name: 'Kuning Emas' },
    { hex: '#F97316', name: 'Oranye Cerah' },
    { hex: '#EA580C', name: 'Oranye Senja' },
  ],
];

// Expanded rows shown when "See all" is clicked
const EXPANDED_SOLID_COLORS = [
  // Flores NTT Heritage
  [
    { hex: '#881337', name: 'Marun Zawo Ende' },
    { hex: '#B91C1C', name: 'Merah Tenun NTT' },
    { hex: '#064E3B', name: 'Hijau Hutan Kelimutu' },
    { hex: '#0A192F', name: 'Biru Selat Flores' },
    { hex: '#0284C7', name: 'Danau Nuwa Muri' },
    { hex: '#9A3412', name: 'Tembaga Tiwu Ata' },
    { hex: '#D97706', name: 'Kuning Kunyit Ende' },
  ],
  // High-Vis Athletic Neons
  [
    { hex: '#CCFF00', name: 'Volt Neon Kuning' },
    { hex: '#00F0FF', name: 'Laser Cyan' },
    { hex: '#FF007F', name: 'Neon Pink' },
    { hex: '#39FF14', name: 'Hijau Neon' },
    { hex: '#FF5F00', name: 'Hyper Orange' },
    { hex: '#9D00FF', name: 'Ultra Violet' },
    { hex: '#0066FF', name: 'Electric Royal' },
  ],
  // Modern Sport Pastels
  [
    { hex: '#A7F3D0', name: 'Pastel Mint' },
    { hex: '#BAE6FD', name: 'Pastel Ice Sky' },
    { hex: '#FED7AA', name: 'Pastel Peach' },
    { hex: '#DDD6FE', name: 'Pastel Lavender' },
    { hex: '#FECDD3', name: 'Pastel Rose' },
    { hex: '#FEF08A', name: 'Pastel Lemon' },
    { hex: '#F1F5F9', name: 'Pastel Slate' },
  ],
];

// Photo Colors extracted from Google Career Certificates & EKRAF
const PHOTO_PALETTES = [
  {
    id: 'google-cert',
    name: 'Google Career Certificates',
    colors: [
      { hex: '#4E5358', name: 'Slate Charcoal' },
      { hex: '#4E78B8', name: 'Google Denim Blue' },
      { hex: '#EA4335', name: 'Google Red' },
      { hex: '#FBBC04', name: 'Google Yellow' },
      { hex: '#34A853', name: 'Google Green' },
    ],
  },
  {
    id: 'ekraf',
    name: 'EKRAF / Kemenparekraf',
    colors: [
      { hex: '#282A2E', name: 'Deep Charcoal' },
      { hex: '#549DD4', name: 'Ekraf Sky Blue' },
      { hex: '#72B3E6', name: 'Azure Blue' },
      { hex: '#99C9ED', name: 'Soft Blue' },
      { hex: '#D0E7F9', name: 'Ice Light Blue' },
    ],
  },
];

// Official RIZA APPAREL Brand Kit
const RIZA_BRAND_KIT = [
  { hex: '#881337', name: 'Marun Zawo Ende' },
  { hex: '#0F172A', name: 'Obsidian Black' },
  { hex: '#0284C7', name: 'Danau Kelimutu' },
  { hex: '#D97706', name: 'Emas Zawo NTT' },
  { hex: '#059669', name: 'Zamrud Flores' },
  { hex: '#EA580C', name: 'Senja Flores' },
  { hex: '#FFFFFF', name: 'Putih Bersih' },
];

const COLLAR_STYLES: { id: CollarStyleId; name: string; desc: string }[] = [
  { id: 'v-neck', name: 'V-Neck Ergonomis', desc: 'Desain leher V modern elastis' },
  { id: 'o-neck', name: 'O-Neck Klasik', desc: 'Kerah bundar fleksibel resmi' },
  { id: 'polo', name: 'Kerah Polo Sport', desc: 'Kerah berdaun semi-formal' },
  { id: 'rib-overlap', name: 'Rib Overlap Silang', desc: 'Kerah tumpuk profesional liga' },
];

// -------------------------------------------------------------
// Unified, Mathematically Consistent Color Swatch Component
// NO harsh red-black outline. Clean subtle hover & active state.
// -------------------------------------------------------------
interface ColorSwatchProps {
  hex: string;
  name?: string;
  isSelected: boolean;
  isDark: boolean;
  onClick: () => void;
  size?: 'md' | 'sm';
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  hex,
  name,
  isSelected,
  isDark,
  onClick,
  size = 'md',
}) => {
  const isLight = isLightColor(hex);
  const sizeClass = size === 'sm' ? 'w-7 h-7 min-w-[28px] min-h-[28px]' : 'w-8 h-8 min-w-[32px] min-h-[32px]';

  return (
    <button
      type="button"
      onClick={onClick}
      title={name ? `${name} (${hex})` : hex}
      style={{ backgroundColor: hex }}
      className={`${sizeClass} aspect-square rounded-full cursor-pointer relative flex items-center justify-center transition-all duration-150 ease-out select-none focus:outline-none focus-visible:outline-none shrink-0 ${
        isSelected
          ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 z-10 shadow-sm'
          : 'border border-black/15 dark:border-white/15 hover:scale-115 hover:shadow-md hover:z-20 active:scale-95'
      }`}
    >
      {isSelected && (
        <Check
          className={`w-3.5 h-3.5 ${isLight ? 'text-slate-900' : 'text-white'} stroke-[2.5] drop-shadow-xs`}
        />
      )}
    </button>
  );
};

export const CanvaColorPicker: React.FC<CanvaColorPickerProps> = ({
  design,
  onUpdateDesign,
  isDark,
  onClose,
}) => {
  const [activeTarget, setActiveTarget] = useState<ColorTarget>('base');
  const [searchQuery, setSearchQuery] = useState('');
  const [seeAllSolids, setSeeAllSolids] = useState(false);
  const [showFigmaPicker, setShowFigmaPicker] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(true);
  const [showCollarSettings, setShowCollarSettings] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Figma/Canva custom color picker state (H, S, V)
  const [hue, setHue] = useState(210);
  const [sat, setSat] = useState(85);
  const [val, setVal] = useState(60);
  const [hexInputText, setHexInputText] = useState('');

  // 2D Saturation-Value drag ref
  const satValBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingSatVal = useRef(false);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingHue = useRef(false);

  // Helper to obtain current color for any target
  const getTargetColor = useCallback((target: ColorTarget): string => {
    switch (target) {
      case 'base':
        return design.baseColor || '#881337';
      case 'secondary':
        return design.secondaryColor || '#D97706';
      case 'accent':
        return design.accentColor || '#FFFFFF';
      case 'collar':
        return design.collarColor || design.secondaryColor || '#D97706';
      case 'typography':
        return design.numberColor || design.nameColor || '#FFFFFF';
      default:
        return '#881337';
    }
  }, [design]);

  const currentTargetColor = useMemo(() => getTargetColor(activeTarget), [activeTarget, getTargetColor]);

  // Sync HSV with target color when target or design changes
  useEffect(() => {
    const hsv = hexToHsv(currentTargetColor);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
    setHexInputText(currentTargetColor.replace('#', ''));
  }, [currentTargetColor]);

  // Target Labels and descriptions matching Canva & Figma style
  const targetMeta: Record<ColorTarget, { label: string; iconLabel: string; short: string }> = {
    base: {
      label: 'Badan Jersey Utama',
      iconLabel: 'Warna Badan (Base)',
      short: 'Badan',
    },
    secondary: {
      label: 'Lengan & Trim Garis',
      iconLabel: 'Warna Lengan (Sleeve)',
      short: 'Lengan',
    },
    accent: {
      label: 'Motif & Pola Sublimasi',
      iconLabel: 'Warna Motif & Aksen',
      short: 'Motif',
    },
    collar: {
      label: 'Kerah Leher',
      iconLabel: 'Warna Kerah (Collar)',
      short: 'Kerah',
    },
    typography: {
      label: 'Nama & Nomor Punggung',
      iconLabel: 'Warna Teks & Nomor',
      short: 'Nomor',
    },
  };

  // Apply a color to the active target
  const applyColor = useCallback((hex: string) => {
    const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
    switch (activeTarget) {
      case 'base':
        onUpdateDesign({ baseColor: cleanHex });
        break;
      case 'secondary':
        onUpdateDesign({ secondaryColor: cleanHex });
        break;
      case 'accent':
        onUpdateDesign({ accentColor: cleanHex });
        break;
      case 'collar':
        onUpdateDesign({ collarColor: cleanHex });
        break;
      case 'typography':
        onUpdateDesign({ numberColor: cleanHex, nameColor: cleanHex });
        break;
    }
  }, [activeTarget, onUpdateDesign]);

  // Eyedropper tool (EyeDropper API support with smooth fallbacks)
  const handleEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          applyColor(result.sRGBHex.toUpperCase());
        }
      } catch {
        // User cancelled or ignored
      }
    } else {
      setShowFigmaPicker(true);
    }
  };

  // Collect all unique colors present in current design
  const colorsInDesign = useMemo(() => {
    const rawList = [
      design.baseColor,
      design.secondaryColor,
      design.accentColor,
      design.collarColor,
      design.numberColor,
      design.nameColor,
      design.numberStrokeColor,
    ].filter(Boolean) as string[];

    const unique: string[] = [];
    rawList.forEach((hex) => {
      const lower = hex.toLowerCase();
      if (!unique.some((u) => u.toLowerCase() === lower)) {
        unique.push(hex.toUpperCase());
      }
    });
    return unique;
  }, [design]);

  // Generate tonal tints/shades for current color
  const tonalPalette = useMemo(() => {
    return generateTonalPalette(currentTargetColor);
  }, [currentTargetColor]);

  // Valid search match check
  const matchesSearch = (name: string, hex: string) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim().replace(/^#/, '');
    const cleanHex = hex.toLowerCase().replace(/^#/, '');
    const cleanName = name.toLowerCase();
    return cleanHex.includes(q) || cleanName.includes(q);
  };

  // Check if search query itself is a valid hex
  const isDirectHexQuery = useMemo(() => {
    const clean = searchQuery.trim().replace(/^#/, '');
    return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(clean);
  }, [searchQuery]);

  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  // -------------------------------------------------------------
  // Custom Figma-style 2D Saturation/Brightness Drag Handlers
  // -------------------------------------------------------------
  const updateSatValFromEvent = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!satValBoxRef.current) return;
    const rect = satValBoxRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const newSat = Math.round((x / rect.width) * 100);
    const newVal = Math.round(100 - (y / rect.height) * 100);

    setSat(newSat);
    setVal(newVal);

    const [r, g, b] = hsvToRgb(hue, newSat, newVal);
    const newHex = rgbToHex(r, g, b);
    setHexInputText(newHex.replace('#', ''));
    applyColor(newHex);
  };

  const handleSatValPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingSatVal.current = true;
    updateSatValFromEvent(e);
  };

  const handleSatValPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSatVal.current) return;
    updateSatValFromEvent(e);
  };

  const handleSatValPointerUp = () => {
    isDraggingSatVal.current = false;
  };

  // -------------------------------------------------------------
  // Custom Figma-style Hue Rainbow Slider Drag Handlers
  // -------------------------------------------------------------
  const updateHueFromEvent = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newHue = Math.round((x / rect.width) * 360);

    setHue(newHue);

    const [r, g, b] = hsvToRgb(newHue, sat, val);
    const newHex = rgbToHex(r, g, b);
    setHexInputText(newHex.replace('#', ''));
    applyColor(newHex);
  };

  const handleHuePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingHue.current = true;
    updateHueFromEvent(e);
  };

  const handleHuePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingHue.current) return;
    updateHueFromEvent(e);
  };

  const handleHuePointerUp = () => {
    isDraggingHue.current = false;
  };

  // RGB values calculation for preview
  const [rgbR, rgbG, rgbB] = useMemo(() => hsvToRgb(hue, sat, val), [hue, sat, val]);

  return (
    <div className="space-y-4 pb-4">
      {/* 1. TOP HEADER & QUICK TOOL ACTIONS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-500" />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Studio Palet Warna Jersey
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowCollarSettings(!showCollarSettings)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
              showCollarSettings
                ? 'bg-brand-500 text-white border-brand-600 shadow-xs'
                : isDark
                  ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <List className="w-3 h-3" />
            <span>Kerah</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Tutup Panel"
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. TARGET ELEMENT SELECTOR PILLS (Sleek Segmented Control with Live Color Preview Dots) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Bagian Jersey:
          </span>
          <span className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-black/15 shadow-2xs"
              style={{ backgroundColor: currentTargetColor }}
            />
            {targetMeta[activeTarget].label}
          </span>
        </div>
        <div className={`p-1 rounded-xl border grid grid-cols-5 gap-1 ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/90 border-slate-200'
        }`}>
          {(['base', 'secondary', 'accent', 'collar', 'typography'] as ColorTarget[]).map((t) => {
            const isSelected = activeTarget === t;
            const targetColor = getTargetColor(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTarget(t)}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 truncate cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200/90 dark:border-slate-700'
                    : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: targetColor }}
                />
                <span className="truncate">{targetMeta[t].short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH INPUT (Well-Padded, Never Clipped) */}
      <div className="relative pt-0.5">
        <div className="absolute inset-y-0 left-0 pl-3 pt-0.5 flex items-center pointer-events-none">
          <Search className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Cari warna, contoh: "merah", "gold", "navy", atau "#881337"'
          className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl border transition-all focus:outline-none focus:ring-1 focus:ring-brand-500 ${
            isDark
              ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-slate-600'
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 shadow-2xs'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-2.5 pt-0.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Direct Hex Query Action Trigger */}
      {isDirectHexQuery && (
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-black/15 dark:border-white/20 shadow-xs shrink-0"
              style={{ backgroundColor: searchQuery.startsWith('#') ? searchQuery : `#${searchQuery}` }}
            />
            <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">
              {searchQuery.startsWith('#') ? searchQuery : `#${searchQuery}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              applyColor(searchQuery);
              setSearchQuery('');
            }}
            className="text-[11px] font-bold px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Terapkan Warna
          </button>
        </div>
      )}

      {/* 4. ACTIVE TARGET ROW: Rainbow Spectrum (+), Eyedropper, Active Swatch, Hex Code */}
      <div className={`p-3 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200/90'
      }`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-xs font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {targetMeta[activeTarget].iconLabel}
          </span>
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Klik (+) untuk Spectrum Figma
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Rainbow Gradient + Spectrum Button */}
            <button
              type="button"
              onClick={() => setShowFigmaPicker(!showFigmaPicker)}
              title="Buka Color Spectrum (Figma / Canva Style)"
              className="w-9 h-9 min-w-[36px] min-h-[36px] aspect-square rounded-full p-0.5 shadow-xs hover:scale-105 hover:shadow-md active:scale-95 transition-all flex items-center justify-center relative overflow-hidden cursor-pointer"
              style={{
                background:
                  'conic-gradient(from 180deg at 50% 50%, #EF4444 0deg, #F59E0B 60deg, #10B981 120deg, #06B6D4 180deg, #3B82F6 240deg, #8B5CF6 300deg, #EF4444 360deg)',
              }}
            >
              <div className={`w-full h-full rounded-full flex items-center justify-center ${
                isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
              }`}>
                <Plus className="w-4 h-4 font-bold stroke-[3]" />
              </div>
            </button>

            {/* Eyedropper Tool Button */}
            <button
              type="button"
              onClick={handleEyedropper}
              title="Pipet Warna (Eyedropper) dari Layar"
              className={`w-9 h-9 min-w-[36px] min-h-[36px] aspect-square rounded-full border shadow-2xs flex items-center justify-center transition-all hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-400'
              }`}
            >
              <Pipette className="w-4 h-4" />
            </button>

            {/* Active Color Circle (Simple, elegant, NO harsh red-black ring) */}
            <button
              type="button"
              onClick={() => setShowFigmaPicker(!showFigmaPicker)}
              title={`Warna Aktif: ${currentTargetColor}`}
              className="w-9 h-9 min-w-[36px] min-h-[36px] aspect-square rounded-full border border-black/15 dark:border-white/20 shadow-xs hover:scale-105 hover:shadow-md transition-all flex items-center justify-center cursor-pointer relative"
              style={{ backgroundColor: currentTargetColor }}
            >
              <Check className={`w-4 h-4 ${isLightColor(currentTargetColor) ? 'text-slate-900' : 'text-white'} drop-shadow-xs stroke-[2.5]`} />
            </button>
          </div>

          {/* Current Hex Code & Quick Copy */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => copyHex(currentTargetColor)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              <span>{currentTargetColor}</span>
              {copiedHex === currentTargetColor ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* FIGMA / CANVA BESPOKE INTERACTIVE COLOR PICKER */}
        {showFigmaPicker && (
          <div className={`mt-3 pt-3 border-t space-y-3 animate-fadeIn ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Sliders className="w-3.5 h-3.5 text-brand-500" />
                <span>Custom Spectrum Picker (Figma/Canva)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowFigmaPicker(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2D Saturation-Brightness Field */}
            <div
              ref={satValBoxRef}
              onPointerDown={handleSatValPointerDown}
              onPointerMove={handleSatValPointerMove}
              onPointerUp={handleSatValPointerUp}
              className="w-full h-32 rounded-xl relative cursor-crosshair overflow-hidden select-none touch-none shadow-inner border border-black/10"
              style={{
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-md absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform"
                style={{
                  left: `${sat}%`,
                  top: `${100 - val}%`,
                  backgroundColor: currentTargetColor,
                }}
              />
            </div>

            {/* 1D Rainbow Hue Slider Bar */}
            <div className="space-y-1">
              <div
                ref={hueSliderRef}
                onPointerDown={handleHuePointerDown}
                onPointerMove={handleHuePointerMove}
                onPointerUp={handleHuePointerUp}
                className="w-full h-3.5 rounded-full relative cursor-pointer select-none touch-none shadow-xs border border-black/10"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    backgroundColor: `hsl(${hue}, 100%, 50%)`,
                  }}
                />
              </div>
            </div>

            {/* Color Value Inputs */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">#</span>
                <input
                  type="text"
                  maxLength={7}
                  value={hexInputText}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
                    setHexInputText(val);
                    if (val.length === 6 || val.length === 3) {
                      applyColor(`#${val}`);
                    }
                  }}
                  placeholder="881337"
                  className={`w-full pl-6 pr-2 py-1 text-xs font-mono rounded-lg border uppercase focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono font-semibold px-2 py-1 rounded-md border flex-1 text-center truncate ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  RGB: {rgbR}, {rgbG}, {rgbB}
                </span>
              </div>
            </div>

            {/* Tonal Shades Row */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tonal Range Warna Ini:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {tonalPalette.map((t, idx) => (
                  <ColorSwatch
                    key={`tonal-${idx}-${t.hex}`}
                    hex={t.hex}
                    name={t.name}
                    isSelected={currentTargetColor.toLowerCase() === t.hex.toLowerCase()}
                    isDark={isDark}
                    onClick={() => applyColor(t.hex)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. "WARNA DALAM DESAIN INI" (Document Colors - Wrapped, Perfectly Aligned) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-brand-500" />
          <span className={`text-xs font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Colors in this design
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 p-1">
          {colorsInDesign.map((hex, idx) => (
            <ColorSwatch
              key={`design-color-${idx}-${hex}`}
              hex={hex}
              name={`Warna Desain ${idx + 1}`}
              isSelected={currentTargetColor.toLowerCase() === hex.toLowerCase()}
              isDark={isDark}
              onClick={() => applyColor(hex)}
            />
          ))}
        </div>
      </div>

      {/* 6. "BRAND KIT (RIZA APPAREL)" */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Bookmark className="w-3.5 h-3.5 text-brand-500" />
            <span>Brand Kit (RIZA APPAREL)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowBrandKit(!showBrandKit)}
            className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
          >
            {showBrandKit ? 'Sembunyikan' : 'Lihat Kit'}
          </button>
        </div>

        {showBrandKit && (
          <div className="flex flex-wrap items-center gap-2.5 p-1">
            {RIZA_BRAND_KIT.map((color) => (
              <ColorSwatch
                key={`brand-${color.hex}`}
                hex={color.hex}
                name={color.name}
                isSelected={currentTargetColor.toLowerCase() === color.hex.toLowerCase()}
                isDark={isDark}
                onClick={() => applyColor(color.hex)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 7. "PHOTO COLORS" (Google Certificates & EKRAF, Exact Same Size Swatches, No Clipping) */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <ImageIcon className="w-3.5 h-3.5 text-brand-500" />
          <span>Photo colors</span>
        </div>

        <div className="space-y-2">
          {/* Row 1: Google Career Certificates */}
          <div className="flex items-center gap-2.5 py-0.5">
            <div className="w-16 h-8 rounded-lg bg-white border border-slate-200 shadow-2xs flex flex-col items-center justify-center p-1 shrink-0">
              <span className="text-[9px] font-black tracking-tighter leading-none bg-gradient-to-r from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent">
                Google
              </span>
              <span className="text-[5px] text-slate-500 font-bold uppercase tracking-tighter leading-tight mt-0.5">
                Certificates
              </span>
            </div>

            <div className="flex items-center gap-2 p-0.5 overflow-x-auto">
              {PHOTO_PALETTES[0].colors.map((c) => (
                <ColorSwatch
                  key={`photo-google-${c.hex}`}
                  hex={c.hex}
                  name={c.name}
                  isSelected={currentTargetColor.toLowerCase() === c.hex.toLowerCase()}
                  isDark={isDark}
                  onClick={() => applyColor(c.hex)}
                />
              ))}
            </div>
          </div>

          {/* Row 2: EKRAF / Kemenparekraf */}
          <div className="flex items-center gap-2.5 py-0.5">
            <div className="w-16 h-8 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1 shrink-0 gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-sky-500" />
              <span className="text-[9px] font-black text-slate-800 tracking-tighter">
                EKRAF
              </span>
            </div>

            <div className="flex items-center gap-2 p-0.5 overflow-x-auto">
              {PHOTO_PALETTES[1].colors.map((c) => (
                <ColorSwatch
                  key={`photo-ekraf-${c.hex}`}
                  hex={c.hex}
                  name={c.name}
                  isSelected={currentTargetColor.toLowerCase() === c.hex.toLowerCase()}
                  isDark={isDark}
                  onClick={() => applyColor(c.hex)}
                />
              ))}
            </div>
          </div>

          {/* Row 3: Custom Uploaded Sponsor Logo Palette */}
          {design.sponsorLogoUrl && (
            <div className="flex items-center gap-2.5 py-0.5">
              <div className="w-16 h-8 rounded-lg bg-white/95 border border-slate-300 shadow-2xs flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img
                  src={design.sponsorLogoUrl}
                  alt="Sponsor Logo"
                  className="max-h-6 max-w-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2 p-0.5 overflow-x-auto">
                {[
                  { hex: '#1E293B', name: 'Logo Dark' },
                  { hex: '#0284C7', name: 'Logo Sky' },
                  { hex: '#DC2626', name: 'Logo Red' },
                  { hex: '#EAB308', name: 'Logo Gold' },
                  { hex: '#FFFFFF', name: 'Logo White' },
                ].map((c) => (
                  <ColorSwatch
                    key={`custom-logo-${c.hex}`}
                    hex={c.hex}
                    name={c.name}
                    isSelected={currentTargetColor.toLowerCase() === c.hex.toLowerCase()}
                    isDark={isDark}
                    onClick={() => applyColor(c.hex)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 8. "DEFAULT SOLID COLORS" (7-Columns Grid, Perfectly Sized 32px Swatches) */}
      <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Palette className="w-3.5 h-3.5 text-brand-500" />
            <span>Default solid colors</span>
          </div>
          <button
            type="button"
            onClick={() => setSeeAllSolids(!seeAllSolids)}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 transition-colors cursor-pointer"
          >
            {seeAllSolids ? 'Show less' : 'See all'}
          </button>
        </div>

        <div className="space-y-2.5 p-1">
          {DEFAULT_SOLID_COLORS.map((row, rowIdx) => (
            <div key={`default-row-${rowIdx}`} className="grid grid-cols-7 gap-2 place-items-center">
              {row.map((color) => {
                if (!matchesSearch(color.name, color.hex)) return null;
                return (
                  <ColorSwatch
                    key={`solid-${color.hex}`}
                    hex={color.hex}
                    name={color.name}
                    isSelected={currentTargetColor.toLowerCase() === color.hex.toLowerCase()}
                    isDark={isDark}
                    onClick={() => applyColor(color.hex)}
                  />
                );
              })}
            </div>
          ))}

          {/* Expanded Rows when "See all" is clicked */}
          {seeAllSolids && (
            <div className="space-y-2.5 pt-2 animate-fadeIn border-t border-dashed border-slate-300 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
                Flores Heritage, Neons & Athletic Pastels:
              </span>
              {EXPANDED_SOLID_COLORS.map((row, rowIdx) => (
                <div key={`expanded-row-${rowIdx}`} className="grid grid-cols-7 gap-2 place-items-center">
                  {row.map((color) => {
                    if (!matchesSearch(color.name, color.hex)) return null;
                    return (
                      <ColorSwatch
                        key={`exp-solid-${color.hex}`}
                        hex={color.hex}
                        name={color.name}
                        isSelected={currentTargetColor.toLowerCase() === color.hex.toLowerCase()}
                        isDark={isDark}
                        onClick={() => applyColor(color.hex)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 9. OPTIONAL COLLAR MODEL SETTINGS */}
      {showCollarSettings && (
        <div className={`p-3.5 rounded-2xl border space-y-2.5 animate-fadeIn ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Model Potongan Kerah (Collar)
            </span>
            <button
              type="button"
              onClick={() => setShowCollarSettings(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {COLLAR_STYLES.map((c) => {
              const isSelected = design.collarStyle === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onUpdateDesign({ collarStyle: c.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 shadow-2xs'
                      : isDark
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className={`text-xs font-bold block ${isSelected ? 'text-brand-600 dark:text-brand-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {c.name}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{c.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
