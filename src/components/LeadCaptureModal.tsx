import React, { useState } from 'react';
import { X, Send, ShieldCheck, Check, Sparkles, MessageCircle } from 'lucide-react';
import { createLeadCapture } from '../lib/cms-service';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  designSummary?: string;
  isDark?: boolean;
  onSuccess?: (leadId: string, waLink: string) => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  designSummary = '',
  isDark = true,
  onSuccess,
}) => {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [namaTim, setNamaTim] = useState('');
  const [jumlah, setJumlah] = useState(12);
  const [pdpConsent, setPdpConsent] = useState(false); // Unchecked by default (FR-E7 / UU PDP)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdpConsent) {
      setErrorMsg('Persetujuan Kebijakan Privasi wajib dicentang untuk melanjutkan.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const leadId = await createLeadCapture({
        nama: nama.trim(),
        nomor_whatsapp: whatsapp.trim(),
        nama_tim: namaTim.trim() || undefined,
        estimasi_jumlah_pesanan: Number(jumlah) || 12,
        ringkasan_desain: designSummary,
        penerimaan_pdp: true,
      });

      // Construct pre-filled WhatsApp message
      const text = `Halo Admin Riza Apparel, saya ${nama.trim()} (${namaTim ? `Tim ${namaTim}` : 'Pesanan Custom'}).
Estimasi Jumlah: ${jumlah} Pcs.
${designSummary ? `Ringkasan Desain: ${designSummary}` : ''}
ID Prospek CRM: ${leadId}`;

      const waLink = `https://wa.me/6281246917740?text=${encodeURIComponent(text)}`;

      if (onSuccess) {
        onSuccess(leadId, waLink);
      } else {
        window.open(waLink, '_blank');
      }

      onClose();
    } catch (err: any) {
      setErrorMsg('Gagal mengirimkan formulir: ' + (err.message || 'Error tidak diketahui'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 relative ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-extrabold border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5 text-heritage-zawo" />
            <span>Permintaan Penawaran & Konsultasi</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Kirimkan Hasil Desain Tim Anda</h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Dapatkan garansi slot produksi & pengubahan menjadi berkas cetak sublimasi presisi.
          </p>
        </div>

        {errorMsg && (
          <p className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
            {errorMsg}
          </p>
        )}

        {/* Lead Capture Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold block mb-1">Nama Pemesan / Penanggung Jawab *</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Karel Wua"
              className={`w-full p-3 rounded-xl border outline-none ${
                isDark ? 'bg-slate-950 border-slate-700 text-white focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Nomor WhatsApp *</label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="081234567890"
                className={`w-full p-3 rounded-xl border outline-none ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Estimasi Jumlah Pcs *</label>
              <input
                type="number"
                required
                min={1}
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
                className={`w-full p-3 rounded-xl border outline-none ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Nama Tim / Komunitas / Instansi (Opsional)</label>
            <input
              type="text"
              value={namaTim}
              onChange={(e) => setNamaTim(e.target.value)}
              placeholder="Contoh: Ende United FC"
              className={`w-full p-3 rounded-xl border outline-none ${
                isDark ? 'bg-slate-950 border-slate-700 text-white focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Mandatory Explicit Consent Checkbox (FR-E7 / UU PDP No. 27/2022) */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] leading-snug text-slate-300">
              <input
                type="checkbox"
                required
                checked={pdpConsent}
                onChange={(e) => setPdpConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-slate-950 border-slate-700 cursor-pointer"
              />
              <span>
                Saya menyetujui data kontak saya disimpan oleh Riza Apparel Ende untuk keperluan konfirmasi pesanan sesuai{' '}
                <a href="#kebijakan-privasi" className="text-brand-400 underline font-bold" target="_blank">
                  Kebijakan Privasi
                </a>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !pdpConsent}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 min-h-[44px] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim Prospek...' : 'Kirim & Konsultasi WA Owner'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
