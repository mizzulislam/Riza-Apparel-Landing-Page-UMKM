import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  onSelectSize?: (size: string) => void;
}

const ADULT_SIZES = [
  { size: 'S', chest: 48, length: 68, shoulder: 42, height: '155 - 165', weight: '45 - 55' },
  { size: 'M', chest: 50, length: 70, shoulder: 44, height: '160 - 170', weight: '55 - 65' },
  { size: 'L', chest: 52, length: 72, shoulder: 46, height: '168 - 178', weight: '65 - 75' },
  { size: 'XL', chest: 54, length: 74, shoulder: 48, height: '175 - 185', weight: '75 - 85' },
  { size: 'XXL', chest: 56, length: 76, shoulder: 50, height: '180 - 190', weight: '85 - 95' },
  { size: '3XL', chest: 59, length: 79, shoulder: 53, height: '185 - 195', weight: '95 - 105' },
  { size: '4XL', chest: 62, length: 82, shoulder: 56, height: '190+', weight: '105+' },
];

const KIDS_SIZES = [
  { size: 'XS (Anak)', age: '3 - 4 Thn', chest: 34, length: 46, height: '95 - 105 cm' },
  { size: 'S (Anak)', age: '5 - 6 Thn', chest: 37, length: 50, height: '105 - 115 cm' },
  { size: 'M (Anak)', age: '7 - 8 Thn', chest: 40, length: 54, height: '115 - 128 cm' },
  { size: 'L (Anak)', age: '9 - 10 Thn', chest: 43, length: 58, height: '128 - 140 cm' },
  { size: 'XL (Anak)', age: '11 - 12 Thn', chest: 46, length: 63, height: '140 - 152 cm' },
];

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
  onSelectSize,
}) => {
  const [activeCategory, setActiveCategory] = useState<'adult' | 'kids'>('adult');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Ruler className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h3 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Panduan Ukuran Standar (Size Chart)
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Standar Pola Jersey Sportswear RIZA APPAREL Ende (cm)
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Category Toggle Tabs */}
          <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setActiveCategory('adult')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeCategory === 'adult'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jersey Dewasa (Adult)
            </button>
            <button
              onClick={() => setActiveCategory('kids')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeCategory === 'kids'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jersey Anak (Kids)
            </button>
          </div>

          {/* Size Table */}
          <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            {activeCategory === 'adult' ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                    <th className="p-3 font-bold">Size</th>
                    <th className="p-3 font-semibold">Lebar Dada (cm)</th>
                    <th className="p-3 font-semibold">Panjang (cm)</th>
                    <th className="p-3 font-semibold">Bahu (cm)</th>
                    <th className="p-3 font-semibold">Tinggi (cm)</th>
                    <th className="p-3 font-semibold">Berat (kg)</th>
                    {onSelectSize && <th className="p-3 font-semibold text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                  {ADULT_SIZES.map((row) => (
                    <tr 
                      key={row.size} 
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 font-extrabold text-brand-400 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-md bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xs">
                          {row.size}
                        </span>
                      </td>
                      <td className={`p-3 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.chest} cm</td>
                      <td className={`p-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{row.length} cm</td>
                      <td className={`p-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{row.shoulder} cm</td>
                      <td className={`p-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{row.height}</td>
                      <td className={`p-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{row.weight}</td>
                      {onSelectSize && (
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              onSelectSize(row.size);
                              onClose();
                            }}
                            className="text-[11px] font-bold text-brand-500 hover:text-white bg-brand-600/10 hover:bg-brand-600 px-2.5 py-1 rounded-md transition-all border border-brand-500/20"
                          >
                            Pilih
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                    <th className="p-3 font-bold">Size Anak</th>
                    <th className="p-3 font-semibold">Perkiraan Usia</th>
                    <th className="p-3 font-semibold">Lebar Dada (cm)</th>
                    <th className="p-3 font-semibold">Panjang (cm)</th>
                    <th className="p-3 font-semibold">Rekomendasi Tinggi</th>
                    {onSelectSize && <th className="p-3 font-semibold text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                  {KIDS_SIZES.map((row) => (
                    <tr 
                      key={row.size} 
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 font-extrabold text-brand-400">
                        {row.size}
                      </td>
                      <td className={`p-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{row.age}</td>
                      <td className={`p-3 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.chest} cm</td>
                      <td className={`p-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{row.length} cm</td>
                      <td className={`p-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{row.height}</td>
                      {onSelectSize && (
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              onSelectSize(row.size);
                              onClose();
                            }}
                            className="text-[11px] font-bold text-brand-500 hover:text-white bg-brand-600/10 hover:bg-brand-600 px-2.5 py-1 rounded-md transition-all border border-brand-500/20"
                          >
                            Pilih
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Measuring Guide Visual Instructions */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-3`}>
            <h4 className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Info className="w-4 h-4 text-brand-400" />
              Cara Mengukur Jersey dengan Tepat:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <span className="font-bold text-brand-500 block mb-1">A. Lebar Dada (Width):</span>
                Bentangkan jersey yang paling nyaman dipakai di atas bidang datar. Ukur dari titik jahitan ketiak kiri ke ketiak kanan.
              </div>
              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <span className="font-bold text-brand-500 block mb-1">B. Panjang Badan (Length):</span>
                Ukur dari titik tertinggi bahu (dekat kerah) tegak lurus ke bawah sampai ke ujung kelim bawah jersey.
              </div>
            </div>
            <p className={`text-[11px] italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              * Catatan: Toleransi potongan dan jahitan konveksi sebesar ±1 - 1.5 cm karena sifat fleksibilitas rajutan kain Drifit Milano.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kain Drifit Milano 160GSM Standar Ende</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
