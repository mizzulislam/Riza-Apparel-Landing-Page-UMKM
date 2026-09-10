import React from 'react';
import { 
  Ruler, 
  Users, 
  Plus, 
  Minus, 
  Trash2, 
  Info, 
  Sparkles,
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { DesignState, JerseySize, TeamSizeBreakdownItem } from '../types';

interface JerseySizeSelectorProps {
  design: DesignState;
  onUpdateDesign: (updates: Partial<DesignState>) => void;
  onOpenSizeChart?: () => void;
  isDark?: boolean;
}

const ALL_SIZES: JerseySize[] = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL',
  'Anak-S', 'Anak-M', 'Anak-L', 'Anak-XL'
];

export const JerseySizeSelector: React.FC<JerseySizeSelectorProps> = ({
  design,
  onUpdateDesign,
  onOpenSizeChart,
  isDark = true,
}) => {
  const currentSize = design.jerseySize || 'L';
  const teamBreakdown: TeamSizeBreakdownItem[] = design.teamSizeBreakdown || [
    { size: 'L', count: 1 }
  ];

  // Calculate total pieces
  const totalPcs = teamBreakdown.reduce((acc: number, curr: TeamSizeBreakdownItem) => acc + curr.count, 0);

  // Update single primary size
  const handleSelectPrimarySize = (sz: JerseySize) => {
    onUpdateDesign({ jerseySize: sz });
    // Update or ensure this size is represented in breakdown
    const existing = teamBreakdown.find((item: TeamSizeBreakdownItem) => item.size === sz);
    if (!existing) {
      onUpdateDesign({
        jerseySize: sz,
        teamSizeBreakdown: [...teamBreakdown, { size: sz, count: 1 }],
      });
    }
  };

  // Adjust count in team roster breakdown
  const handleAdjustCount = (size: JerseySize, delta: number) => {
    let updated = [...teamBreakdown];
    const index = updated.findIndex((item: TeamSizeBreakdownItem) => item.size === size);

    if (index >= 0) {
      const newCount = updated[index].count + delta;
      if (newCount <= 0) {
        // remove item if reaches 0
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], count: newCount };
      }
    } else if (delta > 0) {
      updated.push({ size, count: delta });
    }

    if (updated.length === 0) {
      updated = [{ size: currentSize, count: 1 }];
    }

    onUpdateDesign({ teamSizeBreakdown: updated });
  };

  // Quick preset helper
  const handleApplyPreset = (type: 'futsal' | 'football' | 'reset') => {
    if (type === 'futsal') {
      onUpdateDesign({
        teamSizeBreakdown: [
          { size: 'S', count: 2 },
          { size: 'M', count: 5 },
          { size: 'L', count: 4 },
          { size: 'XL', count: 1 },
        ],
      });
    } else if (type === 'football') {
      onUpdateDesign({
        teamSizeBreakdown: [
          { size: 'S', count: 3 },
          { size: 'M', count: 7 },
          { size: 'L', count: 6 },
          { size: 'XL', count: 2 },
        ],
      });
    } else {
      onUpdateDesign({
        teamSizeBreakdown: [{ size: 'L', count: 1 }],
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner with Size Chart Link */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <Ruler className="w-4 h-4 text-brand-500" />
            </div>
            <div>
              <span className={`text-xs font-extrabold uppercase tracking-wider block ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Pilihan Ukuran Jersey
              </span>
              <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Standar Pola Reguler Atletis RIZA Ende
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onOpenSizeChart}
            className="px-2.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all shrink-0"
          >
            <span>Tabel Ukuran</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Primary Size Quick Selector Buttons */}
      <div className="space-y-2">
        <label className={`text-[11px] font-extrabold uppercase tracking-wider block ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Ukuran Preview Mockup Saat Ini:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
          {ALL_SIZES.slice(0, 8).map((sz) => {
            const isSelected = currentSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => handleSelectPrimarySize(sz)}
                className={`py-2 px-1 text-xs font-black rounded-xl border transition-all min-h-[38px] ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-500 shadow-md ring-2 ring-brand-500/40'
                    : isDark 
                      ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>

        {/* Kids Sizes Strip */}
        <div className="pt-1">
          <span className={`text-[10px] font-bold block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Ukuran Anak-Anak (Junior):
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {ALL_SIZES.slice(8).map((sz) => {
              const isSelected = currentSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleSelectPrimarySize(sz)}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-500'
                      : isDark 
                        ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sz.replace('Anak-', 'Junior ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Team Roster Breakdown (Rincian Jumlah Jersey Per Ukuran) */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-400" />
            <h4 className={`text-xs font-extrabold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Rincian Ukuran Pesanan Tim
            </h4>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Total: {totalPcs} Pcs
          </span>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => handleApplyPreset('futsal')}
            className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            ⚽ Tim Futsal (12 Pcs)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('football')}
            className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            🏆 Sepakbola (18 Pcs)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('reset')}
            className={`text-[10px] font-medium px-2 py-1 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Reset (1 Pcs)
          </button>
        </div>

        {/* Breakdown Items List */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {ALL_SIZES.map((sz) => {
            const item = teamBreakdown.find((b: TeamSizeBreakdownItem) => b.size === sz);
            const count = item ? item.count : 0;
            if (count === 0 && !['S', 'M', 'L', 'XL'].includes(sz)) return null;

            return (
              <div 
                key={sz} 
                className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                  count > 0 
                    ? isDark 
                      ? 'bg-slate-900/90 border-slate-700' 
                      : 'bg-white border-slate-300 shadow-2xs'
                    : isDark 
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-60' 
                      : 'bg-slate-100 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                    count > 0 
                      ? 'bg-brand-600 text-white shadow-xs' 
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {sz.replace('Anak-', 'J-')}
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Size {sz}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdjustCount(sz, -1)}
                    disabled={count <= 0}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                      count > 0 
                        ? isDark 
                          ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                          : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                        : 'opacity-30 cursor-not-allowed border-transparent'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className={`w-7 text-center font-mono font-black text-xs ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {count}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAdjustCount(sz, 1)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white' 
                        : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Sublimation Note */}
        <div className={`p-3 rounded-xl border flex items-start gap-2 text-[11px] ${
          isDark ? 'bg-brand-500/10 border-brand-500/20 text-brand-300' : 'bg-brand-50 border-brand-200 text-brand-900'
        }`}>
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-500" />
          <p className="leading-relaxed">
            Minimal pemesanan custom full printing di RIZA APPAREL adalah <strong>6 pcs</strong>. Rincian ukuran dan nomor pemain dapat diekspor langsung ke lembar kerja penjahit.
          </p>
        </div>
      </div>
    </div>
  );
};
