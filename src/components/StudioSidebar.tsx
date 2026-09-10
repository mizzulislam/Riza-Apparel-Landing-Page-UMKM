import React, { useRef, useState } from 'react';
import { 
  Palette, 
  Type, 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  Upload, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline,
  Ruler,
  FolderOpen,
  FileText,
  Wand2,
  Move,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  DesignState, 
  CollarStyle, 
  SponsorPlacement, 
  JerseyLayer, 
  JerseyPatternTemplate,
  JerseySize
} from '../types';
import { CanvaColorPicker } from './CanvaColorPicker';
import { JerseySizeSelector } from './JerseySizeSelector';
import { ElementInspectorPanel } from './ElementInspectorPanel';
import { AIVectorGenerator } from './AIVectorGenerator';

interface StudioSidebarProps {
  design: DesignState;
  onUpdateDesign: (updates: Partial<DesignState>) => void;
  onOpenSizeChart?: () => void;
  onOpenPrintGuidelines?: () => void;
  isDark?: boolean;
}

type TabKey = 'template' | 'color' | 'typography' | 'inspector' | 'ai_gen' | 'size' | 'sponsor' | 'reference' | 'layers';

const EXPANDED_PALETTE = [
  { name: 'Merah Marun Ende', hex: '#881337' },
  { name: 'Merah Cabai', hex: '#DC2626' },
  { name: 'Emas Zawo NTT', hex: '#D97706' },
  { name: 'Kuning Kunyit', hex: '#EAB308' },
  { name: 'Biru Danau Kelimutu', hex: '#0284C7' },
  { name: 'Biru Navy Pekat', hex: '#0F172A' },
  { name: 'Hijau Zamrud Flores', hex: '#059669' },
  { name: 'Hijau Daun', hex: '#16A34A' },
  { name: 'Putih Tulang', hex: '#F8FAFC' },
  { name: 'Hitam Arang', hex: '#18181B' },
  { name: 'Abu-Abu Baja', hex: '#475569' },
  { name: 'Oranye Senja Flores', hex: '#EA580C' },
  { name: 'Ungu Bangsawan', hex: '#7C3AED' },
  { name: 'Biru Cyan Elektrik', hex: '#06B6D4' },
  { name: 'Kuning Terang Sport', hex: '#FACC15' },
  { name: 'Perak Titanium', hex: '#94A3B8' },
];

const COLLAR_STYLES: { id: CollarStyle; name: string; desc: string }[] = [
  { id: 'v-neck', name: 'V-Neck Ergonomis', desc: 'Desain potongan leher V modern & elastis untuk sirkulasi optimal' },
  { id: 'o-neck', name: 'O-Neck Klasik', desc: 'Kerah bundar fleksibel standar pertandingan sepakbola resmi' },
  { id: 'polo', name: 'Kerah Polo Sport', desc: 'Kerah berdaun semi-formal berkarakter tangguh & elegan' },
  { id: 'rib-overlap', name: 'Rib Overlap Silang', desc: 'Gaya kerah tumpuk profesional khas jersey kompetisi liga eropa' },
];

const TEMPLATES: { id: JerseyPatternTemplate; name: string; desc: string; badge?: string }[] = [
  { id: 'ende-diamond', name: 'Tenun Ikat Ende (Zawo)', desc: 'Belah ketupat anyaman khas Ende Flores NTT bernilai budaya tinggi', badge: 'Warisan Ende' },
  { id: 'modern-stripes', name: 'Garis Dinamis Aerodinamis', desc: 'Pola garis vertikal tegas modern penambah kesan proporsi atletik', badge: 'Populer' },
  { id: 'gradient-slash', name: 'Torehan Gradasi Kecepatan', desc: 'Sapuan diagonal energik khas jersey futsal & running masa kini', badge: 'Modern' },
  { id: 'diagonal-blaze', name: 'Blaze Garis Miring Agresif', desc: 'Blaze kontras tajam penegas postur atlet', badge: 'Sporty' },
  { id: 'hex-grid', name: 'Honeycomb Carbon Mesh', desc: 'Tekstur heksagonal presisi bergaya high-tech sportswear', badge: 'Pro Tech' },
  { id: 'flores-waves', name: 'Gelombang Laut Flores', desc: 'Ombak dinamis selat Ende bernuansa maritim khas NTT', badge: 'Eksklusif' },
  { id: 'camo-military', name: 'Geometric Camo Taktis', desc: 'Pola kamuflase bersudut modern untuk tim berjiwa tempur', badge: 'Taktis' },
  { id: 'cross-hoops', name: 'Garis Horisontal Hoops', desc: 'Balok garis mendatar klasik ala klub rugby & sepakbola legendaris', badge: 'Klasik' },
  { id: 'kelimutu-abstract', name: 'Tiga Kawah Kelimutu', desc: 'Kombinasi warna mistis kawah Kelimutu (Toska, Tembaga & Obsidian)', badge: 'Eksklusif' },
  { id: 'chevron-arrow', name: 'Chevron Panah Presisi', desc: 'Pola panah bertingkat simbol akselerasi & pantang mundur', badge: 'Pro' },
  { id: 'solid-minimalist', name: 'Polos Minimalis Premium', desc: 'Tampilan bersih tanpa motif badan, menonjolkan kombinasi warna & logo', badge: 'Minimalis' },
];

const renderTemplateIcon = (id: JerseyPatternTemplate, isSelected: boolean) => {
  const strokeColor = isSelected ? '#3B82F6' : '#94A3B8';
  const fillColor = isSelected ? '#3B82F6' : '#64748B';
  switch (id) {
    case 'ende-diamond':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <polygon points="16,3 29,16 16,29 3,16" fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 1" />
          <polygon points="16,8 24,16 16,24 8,16" fill={fillColor} fillOpacity="0.4" />
          <polygon points="16,12 20,16 16,20 12,16" fill={strokeColor} />
        </svg>
      );
    case 'modern-stripes':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <rect x="6" y="2" width="4" height="28" rx="1" fill={strokeColor} />
          <rect x="14" y="2" width="4" height="28" rx="1" fill={fillColor} />
          <rect x="22" y="2" width="4" height="28" rx="1" fill={strokeColor} />
        </svg>
      );
    case 'gradient-slash':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <polygon points="6,2 14,2 26,30 18,30" fill={strokeColor} fillOpacity="0.9" />
          <polygon points="16,2 22,2 30,22 24,22" fill={fillColor} fillOpacity="0.5" />
          <line x1="2" y1="12" x2="16" y2="30" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'diagonal-blaze':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <polygon points="2,8 14,2 24,14 16,18 30,30 20,30 8,18 14,14" fill={strokeColor} />
        </svg>
      );
    case 'hex-grid':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <polygon points="16,3 24,8 24,18 16,23 8,18 8,8" fill="none" stroke={strokeColor} strokeWidth="1.8" />
          <polygon points="24,18 32,23 32,31 24,31 20,27" fill="none" stroke={fillColor} strokeWidth="1.2" />
          <polygon points="8,18 0,23 0,31 8,31 12,27" fill="none" stroke={fillColor} strokeWidth="1.2" />
          <circle cx="16" cy="13" r="1.5" fill={strokeColor} />
        </svg>
      );
    case 'flores-waves':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <path d="M2,10 C8,4 12,16 18,10 C24,4 28,16 30,10" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2,18 C8,12 12,24 18,18 C24,12 28,24 30,18" fill="none" stroke={fillColor} strokeWidth="2" strokeDasharray="3 1" strokeLinecap="round" />
          <path d="M2,26 C8,20 12,32 18,26 C24,20 28,32 30,26" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'camo-military':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <polygon points="3,3 14,5 11,15 4,12" fill={strokeColor} fillOpacity="0.8" />
          <polygon points="16,8 29,4 25,18 18,14" fill={fillColor} fillOpacity="0.5" />
          <polygon points="6,18 18,20 14,29 4,26" fill={strokeColor} fillOpacity="0.4" />
          <polygon points="20,20 30,23 26,30 17,28" fill={fillColor} fillOpacity="0.8" />
        </svg>
      );
    case 'cross-hoops':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <rect x="2" y="5" width="28" height="6" rx="1" fill={strokeColor} />
          <rect x="2" y="15" width="28" height="6" rx="1" fill={fillColor} />
          <rect x="2" y="25" width="28" height="4" rx="1" fill={strokeColor} fillOpacity="0.6" />
        </svg>
      );
    case 'kelimutu-abstract':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <circle cx="12" cy="12" r="8" fill="#06B6D4" fillOpacity="0.75" />
          <circle cx="22" cy="14" r="7" fill="#D97706" fillOpacity="0.75" />
          <circle cx="16" cy="22" r="6.5" fill="#3B82F6" fillOpacity="0.75" />
        </svg>
      );
    case 'chevron-arrow':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <polyline points="4,12 16,3 28,12" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="4,20 16,11 28,20" fill="none" stroke={fillColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="4,28 16,19 28,28" fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'solid-minimalist':
    default:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0 rounded-lg p-1 bg-slate-900/60 border border-slate-700/50">
          <path d="M8,7 L12,4 L20,4 L24,7 L28,12 L24,16 L22,28 L10,28 L8,16 L4,12 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
  }
};

const FONT_OPTIONS = [
  // Sport & Athletic
  { id: 'Teko', name: 'Teko Sport Condensed', sample: 'NUM 10', category: 'Sport' },
  { id: 'Bebas Neue', name: 'Bebas Neue Atletik Pro', sample: 'ATHLETE 7', category: 'Sport' },
  { id: 'Oswald', name: 'Oswald Collegiate Heavy', sample: 'PLAYER 8', category: 'Sport' },
  { id: 'Anton', name: 'Anton Striker Heavy', sample: 'STRIKER 11', category: 'Sport' },
  { id: 'Kanit', name: 'Kanit Dynamic Runner', sample: 'RUNNER 9', category: 'Sport' },
  { id: 'Russo One', name: 'Russo One Block Power', sample: 'POWER 99', category: 'Sport' },
  { id: 'Barlow Condensed', name: 'Barlow Match Condensed', sample: 'SPEED 14', category: 'Sport' },
  
  // Esports & High Tech
  { id: 'Orbitron', name: 'Orbitron Cyber Speed', sample: 'CYBER 01', category: 'Esports' },
  { id: 'Chakra Petch', name: 'Chakra Petch Mecha', sample: 'MECHA 88', category: 'Esports' },
  { id: 'Audiowide', name: 'Audiowide Sci-Fi Future', sample: 'AERO 23', category: 'Esports' },
  { id: 'Rajdhani', name: 'Rajdhani Precision Pro', sample: 'TACTIC 05', category: 'Esports' },
  { id: 'Bungee', name: 'Bungee Streetwear Block', sample: 'STREET 12', category: 'Street' },
  { id: 'Black Ops One', name: 'Black Ops Tactical Stencil', sample: 'ALPHA 07', category: 'Tactical' },

  // Modern Clean & Minimalist
  { id: 'Montserrat', name: 'Montserrat Pro Clean', sample: 'CAPTAIN 9', category: 'Clean' },
  { id: 'Plus Jakarta Sans', name: 'Jakarta Modern Sans', sample: 'DEFENDER 4', category: 'Clean' },
  { id: 'Poppins', name: 'Poppins Geometric Pro', sample: 'VANGUARD 2', category: 'Clean' },
  { id: 'Inter', name: 'Inter Clean Minimalist', sample: 'MIDFIELD 6', category: 'Clean' },

  // Classic, Heritage & Display
  { id: 'Righteous', name: 'Righteous Retro Wave', sample: 'RETRO 77', category: 'Display' },
  { id: 'Playfair Display', name: 'Playfair Royal Serif', sample: 'VINTAGE 5', category: 'Classic' },
  { id: 'Cinzel', name: 'Cinzel Classical Roman', sample: 'CHAMPION 1', category: 'Classic' },
];

const DEFAULT_LAYERS: JerseyLayer[] = [
  { id: 'base', label: 'Bahan & Warna Dasar Jersey', visible: true },
  { id: 'motif', label: 'Motif Sublimasi / Tenun NTT', visible: true },
  { id: 'collar', label: 'Kerah & Variasi Rib Leher', visible: true },
  { id: 'sponsor', label: 'Logo / Teks Sponsor Dada', visible: true },
  { id: 'typography', label: 'Nama Punggung & Nomor Pemain', visible: true },
];

interface QuickColorSwatchButtonProps {
  color: string;
  onChange: (color: string) => void;
  title?: string;
  isDark?: boolean;
}

const QuickColorSwatchButton: React.FC<QuickColorSwatchButtonProps> = ({
  color,
  onChange,
  title = 'Pilih Warna',
  isDark = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(color.replace('#', ''));
  const presets = [
    '#FFFFFF', '#000000', '#0F172A', '#D97706', '#881337', 
    '#0284C7', '#DC2626', '#059669', '#FACC15', '#EA580C', 
    '#7C3AED', '#475569'
  ];

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={title}
        style={{ backgroundColor: color }}
        className="w-8 h-8 rounded-full border border-black/15 dark:border-white/20 shadow-xs cursor-pointer hover:scale-110 active:scale-95 transition-all flex items-center justify-center focus:outline-none"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-white/70 shadow-2xs" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 bottom-10 z-50 p-3 rounded-2xl border shadow-2xl w-56 space-y-2.5 animate-fadeIn ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>{title}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {presets.map((hex) => {
              const isSel = color.toLowerCase() === hex.toLowerCase();
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => {
                    onChange(hex);
                    setCustomHex(hex.replace('#', ''));
                    setIsOpen(false);
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
          <div className="pt-1.5 border-t border-slate-700/50 flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono">#</span>
            <input
              type="text"
              maxLength={6}
              value={customHex}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
                setCustomHex(v);
                if (v.length === 6 || v.length === 3) {
                  onChange(`#${v}`);
                }
              }}
              placeholder="FFFFFF"
              className={`w-full px-2 py-1 text-xs font-mono uppercase rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  design,
  onUpdateDesign,
  onOpenSizeChart,
  onOpenPrintGuidelines,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('template');
  const patternInputRef = useRef<HTMLInputElement>(null);
  const sponsorLogoInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const localFontInputRef = useRef<HTMLInputElement>(null);

  const currentLayers = design.layers || DEFAULT_LAYERS;

  // Handle layer visibility toggle
  const toggleLayerVisibility = (id: string) => {
    const updated = currentLayers.map((layer) => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    );
    onUpdateDesign({ layers: updated });
  };

  // Handle reorder layers (move up/down)
  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentLayers.length) return;

    const newLayers = [...currentLayers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[targetIndex];
    newLayers[targetIndex] = temp;

    onUpdateDesign({ layers: newLayers });
  };

  // Upload Custom Sublimation Pattern
  const handlePatternUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateDesign({
        motifTemplate: 'custom-upload',
        customPatternUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  // Upload Sponsor Logo
  const handleSponsorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateDesign({
        sponsorLogoUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  // Upload Reference Media Image
  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateDesign({
        referenceImageUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  // Upload Local Font (.ttf/.otf)
  const handleLocalFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const cleanFontName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      const arrayBuffer = await file.arrayBuffer();
      const fontFace = new (window as any).FontFace(cleanFontName, arrayBuffer);
      await fontFace.load();
      (document as any).fonts.add(fontFace);

      const existing = design.customFonts || [];
      const updatedCustom = existing.some(f => f.name === cleanFontName) 
        ? existing 
        : [...existing, { name: cleanFontName, isLocal: true }];
        
      onUpdateDesign({
        customFonts: updatedCustom,
        fontFamily: cleanFontName,
      });
    } catch (err) {
      console.error("Gagal memuat font lokal:", err);
    }
  };

  // Tab definitions with clear labels and icons
  const TAB_ITEMS: { id: TabKey; label: string; short: string; icon: any; desc: string }[] = [
    { id: 'template', label: 'Motif Pola', short: 'Motif', icon: Sparkles, desc: 'Pilihan 11 template pola sublimasi budaya & modern' },
    { id: 'color', label: 'Warna & Kerah', short: 'Warna', icon: Palette, desc: 'Palet warna jersey, lengan, aksen & model kerah' },
    { id: 'typography', label: 'Teks & Font', short: 'Teks', icon: Type, desc: 'Nama punggung, nomor, font Google & font lokal' },
    { id: 'inspector', label: 'Posisi & Alat', short: 'Posisi', icon: Move, desc: 'Perataan, geser koordinat, rotasi & stroke outline' },
    { id: 'ai_gen', label: 'AI Vektor', short: 'AI Vektor', icon: Wand2, desc: 'Generator motif tenun & emblem perisai berbasis prompt AI' },
    { id: 'size', label: 'Ukuran Tim', short: 'Ukuran', icon: Ruler, desc: 'Pilihan size preview & rincian pesanan ukuran tim' },
    { id: 'sponsor', label: 'Logo Sponsor', short: 'Sponsor', icon: ImageIcon, desc: 'Unggah logo sponsor, penempatan & skala logo' },
    { id: 'reference', label: 'Media & Cetak', short: 'File Cetak', icon: Upload, desc: 'Foto referensi & panduan spesifikasi file cetak' },
    { id: 'layers', label: 'Layer Desain', short: 'Layer', icon: Layers, desc: 'Urutan tumpukan layer & kendali visibilitas elemen' },
  ];

  const currentTabInfo = TAB_ITEMS.find(t => t.id === activeTab) || TAB_ITEMS[0];
  const CurrentTabIcon = currentTabInfo.icon;

  return (
    <aside 
      id="studio-tools-sidebar"
      className={`w-full rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-slate-900/95 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* 1. SIDEBAR HEADER: 3-COLUMN STRUCTURED NAVIGATION GRID */}
      <div className={`p-2.5 border-b grid grid-cols-3 gap-1.5 ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        {TAB_ITEMS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-2.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[42px] ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md ring-1 ring-brand-500/50'
                  : isDark 
                    ? 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/90 border border-slate-800' 
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-2xs'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. ACTIVE TOOL CONTEXT BANNER */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${
        isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <CurrentTabIcon className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          <span className={`font-extrabold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentTabInfo.label}
          </span>
          <span className={`text-[11px] truncate hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            • {currentTabInfo.desc}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-500 border border-brand-500/20 shrink-0">
          Alat Aktif
        </span>
      </div>

      {/* 3. TAB CONTENT CONTAINER */}
      <div className="p-4 sm:p-5 pb-28 sm:pb-36 max-h-[750px] overflow-y-auto space-y-6 custom-scrollbar">

        {/* 1. TAB: TEMPLATE & MOTIF */}
        {activeTab === 'template' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Pilih Pola & Template Jersey</span>
              </h3>
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                11 Pilihan Desain
              </span>
            </div>

            {/* Custom File Upload Option */}
            <div className={`p-4 rounded-2xl border ${
              design.motifTemplate === 'custom-upload'
                ? 'border-brand-500 bg-brand-500/10'
                : isDark ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Upload className="w-3.5 h-3.5 text-brand-500" />
                  <span>Upload Motif / Pola Custom</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-600 text-white font-bold">PNG / JPG</span>
              </div>
              <p className={`text-[11px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Unggah gambar motif tenun, abstrak, atau tekstur kustom Anda untuk disublimasikan pada kanvas jersey.
              </p>
              <div className="flex items-center gap-2">
                <input
                  ref={patternInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePatternUpload}
                  className="hidden"
                  id="custom-pattern-upload-input"
                />
                <button
                  type="button"
                  onClick={() => patternInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[40px] shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{design.customPatternUrl ? 'Ganti File Motif' : 'Pilih File Gambar Motif'}</span>
                </button>
                {design.customPatternUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateDesign({ customPatternUrl: undefined, motifTemplate: 'ende-diamond' })}
                    className="p-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs min-h-[40px]"
                    title="Hapus Pola Kustom"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {design.customPatternUrl && (
                <div className={`mt-3 flex items-center gap-3 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                  <span className={`text-[11px] whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Kerapatan Pola:
                  </span>
                  <input
                    type="range"
                    min="30"
                    max="140"
                    value={design.customPatternScale || 60}
                    onChange={(e) => onUpdateDesign({ customPatternScale: Number(e.target.value) })}
                    className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}
                  />
                  <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {design.customPatternScale || 60}px
                  </span>
                </div>
              )}
            </div>

            {/* Template List Grid */}
            <div className="space-y-2">
              {TEMPLATES.map((tmpl) => {
                const isSelected = design.motifTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => onUpdateDesign({ motifTemplate: tmpl.id, motif: tmpl.id })}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/15 shadow-sm ring-1 ring-brand-500/40'
                        : isDark
                          ? 'border-slate-800 hover:border-slate-700 bg-slate-800/50'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    {/* Visual Motif Icon Thumbnail */}
                    {renderTemplateIcon(tmpl.id, isSelected)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-brand-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
                          {tmpl.name}
                        </span>
                        {tmpl.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-heritage-zawo/20 text-heritage-zawo border border-heritage-zawo/30 font-bold whitespace-nowrap">
                            {tmpl.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{tmpl.desc}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      isSelected ? 'bg-brand-600 border-brand-500 text-white' : 'border-slate-400'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TAB: COLOR & COLLAR (CANVA-STYLE COLOR PICKER) */}
        {activeTab === 'color' && (
          <CanvaColorPicker
            design={design}
            onUpdateDesign={onUpdateDesign}
            isDark={isDark}
          />
        )}

        {/* 3. TAB: TYPOGRAPHY & NUMBER */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              <span>Personalisasi Nama, Nomor & Font</span>
            </h3>

            {/* Player Name and Number Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`text-[11px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Nama Punggung:
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={design.playerName}
                  onChange={(e) => onUpdateDesign({ playerName: e.target.value.toUpperCase() })}
                  placeholder="EUGENIO"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-extrabold tracking-wider focus:outline-none focus:border-brand-500 min-h-[44px] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className={`text-[11px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Nomor Punggung:
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={design.playerNumber}
                  onChange={(e) => onUpdateDesign({ playerNumber: e.target.value })}
                  placeholder="10"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-center font-black focus:outline-none focus:border-brand-500 min-h-[44px] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Font Family Selector with Google Fonts + Local Font Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-[11px] font-bold uppercase block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Model Font:
                </label>
                <button
                  type="button"
                  onClick={() => localFontInputRef.current?.click()}
                  className="text-[10px] font-bold text-brand-500 hover:text-brand-400 flex items-center gap-1 transition-colors"
                >
                  <FolderOpen className="w-3 h-3" />
                  <span>+ Upload Font Lokal (.ttf/.otf)</span>
                </button>
                <input
                  ref={localFontInputRef}
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleLocalFontUpload}
                  className="hidden"
                />
              </div>

              {/* Uploaded Custom Fonts if any */}
              {design.customFonts && design.customFonts.length > 0 && (
                <div className={`p-2 rounded-xl border space-y-1 ${
                  isDark ? 'bg-brand-950/30 border-brand-500/30' : 'bg-brand-50 border-brand-200'
                }`}>
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">
                    Font Kustom Anda:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {design.customFonts.map((cf) => (
                      <button
                        key={cf.name}
                        type="button"
                        onClick={() => onUpdateDesign({ fontFamily: cf.name })}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all ${
                          design.fontFamily === cf.name
                            ? 'bg-brand-600 border-brand-500 text-white'
                            : isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                        style={{ fontFamily: cf.name }}
                      >
                        {cf.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto custom-scrollbar p-1">
                {FONT_OPTIONS.map((f) => {
                  const isSelected = (design.fontFamily || 'Teko') === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onUpdateDesign({ fontFamily: f.id })}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/15 shadow-2xs ring-1 ring-brand-500/30'
                          : isDark ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span 
                          className={`text-sm block truncate ${isSelected ? 'text-brand-500 font-bold' : isDark ? 'text-white' : 'text-slate-900'}`}
                          style={{ fontFamily: f.id }}
                        >
                          {f.sample}
                        </span>
                        {f.category && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${
                            isSelected 
                              ? 'bg-brand-500/20 text-brand-400' 
                              : isDark ? 'bg-slate-700/60 text-slate-400' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {f.category}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{f.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Alignment & Style Toolbar */}
            <div className={`p-3 rounded-2xl border space-y-3 ${
              isDark ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-50'
            }`}>
              {/* Alignment Controls (Left, Center, Right) */}
              <div className="space-y-1.5">
                <span className={`text-[11px] font-bold uppercase block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Perataan Teks (Alignment):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateDesign({ textAlignment: 'left' })}
                    className={`py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      design.textAlignment === 'left'
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Rata Kiri</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateDesign({ textAlignment: 'center' })}
                    className={`py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      design.textAlignment === 'center' || !design.textAlignment
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>Tengah</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateDesign({ textAlignment: 'right' })}
                    className={`py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      design.textAlignment === 'right'
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                    <span>Rata Kanan</span>
                  </button>
                </div>
              </div>

              {/* Letter Spacing Slider */}
              <div className={`space-y-1.5 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Pengaturan Spasi Huruf (Kerning):</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {design.letterSpacing ?? 2}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="14"
                  value={design.letterSpacing ?? 2}
                  onChange={(e) => onUpdateDesign({ letterSpacing: Number(e.target.value) })}
                  className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
                />
              </div>

              {/* Style Controls: Bold, Italic, Underline */}
              <div className={`grid grid-cols-3 gap-2 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => onUpdateDesign({ 
                    fontWeight: design.fontWeight === '900' || !design.fontWeight ? 'normal' : '900' 
                  })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    (design.fontWeight === '900' || !design.fontWeight)
                      ? 'bg-brand-600 border-brand-500 text-white'
                      : isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="font-black text-sm">B</span>
                  <span>Tebal</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDesign({ isItalic: !design.isItalic })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    design.isItalic
                      ? 'bg-brand-600 border-brand-500 text-white'
                      : isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="italic font-serif text-sm">I</span>
                  <span>Miring</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDesign({ isUnderline: !design.isUnderline })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    design.isUnderline
                      ? 'bg-brand-600 border-brand-500 text-white'
                      : isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <Underline className="w-3.5 h-3.5" />
                  <span>Garis Bawah</span>
                </button>
              </div>

              {/* Stroke / Outline Width Slider & Color */}
              <div className={`space-y-1.5 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Tebal Stroke / Outline Teks:</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {design.strokeWidth ?? (design.hasTextOutline !== false ? 2 : 0)}px
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={design.strokeWidth ?? (design.hasTextOutline !== false ? 2 : 0)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateDesign({ 
                        strokeWidth: val,
                        hasTextOutline: val > 0 
                      });
                    }}
                    className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
                  />
                  <QuickColorSwatchButton
                    color={design.strokeColor || design.numberStrokeColor || '#0F172A'}
                    onChange={(newColor) => onUpdateDesign({
                      strokeColor: newColor,
                      numberStrokeColor: newColor
                    })}
                    title="Warna Stroke Outline"
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* Opacity Slider */}
              <div className={`space-y-1.5 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Transparansi (Opacity):</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {design.elementOpacity ?? 100}%
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="5"
                  value={design.elementOpacity ?? 100}
                  onChange={(e) => onUpdateDesign({ elementOpacity: Number(e.target.value) })}
                  className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
                />
              </div>

              {/* Text Colors */}
              <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <div className={`flex items-center justify-between p-2 rounded-xl border ${
                  isDark ? 'border-slate-700/50 bg-slate-900/60' : 'border-slate-300 bg-white'
                }`}>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Warna Nama:</span>
                  <QuickColorSwatchButton
                    color={design.nameColor || '#FFFFFF'}
                    onChange={(newColor) => onUpdateDesign({ nameColor: newColor })}
                    title="Warna Nama Punggung"
                    isDark={isDark}
                  />
                </div>
                <div className={`flex items-center justify-between p-2 rounded-xl border ${
                  isDark ? 'border-slate-700/50 bg-slate-900/60' : 'border-slate-300 bg-white'
                }`}>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Warna Nomor:</span>
                  <QuickColorSwatchButton
                    color={design.numberColor || design.accentColor || '#FFFFFF'}
                    onChange={(newColor) => onUpdateDesign({ numberColor: newColor })}
                    title="Warna Nomor Punggung"
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB: ELEMENT INSPECTOR (POSISI, LAYOUT, ROTASI, GROUP) */}
        {activeTab === 'inspector' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                <Move className="w-4 h-4" />
                <span>Atur Posisi & Layout Elemen</span>
              </h3>
            </div>
            <ElementInspectorPanel 
              design={design} 
              onUpdateDesign={onUpdateDesign} 
              isDark={isDark} 
            />
          </div>
        )}

        {/* 5. TAB: AI VECTOR 2D/3D GENERATOR */}
        {activeTab === 'ai_gen' && (
          <div className="space-y-4">
            <AIVectorGenerator 
              onApplyPattern={(dataUrl, name) => {
                onUpdateDesign({
                  motifTemplate: 'custom-upload',
                  customPatternUrl: dataUrl,
                });
                setActiveTab('template');
              }}
              onApplyLogo={(dataUrl, name) => {
                onUpdateDesign({
                  sponsorLogoUrl: dataUrl,
                  sponsorLogoPosition: 'chest',
                });
                setActiveTab('sponsor');
              }}
              isDark={isDark}
              currentJerseyColors={[design.baseColor, design.secondaryColor, design.accentColor]}
            />
          </div>
        )}

        {/* 6. TAB: UKURAN JERSEY & RINCIAN TIM */}
        {activeTab === 'size' && (
          <div className="space-y-4">
            <JerseySizeSelector
              design={design}
              onUpdateDesign={onUpdateDesign}
              onOpenSizeChart={() => onOpenSizeChart?.()}
              isDark={isDark}
            />
          </div>
        )}

        {/* 7. TAB: SPONSOR & LOGO */}
        {activeTab === 'sponsor' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Logo Sponsor & Aksen Apparel</span>
            </h3>

            {/* Custom Sponsor Logo File Upload */}
            <div className={`p-4 rounded-2xl border ${
              design.sponsorLogoUrl
                ? 'border-brand-500 bg-brand-500/10'
                : isDark ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Upload className="w-4 h-4 text-brand-500" />
                  <span>Tambah Foto / Logo Sponsor</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-bold">
                  PNG Transparan / JPG
                </span>
              </div>
              <p className={`text-[11px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Upload logo tim, instansi, atau sponsor Anda untuk disematkan pada jersey dan diuji langsung pada simulasi 2D & 3D.
              </p>

              <input
                ref={sponsorLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleSponsorUpload}
                className="hidden"
                id="sponsor-logo-upload-input"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sponsorLogoInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>{design.sponsorLogoUrl ? 'Ganti File Logo Sponsor' : 'Pilih File Logo Sponsor'}</span>
                </button>
                {design.sponsorLogoUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateDesign({ sponsorLogoUrl: undefined })}
                    className="p-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs min-h-[42px]"
                    title="Hapus Logo Sponsor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Logo Preview Thumbnail */}
              {design.sponsorLogoUrl && (
                <div className={`mt-3 p-2 rounded-xl border flex items-center gap-3 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <img
                    src={design.sponsorLogoUrl}
                    alt="Logo Preview"
                    className="w-12 h-12 object-contain bg-white/5 rounded-lg p-1 border border-slate-400"
                  />
                  <div className="flex-1">
                    <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Logo Aktif</span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Diterapkan pada kanvas</span>
                  </div>
                </div>
              )}
            </div>

            {/* Placement Position */}
            <div>
              <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Posisi Penempatan Logo Sponsor:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'chest', label: 'Dada Tengah' },
                  { id: 'left-chest', label: 'Dada Kiri (Crest)' },
                  { id: 'right-chest', label: 'Dada Kanan' },
                  { id: 'sleeve', label: 'Lengan Jersey' },
                  { id: 'upper-back', label: 'Punggung Atas' },
                ].map((pos) => {
                  const isSelected = (design.sponsorLogoPosition || 'chest') === pos.id;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => onUpdateDesign({ sponsorLogoPosition: pos.id as SponsorPlacement })}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/15 text-brand-500 font-extrabold shadow-2xs'
                          : isDark ? 'border-slate-800 bg-slate-800/40 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pos.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Scale Slider */}
            <div className={`p-3 rounded-2xl border space-y-2 ${isDark ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>Skala / Ukuran Logo:</span>
                <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {Math.round((design.sponsorScale || 1.0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={design.sponsorScale || 1.0}
                onChange={(e) => onUpdateDesign({ sponsorScale: Number(e.target.value) })}
                className={`w-full accent-brand-500 h-2 rounded-lg cursor-pointer ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
              />
            </div>

            {/* Text Sponsor Alternative */}
            <div>
              <label className={`text-[11px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Teks Sponsor Alternatif (Bila Tanpa File Logo):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={design.sponsorText || ''}
                  onChange={(e) => onUpdateDesign({ sponsorText: e.target.value })}
                  placeholder="RIZA SPORT / NAMA SPONSOR"
                  className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-brand-500 min-h-[42px] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <QuickColorSwatchButton
                  color={design.sponsorColor || '#FFFFFF'}
                  onChange={(newColor) => onUpdateDesign({ sponsorColor: newColor })}
                  title="Warna Teks Sponsor"
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        )}

        {/* 8. TAB: REFERENCE MEDIA & PRINT GUIDELINES */}
        {activeTab === 'reference' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span>Media Referensi & Persyaratan File Cetak</span>
            </h3>

            {/* Print & Design File Requirements Callout */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
              isDark ? 'border-brand-500/30 bg-brand-950/20' : 'border-brand-200 bg-brand-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Persyaratan File Cetak
                  </span>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    DPI, format CDR/AI/PDF, resolusi sublim
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenPrintGuidelines?.()}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
              >
                Lihat Panduan
              </button>
            </div>

            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Punya contoh foto jersey yang ingin ditiru atau menjadi rujukan? Unggah foto referensi di sini. Admin dan tim desainer grafis RIZA APPAREL akan menyempurnakannya saat validasi WhatsApp.
            </p>

            <input
              ref={referenceInputRef}
              type="file"
              accept="image/*"
              onChange={handleReferenceUpload}
              className="hidden"
              id="reference-media-upload-input"
            />

            <div 
              onClick={() => referenceInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all ${
                design.referenceImageUrl
                  ? 'border-brand-500 bg-brand-500/10'
                  : isDark ? 'border-slate-700 hover:border-slate-600 bg-slate-800/30' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
            >
              {design.referenceImageUrl ? (
                <div className="space-y-2">
                  <img
                    src={design.referenceImageUrl}
                    alt="Foto Referensi"
                    className="w-full max-h-44 object-contain rounded-xl mx-auto border border-slate-400 shadow-md"
                  />
                  <span className="text-xs font-bold text-emerald-500 block">✓ Foto Referensi Terpasang</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Klik untuk mengganti foto</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-brand-600/20 text-brand-500 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Upload Foto Contoh / Referensi
                  </span>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Mendukung format JPG, PNG, WEBP
                  </span>
                </div>
              )}
            </div>

            {/* Note for Tailor / Production Team */}
            <div>
              <label className={`text-[11px] font-bold uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Catatan Khusus Desain / Permintaan Tim:
              </label>
              <textarea
                rows={3}
                value={design.referenceNote || ''}
                onChange={(e) => onUpdateDesign({ referenceNote: e.target.value })}
                placeholder="Contoh: Tolong garis di lengan dibuat lebih tebal 2cm, warna merah marun agak gelap seperti klub AS Roma..."
                className={`w-full border rounded-2xl p-3 text-xs focus:outline-none focus:border-brand-500 resize-none ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>
        )}

        {/* 9. TAB: LAYERS & Z-ORDER */}
        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Manajemen Layer & Urutan Tampilan</span>
              </h3>
              <button
                type="button"
                onClick={() => onUpdateDesign({ layers: DEFAULT_LAYERS })}
                className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                title="Reset ke urutan bawaan"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Atur posisi layer depan-belakang elemen desain jersey dan nyalakan/matikan visibilitas elemen secara dinamis.
            </p>

            <div className="space-y-2">
              {currentLayers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    layer.visible
                      ? isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-white shadow-2xs'
                      : isDark ? 'border-slate-800/60 bg-slate-900/50 opacity-60' : 'border-slate-200 bg-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className={`p-1.5 rounded-lg transition-all min-h-[34px] min-w-[34px] flex items-center justify-center ${
                        layer.visible
                          ? 'text-brand-500 hover:bg-brand-500/20'
                          : isDark ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-200'
                      }`}
                      title={layer.visible ? 'Sembunyikan Layer' : 'Tampilkan Layer'}
                    >
                      {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <div>
                      <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {layer.label}
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Layer {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Reorder Buttons Up & Down */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveLayer(index, 'up')}
                      className={`p-1.5 rounded-lg border text-xs min-h-[32px] min-w-[32px] flex items-center justify-center ${
                        index === 0
                          ? 'border-transparent text-slate-400/40 cursor-not-allowed'
                          : isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Pindah ke Depan (Naik)"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === currentLayers.length - 1}
                      onClick={() => moveLayer(index, 'down')}
                      className={`p-1.5 rounded-lg border text-xs min-h-[32px] min-w-[32px] flex items-center justify-center ${
                        index === currentLayers.length - 1
                          ? 'border-transparent text-slate-400/40 cursor-not-allowed'
                          : isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Pindah ke Belakang (Turun)"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
