import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { 
  LayoutDashboard, 
  Package, 
  Grid, 
  Users, 
  ShoppingBag, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Check, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  PhoneCall, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { 
  getCMSProducts, 
  saveCMSProduct, 
  getCMSMotifs, 
  saveCMSMotif, 
  getCMSLeads, 
  updateLeadStatus, 
  getCMSOrders, 
  createOrderFromLead, 
  updateOrderStatus, 
  getUnansweredQuestions,
  CMSMotif, 
  CMSLead, 
  CMSOrder, 
  UnansweredQuestion 
} from '../../lib/cms-service';
import { CatalogItem } from '../../types';
import { compressImageToWebP } from '../../lib/image-compressor';
import { seedInitialFirestoreData } from '../../lib/seed-data';
import { getAIQuotaInfo, AIQuotaInfo } from '../../lib/ai-client';

interface AdminPortalProps {
  onLogout: () => void;
  onBackToSite: () => void;
  isDark?: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onLogout,
  onBackToSite,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'motifs' | 'leads' | 'orders' | 'kb'>('dashboard');

  // State data
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [motifs, setMotifs] = useState<CMSMotif[]>([]);
  const [leads, setLeads] = useState<CMSLead[]>([]);
  const [orders, setOrders] = useState<CMSOrder[]>([]);
  const [unanswered, setUnanswered] = useState<UnansweredQuestion[]>([]);
  const [quotaInfo, setQuotaInfo] = useState<AIQuotaInfo>(getAIQuotaInfo());
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [copiedTokenId, setCopiedTokenId] = useState('');

  // Form Edit Product State
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Form Edit Motif State
  const [editingMotif, setEditingMotif] = useState<CMSMotif | null>(null);
  const [isMotifModalOpen, setIsMotifModalOpen] = useState(false);

  // Load all data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prodsData, motifsData, leadsData, ordersData, unansweredData] = await Promise.all([
        getCMSProducts(),
        getCMSMotifs(),
        getCMSLeads(),
        getCMSOrders(),
        getUnansweredQuestions(),
      ]);
      setProducts(prodsData);
      setMotifs(motifsData);
      setLeads(leadsData);
      setOrders(ordersData);
      setUnanswered(unansweredData);
      setQuotaInfo(getAIQuotaInfo());
    } catch (e) {
      console.warn('Error loading CMS data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    onLogout();
  };

  const handleSeedData = async () => {
    setIsLoading(true);
    const res = await seedInitialFirestoreData();
    if (res.success) {
      setActionSuccess(`Berhasil menginisialisasi ${res.count} data awal Firestore!`);
      setTimeout(() => setActionSuccess(''), 3000);
      await loadAllData();
    }
    setIsLoading(false);
  };

  // Image Upload Handler for Products
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingProduct) {
      try {
        const compressed = await compressImageToWebP(e.target.files[0], { maxWidth: 1000, quality: 0.8 });
        setEditingProduct({ ...editingProduct, imageUrl: compressed.dataUrl });
      } catch (err) {
        alert('Gagal mengompresi gambar');
      }
    }
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsLoading(true);
    await saveCMSProduct(editingProduct);
    setIsProductModalOpen(false);
    setActionSuccess('Produk katalog berhasil disimpan ke CMS!');
    setTimeout(() => setActionSuccess(''), 3000);
    await loadAllData();
  };

  const handleSaveMotifForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMotif) return;
    if (!editingMotif.atribusi_sumber || !editingMotif.atribusi_sumber.trim()) {
      alert('Atribusi Sumber Kultural Wajib Diisi (Aturan Mutlak R7)');
      return;
    }
    setIsLoading(true);
    try {
      await saveCMSMotif(editingMotif);
      setIsMotifModalOpen(false);
      setActionSuccess('Motif tenun berhasil disimpan!');
      setTimeout(() => setActionSuccess(''), 3000);
      await loadAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrderFromLeadItem = async (lead: CMSLead) => {
    setIsLoading(true);
    const res = await createOrderFromLead({
      id_prospek_terkait: lead.id,
      nama_pemesan: lead.nama,
      nomor_whatsapp: lead.nomor_whatsapp,
      nama_tim: lead.nama_tim || 'Team Custom',
      status_pesanan: 'Diterima',
      jumlah_item: lead.estimasi_jumlah_pesanan || 12,
      rincian_desain: lead.ringkasan_desain || 'Jersey Custom',
      estimasi_selesai: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    });

    await updateLeadStatus(lead.id!, 'jadi_pesanan');
    setActionSuccess(`Pesanan berhasil dibuat! Token Tracking: ${res.token}`);
    setTimeout(() => setActionSuccess(''), 4000);
    await loadAllData();
  };

  const copyTrackingLink = (token: string) => {
    const trackingUrl = `${window.location.origin}/#status-pesanan?token=${token}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedTokenId(token);
    setTimeout(() => setCopiedTokenId(''), 2000);
  };

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-[#0B0F19] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSite}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title="Kembali ke Situs Utama"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <h1 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-heritage-zawo" />
              <span>Portal Admin CMS & CRM</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Mobile-First
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadAllData}
              disabled={isLoading}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700'
              }`}
              title="Refresh Data CMS"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-extrabold text-xs rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Success Alert */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Responsive Mobile-First Tab Navigation */}
        <div className={`p-1.5 rounded-2xl border mb-6 flex overflow-x-auto no-scrollbar gap-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-200 border-slate-300'
        }`}>
          {[
            { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
            { id: 'products', label: 'Katalog CMS', icon: Package, badge: products.length },
            { id: 'motifs', label: 'Motif Tenun', icon: Grid, badge: motifs.length },
            { id: 'leads', label: 'Prospek CRM', icon: Users, badge: leads.filter(l => l.status_tindak_lanjut === 'baru').length },
            { id: 'orders', label: 'Pesanan & Tracking', icon: ShoppingBag, badge: orders.length },
            { id: 'kb', label: 'Knowledge Base', icon: HelpCircle, badge: unanswered.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-500/20 text-brand-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASBOR RINGKAS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Prospek Baru</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-brand-400">{leads.filter(l => l.status_tindak_lanjut === 'baru').length}</span>
                  <Users className="w-6 h-6 text-brand-500 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-400">Prospek lead capture belum dihubungi</p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Pesanan Aktif</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-heritage-zawo">{orders.filter(o => o.status_pesanan !== 'Selesai').length}</span>
                  <ShoppingBag className="w-6 h-6 text-heritage-zawo opacity-60" />
                </div>
                <p className="text-[11px] text-slate-400">Status Diterima / Diproduksi</p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Status Kuota AI</span>
                <div className="flex items-baseline justify-between">
                  <span className={`text-lg font-black ${
                    quotaInfo.status === 'quota_exceeded' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {quotaInfo.status === 'quota_exceeded' ? 'KUOTA HABIS' : 'NORMAL'}
                  </span>
                  <Sparkles className="w-6 h-6 text-emerald-400 opacity-60" />
                </div>
                <p className="text-[11px] text-slate-400">Terpakai: {quotaInfo.usedToday} / {quotaInfo.maxDailyQuota} RPD</p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Google Analytics 4</span>
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-extrabold text-brand-400 hover:underline pt-1"
                >
                  <span>Buka Dasbor GA4</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-[11px] text-slate-400">Pantau event funnel konversi</p>
              </div>

            </div>

            {/* Inisialisasi Data Seeding Button */}
            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <h4 className="text-sm font-bold">Inisialisasi Data Firestore (Initial Seeding)</h4>
                <p className="text-xs text-slate-400 mt-0.5">Isi Firestore dengan katalog produk dan motif tenun awal Riza Apparel.</p>
              </div>
              <button
                type="button"
                onClick={handleSeedData}
                disabled={isLoading}
                className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all min-h-[40px] whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Jalankan Seed Data Initial</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: KATALOG PRODUK CMS */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold">Katalog Produk CMS ({products.length})</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct({
                    id: String(Date.now()),
                    name: '',
                    category: 'team',
                    startingPrice: 90000,
                    promoBadge: 'Beli 2 Bonus 1',
                    description: '',
                    features: [],
                    fabricSpecs: 'Dry-Fit Milano 160gsm',
                    leadTimeDays: 5,
                    imageUrl: '',
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden relative">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.promoBadge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{p.name}</h4>
                    <p className="text-xs text-brand-400 font-extrabold mt-0.5">Rp {p.startingPrice.toLocaleString('id-ID')}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(p);
                      setIsProductModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Edit Produk
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PUSTAKA MOTIF TENUN (FR-C2, ATRIBUSI WAJIB R7) */}
        {activeTab === 'motifs' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">Pustaka Motif Tenun ({motifs.length})</h3>
                <p className="text-xs text-slate-400">Atribusi sumber kultural wajib diisi sebelum diaktifkan (R7).</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingMotif({
                    nama_motif: '',
                    kategori_kultural: 'ende-zawo',
                    file_aset: 'ende-diamond',
                    atribusi_sumber: '',
                    status_aktif: true,
                  });
                  setIsMotifModalOpen(true);
                }}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Motif Tenun</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {motifs.map((m) => (
                <div key={m.id} className={`p-4 rounded-2xl border space-y-2.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-heritage-zawo">{m.nama_motif}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      m.status_aktif ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.status_aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded-xl border border-slate-800">
                    📌 <strong>Atribusi Sumber:</strong> {m.atribusi_sumber || '[PLACEHOLDER — Menunggu Klien]'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMotif(m);
                      setIsMotifModalOpen(true);
                    }}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Edit Motif & Atribusi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROSPEK CRM (UC11, FR-B3) */}
        {activeTab === 'leads' && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-base font-extrabold">Prospek Masuk CRM ({leads.length})</h3>
            <div className="space-y-3">
              {leads.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-6 text-center border rounded-2xl">Belum ada prospek masuk.</p>
              ) : (
                leads.map((l) => (
                  <div key={l.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold">{l.nama}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          l.status_tindak_lanjut === 'baru' ? 'bg-brand-500/20 text-brand-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {l.status_tindak_lanjut}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">📱 WA: <strong>{l.nomor_whatsapp}</strong> | Tim: {l.nama_tim || '-'} | Est. Jumlah: {l.estimasi_jumlah_pesanan} pcs</p>
                      {l.ringkasan_desain && <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800 mt-1">{l.ringkasan_desain}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${l.nomor_whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(l.nama)},%20saya%20Admin%20Riza%20Apparel...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>
                      {l.status_tindak_lanjut !== 'jadi_pesanan' && (
                        <button
                          type="button"
                          onClick={() => handleCreateOrderFromLeadItem(l)}
                          className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buat Pesanan</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PESANAN & TRACKING TOKEN UNIK (FR-E9, UC10, UC12) */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-base font-extrabold">Daftar Pesanan & Status Tracking ({orders.length})</h3>
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-slate-800">
                    <div>
                      <span className="text-sm font-extrabold">{o.nama_pemesan} ({o.nama_tim})</span>
                      <p className="text-[11px] text-slate-400">Jumlah: {o.jumlah_item} Pcs | Est. Selesai: {o.estimasi_selesai}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {['Diterima', 'Diproduksi', 'Selesai'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateOrderStatus(o.id!, st as any).then(loadAllData)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                            o.status_pesanan === st
                              ? 'bg-heritage-zawo text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Token Tracking Link Display */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-400 font-mono text-[11px]">Tautan Tracking Pelanggan:</span>
                      <span className="font-mono text-brand-300 font-bold truncate">token={o.token_akses_unik}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyTrackingLink(o.token_akses_unik)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0"
                    >
                      {copiedTokenId === o.token_akses_unik ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTokenId === o.token_akses_unik ? 'Tersalin' : 'Salin Tautan'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: KNOWLEDGE BASE CHATBOT (UC15, FR-E2) */}
        {activeTab === 'kb' && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-base font-extrabold">Log Pertanyaan Belum Terjawab ({unanswered.length})</h3>
            <p className="text-xs text-slate-400">Daftar pertanyaan riil pengguna yang belum ada di knowledge base (FR-E2).</p>
            <div className="space-y-2">
              {unanswered.map((u) => (
                <div key={u.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <span>"{u.pertanyaan}"</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-400">
                    Frekuensi: {u.frekuensi}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL EDIT PRODUK */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-lg p-6 rounded-3xl border space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white text-slate-900'
          }`}>
            <h3 className="text-base font-extrabold">Form Edit Produk Katalog</h3>
            <form onSubmit={handleSaveProductForm} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Harga Awal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.startingPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, startingPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Badge Promo</label>
                  <input
                    type="text"
                    value={editingProduct.promoBadge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, promoBadge: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Foto Produk (WebP Kompresi Otomatis)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  className="w-full p-2 rounded-xl border bg-slate-950 border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT MOTIF TENUN (FR-C2, ATRIBUSI R7) */}
      {isMotifModalOpen && editingMotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-lg p-6 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white text-slate-900'
          }`}>
            <h3 className="text-base font-extrabold">Form Edit Motif Tenun (Atribusi Wajib)</h3>
            <form onSubmit={handleSaveMotifForm} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Nama Motif</label>
                <input
                  type="text"
                  required
                  value={editingMotif.nama_motif}
                  onChange={(e) => setEditingMotif({ ...editingMotif, nama_motif: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-heritage-zawo">Atribusi Sumber Kultural (Wajib - Aturan Mutlak R7)</label>
                <input
                  type="text"
                  required
                  value={editingMotif.atribusi_sumber}
                  onChange={(e) => setEditingMotif({ ...editingMotif, atribusi_sumber: e.target.value })}
                  placeholder="Contoh: Motif Tenun Ikat Ende Zawo — Koleksi Resmi Riza Apparel Ende 2026"
                  className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-700 text-brand-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMotifModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold"
                >
                  Simpan Motif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
