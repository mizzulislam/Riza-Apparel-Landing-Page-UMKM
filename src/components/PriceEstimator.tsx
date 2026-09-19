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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 text-brand-300 text-[10px] font-extrabold border border-brand-500/30">
          <Calculator className="w-3.5 h-3.5 text-heritage-zawo" />
          <span>Kalkulator Transparan FR-B4</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight">Estimator Harga Custom Jersey</h3>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Hitung estimasi biaya pesanan tim Anda secara akurat tanpa biaya tersembunyi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Controls */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1.5">1. Pilih Jenis Kategori Jersey</label>
            <select
              value={jerseyType}
              onChange={(e) => setJerseyType(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none font-bold ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="futsal">Jersey Sepak Bola & Futsal Pro (Mulai 90rb)</option>
              <option value="volleyball">Jersey Tim Voli & Basket (Mulai 95rb)</option>
              <option value="running">Jersey Komunitas Lari Anti-UV (Mulai 100rb)</option>
              <option value="esports">Jersey Esports Gaming Pro (Mulai 95rb)</option>
              <option value="polo">Polo Shirt Sublimasi Tenun (Mulai 115rb)</option>
              <option value="jacket">Jaket Windbreaker Sublim (Mulai 145rb)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold block">2. Jumlah Pesanan (Kuantitas Pcs)</label>
              <span className="text-brand-400 font-extrabold font-mono text-sm">{quantity} Pcs</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
              <span>1 Pcs (Satuan)</span>
              <span>12 Pcs (Diskon 5%)</span>
              <span>24+ Pcs (Diskon 10%)</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="font-bold block">3. Opsi Spesifikasi Tambahan</label>
            
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isLongSleeve}
                onChange={(e) => setIsLongSleeve(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 bg-slate-950 border-slate-700 cursor-pointer"
              />
              <span>Pola Lengan Panjang (+Rp 10.000 / Pcs)</span>
            </label>

            {jerseyType !== 'polo' && (
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPoloCollar}
                  onChange={(e) => setHasPoloCollar(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 bg-slate-950 border-slate-700 cursor-pointer"
                />
                <span>Kerah Rajut Polo Premium (+Rp 15.000 / Pcs)</span>
              </label>
            )}
          </div>
        </div>

        {/* Output Display */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-800">
              <span className="text-xs text-slate-400">Harga per Unit:</span>
              <span className="text-sm font-extrabold text-heritage-zawo">
                Rp {pricePerUnit.toLocaleString('id-ID')} / pcs
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2 border-slate-800">
              <span className="text-xs text-slate-400">Kuantitas Pesanan:</span>
              <span className="text-sm font-extrabold">{quantity} Pcs</span>
            </div>

            {quantity >= 12 && (
              <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Diskon Kuantitas Tim ({quantity >= 24 ? '10%' : '5%'}):</span>
                </span>
                <span>Termasuk Diskon</span>
              </div>
            )}

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Estimasi Biaya:</span>
              <span className="text-2xl sm:text-3xl font-black text-brand-400">
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
