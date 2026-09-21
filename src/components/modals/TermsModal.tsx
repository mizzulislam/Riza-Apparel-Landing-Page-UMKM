import React from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
}) => {
  if (!isOpen) return null;

  return (
    <div id="ketentuan-penggunaan" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-extrabold border border-brand-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tata Kelola HKI & Penggunaan</span>
          </div>
          <h3 className="text-xl font-black">Ketentuan Penggunaan (Terms of Use)</h3>
          <p className="text-xs text-slate-400">Terakhir diperbarui: 19 September 2026</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Pemberitahuan Legal:</strong> Draf ketentuan penggunaan ini disusun untuk tata kelola hak kekayaan intelektual (HKI) dan hak penolakan pesanan yang melanggar merek terdaftar.
          </span>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">1. Hak Atas Materi Unggahan Pengguna</h4>
            <p>Pengguna menyatakan dan menjamin bahwa logo, gambar, atau elemen grafis yang diunggah ke Design Studio adalah milik pengguna secara sah atau telah memperoleh izin eksplisit dari pemegang hak cipta/merek terdaftar.</p>
          </section>

          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">2. Hak Menolak Pesanan Pelanggaran IP</h4>
            <p>Riza Apparel berhak sepenuhnya menolak atau membatalkan pesanan cetak jersey yang memuat logo merek terdaftar tanpa izin (misal: logo klub profesional resmi, merek komersial terdaftar) tanpa jaminan pengembalian biaya draf.</p>
          </section>

          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">3. Kepemilikan Desain Hasil AI Generator & Motif Kultural</h4>
            <p>Motif tenun ikat Ende Diamond Zawo dan Flores Ocean Waves yang disediakan sebagai preset merupakan kekayaan intelektual dan warisan budaya yang dilindungi. Penggunaan motif tersebut diproses dengan atribusi kultural yang sah.</p>
          </section>

          <section className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">4. Batasan Tanggung Jawab Output AI</h4>
            <p>Gambar atau vektor hasil generasi AI pada Studio bersifat Draf Awal / Inspirasi visual, bukan jaminan 100% presisi cetak fisik sebelum disetujui ulang oleh tim desainer Riza Apparel.</p>
          </section>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-xl text-xs"
        >
          Saya Memahami Ketentuan Penggunaan
        </button>
      </div>
    </div>
  );
};
