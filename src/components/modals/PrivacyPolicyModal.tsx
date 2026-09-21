import React from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
}) => {
  if (!isOpen) return null;

  return (
    <div id="kebijakan-privasi" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-2xl p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-5 relative max-h-[85vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kepatuhan UU No. 27 Tahun 2022 PDP</span>
          </div>
          <h3 className="text-xl font-black">Kebijakan Privasi (Privacy Policy)</h3>
          <p className="text-xs text-slate-400">Terakhir diperbarui: 19 September 2026</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Pemberitahuan Legal:</strong> Draf kebijakan privasi ini disusun sebagai bentuk transparansi awal Riza Apparel Ende dan perlu ditinjau oleh pihak berkompeten sebelum berkekuatan hukum penuh.
          </span>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">1. Data Pribadi yang Kami Kumpulkan</h4>
            <p>Riza Apparel mengumpulkan data pribadi minimum yang Anda serahkan secara sukarela saat mengisi formulir penawaran (lead capture) atau pengiriman pesan WhatsApp, meliputi: Nama Lengkap, Nomor WhatsApp/Telepon, Nama Tim/Instansi (opsional), dan Rincian Konfigurasi Desain.</p>
          </section>

          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">2. Tujuan Pemrosesan Data</h4>
            <p>Data pribadi Anda diproses secara khusus untuk: (a) Konfirmasi rincian pesanan dan estimasi biaya; (b) Koordinasi proses cetak sublimasi & produksi garmen; (c) Pengiriman barang ke alamat tujuan di wilayah Ende, NTT, maupun wilayah Indonesia lainnya.</p>
          </section>

          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">3. Hak Subjek Data Pribadi (UU PDP)</h4>
            <p>Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda berhak untuk: mengakses data Anda, memperbarui/mengoreksi data, atau meminta penghapusan data kontak Anda dari basis data kami dengan menghubungi Admin WhatsApp resmi (+62 812-4691-7740).</p>
          </section>

          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">4. Keamanan & Kerahasiaan Data</h4>
            <p>Kami tidak pernah menjual, menyewakan, atau membagikan data kontak Anda kepada pihak ketiga mana pun di luar kebutuhan produksi dan pengiriman ekspedisi pesanan Anda.</p>
          </section>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-xl text-xs"
        >
          Saya Memahami Kebijakan Privasi
        </button>
      </div>
    </div>
  );
};
