import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, CheckCircle2, Clock, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { getOrderByToken, CMSOrder } from '../lib/cms-service';

interface OrderStatusTrackerProps {
  initialToken?: string;
  onBackToSite?: () => void;
  isDark?: boolean;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  initialToken = '',
  onBackToSite,
  isDark = true,
}) => {
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [orderData, setOrderData] = useState<Partial<CMSOrder> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchStatus = async (tokenToFetch: string) => {
    if (!tokenToFetch.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    const data = await getOrderByToken(tokenToFetch.trim());
    setOrderData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialToken) {
      fetchStatus(initialToken);
    }
  }, [initialToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(tokenInput);
  };

  const getStepIndex = (status?: string) => {
    if (status === 'Selesai') return 3;
    if (status === 'Diproduksi') return 2;
    return 1; // 'Diterima'
  };

  return (
    <div className={`min-h-screen p-4 sm:p-8 font-sans ${isDark ? 'bg-[#0B0F19] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-800">
          {onBackToSite && (
            <button
              type="button"
              onClick={onBackToSite}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-400">Pelacakan Pesanan Resmi Riza Apparel</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-heritage-zawo p-0.5 mx-auto flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Cek Status Pesanan Jersey Custom</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Masukkan Token Unik Pelanggan yang Anda terima dari admin Riza Apparel.
          </p>
        </div>

        {/* Search Token Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Contoh: rz-abc123xyz"
              className={`w-full text-xs font-mono pl-9 pr-3.5 py-3 rounded-2xl border outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-brand-500' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={isLoading || !tokenInput.trim()}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Cek Status</span>
          </button>
        </form>

        {/* Results */}
        {isLoading && (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-500" />
            <p>Mencari data status pesanan...</p>
          </div>
        )}

        {!isLoading && hasSearched && !orderData && (
          <div className={`p-8 rounded-3xl border text-center space-y-2 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <p className="text-sm font-bold text-rose-400">Token Akses Tidak Ditemukan</p>
            <p className="text-xs text-slate-400">Pastikan kode token unik yang diinputkan sudah sesuai. Hubungi Admin via WhatsApp jika ada masalah.</p>
          </div>
        )}

        {!isLoading && orderData && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 animate-slide-up ${
            isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">Pemesan:</span>
                <h3 className="text-lg font-black">{orderData.nama_pemesan} ({orderData.nama_tim || 'Custom Jersey'})</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Estimasi Selesai:</span>
                <p className="text-sm font-black text-heritage-zawo">{orderData.estimasi_selesai || 'Mengkonfirmasi'}</p>
              </div>
            </div>

            {/* Stepper Status Progress */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block mb-3">Progress Status Produksi:</span>
              <div className="grid grid-cols-3 gap-2 relative">
                {[
                  { step: 1, title: '1. Pesanan Diterima', desc: 'Draf & Desain Valid' },
                  { step: 2, title: '2. Proses Produksi', desc: 'Sublimasi & Jahit' },
                  { step: 3, title: '3. Pesanan Selesai', desc: 'Siap Kirim / Ambil' },
                ].map((st) => {
                  const currentStep = getStepIndex(orderData.status_pesanan);
                  const isDone = currentStep >= st.step;
                  const isCurrent = currentStep === st.step;

                  return (
                    <div
                      key={st.step}
                      className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${
                        isCurrent
                          ? 'bg-brand-600/20 border-brand-500 ring-2 ring-brand-500/40'
                          : isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-slate-950/40 border-slate-800 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <CheckCircle2 className={`w-5 h-5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                      </div>
                      <h4 className="text-xs font-bold leading-snug">{st.title}</h4>
                      <p className="text-[10px] text-slate-400">{st.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details (Sanitised - Safe Data Only) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b pb-2 border-slate-800">
                <span className="text-slate-400">Jumlah Pesanan:</span>
                <span className="font-bold text-white">{orderData.jumlah_item} Pcs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rincian Desain:</span>
                <span className="font-bold text-white">{orderData.rincian_desain || 'Custom Sublimasi'}</span>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-500">
              🔒 Privasi Terjamin: Halaman ini hanya menampilkan data status pesanan publik tanpa nomor telepon atau informasi sensitif.
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
