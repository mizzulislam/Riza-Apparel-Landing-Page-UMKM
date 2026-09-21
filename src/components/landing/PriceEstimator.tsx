import React, { useState } from 'react';
import { Calculator, Sparkles, Send, Check, ShieldCheck, Tag } from 'lucide-react';

interface PriceEstimatorProps {
  isDark?: boolean;
  onOpenLeadCapture?: (summary: string) => void;
}

export const PriceEstimator: React.FC<PriceEstimatorProps> = ({
  isDark = true,
  onOpenLeadCapture,
}) => {
  const [jerseyType, setJerseyType] = useState('futsal');
  const [quantity, setQuantity] = useState(12);
  const [isLongSleeve, setIsLongSleeve] = useState(false);
  const [hasPoloCollar, setHasPoloCollar] = useState(false);

  // Base prices per unit
  const basePrices: Record<string, number> = {
    futsal: 90000,
    volleyball: 95000,
    running: 100000,
    esports: 95000,
    polo: 115000,
    jacket: 145000,
  };

  const getPricePerUnit = (): number => {
    let price = basePrices[jerseyType] || 90000;
    if (isLongSleeve) price += 10000;
    if (hasPoloCollar && jerseyType !== 'polo') price += 15000;

    // Quantity Discount Tier
    if (quantity >= 24) {
      price = Math.round(price * 0.90); // 10% diskon grosir >24 pcs
    } else if (quantity >= 12) {
      price = Math.round(price * 0.95); // 5% diskon tim >12 pcs
    }

    return price;
  };

  const pricePerUnit = getPricePerUnit();
  const totalPrice = pricePerUnit * quantity;

  const handleWhatsAppSend = () => {
    const text = `Halo Admin Riza Apparel, saya menggunakan Kalkulator Estimator Harga di website:
- Jenis Jersey: ${jerseyType.toUpperCase()}
- Kuantitas: ${quantity} Pcs
- Lengan Panjang: ${isLongSleeve ? 'Ya (+10rb)' : 'Tidak'}
- Kerah Polo: ${hasPoloCollar ? 'Ya' : 'Tidak'}
- Estimasi Harga per Unit: Rp ${pricePerUnit.toLocaleString('id-ID')}
- Total Estimasi Biaya: Rp ${totalPrice.toLocaleString('id-ID')}

Mohon informasi ketersediaan slot produksi. Terima kasih!`;

    const waUrl = `https://wa.me/6281246917740?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleLeadCaptureClick = () => {
    const summary = `Estimator: ${quantity} pcs ${jerseyType.toUpperCase()} (${isLongSleeve ? 'Lengan Panjang, ' : ''}Rp ${pricePerUnit.toLocaleString('id-ID')}/pcs, Total: Rp ${totalPrice.toLocaleString('id-ID')})`;
    if (onOpenLeadCapture) {
      onOpenLeadCapture(summary);
    } else {
      handleWhatsAppSend();
    }
  };

  return (
    <div id="estimator" className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 transition-colors ${
      isDark ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      {/* Header */}
      <div className="space-y-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border ${
          isDark
            ? 'bg-brand-600/20 text-brand-300 border-brand-500/30'
            : 'bg-brand-50 text-brand-700 border-brand-200'
        }`}>
          <Calculator className="w-3.5 h-3.5 text-heritage-zawo" />
          <span>Kalkulator Transparan</span>
        </div>
        <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Estimator Harga Custom Jersey</h3>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
          Hitung estimasi biaya pesanan tim Anda secara akurat tanpa biaya tersembunyi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Controls */}
        <div className="space-y-4 text-xs">
          <div>
            <label className={`font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>1. Pilih Jenis Kategori Jersey</label>
            <div className="relative">
              <select
                value={jerseyType}
                onChange={(e) => setJerseyType(e.target.value)}
                className={`w-full p-3 pr-10 rounded-xl border appearance-none outline-none font-bold transition-all cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-brand-600'
                }`}
              >
                <option value="futsal">Jersey Sepak Bola & Futsal Pro (Mulai 90rb)</option>
                <option value="volleyball">Jersey Tim Voli & Basket (Mulai 95rb)</option>
                <option value="running">Jersey Komunitas Lari Anti-UV (Mulai 100rb)</option>
                <option value="esports">Jersey Esports Gaming Pro (Mulai 95rb)</option>
                <option value="polo">Polo Shirt Sublimasi Tenun (Mulai 115rb)</option>
                <option value="jacket">Jaket Windbreaker Sublim (Mulai 145rb)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>2. Jumlah Pesanan (Kuantitas Pcs)</label>
              <span className="text-brand-500 font-extrabold font-mono text-sm">{quantity} Pcs</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className={`flex justify-between text-[10px] font-bold pt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>1 Pcs (Satuan)</span>
              <span>12 Pcs (Diskon 5%)</span>
              <span>24+ Pcs (Diskon 10%)</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>3. Opsi Spesifikasi Tambahan</label>
            
            <div
              onClick={() => setIsLongSleeve(!isLongSleeve)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                isLongSleeve
                  ? (isDark ? 'bg-brand-600/20 border-brand-500/80 text-white shadow-md shadow-brand-500/10' : 'bg-brand-50 border-brand-400 text-brand-950 font-bold')
                  : (isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400')
              }`}
            >
              <span className="font-bold text-xs">Pola Lengan Panjang (+Rp 10.000 / Pcs)</span>
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                isLongSleeve
                  ? 'bg-gradient-to-r from-brand-600 to-rose-600 border-brand-500 text-white shadow-xs'
                  : (isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-100')
              }`}>
                {isLongSleeve && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {jerseyType !== 'polo' && (
              <div
                onClick={() => setHasPoloCollar(!hasPoloCollar)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  hasPoloCollar
                    ? (isDark ? 'bg-brand-600/20 border-brand-500/80 text-white shadow-md shadow-brand-500/10' : 'bg-brand-50 border-brand-400 text-brand-950 font-bold')
                    : (isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400')
                }`}
              >
                <span className="font-bold text-xs">Kerah Rajut Polo Premium (+Rp 15.000 / Pcs)</span>
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                  hasPoloCollar
                    ? 'bg-gradient-to-r from-brand-600 to-rose-600 border-brand-500 text-white shadow-xs'
                    : (isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-100')
                }`}>
                  {hasPoloCollar && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Display */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Harga per Unit:</span>
              <span className={`text-sm font-extrabold ${isDark ? 'text-heritage-zawo' : 'text-amber-700'}`}>
                Rp {pricePerUnit.toLocaleString('id-ID')} / pcs
              </span>
            </div>

            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Kuantitas Pesanan:</span>
              <span className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quantity} Pcs</span>
            </div>

            {quantity >= 12 && (
              <div className={`flex items-center justify-between text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Diskon Kuantitas Tim ({quantity >= 24 ? '10%' : '5%'}):</span>
                </span>
                <span>Termasuk Diskon</span>
              </div>
            )}

            <div className="pt-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Estimasi Biaya:</span>
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLeadCaptureClick}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 min-h-[44px] transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Estimasi & Minta Penawaran</span>
          </button>
        </div>

      </div>
    </div>
  );
};
