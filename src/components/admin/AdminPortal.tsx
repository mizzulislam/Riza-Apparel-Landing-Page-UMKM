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
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Sun,
  Moon,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Globe,
  Sliders,
  Star,
  Award,
  MessageSquare,
  FolderKanban,
  Send,
  Share2,
  FileText,
  MapPin,
  ShieldCheck,
  Zap,
  Printer,
  Edit,
  Trash2,
  Phone,
  Tag,
  Bookmark,
  Flame,
  Lightbulb,
  Inbox,
  Cog,
  PartyPopper,
  Crown,
  Truck,
  Trophy
} from 'lucide-react';
import { 
  getCMSProducts, 
  saveCMSProduct, 
  saveCMSProducts,
  getCMSMotifs, 
  saveCMSMotif, 
  saveCMSMotifs, 
  getCMSLeads, 
  updateLeadStatus, 
  getCMSOrders, 
  createOrderFromLead, 
  updateOrderStatus, 
  getUnansweredQuestions,
  getCMSHeroConfig,
  saveCMSHeroConfig,
  getCMSPortfolio,
  saveCMSPortfolio,
  getCMSTestimonials,
  saveCMSTestimonials,
  getCMSUSP,
  saveCMSUSP,
  getCMSContactConfig,
  saveCMSContactConfig,
  getCMSAboutConfig,
  saveCMSAboutConfig,
  getCMSPromos,
  saveCMSPromos,
  getCMSWorkflow,
  saveCMSWorkflow,
  getCMSFAQ,
  saveCMSFAQ,
  getCMSPartners,
  saveCMSPartners,
  getCMSCustomerTiers,
  saveCMSCustomerTiers,
  getCMSWATemplates,
  saveCMSWATemplates,
  getCMSCSATRatings,
  saveCMSCSATRatings,
  getCMSCatalogConfig,
  saveCMSCatalogConfig,
  getCMSPromoHeaderConfig,
  saveCMSPromoHeaderConfig,
  getCMSWorkflowHeaderConfig,
  saveCMSWorkflowHeaderConfig,
  getCMSFAQHeaderConfig,
  saveCMSFAQHeaderConfig,
  getCMSTestimonialsHeaderConfig,
  saveCMSTestimonialsHeaderConfig,
  CMSMotif, 
  CMSLead, 
  CMSOrder, 
  UnansweredQuestion,
  CMSHeroConfig,
  CMSHeroSlide,
  CMSPortfolioItem,
  CMSTestimonialItem,
  CMSUSPItem,
  CMSContactConfig,
  CMSAboutConfig,
  CMSPromoItem,
  CMSWorkflowStep,
  CMSFAQItem,
  CMSPartnerItem,
  CMSCustomerTier,
  CMSWATemplate,
  CMSCSATRating,
  CMSCatalogConfig,
  CMSPromoHeaderConfig,
  CMSWorkflowHeaderConfig,
  CMSFAQHeaderConfig,
  CMSTestimonialsHeaderConfig
} from '../../lib/cms-service';
import { CatalogItem } from '../../types';
import { compressImageToWebP } from '../../lib/image-compressor';
import { seedInitialFirestoreData } from '../../lib/seed-data';
import { getAIQuotaInfo, AIQuotaInfo } from '../../lib/ai-client';

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isDark?: boolean;
}

const PRICE_UNIT_OPTIONS: CustomSelectOption[] = [
  { value: 'pcs', label: 'pcs (Per-Pcs / Satuan)' },
  { value: 'set', label: 'set (Stel Lengkap)' },
  { value: 'lusin', label: 'lusin (12 Pcs)' },
  { value: 'paket', label: 'paket (Paket Tim)' },
  { value: 'box', label: 'box (Kotak / Dus)' },
];

const CATEGORY_OPTIONS: CustomSelectOption[] = [
  { value: 'team', label: 'Jersey Tim Olahraga' },
  { value: 'community', label: 'Event & Komunitas' },
  { value: 'casual', label: 'Apparel Kasual & Outerwear' },
];

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  className = '',
  isDark = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || {
    value,
    label: value || placeholder,
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full rounded-xl px-3 py-2.5 flex items-center justify-between text-xs transition-all outline-none border ${
          isDark
            ? 'bg-slate-950 border-slate-800 text-white hover:border-brand-500/60 focus:border-brand-500'
            : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-brand-600 focus:border-brand-600'
        }`}
      >
        <span className="truncate font-medium">{selectedOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-400' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl p-1.5 shadow-2xl max-h-48 overflow-y-auto space-y-0.5 border backdrop-blur-xl animate-slide-up-fade ${
          isDark
            ? 'bg-slate-900/98 border-slate-700/80 text-white'
            : 'bg-white/98 border-slate-200 text-slate-900'
        }`}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? (isDark ? 'bg-brand-600/30 text-brand-300 border border-brand-500/40' : 'bg-brand-50 text-brand-700 font-extrabold')
                    : (isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const renderBadgeWithIcon = (badgeText: string) => {
  if (!badgeText) return null;
  const cleanText = badgeText.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  const lower = badgeText.toLowerCase();

  let IconComponent = Flame;
  let colorClass = 'text-amber-400';

  if (lower.includes('ongkir') || lower.includes('gratis')) {
    IconComponent = Truck;
    colorClass = 'text-emerald-400';
  } else if (lower.includes('diskon') || lower.includes('tim') || lower.includes('juara')) {
    IconComponent = Trophy;
    colorClass = 'text-amber-400';
  } else if (lower.includes('populer') || lower.includes('spesial') || lower.includes('promo')) {
    IconComponent = Flame;
    colorClass = 'text-rose-400';
  } else {
    IconComponent = Sparkles;
    colorClass = 'text-brand-400';
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <IconComponent className={`w-3 h-3 ${colorClass} shrink-0 stroke-[2.5]`} />
      <span>{cleanText || badgeText}</span>
    </span>
  );
};

const renderTierWithIcon = (tierText: string) => {
  if (!tierText) return null;
  const cleanText = tierText.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  return (
    <span className="inline-flex items-center gap-1">
      <Crown className="w-3 h-3 text-amber-400 shrink-0 stroke-[2.5]" />
      <span>{cleanText || tierText}</span>
    </span>
  );
};

interface AdminPortalProps {
  onLogout: () => void;
  onBackToSite: () => void;
  isDark?: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onLogout,
  onBackToSite,
  isDark: isDarkProp = true,
}) => {
  const [activePortal, setActivePortal] = useState<'cms' | 'crm'>('cms');
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('riza_apparel_theme_mode');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return isDarkProp ? 'dark' : 'light';
  });
  const isDark = themeMode === 'dark';

  useEffect(() => {
    try {
      localStorage.setItem('riza_apparel_theme_mode', themeMode);
    } catch (e) {}
  }, [themeMode]);

  // CMS Section Data States (Aligned 1:1 with Landing Page Sections)
  const [heroConfig, setHeroConfig] = useState<CMSHeroConfig | null>(null);
  const [aboutConfig, setAboutConfig] = useState<CMSAboutConfig | null>(null);
  const [catalogConfig, setCatalogConfig] = useState<CMSCatalogConfig | null>(null);
  const [promoHeaderConfig, setPromoHeaderConfig] = useState<CMSPromoHeaderConfig | null>(null);
  const [workflowHeaderConfig, setWorkflowHeaderConfig] = useState<CMSWorkflowHeaderConfig | null>(null);
  const [faqHeaderConfig, setFAQHeaderConfig] = useState<CMSFAQHeaderConfig | null>(null);
  const [testimonialsHeaderConfig, setTestimonialsHeaderConfig] = useState<CMSTestimonialsHeaderConfig | null>(null);
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [motifs, setMotifs] = useState<CMSMotif[]>([]);
  const [promos, setPromos] = useState<CMSPromoItem[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<CMSWorkflowStep[]>([]);
  const [faqItems, setFAQItems] = useState<CMSFAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonialItem[]>([]);
  const [partners, setPartners] = useState<CMSPartnerItem[]>([]);
  const [contactConfig, setContactConfig] = useState<CMSContactConfig | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<CMSPortfolioItem[]>([]);
  const [uspItems, setUSPItems] = useState<CMSUSPItem[]>([]);

  // CRM Section Data States
  const [leads, setLeads] = useState<CMSLead[]>([]);
  const [orders, setOrders] = useState<CMSOrder[]>([]);
  const [customerTiers, setCustomerTiers] = useState<CMSCustomerTier[]>([]);
  const [waTemplates, setWATemplates] = useState<CMSWATemplate[]>([]);
  const [csatRatings, setCSATRatings] = useState<CMSCSATRating[]>([]);
  const [unanswered, setUnanswered] = useState<UnansweredQuestion[]>([]);
  const [quotaInfo, setQuotaInfo] = useState<AIQuotaInfo>(getAIQuotaInfo());
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [copiedTokenId, setCopiedTokenId] = useState('');

  // Modals & Form States
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [editingMotif, setEditingMotif] = useState<CMSMotif | null>(null);
  const [isMotifModalOpen, setIsMotifModalOpen] = useState(false);

  const [editingPortfolio, setEditingPortfolio] = useState<CMSPortfolioItem | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<CMSTestimonialItem | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  const [editingPromo, setEditingPromo] = useState<CMSPromoItem | null>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  const [editingFAQ, setEditingFAQ] = useState<CMSFAQItem | null>(null);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);

  const [editingPartner, setEditingPartner] = useState<CMSPartnerItem | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const [editingWorkflowStep, setEditingWorkflowStep] = useState<CMSWorkflowStep | null>(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  const [editingHeroSlide, setEditingHeroSlide] = useState<CMSHeroSlide | null>(null);
  const [isHeroSlideModalOpen, setIsHeroSlideModalOpen] = useState(false);

  // Custom Modern Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const askConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    options?: {
      confirmText?: string;
      cancelText?: string;
      variant?: 'danger' | 'warning' | 'info';
    }
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText: options?.confirmText || 'Ya, Lanjutkan',
      cancelText: options?.cancelText || 'Batal',
      variant: options?.variant || 'danger',
    });
  };

  // Load all data from CMS & CRM services
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        heroData, aboutData, catalogData, promoHeaderData, workflowHeaderData, faqHeaderData, testimonialsHeaderData, prodsData, motifsData, promosData, workflowData, faqData, testiData, partnersData, contactData,
        portData, uspData, leadsData, ordersData, tiersData, tplData, csatData, unansweredData
      ] = await Promise.all([
        getCMSHeroConfig(),
        getCMSAboutConfig(),
        getCMSCatalogConfig(),
        getCMSPromoHeaderConfig(),
        getCMSWorkflowHeaderConfig(),
        getCMSFAQHeaderConfig(),
        getCMSTestimonialsHeaderConfig(),
        getCMSProducts(),
        getCMSMotifs(),
        getCMSPromos(),
        getCMSWorkflow(),
        getCMSFAQ(),
        getCMSTestimonials(),
        getCMSPartners(),
        getCMSContactConfig(),
        getCMSPortfolio(),
        getCMSUSP(),
        getCMSLeads(),
        getCMSOrders(),
        getCMSCustomerTiers(),
        getCMSWATemplates(),
        getCMSCSATRatings(),
        getUnansweredQuestions(),
      ]);

      setHeroConfig(heroData);
      setAboutConfig(aboutData);
      setCatalogConfig(catalogData);
      setPromoHeaderConfig(promoHeaderData);
      setWorkflowHeaderConfig(workflowHeaderData);
      setFAQHeaderConfig(faqHeaderData);
      setTestimonialsHeaderConfig(testimonialsHeaderData);
      setProducts(prodsData);
      setMotifs(motifsData);
      setPromos(promosData);
      setWorkflowSteps(workflowData);
      setFAQItems(faqData);
      setTestimonials(testiData);
      setPartners(partnersData);
      setContactConfig(contactData);
      setPortfolioItems(portData);
      setUSPItems(uspData);

      setLeads(leadsData);
      setOrders(ordersData);
      setCustomerTiers(tiersData);
      setWATemplates(tplData);
      setCSATRatings(csatData);
      setUnanswered(unansweredData);
      setQuotaInfo(getAIQuotaInfo());
    } catch (e) {
      console.warn('Error loading CMS & CRM data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSignOut = () => {
    askConfirmation(
      'Keluar dari Admin Portal?',
      'Sesi Anda akan diakhiri dan Anda akan keluar dari Portal CMS & CRM Riza Apparel.',
      async () => {
        await signOut(auth);
        onLogout();
      },
      { confirmText: 'Ya, Keluar Sesi', cancelText: 'Batal', variant: 'warning' }
    );
  };

  const handleSeedData = () => {
    askConfirmation(
      'Inisialisasi Data Awal (Seed)?',
      'Tindakan ini akan mengunggah & menyegarkan data sampel default ke Firestore & penyimpanan lokal.',
      async () => {
        setIsLoading(true);
        const res = await seedInitialFirestoreData();
        if (res.success) {
          setActionSuccess(`Berhasil menginisialisasi ${res.count} data awal Firestore!`);
          setTimeout(() => setActionSuccess(''), 3000);
          await loadAllData();
        }
        setIsLoading(false);
      },
      { confirmText: 'Ya, Inisialisasi Data', cancelText: 'Batal', variant: 'warning' }
    );
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

  const handleToggleProductStatus = async (product: CatalogItem) => {
    const updated: CatalogItem = { ...product, isActive: product.isActive === false ? true : false };
    setIsLoading(true);
    try {
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
      await saveCMSProduct(updated);
      setActionSuccess(`Status produk "${product.name}" diubah ke ${updated.isActive ? 'AKTIF' : 'NONAKTIF'}!`);
      setTimeout(() => setActionSuccess(''), 3000);
      await loadAllData();
    } catch (err: any) {
      console.warn('Toggle product status error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsLoading(true);
    try {
      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === editingProduct.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = editingProduct;
          return updated;
        }
        return [...prev, editingProduct];
      });

      await saveCMSProduct(editingProduct);
      setIsProductModalOpen(false);
      setActionSuccess('Foto & data produk berhasil disimpan!');
      setTimeout(() => setActionSuccess(''), 3000);
      await loadAllData();
    } catch (err: any) {
      console.warn('Save product error:', err);
      setIsProductModalOpen(false);
      setActionSuccess('Foto & data produk berhasil disimpan (Lokal)!');
      setTimeout(() => setActionSuccess(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMotifForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMotif) return;
    if (!editingMotif.atribusi_sumber || !editingMotif.atribusi_sumber.trim()) {
      alert('Atribusi Sumber Kultural Wajib Diisi');
      return;
    }
    setIsLoading(true);
    try {
      setMotifs(prev => {
        const idx = prev.findIndex(m => (m.id && m.id === editingMotif.id) || m.nama_motif === editingMotif.nama_motif);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = editingMotif;
          return updated;
        }
        return [...prev, editingMotif];
      });

      await saveCMSMotif(editingMotif);
      setIsMotifModalOpen(false);
      setActionSuccess('Motif tenun berhasil disimpan!');
      setTimeout(() => setActionSuccess(''), 3000);
      await loadAllData();
    } catch (err: any) {
      console.warn('Save motif warning:', err);
      setIsMotifModalOpen(false);
      setActionSuccess('Motif tenun berhasil disimpan!');
      setTimeout(() => setActionSuccess(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrderFromLeadItem = async (lead: CMSLead) => {
    if (!lead.id) return;
    const res = await createOrderFromLead({
      nama_pemesan: lead.nama,
      nama_tim: lead.nama_tim || 'Pelanggan Riza Apparel',
      nomor_whatsapp: lead.nomor_whatsapp,
      rincian_desain: lead.ringkasan_desain || 'Jersey Custom',
      jumlah_item: lead.estimasi_jumlah_pesanan || 12,
      status_pesanan: 'Diterima',
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

  const handleDeletePartner = (id: string) => {
    askConfirmation(
      'Hapus Logo Mitra?',
      'Apakah Anda yakin ingin menghapus logo mitra ini dari tampilan website?',
      async () => {
        const updated = partners.filter(p => p.id !== id);
        setPartners(updated);
        await saveCMSPartners(updated);
        setIsPartnerModalOpen(false);
        setActionSuccess('Logo mitra berhasil dihapus!');
        setTimeout(() => setActionSuccess(''), 2500);
      },
      { confirmText: 'Hapus Mitra', variant: 'danger' }
    );
  };

  const handleDeleteTestimonial = (id: string) => {
    askConfirmation(
      'Hapus Ulasan Testimoni?',
      'Apakah Anda yakin ingin menghapus ulasan testimoni pelanggan ini?',
      async () => {
        const updated = testimonials.filter(t => t.id !== id);
        setTestimonials(updated);
        await saveCMSTestimonials(updated);
        setIsTestimonialModalOpen(false);
        setActionSuccess('Testimoni berhasil dihapus!');
        setTimeout(() => setActionSuccess(''), 2500);
      },
      { confirmText: 'Hapus Testimoni', variant: 'danger' }
    );
  };

  const handleDeletePortfolio = (id: string) => {
    askConfirmation(
      'Hapus Item Portfolio?',
      'Apakah Anda yakin ingin menghapus item portofolio karya jersey ini?',
      async () => {
        const updated = portfolioItems.filter(item => item.id !== id);
        setPortfolioItems(updated);
        await saveCMSPortfolio(updated);
        setIsPortfolioModalOpen(false);
        setActionSuccess('Item portfolio berhasil dihapus!');
        setTimeout(() => setActionSuccess(''), 2500);
      },
      { confirmText: 'Hapus Portfolio', variant: 'danger' }
    );
  };

  const handleDeletePromo = (id: string) => {
    askConfirmation(
      'Hapus Paket Promo?',
      'Apakah Anda yakin ingin menghapus paket promo ini?',
      async () => {
        const updated = promos.filter(p => p.id !== id);
        setPromos(updated);
        await saveCMSPromos(updated);
        setIsPromoModalOpen(false);
        setActionSuccess('Paket promo berhasil dihapus!');
        setTimeout(() => setActionSuccess(''), 2500);
      },
      { confirmText: 'Hapus Promo', variant: 'danger' }
    );
  };

  const handleDeleteWorkflowStep = (id: string) => {
    askConfirmation(
      'Hapus Alur Produksi?',
      'Apakah Anda yakin ingin menghapus tahapan alur produksi ini?',
      async () => {
        const updated = workflowSteps.filter(s => s.id !== id);
        setWorkflowSteps(updated);
        await saveCMSWorkflow(updated);
        setIsWorkflowModalOpen(false);
        setActionSuccess('Tahapan alur produksi berhasil dihapus!');
        setTimeout(() => setActionSuccess(''), 2500);
      },
      { confirmText: 'Hapus Tahapan', variant: 'danger' }
    );
  };

  const handleDeleteProduct = (id: string) => {
    askConfirmation(
      'Hapus Produk Katalog?',
      'Apakah Anda yakin ingin menghapus produk ini dari katalog CMS?',
      async () => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        await saveCMSProducts(updated);
        setIsProductModalOpen(false);
        setActionSuccess('Produk berhasil dihapus dari katalog!');
        setTimeout(() => setActionSuccess(''), 2500);
      },
      { confirmText: 'Hapus Produk', variant: 'danger' }
    );
  };

  const handleDeleteMotif = (id: string) => {
    askConfirmation(
      'Hapus Motif Tenun?',
      'Apakah Anda yakin ingin menghapus motif tenun autentik ini?',
      async () => {
        const updated = motifs.filter(m => m.id !== id);
        setMotifs(updated);
        await saveCMSMotifs(updated);
        setIsMotifModalOpen(false);
        setActionSuccess('Motif tenun berhasil dihapus!');
        setTimeout(() => setActionSuccess(''), 2500);
      },
      { confirmText: 'Hapus Motif', variant: 'danger' }
    );
  };

  return (
    <div className={`min-h-screen font-sans flex ${isDark ? 'bg-[#0A0E1A] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* SIDEBAR COMPONENT (Distinct Deep Color contrast + Proportional Logo Toggle + Top Aligned pt-7) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen border-r flex flex-col transition-[width,transform] duration-300 ease-in-out ${
          isDark ? 'bg-[#05070E] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        } ${
          isSidebarCollapsed ? 'md:w-[76px]' : 'md:w-[260px]'
        } w-[260px] ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header & Official Riza Apparel SVG Logo */}
        <div className="pt-[35px] pb-3 px-4 flex items-center justify-between shrink-0">
          {isSidebarCollapsed ? (
            /* COLLAPSED STATE: Proportional single Logo Button with expand icon hidden behind logo until hovered */
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className={`group relative w-10 h-10 mx-auto rounded-xl border flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-slate-900/90 hover:bg-brand-600/30 border-slate-800 hover:border-brand-500'
                  : 'bg-white hover:bg-brand-50 border-slate-200 hover:border-brand-400'
              }`}
              title="Perluas Sidebar"
            >
              <img
                src={isDark ? "/logos/logo-riza-apparel-dark.svg" : "/logos/logo-riza-apparel-light.svg"}
                alt="RIZA APPAREL Logo"
                className="h-5 w-auto object-contain transition-all duration-200 group-hover:opacity-0 group-hover:scale-75"
              />
              <PanelLeftOpen className={`w-4 h-4 absolute opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 ${
                isDark ? 'text-brand-400' : 'text-brand-600'
              }`} />
            </button>
          ) : (
            /* EXPANDED STATE: Official Logo Image + Title Text + Toggle Close Button */
            <>
              <div className="flex items-center gap-3.5 overflow-hidden">
                <img
                  src={isDark ? "/logos/logo-riza-apparel-dark.svg" : "/logos/logo-riza-apparel-light.svg"}
                  alt="RIZA APPAREL Logo"
                  className="h-7 w-auto object-contain shrink-0"
                />
                <div className="truncate flex flex-col justify-center pl-0.5 whitespace-nowrap">
                  <span className={`text-xs font-black tracking-wider uppercase leading-snug block ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    RIZA APPAREL
                  </span>
                  <span className={`text-[10px] font-bold tracking-tight block leading-none mt-0.5 ${
                    isDark ? 'text-brand-400' : 'text-brand-600'
                  }`}>
                    CMS & CRM Portal
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className={`hidden md:flex w-8 h-8 items-center justify-center rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700/70 text-slate-400 hover:text-white hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title="Lipat Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* PORTAL SWITCHER PILL (CMS Portal vs CRM Portal) - HIDDEN WHEN COLLAPSED */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
          isSidebarCollapsed ? 'max-h-0 opacity-0 px-3 py-0 pointer-events-none' : 'max-h-20 opacity-100 px-3 pb-2.5 pt-2 mt-2.5'
        }`}>
          <div className={`p-1 rounded-2xl border grid grid-cols-2 gap-1 text-[11px] font-bold ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => {
                setActivePortal('cms');
                if (!['hero', 'about', 'products', 'promos', 'workflow', 'faq', 'testimonials', 'contact'].includes(activeTab)) {
                  setActiveTab('hero');
                }
              }}
              className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activePortal === 'cms'
                  ? 'bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-md shadow-brand-600/30 font-black'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>Portal CMS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePortal('crm');
                if (!['leads', 'orders', 'kanban', 'cust_history', 'wa_templates', 'ratings', 'kb'].includes(activeTab)) {
                  setActiveTab('leads');
                }
              }}
              className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activePortal === 'crm'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 font-black'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Portal CRM</span>
            </button>
          </div>
        </div>

        {/* Sidebar Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(activePortal === 'cms' ? [
            { id: 'hero', label: '1. Header & Hero', icon: Sliders },
            { id: 'about', label: '2. Tentang Kami', icon: FileText },
            { id: 'products', label: '3. Katalog & Motif', icon: Package, badge: products.length + motifs.length },
            { id: 'promos', label: '4. Paket & Promo', icon: Award, badge: promos.length },
            { id: 'workflow', label: '5. Alur Produksi', icon: Printer, badge: workflowSteps.length },
            { id: 'faq', label: '6. FAQ Section', icon: HelpCircle, badge: faqItems.length },
            { id: 'testimonials', label: '7. Testimoni & Mitra', icon: Star, badge: testimonials.length + partners.length },
            { id: 'contact', label: '8. Kontak & Footer', icon: PhoneCall },
          ] : [
            { id: 'leads', label: 'Prospek Lead CRM', icon: Users, badge: leads.filter(l => l.status_tindak_lanjut === 'baru').length, badgeColor: 'bg-brand-500' },
            { id: 'orders', label: 'Pesanan & Tracking', icon: ShoppingBag, badge: orders.length },
            { id: 'kanban', label: 'Papan Kanban', icon: FolderKanban, badge: orders.filter(o => o.status_pesanan !== 'Selesai').length, badgeColor: 'bg-emerald-500' },
            { id: 'cust_history', label: 'Riwayat Pelanggan', icon: Award, badge: customerTiers.length },
            { id: 'wa_templates', label: 'Generator Templat WA', icon: Send, badge: waTemplates.length },
            { id: 'ratings', label: 'CSAT & Rating Hub', icon: MessageSquare, badge: csatRatings.length },
            { id: 'kb', label: 'Knowledge Base', icon: HelpCircle, badge: unanswered.length },
          ]).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? tab.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative whitespace-nowrap overflow-hidden ${
                  isActive
                    ? activePortal === 'cms' 
                      ? 'bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-md shadow-brand-600/30'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                    : isDark
                      ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={`transition-all duration-300 ease-in-out truncate flex-1 text-left whitespace-nowrap ${
                  isSidebarCollapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[180px] opacity-100'
                }`}>
                  {tab.label}
                </span>
                
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`rounded-full text-[10px] font-extrabold transition-all duration-300 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : (tab as any).badgeColor 
                        ? `${(tab as any).badgeColor} text-white` 
                        : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  } ${
                    isSidebarCollapsed 
                      ? 'absolute top-1 right-1.5 px-1 py-0 text-[9px] min-w-[14px] text-center' 
                      : 'px-2 py-0.5 ml-auto'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Profile & Controls */}
        <div className={`p-3 border-t space-y-2 shrink-0 transition-all duration-300 ${
          isDark ? 'border-slate-800/80 bg-[#03050B]' : 'border-slate-200 bg-slate-50/90'
        }`}>
          {/* Profile Card */}
          <div className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ease-in-out overflow-hidden ${
            isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-2xs'
          } ${
            isSidebarCollapsed ? 'max-h-0 opacity-0 p-0 border-0 pointer-events-none mb-0' : 'max-h-16 opacity-100 mb-1'
          }`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              RA
            </div>
            <div className="truncate min-w-0 whitespace-nowrap">
              <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Riza Apparel</p>
              <p className={`text-[10px] font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Super Admin</p>
            </div>
          </div>

          <div className={`grid gap-1.5 transition-all duration-300 ${isSidebarCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <button
              type="button"
              onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all whitespace-nowrap overflow-hidden ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-amber-600 hover:bg-slate-100 shadow-2xs'
              }`}
              title="Ganti Mode Tema CMS"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-indigo-500 shrink-0" />}
              <span className={`transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'max-w-0 opacity-0 pointer-events-none hidden' : 'max-w-[80px] opacity-100'
              }`}>
                {isDark ? 'Terang' : 'Gelap'}
              </span>
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all whitespace-nowrap overflow-hidden ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-2xs'
              }`}
              title="Kembali ke Situs Utama"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className={`transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'max-w-0 opacity-0 pointer-events-none hidden' : 'max-w-[80px] opacity-100'
              }`}>
                Website
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className={`w-full py-2 px-3 font-extrabold text-xs rounded-xl border flex items-center justify-center gap-2 transition-all whitespace-nowrap overflow-hidden ${
              isDark
                ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-rose-500/30'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
            title="Keluar Admin"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'max-w-0 opacity-0 pointer-events-none hidden' : 'max-w-[120px] opacity-100'
            }`}>
              Keluar Admin
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA WITH DISTINCT COLOR BACKGROUND & DYNAMIC MARGIN OFFSET */}
      <div className={`flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out ${
        isSidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[260px]'
      }`}>
        
        {/* Top Header Bar (Borderless & Generous Padding for Proportional Placement - Top Aligned at pt-7) */}
        <header className={`sticky top-0 z-30 backdrop-blur-md pt-7 pb-5 px-6 sm:px-8 lg:px-10 flex items-center justify-between transition-colors ${
          isDark ? 'bg-[#0A0E1A]/90 text-white' : 'bg-slate-100/90 text-slate-900'
        }`}>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className={`p-2.5 rounded-xl border md:hidden ${
                isDark ? 'bg-slate-800/90 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h1 className={`text-xl sm:text-2xl md:text-[26px] font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {activeTab === 'hero' && '1. Konfigurasi Header & Hero Banner'}
                {activeTab === 'about' && '2. Kelola Section Tentang Kami'}
                {activeTab === 'products' && '3. Katalog Produk & Pustaka Motif Tenun NTT'}
                {activeTab === 'promos' && '4. Kelola Paket & Promo Spesial'}
                {activeTab === 'workflow' && '5. Kelola Alur Produksi & Timeline'}
                {activeTab === 'faq' && '6. Pertanyaan Umum (FAQ Section)'}
                {activeTab === 'testimonials' && '7. Testimoni Klien & Logo Mitra'}
                {activeTab === 'contact' && '8. Informasi Kontak & Footer Website'}

                {activeTab === 'leads' && 'Prospek Lead Capture CRM'}
                {activeTab === 'orders' && 'Manajemen Pesanan & Status Tracking'}
                {activeTab === 'kanban' && 'Papan Kanban Tahapan Produksi'}
                {activeTab === 'cust_history' && 'Database & Tier Loyalty Pelanggan'}
                {activeTab === 'wa_templates' && 'Generator Templat Pesan WhatsApp Auto'}
                {activeTab === 'ratings' && 'Hub Ulasan & Rating Kepuasan (CSAT)'}
                {activeTab === 'kb' && 'Knowledge Base & Log Chatbot'}
              </h1>
              <p className={`text-xs sm:text-sm font-medium leading-normal ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {activeTab === 'hero' && 'Ubah judul utama, tagline promo, deskripsi hero, dan tombol aksinya di landing page public'}
                {activeTab === 'about' && 'Atur teks profil Riza Apparel, ringkasan perusahaan, Visi, Misi, serta pilar nilai kebudayaan Ende NTT'}
                {activeTab === 'products' && 'Kelola daftar varian produk, harga dual-unit, spesifikasi bahan, dan pustaka motif tenun ikat NTT dengan atribusi kultural'}
                {activeTab === 'promos' && 'Atur promo Beli 2 Bonus 1, Gratis Ongkir NTT, diskon tim, serta kode promo yang tampil di landing page'}
                {activeTab === 'workflow' && 'Kelola 5 tahapan alur produksi dari desain hingga QC & Pengiriman bebas ongkir'}
                {activeTab === 'faq' && 'Tambah, edit, atau hapus daftar pertanyaan accordion yang tampil pada section FAQ website'}
                {activeTab === 'testimonials' && 'Kelola ulasan kepuasan dari pelanggan/kapten tim serta susunan logo mitra & klub olahraga'}
                {activeTab === 'contact' && 'Perbarui nomor WhatsApp resmi, alamat workshop Ende, jam operasional, dan link sosial media'}

                {activeTab === 'leads' && 'Pantau prospek pelanggan baru dari formulir konsultasi & estimasi'}
                {activeTab === 'orders' && 'Lacak status pengerjaan pesanan dan bagikan token unik tracking'}
                {activeTab === 'kanban' && 'Visualisasikan tahapan kerja produksi jersey dari DP hingga Siap Kirim'}
                {activeTab === 'cust_history' && 'Kelola riwayat nilai pesanan (LTV) dan pengelompokan tier loyalty pelanggan'}
                {activeTab === 'wa_templates' && 'Salin pesan WhatsApp terformat otomatis 1-klik untuk follow-up pelanggan'}
                {activeTab === 'ratings' && 'Kumpulkan ulasan kepuasan (CSAT 1-5 Bintang) dan pilih untuk tampilkan di website'}
                {activeTab === 'kb' && 'Pusat informasi FAQ dan log pertanyaan riil pengguna chatbot'}
              </p>
            </div>
          </div>
        </header>

        {/* Main Workspace Container */}
        <main className="flex-1 px-6 pb-8 sm:px-8 lg:px-10 pt-3">
          
          {/* Success Alert */}
          {actionSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

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

        {/* TAB 1: HEADER & HERO BANNER CONFIG */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Konfigurasi Header & Hero Banner
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Ubah judul utama, tagline promo, deskripsi hero, tombol aksi, dan slideshow carousel jersey pada landing page public.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (heroConfig) {
                      await saveCMSHeroConfig(heroConfig);
                      setActionSuccess('Banner & Header utama berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0 self-start sm:self-center"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Hero</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Utama (Headline Title)</label>
                    <input
                      type="text"
                      value={heroConfig?.headlineTitle || ''}
                      onChange={(e) => setHeroConfig(prev => prev ? { ...prev, headlineTitle: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Teks Sorotan (Headline Highlight)</label>
                    <input
                      type="text"
                      value={heroConfig?.headlineHighlight || ''}
                      onChange={(e) => setHeroConfig(prev => prev ? { ...prev, headlineHighlight: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-brand-400' : 'bg-slate-50 border-slate-300 text-brand-600'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Deskripsi Singkat (Subtext)</label>
                  <textarea
                    rows={3}
                    value={heroConfig?.subtext || ''}
                    onChange={(e) => setHeroConfig(prev => prev ? { ...prev, subtext: e.target.value } : null)}
                    className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Teks Tombol Utama (Primary CTA)</label>
                    <input
                      type="text"
                      value={heroConfig?.primaryCtaText || ''}
                      onChange={(e) => setHeroConfig(prev => prev ? { ...prev, primaryCtaText: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Teks Tombol Kedua (Secondary CTA)</label>
                    <input
                      type="text"
                      value={heroConfig?.secondaryCtaText || ''}
                      onChange={(e) => setHeroConfig(prev => prev ? { ...prev, secondaryCtaText: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Teks Banner Top Bar Promo</label>
                    <input
                      type="text"
                      value={heroConfig?.bannerBadgeText || ''}
                      onChange={(e) => setHeroConfig(prev => prev ? { ...prev, bannerBadgeText: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-rose-300' : 'bg-slate-50 border-slate-300 text-rose-700'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Teks Rating Badge</label>
                    <input
                      type="text"
                      value={heroConfig?.ratingBadgeText || ''}
                      onChange={(e) => setHeroConfig(prev => prev ? { ...prev, ratingBadgeText: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-amber-300' : 'bg-slate-50 border-slate-300 text-amber-700'}`}
                    />
                  </div>
                </div>

                {/* KELOLA CAROUSEL GAMBAR SLIDESHOW HERO */}
                <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 mt-4 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                        <ImageIcon className="w-4 h-4" />
                        <span>Gambar Carousel Slideshow Hero ({heroConfig?.slides?.length || 0})</span>
                      </h4>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>
                        Ubah atau tambah foto jersey carousel yang berputar otomatis pada Hero Banner website.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHeroSlide({
                          id: String(Date.now()),
                          src: '',
                          title: '',
                          subtitle: '',
                          price: 'Rp 90.000 / pcs'
                        });
                        setIsHeroSlideModalOpen(true);
                      }}
                      className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Slide Carousel</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {(heroConfig?.slides || []).map((slide) => (
                      <div key={slide.id} className={`p-3 rounded-xl border space-y-2 relative min-w-0 w-full overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
                        <div className="aspect-video rounded-lg bg-slate-950 overflow-hidden relative">
                          <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                          {slide.price && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-700">
                              {slide.price}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 w-full overflow-hidden">
                          <h5 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`} title={slide.title}>{slide.title}</h5>
                          <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`} title={slide.subtitle}>{slide.subtitle || '-'}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingHeroSlide(slide);
                              setIsHeroSlideModalOpen(true);
                            }}
                            className="text-[11px] font-extrabold text-brand-500 hover:underline flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit Slide</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              askConfirmation(
                                'Hapus Slide Hero?',
                                'Apakah Anda yakin ingin menghapus slide carousel hero ini?',
                                () => {
                                  if (heroConfig) {
                                    const updatedSlides = (heroConfig.slides || []).filter(s => s.id !== slide.id);
                                    setHeroConfig({ ...heroConfig, slides: updatedSlides });
                                  }
                                },
                                { confirmText: 'Hapus Slide', variant: 'danger' }
                              );
                            }}
                            className="text-[11px] font-extrabold text-rose-500 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TENTANG KAMI CONFIG */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Kelola Section Tentang Kami
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Atur teks profil Riza Apparel, ringkasan perusahaan, Visi, Misi, serta pilar nilai kebudayaan Ende NTT.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (aboutConfig) {
                      await saveCMSAboutConfig(aboutConfig);
                      setActionSuccess('Informasi Tentang Kami berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0 self-start sm:self-center"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Tentang Kami</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Section Utama</label>
                    <input
                      type="text"
                      value={aboutConfig?.sectionTitle || ''}
                      onChange={(e) => setAboutConfig(prev => prev ? { ...prev, sectionTitle: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle Section</label>
                    <input
                      type="text"
                      value={aboutConfig?.sectionSubtitle || ''}
                      onChange={(e) => setAboutConfig(prev => prev ? { ...prev, sectionSubtitle: e.target.value } : null)}
                      className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-brand-400' : 'bg-slate-50 border-slate-300 text-brand-600'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Ringkasan Profil Perusahaan (Company Overview)</label>
                  <textarea
                    rows={4}
                    value={aboutConfig?.companyOverview || ''}
                    onChange={(e) => setAboutConfig(prev => prev ? { ...prev, companyOverview: e.target.value } : null)}
                    className={`w-full p-3 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
                    <h4 className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                      <Sparkles className="w-4 h-4" />
                      <span>Konfigurasi Visi Perusahaan</span>
                    </h4>
                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Visi</label>
                      <input
                        type="text"
                        value={aboutConfig?.visionTitle || ''}
                        onChange={(e) => setAboutConfig(prev => prev ? { ...prev, visionTitle: e.target.value } : null)}
                        className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Penjelasan Visi</label>
                      <textarea
                        rows={3}
                        value={aboutConfig?.visionText || ''}
                        onChange={(e) => setAboutConfig(prev => prev ? { ...prev, visionText: e.target.value } : null)}
                        className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'}`}
                      />
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
                    <h4 className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      <Award className="w-4 h-4" />
                      <span>Konfigurasi Misi Perusahaan</span>
                    </h4>
                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Misi</label>
                      <input
                        type="text"
                        value={aboutConfig?.missionTitle || ''}
                        onChange={(e) => setAboutConfig(prev => prev ? { ...prev, missionTitle: e.target.value } : null)}
                        className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Penjelasan Misi</label>
                      <textarea
                        rows={3}
                        value={aboutConfig?.missionText || ''}
                        onChange={(e) => setAboutConfig(prev => prev ? { ...prev, missionText: e.target.value } : null)}
                        className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROSPEK CRM (UC11, FR-B3) */}
        {activeTab === 'leads' && (
          <div className="space-y-5 animate-slide-up">
            
            {/* Premium Lead Pipeline Header Card */}
            <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-rose-950/30 border-slate-800/90 shadow-xl'
                : 'bg-gradient-to-r from-white via-slate-50 to-rose-50/50 border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Prospek Masuk CRM ({leads.length})
                </h3>
                <p className={`text-xs sm:text-sm font-medium max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Pantau prospek pelanggan baru dari formulir konsultasi & estimasi harga. Klik tombol "Buat Pesanan" untuk mengonversi prospek menjadi pesanan produksi aktif.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {leads.length === 0 ? (
                <p className={`text-xs italic p-8 text-center border rounded-2xl ${
                  isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'
                }`}>Belum ada prospek masuk.</p>
              ) : (
                leads.map((l) => (
                  <div key={l.id} className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold">{l.nama}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                          l.status_tindak_lanjut === 'baru' 
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {l.status_tindak_lanjut}
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Phone className="w-3.5 h-3.5 inline-block text-brand-400 mr-1 stroke-[2.5]" /> WA: <strong>{l.nomor_whatsapp}</strong> | Tim: {l.nama_tim || '-'} | Est. Jumlah: {l.estimasi_jumlah_pesanan} pcs
                      </p>
                      {l.ringkasan_desain && (
                        <p className={`text-[11px] p-2.5 rounded-xl border mt-1 ${
                          isDark ? 'bg-slate-950/80 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {l.ringkasan_desain}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${l.nomor_whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(l.nama)},%20saya%20Admin%20Riza%20Apparel...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>
                      {l.status_tindak_lanjut !== 'jadi_pesanan' && (
                        <button
                          type="button"
                          onClick={() => handleCreateOrderFromLeadItem(l)}
                          className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
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
          <div className="space-y-5 animate-slide-up">
            
            {/* Premium Live Tracking Section Header Card */}
            <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 border-slate-800/90 shadow-xl'
                : 'bg-gradient-to-r from-white via-slate-50 to-emerald-50/50 border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Daftar Pesanan & Status Tracking ({orders.length})
                </h3>
                <p className={`text-xs sm:text-sm font-medium max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Lacak status pengerjaan pesanan dan bagikan token akses tracking unik agar pemesan dapat memantau progres produksi secara independen.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className={`p-5 rounded-2xl border space-y-3.5 transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <div>
                      <span className="text-sm font-extrabold">{o.nama_pemesan} ({o.nama_tim})</span>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Jumlah: {o.jumlah_item} Pcs | Est. Selesai: {o.estimasi_selesai}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {['Diterima', 'Diproduksi', 'Selesai'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateOrderStatus(o.id!, st as any).then(loadAllData)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                            o.status_pesanan === st
                              ? 'bg-heritage-zawo text-slate-950 border-amber-400/50 shadow-xs'
                              : isDark ? 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Token Tracking Link Display */}
                  <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 truncate">
                      <span className={`font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tautan Tracking Pelanggan:</span>
                      <span className="font-mono text-brand-400 font-bold truncate">token={o.token_akses_unik}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyTrackingLink(o.token_akses_unik)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {copiedTokenId === o.token_akses_unik ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTokenId === o.token_akses_unik ? 'Tersalin' : 'Salin Tautan'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* TAB 2: KATALOG PRODUK CMS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Header Judul & Tag Badge Catalog Form */}
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-5 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Konfigurasi Judul, Subtitle & Tag Header Katalog
                  </h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Atur teks tag badge transparansi harga, judul section katalog, dan deskripsi singkat yang tampil di landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (catalogConfig) {
                      await saveCMSCatalogConfig(catalogConfig);
                      setActionSuccess('Judul & Tag Katalog berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0 self-start sm:self-center"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Judul & Tag Katalog</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tag Badge Header Katalog</label>
                  <input
                    type="text"
                    value={catalogConfig?.tagBadgeText || ''}
                    onChange={(e) => setCatalogConfig(prev => prev ? { ...prev, tagBadgeText: e.target.value } : null)}
                    placeholder="TRANSPARANSI HARGA CITITEX–STANDARD"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-50 border-slate-300 text-amber-600'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Section Utama Katalog</label>
                  <input
                    type="text"
                    value={catalogConfig?.sectionTitle || ''}
                    onChange={(e) => setCatalogConfig(prev => prev ? { ...prev, sectionTitle: e.target.value } : null)}
                    placeholder="Katalog Produk & Batas Harga Mulai Dari"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle / Deskripsi Header Katalog</label>
                <textarea
                  rows={2}
                  value={catalogConfig?.sectionSubtitle || ''}
                  onChange={(e) => setCatalogConfig(prev => prev ? { ...prev, sectionSubtitle: e.target.value } : null)}
                  placeholder="Harga terbuka dan jelas tanpa biaya tersembunyi..."
                  className={`w-full p-3 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                />
              </div>
            </div>

            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark
                ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              {/* Header inside parent card */}
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Katalog Produk CMS ({products.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Aktifkan atau nonaktifkan produk tanpa menghapus data. Produk yang diaktifkan tayang real-time di landing page.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <div className={`p-1 rounded-2xl border flex items-center gap-1 text-xs font-bold ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
                  }`}>
                    {[
                      { id: 'all', label: 'Semua', count: products.length },
                      { id: 'active', label: 'Aktif', count: products.filter(p => p.isActive !== false).length },
                      { id: 'inactive', label: 'Nonaktif', count: products.filter(p => p.isActive === false).length },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setProductFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-xl transition-all font-extrabold ${
                          productFilter === f.id
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f.label} ({f.count})
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({
                        id: String(Date.now()),
                        name: '',
                        category: 'team',
                        startingPrice: 90000,
                        priceUnit: 'pcs',
                        minOrderBadge: 'Bisa Satuan (1 Pcs)',
                        promoBadge: 'Beli 2 Bonus 1',
                        description: '',
                        features: [
                          'Bahan Dry-Fit Premium Sublimasi',
                          'Gratis Custom Nama, Nomor & Logo Tim',
                          'Jahitan Rantai Standar Jersey Olahraga'
                        ],
                        fabricSpecs: 'Dry-Fit Milano 160gsm',
                        leadTimeDays: 5,
                        imageUrl: '',
                        isActive: true,
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk Baru</span>
                  </button>
                </div>
              </div>

              {/* Grid inside same parent card */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter(p => productFilter === 'all' ? true : productFilter === 'active' ? p.isActive !== false : p.isActive === false)
                  .map((p) => (
                    <div key={p.id} className={`p-4 rounded-2xl border space-y-3 relative transition-all min-w-0 w-full overflow-hidden ${
                      p.isActive === false ? 'opacity-75 border-dashed' : ''
                    } ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'}`}>
                      
                      <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden relative w-full">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-2 right-2 text-[10px] font-black px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-md flex items-center gap-1 border ${
                          p.isActive !== false
                            ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                            : 'bg-slate-900/95 text-rose-300 border-rose-500/40'
                        }`}>
                          {p.isActive !== false ? '● AKTIF TAYANG' : '○ NONAKTIF'}
                        </span>
                        {p.promoBadge && (
                          <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {p.promoBadge}
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 bg-slate-950/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                          Est. {p.leadTimeDays || 5} Hari Kerja
                        </span>
                      </div>

                      <div className="min-w-0 w-full overflow-hidden space-y-1">
                        <h4 className={`text-sm font-extrabold truncate w-full block ${isDark ? 'text-white' : 'text-slate-900'}`} title={p.name}>{p.name}</h4>
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-brand-500 font-extrabold">Rp {p.startingPrice.toLocaleString('id-ID')} /{p.priceUnit || 'pcs'}</span>
                            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.minOrderBadge || 'Bisa Satuan'}</span>
                          </div>
                          {p.secondaryPrice && p.secondaryPrice > 0 && (
                            <div className={`flex items-center justify-between text-[10px] font-bold px-2 py-1 rounded-lg border ${
                              isDark ? 'text-emerald-400 bg-slate-950/80 border-slate-800' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            }`}>
                              <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-emerald-400 stroke-[2.5]" />{p.secondaryPriceLabel || 'Grosir'}:</span>
                              <span>Rp {p.secondaryPrice.toLocaleString('id-ID')} /{p.secondaryPriceUnit || 'pcs'}</span>
                            </div>
                          )}
                        </div>
                        <p className={`text-[11px] line-clamp-2 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/40">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className={`py-2 rounded-xl font-bold text-[11px] transition-all ${
                            isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(p)}
                          className={`py-2 rounded-xl font-bold text-[11px] transition-all border ${
                            p.isActive !== false
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border-emerald-500/40'
                          }`}
                        >
                          {p.isActive !== false ? 'Nonaktif' : 'Aktifkan'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="py-2 rounded-xl font-bold text-[11px] transition-all border bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/30 flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUSTAKA MOTIF TENUN */}
        {activeTab === 'motifs' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Pustaka Motif Tenun NTT ({motifs.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Kelola motif tenun tradisional khas Flores & Ende. Atribusi sumber kultural lokal wajib diisi sebelum status motif dapat diaktifkan.
                  </p>
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
                  className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 shrink-0 self-start md:self-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Motif Tenun</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motifs.map((m) => (
                  <div key={m.id} className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all min-w-0 w-full overflow-hidden ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="flex items-center justify-between min-w-0 w-full gap-2">
                      <span className="text-sm font-extrabold text-heritage-zawo truncate min-w-0 block" title={m.nama_motif}>{m.nama_motif}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border shrink-0 ${
                        m.status_aktif 
                          ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
                          : 'bg-slate-200 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                        {m.status_aktif ? '● Aktif' : '○ Nonaktif'}
                      </span>
                    </div>
                    <p className={`text-xs font-mono p-3 rounded-xl border leading-relaxed break-words ${
                      isDark ? 'bg-slate-950/80 text-slate-300 border-slate-800' : 'bg-white text-slate-700 border-slate-200'
                    }`}>
                      <Bookmark className="w-3.5 h-3.5 inline-block text-brand-400 mr-1 stroke-[2.5]" /> <strong>Atribusi Sumber:</strong> {m.atribusi_sumber || '[PLACEHOLDER — Menunggu Klien]'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMotif(m);
                          setIsMotifModalOpen(true);
                        }}
                        className={`py-2 font-extrabold text-xs rounded-xl border transition-all ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                        }`}
                      >
                        Edit Motif
                      </button>
                      <button
                        type="button"
                        onClick={() => m.id && handleDeleteMotif(m.id)}
                        className="py-2 font-extrabold text-xs rounded-xl border bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/30 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAKET & PROMO CONFIG */}
        {activeTab === 'promos' && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Header Judul & Tag Badge Promo Form */}
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-5 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Konfigurasi Judul, Subtitle & Tag Header Paket & Promo
                  </h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Atur teks tag badge, judul section penawaran promo, dan deskripsi singkat yang tampil di landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (promoHeaderConfig) {
                      await saveCMSPromoHeaderConfig(promoHeaderConfig);
                      setActionSuccess('Judul & Tag Section Promo berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0 self-start sm:self-center"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Header Promo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tag Badge Header Promo</label>
                  <input
                    type="text"
                    value={promoHeaderConfig?.tagBadgeText || ''}
                    onChange={(e) => setPromoHeaderConfig(prev => prev ? { ...prev, tagBadgeText: e.target.value } : null)}
                    placeholder="PAKET & PROMO SPESIAL RIZA APPAREL"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-50 border-slate-300 text-amber-600'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Section Utama Promo</label>
                  <input
                    type="text"
                    value={promoHeaderConfig?.sectionTitle || ''}
                    onChange={(e) => setPromoHeaderConfig(prev => prev ? { ...prev, sectionTitle: e.target.value } : null)}
                    placeholder="Nikmati Penawaran Hemat Pemesanan"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle / Deskripsi Header Promo (Opsional)</label>
                <textarea
                  rows={2}
                  value={promoHeaderConfig?.sectionSubtitle || ''}
                  onChange={(e) => setPromoHeaderConfig(prev => prev ? { ...prev, sectionSubtitle: e.target.value } : null)}
                  placeholder="Deskripsi singkat promo..."
                  className={`w-full p-3 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                />
              </div>
            </div>

            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Kelola Paket & Promo Spesial ({promos.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Daftar promo "Beli 2 Bonus 1", "Gratis Ongkir NTT", dan diskon seragam tim yang tampil aktif di landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPromo({
                      id: 'promo-' + Date.now(),
                      title: '',
                      description: '',
                      badge: '🔥 PROMO SPESIAL',
                      code: 'PROMO' + Math.floor(Math.random() * 1000),
                    });
                    setIsPromoModalOpen(true);
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Promo Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {promos.map((item) => (
                  <div key={item.id} className={`p-5 rounded-2xl border space-y-3 min-w-0 w-full overflow-hidden flex flex-col justify-between ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="space-y-3 min-w-0 w-full">
                      <div className="flex items-center justify-between gap-2 min-w-0 w-full">
                        <span className="text-[10px] bg-brand-500/20 text-brand-500 px-2.5 py-0.5 rounded-full font-black border border-brand-500/30 shrink-0">
                          {renderBadgeWithIcon(item.badge)}
                        </span>
                        {item.code && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border truncate shrink-0 ${
                            isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-white text-slate-800 border-slate-200'
                          }`}>
                            KODE: {item.code}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 w-full">
                        <h4 className={`text-sm font-extrabold truncate w-full block ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                        <p className={`text-xs mt-1 line-clamp-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPromo(item);
                          setIsPromoModalOpen(true);
                        }}
                        className="text-brand-500 hover:underline font-extrabold text-xs flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePromo(item.id)}
                        className="text-rose-500 hover:underline font-extrabold text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ALUR PRODUKSI */}
        {activeTab === 'workflow' && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Header Judul & Tag Badge Workflow Form */}
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-5 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Konfigurasi Judul, Subtitle & Tag Header Alur Produksi
                  </h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Atur teks tag badge alur produksi presisi, judul section, dan penjelasan singkat yang tampil di landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (workflowHeaderConfig) {
                      await saveCMSWorkflowHeaderConfig(workflowHeaderConfig);
                      setActionSuccess('Judul & Tag Section Alur Produksi berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0 self-start sm:self-center"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Header Alur Produksi</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tag Badge Header Alur Produksi</label>
                  <input
                    type="text"
                    value={workflowHeaderConfig?.tagBadgeText || ''}
                    onChange={(e) => setWorkflowHeaderConfig(prev => prev ? { ...prev, tagBadgeText: e.target.value } : null)}
                    placeholder="ALUR PRODUKSI PRESISI"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-50 border-slate-300 text-amber-600'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Section Utama Alur Produksi</label>
                  <input
                    type="text"
                    value={workflowHeaderConfig?.sectionTitle || ''}
                    onChange={(e) => setWorkflowHeaderConfig(prev => prev ? { ...prev, sectionTitle: e.target.value } : null)}
                    placeholder="Dari Draf Desain Hingga Jersey Siap Tanding"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle / Deskripsi Header Alur Produksi</label>
                <textarea
                  rows={2}
                  value={workflowHeaderConfig?.sectionSubtitle || ''}
                  onChange={(e) => setWorkflowHeaderConfig(prev => prev ? { ...prev, sectionSubtitle: e.target.value } : null)}
                  placeholder="Langkah transparan dan terkontrol..."
                  className={`w-full p-3 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                />
              </div>
            </div>

            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Kelola Tahapan Alur Produksi ({workflowSteps.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tahapan alur produksi presisi dari Draf Desain 3D, Approval Proofing, Sublimasi 1440 DPI, Jahitan Rantai, hingga QC & Kirim.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {workflowSteps.map((step) => (
                  <div key={step.id} className={`p-4 rounded-2xl border space-y-2.5 transition-all min-w-0 w-full overflow-hidden flex flex-col justify-between ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="space-y-2 min-w-0 w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-500 border border-brand-500/30 flex items-center justify-center text-xs font-black shrink-0">
                          {step.stepNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingWorkflowStep(step);
                              setIsWorkflowModalOpen(true);
                            }}
                            className={`p-1.5 rounded-lg transition-all ${
                              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                            }`}
                            title="Edit Tahapan"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWorkflowStep(step.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/20 transition-all"
                            title="Hapus Tahapan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="min-w-0 w-full">
                        <h4 className={`text-xs font-extrabold truncate w-full block ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h4>
                        <p className={`text-[11px] mt-1 leading-relaxed line-clamp-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FAQ SECTION */}
        {activeTab === 'faq' && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Header Judul & Tag Badge FAQ Form */}
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-5 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Konfigurasi Judul, Subtitle & Tag Header FAQ
                  </h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Atur teks tag badge FAQ, judul utama section accordion, dan penjelasan singkat yang tampil di landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (faqHeaderConfig) {
                      await saveCMSFAQHeaderConfig(faqHeaderConfig);
                      setActionSuccess('Judul & Tag Section FAQ berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0 self-start sm:self-center"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Header FAQ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tag Badge Header FAQ</label>
                  <input
                    type="text"
                    value={faqHeaderConfig?.tagBadgeText || ''}
                    onChange={(e) => setFAQHeaderConfig(prev => prev ? { ...prev, tagBadgeText: e.target.value } : null)}
                    placeholder="PERTANYAAN UMUM (FAQ)"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-50 border-slate-300 text-amber-600'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Section Utama FAQ</label>
                  <input
                    type="text"
                    value={faqHeaderConfig?.sectionTitle || ''}
                    onChange={(e) => setFAQHeaderConfig(prev => prev ? { ...prev, sectionTitle: e.target.value } : null)}
                    placeholder="Hal yang Sering Ditanyakan Pelanggan"
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle / Deskripsi Header FAQ</label>
                <textarea
                  rows={2}
                  value={faqHeaderConfig?.sectionSubtitle || ''}
                  onChange={(e) => setFAQHeaderConfig(prev => prev ? { ...prev, sectionSubtitle: e.target.value } : null)}
                  placeholder="Informasi penting mengenai cara pemesanan..."
                  className={`w-full p-3 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                />
              </div>
            </div>

            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Daftar FAQ Accordion ({faqItems.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Kelola pertanyaan umum pelanggan yang ditampilkan pada accordion section FAQ di landing page public.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingFAQ({
                      id: 'faq-' + Date.now(),
                      question: '',
                      answer: '',
                    });
                    setIsFAQModalOpen(true);
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah FAQ Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqItems.map((faq) => (
                  <div key={faq.id} className={`p-4 sm:p-5 rounded-2xl border space-y-2 min-w-0 w-full overflow-hidden ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="flex items-center justify-between gap-2 min-w-0 w-full">
                      <h4 className="text-sm font-extrabold text-brand-500 truncate min-w-0 flex items-center gap-1.5 flex-1">
                        <HelpCircle className="w-4 h-4 shrink-0 text-brand-500 stroke-[2.5]" />
                        <span>{faq.question.replace(/^❓\s*/, '')}</span>
                      </h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFAQ(faq);
                            setIsFAQModalOpen(true);
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            askConfirmation(
                              'Hapus Pertanyaan FAQ?',
                              'Apakah Anda yakin ingin menghapus pertanyaan FAQ ini?',
                              async () => {
                                const updated = faqItems.filter(f => f.id !== faq.id);
                                setFAQItems(updated);
                                await saveCMSFAQ(updated);
                                setActionSuccess('Pertanyaan FAQ berhasil dihapus!');
                                setTimeout(() => setActionSuccess(''), 2500);
                              },
                              { confirmText: 'Hapus FAQ', variant: 'danger' }
                            );
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs p-3 rounded-xl border leading-relaxed break-words flex items-start gap-1.5 ${
                      isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{faq.answer.replace(/^💡\s*/, '')}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Galeri Portfolio Hasil Jadi ({portfolioItems.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Dokumentasi hasil jersey yang telah selesai diproduksi untuk klien dan tim di NTT.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPortfolio({
                      id: 'port-' + Date.now(),
                      title: '',
                      category: 'Sepak Bola',
                      imageUrl: '',
                      clientName: '',
                      location: 'Ende, NTT',
                      description: '',
                      orderQuantity: 12,
                    });
                    setIsPortfolioModalOpen(true);
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Item Portfolio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div key={item.id} className={`p-4 rounded-2xl border space-y-3 min-w-0 w-full overflow-hidden ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden relative w-full">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="min-w-0 w-full overflow-hidden space-y-1">
                      <h4 className={`text-sm font-extrabold truncate w-full block ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                      <p className="text-xs text-brand-500 font-extrabold truncate w-full block">{item.clientName} ({item.location})</p>
                      <p className={`text-[11px] line-clamp-2 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-xs">
                      <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total: {item.orderQuantity} Pcs</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPortfolio(item);
                            setIsPortfolioModalOpen(true);
                          }}
                          className="text-brand-500 hover:underline font-extrabold flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <span className="text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="text-rose-500 hover:underline font-extrabold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: TESTIMONIALS & MITRA */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-slide-up">
            
            {/* Header Judul & Tag Badge Testimoni & Mitra Form */}
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-5 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Konfigurasi Judul & Tag Section Testimoni & Mitra
                  </h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Atur teks tag badge, judul section utama, dan penjelasan subtitle untuk blok Ulasan Testimoni & Blok Carousel Mitra.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (testimonialsHeaderConfig) {
                      await saveCMSTestimonialsHeaderConfig(testimonialsHeaderConfig);
                      setActionSuccess('Judul & Tag Section Testimoni & Mitra berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-600/20 shrink-0 self-start sm:self-center"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Header Testimoni & Mitra</span>
                </button>
              </div>

              {/* Sub-block Testimoni */}
              <div className="space-y-3 pt-1">
                <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  1. Header Section Testimoni Pelanggan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tag Badge Testimoni</label>
                    <input
                      type="text"
                      value={testimonialsHeaderConfig?.testiTagBadgeText || ''}
                      onChange={(e) => setTestimonialsHeaderConfig(prev => prev ? { ...prev, testiTagBadgeText: e.target.value } : null)}
                      placeholder="ULASAN & TESTIMONI PELANGGAN"
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-50 border-slate-300 text-amber-600'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Utama Testimoni</label>
                    <input
                      type="text"
                      value={testimonialsHeaderConfig?.testiSectionTitle || ''}
                      onChange={(e) => setTestimonialsHeaderConfig(prev => prev ? { ...prev, testiSectionTitle: e.target.value } : null)}
                      placeholder="Dipercaya oleh Atlet, Tim & Komunitas Regional"
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle Deskripsi Testimoni</label>
                  <input
                    type="text"
                    value={testimonialsHeaderConfig?.testiSectionSubtitle || ''}
                    onChange={(e) => setTestimonialsHeaderConfig(prev => prev ? { ...prev, testiSectionSubtitle: e.target.value } : null)}
                    placeholder="Pengalaman nyata pelanggan..."
                    className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                  />
                </div>
              </div>

              {/* Sub-block Mitra */}
              <div className="space-y-3 pt-3 border-t border-slate-800/40">
                <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                  2. Header Section Mitra & Klien
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tag Badge Mitra</label>
                    <input
                      type="text"
                      value={testimonialsHeaderConfig?.partnerTagBadgeText || ''}
                      onChange={(e) => setTestimonialsHeaderConfig(prev => prev ? { ...prev, partnerTagBadgeText: e.target.value } : null)}
                      placeholder="MITRA & KLIEN KAMI"
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-brand-400' : 'bg-slate-50 border-slate-300 text-brand-600'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Utama Mitra</label>
                    <input
                      type="text"
                      value={testimonialsHeaderConfig?.partnerSectionTitle || ''}
                      onChange={(e) => setTestimonialsHeaderConfig(prev => prev ? { ...prev, partnerSectionTitle: e.target.value } : null)}
                      placeholder="Dipercaya oleh Perusahaan & Ekosistem Industri"
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle Deskripsi Mitra</label>
                  <input
                    type="text"
                    value={testimonialsHeaderConfig?.partnerSectionSubtitle || ''}
                    onChange={(e) => setTestimonialsHeaderConfig(prev => prev ? { ...prev, partnerSectionSubtitle: e.target.value } : null)}
                    placeholder="Sinergi berkelanjutan bersama produsen..."
                    className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}
                  />
                </div>
              </div>

            </div>
            
            {/* SUB-SECTION 1: TESTIMONI & REVIEW PELANGGAN CONTAINER */}
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Testimoni & Review Pelanggan ({testimonials.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Ulasan dan kesan nyata dari manajer tim, kapten komunitas, dan pelanggan di Flores NTT.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial({
                      id: 'testi-' + Date.now(),
                      clientName: '',
                      teamOrOrg: '',
                      location: 'Ende, NTT',
                      quote: '',
                      rating: 5,
                      verifiedOrder: true,
                    });
                    setIsTestimonialModalOpen(true);
                  }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Testimoni</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className={`p-5 rounded-2xl border space-y-3 min-w-0 w-full overflow-hidden flex flex-col justify-between ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="space-y-3 min-w-0 w-full">
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <img src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={t.clientName} className="w-10 h-10 rounded-full object-cover border border-brand-500/40 shrink-0" />
                        <div className="truncate min-w-0 flex-1">
                          <h4 className={`text-xs font-extrabold truncate w-full block ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.clientName}</h4>
                          <p className={`text-[10px] font-medium truncate w-full block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.teamOrOrg} ({t.location})</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className={`text-xs italic line-clamp-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"{t.quote}"</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs mt-2">
                      <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Pesanan Terverifikasi</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTestimonial(t);
                            setIsTestimonialModalOpen(true);
                          }}
                          className="text-brand-500 hover:underline font-extrabold"
                        >
                          Edit
                        </button>
                        <span className="text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="text-rose-500 hover:underline font-extrabold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-SECTION 2: LOGO MITRA & KLIEN CONTAINER */}
            <div className={`p-5 sm:p-6 lg:p-7 rounded-3xl border space-y-6 transition-all ${
              isDark ? 'bg-[#0E1322]/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className={`pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200/80'
              }`}>
                <div className="space-y-1">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Logo Mitra & Klub Olahraga Regional ({partners.length})
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Kelola susunan logo mitra utama (Regarsport, Regarmarket) dan badge klub mitra Ende/Flores.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPartner({
                      id: 'part-' + Date.now(),
                      name: '',
                      role: 'Mitra Regional',
                      type: 'badge',
                      customText: '',
                    });
                    setIsPartnerModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Logo Mitra</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
                {partners.map((p) => (
                  <div key={p.id} className={`p-3.5 rounded-2xl border space-y-2.5 flex flex-col items-center justify-between text-center min-w-0 w-full overflow-hidden ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}>
                    <div className="w-full min-w-0 flex items-center justify-center h-10 overflow-hidden px-1">
                      {p.type === 'svg' && p.logoDark ? (
                        <img src={isDark ? p.logoDark : (p.logoLight || p.logoDark)} alt={p.name} className="h-8 max-w-full object-contain" />
                      ) : (
                        <span className="font-black text-xs text-brand-500 tracking-wider p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 w-full truncate block text-center" title={p.customText || p.name}>
                          {p.customText || p.name}
                        </span>
                      )}
                    </div>
                    <div className="w-full min-w-0 overflow-hidden text-center space-y-0.5">
                      <p className={`text-xs font-extrabold truncate w-full block ${isDark ? 'text-white' : 'text-slate-900'}`} title={p.name}>{p.name}</p>
                      <p className={`text-[10px] font-medium truncate w-full block ${isDark ? 'text-slate-400' : 'text-slate-600'}`} title={p.role}>{p.role}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/40 w-full justify-center text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPartner(p);
                          setIsPartnerModalOpen(true);
                        }}
                        className="text-[11px] text-brand-500 font-extrabold hover:underline"
                      >
                        Edit
                      </button>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(p.id)}
                        className="text-[11px] text-rose-500 font-extrabold hover:underline flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

        {/* TAB: USP */}
        {activeTab === 'usp' && (
          <div className="space-y-5 animate-slide-up">
            <div className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Keunggulan Layanan & Spesifikasi Teknis USP ({uspItems.length})
              </h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                Point keunggulan utama konveksi yang ditampilkan pada landing page public.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uspItems.map((u) => (
                <div key={u.id} className={`p-5 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-brand-400">{u.title}</span>
                    <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-bold border border-brand-500/30">
                      {u.highlightTag || 'USP'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{u.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <span>Informasi Kontak & Footer Website</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Nomor WhatsApp Resmi (Format: 628...)</label>
                  <input
                    type="text"
                    value={contactConfig?.whatsappNumber || ''}
                    onChange={(e) => setContactConfig(prev => prev ? { ...prev, whatsappNumber: e.target.value } : null)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Email Informasi</label>
                  <input
                    type="email"
                    value={contactConfig?.email || ''}
                    onChange={(e) => setContactConfig(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Alamat Lengkap Workshop Ende</label>
                <textarea
                  rows={2}
                  value={contactConfig?.addressText || ''}
                  onChange={(e) => setContactConfig(prev => prev ? { ...prev, addressText: e.target.value } : null)}
                  className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Jam Operasional</label>
                  <input
                    type="text"
                    value={contactConfig?.operationalHours || ''}
                    onChange={(e) => setContactConfig(prev => prev ? { ...prev, operationalHours: e.target.value } : null)}
                    className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={contactConfig?.instagramHandle || ''}
                    onChange={(e) => setContactConfig(prev => prev ? { ...prev, instagramHandle: e.target.value } : null)}
                    className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-pink-400' : 'bg-slate-50 border-slate-200 text-pink-600'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">TikTok Handle</label>
                  <input
                    type="text"
                    value={contactConfig?.tiktokHandle || ''}
                    onChange={(e) => setContactConfig(prev => prev ? { ...prev, tiktokHandle: e.target.value } : null)}
                    className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-cyan-400' : 'bg-slate-50 border-slate-200 text-cyan-600'}`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (contactConfig) {
                      await saveCMSContactConfig(contactConfig);
                      setActionSuccess('Informasi kontak berhasil diperbarui!');
                      setTimeout(() => setActionSuccess(''), 3000);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Informasi Kontak</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div className="space-y-5 animate-slide-up">
            <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Papan Kanban Tahapan Produksi
                </h3>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Pindahkan tahapan pesanan secara visual antar kolom produksi dari DP Diterima hingga Selesai.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Diterima (DP / Draft)', icon: Inbox, status: 'Diterima', color: 'border-brand-500/40 bg-brand-500/10 text-brand-300' },
                { title: 'Diproduksi (Sublim & Jahit)', icon: Cog, status: 'Diproduksi', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
                { title: 'Selesai & Ready Kirim', icon: PartyPopper, status: 'Selesai', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
              ].map((col) => {
                const IconComp = col.icon;
                return (
                  <div key={col.status} className={`p-4 rounded-2xl border space-y-3 min-h-[300px] ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-between ${col.color}`}>
                      <span className="flex items-center gap-1.5"><IconComp className="w-4 h-4 shrink-0 stroke-[2.5]" /><span>{col.title}</span></span>
                      <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                        {orders.filter(o => o.status_pesanan === col.status).length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {orders.filter(o => o.status_pesanan === col.status).map((o) => (
                        <div key={o.id} className={`p-3.5 rounded-xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold truncate">{o.nama_pemesan}</span>
                            <span className="text-[10px] font-mono text-brand-400 font-bold">{o.jumlah_item} Pcs</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{o.nama_tim}</p>
                          
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                            {col.status !== 'Diterima' && (
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(o.id!, col.status === 'Selesai' ? 'Diproduksi' : 'Diterima').then(loadAllData)}
                                className="text-[10px] text-slate-400 hover:text-white underline"
                              >
                                ← Mundur
                              </button>
                            )}
                            {col.status !== 'Selesai' && (
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(o.id!, col.status === 'Diterima' ? 'Diproduksi' : 'Selesai').then(loadAllData)}
                                className="text-[10px] text-emerald-400 hover:underline font-extrabold ml-auto"
                              >
                                Lanjut →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: CUSTOMER HISTORY & TIERS */}
        {activeTab === 'cust_history' && (
          <div className="space-y-5 animate-slide-up">
            <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Database & Tier Loyalty Pelanggan ({customerTiers.length})
                </h3>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Rekapitulasi total pengeluaran (Lifetime Value - LTV) dan tier loyalitas pemesan jersey.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customerTiers.map((c) => (
                <div key={c.id} className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold">{c.nama}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                      c.tier === 'VIP Club' 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : c.tier === 'Setia'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {renderTierWithIcon(c.tier)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">Tim: <strong>{c.nama_tim}</strong></p>
                  
                  <div className={`p-3 rounded-xl border space-y-1 text-xs ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Total Pesanan:</span>
                      <span className="font-bold text-white">{c.total_pesanan}x Order</span>
                    </div>
                    <div className="flex justify-between text-brand-400 text-[11px] font-bold">
                      <span>Lifetime Value (LTV):</span>
                      <span>Rp {c.total_pengeluaran.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${c.nomor_whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Kak%20${encodeURIComponent(c.nama)}%20dari%20${encodeURIComponent(c.nama_tim)},%20terima%20kasih%20telah%20menjadi%20pelanggan%20${c.tier}%20Riza%20Apparel...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Sapa via WA (Diskon {c.tier === 'VIP Club' ? '10%' : '5%'})</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: WA TEMPLATES */}
        {activeTab === 'wa_templates' && (
          <div className="space-y-5 animate-slide-up">
            <div className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Generator Templat Pesan WhatsApp Auto ({waTemplates.length})
              </h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                Salin templat pesan WhatsApp terformat otomatis 1-klik untuk komunikasi cepat dengan pemesan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {waTemplates.map((tpl) => (
                <div key={tpl.id} className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">{tpl.nama_templat}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                      {tpl.kategori}
                    </span>
                  </div>

                  <p className={`text-xs font-mono p-3 rounded-xl border leading-relaxed ${isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    {tpl.isi_pesan}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(tpl.isi_pesan);
                      setActionSuccess(`Templat "${tpl.nama_templat}" tersalin ke clipboard!`);
                      setTimeout(() => setActionSuccess(''), 2500);
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700"
                  >
                    <Copy className="w-4 h-4 text-emerald-400" />
                    <span>Salin Templat Pesan</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: RATINGS & CSAT */}
        {activeTab === 'ratings' && (
          <div className="space-y-5 animate-slide-up">
            <div className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hub Ulasan & CSAT Rating Pelanggan ({csatRatings.length})
              </h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                Kumpulkan skor bintang (1-5) dan ulasan dari pelanggan yang telah menerima pesanan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {csatRatings.map((r) => (
                <div key={r.id} className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold">{r.nama_pelanggan} ({r.nama_tim})</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.tanggal}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: r.bintang }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{r.ulasan}"</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      r.status_publikasi ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {r.status_publikasi ? '● TAYANG DI LANDING PAGE' : '○ TIDAK DITAMPILKAN'}
                    </span>

                    <button
                      type="button"
                      onClick={async () => {
                        const updated = csatRatings.map(item => item.id === r.id ? { ...item, status_publikasi: !item.status_publikasi } : item);
                        setCSATRatings(updated);
                        await saveCMSCSATRatings(updated);
                        
                        if (!r.status_publikasi) {
                          const newTesti: CMSTestimonialItem = {
                            id: 'testi-csat-' + r.id,
                            clientName: r.nama_pelanggan,
                            teamOrOrg: r.nama_tim,
                            location: 'Ende, NTT',
                            quote: r.ulasan,
                            rating: r.bintang,
                            verifiedOrder: true,
                          };
                          const updatedTestis = [...testimonials, newTesti];
                          setTestimonials(updatedTestis);
                          await saveCMSTestimonials(updatedTestis);
                        }

                        setActionSuccess(`Status tayang ulasan "${r.nama_pelanggan}" diperbarui!`);
                        setTimeout(() => setActionSuccess(''), 2500);
                      }}
                      className="text-xs font-extrabold text-brand-400 hover:underline"
                    >
                      {r.status_publikasi ? 'Sembunyikan' : 'Publikasikan ke Website'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: KNOWLEDGE BASE */}
        {activeTab === 'kb' && (
          <div className="space-y-5 animate-slide-up">
            
            {/* Premium Knowledge Base Section Header Card */}
            <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/30 border-slate-800/90 shadow-xl'
                : 'bg-gradient-to-r from-white via-slate-50 to-indigo-50/50 border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Log Pertanyaan Belum Terjawab ({unanswered.length})
                </h3>
                <p className={`text-xs sm:text-sm font-medium max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Daftar pertanyaan riil pengguna dari chatbot Riza Apparel yang belum ada dalam basis pengetahuan untuk bahan update otomatis sistem.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {unanswered.map((u) => (
                <div key={u.id} className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                }`}>
                  <span className="font-semibold">"{u.pertanyaan}"</span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    Frekuensi: {u.frekuensi}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>

      {/* MODAL EDIT PRODUK */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <Package className="w-5 h-5 text-heritage-zawo" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold">Form Edit Produk Katalog</h3>
                  <p className="text-[11px] text-slate-400">Atur skema dual harga, estimasi kerja, & detail produk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className={`p-2 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="product-form" onSubmit={handleSaveProductForm} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              
              {/* STATUS KATALOG AKTIF / NONAKTIF SWITCH */}
              <div
                onClick={() => setEditingProduct({ ...editingProduct, isActive: editingProduct.isActive === false ? true : false })}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  editingProduct.isActive !== false
                    ? (isDark ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold')
                    : (isDark ? 'bg-slate-950/80 border-rose-500/40 text-slate-300' : 'bg-rose-50 border-rose-200 text-rose-950 font-bold')
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${editingProduct.isActive !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span>{editingProduct.isActive !== false ? 'Status Katalog: AKTIF (Tampil di Website)' : 'Status Katalog: NONAKTIF (Disembunyikan)'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 block font-normal">
                    {editingProduct.isActive !== false
                      ? 'Produk ini aktif dan tayang di katalog utama landing page pengunjung.'
                      : 'Produk disembunyikan tanpa dihapus. Klik untuk mengaktifkan kembali kapan saja.'}
                  </span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                  editingProduct.isActive !== false
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                }`}>
                  {editingProduct.isActive !== false ? 'Aktif' : 'Nonaktif'}
                </div>
              </div>

              {/* Nama & Kategori Produk */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold block mb-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-brand-600'
                    }`}
                    placeholder="Contoh: Jersey Pro Sepak Bola & Futsal"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Kategori Produk</label>
                  <CustomSelect
                    options={CATEGORY_OPTIONS}
                    value={editingProduct.category}
                    onChange={(val) => setEditingProduct({ ...editingProduct, category: val as any })}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* DUAL PRICING CONFIGURATION (SKEMA 2 DATA HARGA) */}
              <div className={`p-3.5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <span className="text-xs font-extrabold text-heritage-zawo flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Konfigurasi Dual Price (Dua Skema Harga)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Satuan & Grosir/Tim</span>
                </div>

                {/* SKEMA 1: HARGA UTAMA / SATUAN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className={`font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Harga 1 (Rp Utama)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.startingPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, startingPrice: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border font-bold outline-none transition-all ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-white border-slate-300 text-slate-900 focus:border-brand-600'
                      }`}
                      placeholder="90000"
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Satuan Harga 1</label>
                    <CustomSelect
                      options={PRICE_UNIT_OPTIONS}
                      value={editingProduct.priceUnit || 'pcs'}
                      onChange={(val) => setEditingProduct({ ...editingProduct, priceUnit: val })}
                      isDark={isDark}
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Opsi / Min. Order</label>
                    <input
                      type="text"
                      value={editingProduct.minOrderBadge || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, minOrderBadge: e.target.value })}
                      placeholder="Bisa Satuan (1 Pcs)"
                      className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-white border-slate-300 text-slate-900 focus:border-brand-600'
                      }`}
                    />
                  </div>
                </div>

                {/* SKEMA 2: HARGA KE-2 / GROSIR (OPSIONAL) */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div>
                    <label className="font-bold block mb-1 text-emerald-500">Harga 2 (Rp Grosir) <span className="text-[10px] font-normal text-slate-400">(Opsional)</span></label>
                    <input
                      type="number"
                      value={editingProduct.secondaryPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, secondaryPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className={`w-full p-2.5 rounded-xl border font-bold outline-none transition-all ${
                        isDark ? 'bg-slate-950 border-slate-800 text-emerald-300 focus:border-emerald-500' : 'bg-white border-slate-300 text-emerald-700 focus:border-emerald-600'
                      }`}
                      placeholder="85000"
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Satuan Harga 2</label>
                    <CustomSelect
                      options={PRICE_UNIT_OPTIONS}
                      value={editingProduct.secondaryPriceUnit || 'pcs'}
                      onChange={(val) => setEditingProduct({ ...editingProduct, secondaryPriceUnit: val })}
                      isDark={isDark}
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Label Keterangan Harga 2</label>
                    <input
                      type="text"
                      value={editingProduct.secondaryPriceLabel || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, secondaryPriceLabel: e.target.value })}
                      placeholder="Grosir Tim ≥ 12 Pcs"
                      className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-white border-slate-300 text-slate-900 focus:border-brand-600'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Estimasi Kerja, Badge Promo & Spesifikasi Bahan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold block mb-1 text-emerald-500">Estimasi Kerja (Hari)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.leadTimeDays || 5}
                    onChange={(e) => setEditingProduct({ ...editingProduct, leadTimeDays: Number(e.target.value) })}
                    placeholder="5"
                    className={`w-full p-2.5 rounded-xl border font-extrabold outline-none transition-all ${
                      isDark ? 'bg-slate-950 border-slate-800 text-emerald-300 focus:border-emerald-500' : 'bg-white border-slate-300 text-emerald-700 focus:border-emerald-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Badge Promo</label>
                  <input
                    type="text"
                    value={editingProduct.promoBadge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, promoBadge: e.target.value })}
                    placeholder="Beli 2 Bonus 1"
                    className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-white border-slate-300 text-slate-900 focus:border-brand-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Spesifikasi Bahan</label>
                  <input
                    type="text"
                    value={editingProduct.fabricSpecs || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabricSpecs: e.target.value })}
                    placeholder="Dry-Fit Milano 160gsm"
                    className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-white border-slate-300 text-slate-900 focus:border-brand-600'
                    }`}
                  />
                </div>
              </div>

              {/* Foto Produk */}
              <div>
                <label className="font-bold block mb-1">Foto Produk (WebP Kompresi Otomatis)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="product-image-upload"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className={`w-full p-3 rounded-2xl border border-dashed flex items-center justify-between cursor-pointer transition-all ${
                      isDark
                        ? 'bg-slate-950/70 border-slate-800 hover:border-brand-500 text-slate-300'
                        : 'bg-slate-50 border-slate-300 hover:border-brand-600 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs truncate">
                        {editingProduct.imageUrl ? 'Ganti Foto Produk (WebP Auto-Compress)' : 'Pilih / Unggah Foto Produk...'}
                      </span>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-[11px] shrink-0 shadow-xs transition-all">
                      Pilih File
                    </span>
                  </label>
                  {editingProduct.imageUrl && (
                    <div className="mt-2.5 relative rounded-xl overflow-hidden max-h-36 border border-slate-800 flex items-center justify-center bg-slate-950">
                      <img src={editingProduct.imageUrl} alt="Preview Produk" className="h-32 object-contain" />
                      <span className="absolute bottom-1.5 right-1.5 bg-slate-950/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-800 shadow-xs flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>WebP Compressed Ready</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deskripsi Ringkas */}
              <div>
                <label className="font-bold block mb-1">Deskripsi Ringkas Produk</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Performa aerodinamis dengan aksen tenun ikat Ende Diamond Zawo..."
                  className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-white border-slate-300 text-slate-900 focus:border-brand-600'
                  }`}
                />
              </div>

              {/* Fitur & Detail Selengkapnya */}
              <div>
                <label className="font-bold block mb-1 text-heritage-zawo flex items-center justify-between">
                  <span>Rincian Poin 'Selengkapnya' (Accordion Website)</span>
                  <span className="text-[10px] text-slate-400 font-normal">1 baris per poin fitur</span>
                </label>
                <textarea
                  rows={4}
                  value={(editingProduct.features || []).join('\n')}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    features: e.target.value.split('\n').filter(line => line.trim() !== '')
                  })}
                  placeholder={`Bahan Dry-Fit Milano 160gsm (Sirkulasi Udara)\nMotif Tenun Sublimasi Full Print Anti-Luntur\nTermasuk Custom Nama, Nomor & Logo Tim\nJahitan Rantai Standar Jersey Liga Profesional`}
                  className={`w-full p-2.5 rounded-xl border font-mono text-[11px] leading-relaxed outline-none transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-brand-600'
                  }`}
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between gap-2.5 shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              {products.some(p => p.id === editingProduct.id) ? (
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(editingProduct.id)}
                  className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Produk</span>
                </button>
              ) : <div />}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all text-xs ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="product-form"
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-600 via-rose-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white rounded-xl font-extrabold shadow-lg transition-all text-xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Produk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT MOTIF TENUN (FR-C2, ATRIBUSI R7) */}
      {isMotifModalOpen && editingMotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-heritage-zawo/10 text-heritage-zawo border border-heritage-zawo/20">
                  <Grid className="w-5 h-5 text-heritage-zawo" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold">Form Edit Motif Tenun</h3>
                  <p className="text-[11px] text-slate-400">Atribusi sumber kultural wajib diisi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMotifModalOpen(false)}
                className={`p-2 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form id="motif-form" onSubmit={handleSaveMotifForm} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Nama Motif</label>
                <input
                  type="text"
                  required
                  value={editingMotif.nama_motif}
                  onChange={(e) => setEditingMotif({ ...editingMotif, nama_motif: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-brand-600'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-heritage-zawo">Atribusi Sumber Kultural (Wajib)</label>
                <input
                  type="text"
                  required
                  value={editingMotif.atribusi_sumber}
                  onChange={(e) => setEditingMotif({ ...editingMotif, atribusi_sumber: e.target.value })}
                  placeholder="Contoh: Motif Tenun Ikat Ende Zawo — Koleksi Resmi Riza Apparel Ende 2026"
                  className={`w-full p-2.5 rounded-xl border outline-none transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800 text-brand-300 focus:border-brand-500' : 'bg-slate-50 border-slate-300 text-brand-700 focus:border-brand-600'
                  }`}
                />
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 border-t flex items-center justify-between shrink-0 border-slate-800 bg-slate-900/60">
              {motifs.some(m => m.id === editingMotif.id) ? (
                <button
                  type="button"
                  onClick={() => editingMotif.id && handleDeleteMotif(editingMotif.id)}
                  className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Motif</span>
                </button>
              ) : <div />}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMotifModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all text-xs ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="motif-form"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-extrabold shadow-lg transition-all text-xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Motif</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PORTFOLIO */}
      {isPortfolioModalOpen && editingPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-sm sm:text-base font-extrabold">Form Edit Portfolio Hasil Jadi</h3>
              <button type="button" onClick={() => setIsPortfolioModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const updated = portfolioItems.some(item => item.id === editingPortfolio.id)
                ? portfolioItems.map(item => item.id === editingPortfolio.id ? editingPortfolio : item)
                : [...portfolioItems, editingPortfolio];
              setPortfolioItems(updated);
              await saveCMSPortfolio(updated);
              setIsPortfolioModalOpen(false);
              setActionSuccess('Item portfolio berhasil disimpan!');
              setTimeout(() => setActionSuccess(''), 2500);
            }} className="p-4 sm:p-6 space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="font-bold block mb-1">Judul Project / Jersey</label>
                <input type="text" required value={editingPortfolio.title} onChange={e => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Klien & Lokasi</label>
                <input type="text" required value={editingPortfolio.clientName} onChange={e => setEditingPortfolio({ ...editingPortfolio, clientName: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">URL Foto Hasil Jadi</label>
                <input type="text" required value={editingPortfolio.imageUrl} onChange={e => setEditingPortfolio({ ...editingPortfolio, imageUrl: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi Pengerjaan</label>
                <textarea rows={2} value={editingPortfolio.description} onChange={e => setEditingPortfolio({ ...editingPortfolio, description: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-800/60 mt-2">
                {portfolioItems.some(item => item.id === editingPortfolio.id) ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(editingPortfolio.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Item</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsPortfolioModalOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 font-bold text-white rounded-xl">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT TESTIMONIAL */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-sm sm:text-base font-extrabold">Form Edit Testimoni & Review</h3>
              <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const updated = testimonials.some(t => t.id === editingTestimonial.id)
                ? testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t)
                : [...testimonials, editingTestimonial];
              setTestimonials(updated);
              await saveCMSTestimonials(updated);
              setIsTestimonialModalOpen(false);
              setActionSuccess('Testimoni berhasil disimpan!');
              setTimeout(() => setActionSuccess(''), 2500);
            }} className="p-4 sm:p-6 space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="font-bold block mb-1">Nama Pelanggan / Kapten Tim</label>
                <input type="text" required value={editingTestimonial.clientName} onChange={e => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Tim / Komunitas</label>
                <input type="text" required value={editingTestimonial.teamOrOrg} onChange={e => setEditingTestimonial({ ...editingTestimonial, teamOrOrg: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Ulasan / Kesan (Quote)</label>
                <textarea rows={3} required value={editingTestimonial.quote} onChange={e => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-800/60 mt-2">
                {testimonials.some(t => t.id === editingTestimonial.id) ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(editingTestimonial.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Testimoni</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 font-bold text-white rounded-xl">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL EDIT PROMO */}
      {isPromoModalOpen && editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-sm sm:text-base font-extrabold">Form Edit Paket & Promo</h3>
              <button type="button" onClick={() => setIsPromoModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const updated = promos.some(p => p.id === editingPromo.id)
                ? promos.map(p => p.id === editingPromo.id ? editingPromo : p)
                : [...promos, editingPromo];
              setPromos(updated);
              await saveCMSPromos(updated);
              setIsPromoModalOpen(false);
              setActionSuccess('Paket promo berhasil disimpan!');
              setTimeout(() => setActionSuccess(''), 2500);
            }} className="p-4 sm:p-6 space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="font-bold block mb-1">Judul Promo</label>
                <input type="text" required value={editingPromo.title} onChange={e => setEditingPromo({ ...editingPromo, title: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Badge Tag Promo</label>
                <input type="text" required value={editingPromo.badge} onChange={e => setEditingPromo({ ...editingPromo, badge: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Kode Promo (Opsional)</label>
                <input type="text" value={editingPromo.code || ''} onChange={e => setEditingPromo({ ...editingPromo, code: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi Promo</label>
                <textarea rows={3} required value={editingPromo.description} onChange={e => setEditingPromo({ ...editingPromo, description: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-800/60 mt-2">
                {promos.some(p => p.id === editingPromo.id) ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePromo(editingPromo.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Promo</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsPromoModalOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 font-bold text-white rounded-xl">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT FAQ */}
      {isFAQModalOpen && editingFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-sm sm:text-base font-extrabold">Form Edit Pertanyaan FAQ</h3>
              <button type="button" onClick={() => setIsFAQModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const updated = faqItems.some(f => f.id === editingFAQ.id)
                ? faqItems.map(f => f.id === editingFAQ.id ? editingFAQ : f)
                : [...faqItems, editingFAQ];
              setFAQItems(updated);
              await saveCMSFAQ(updated);
              setIsFAQModalOpen(false);
              setActionSuccess('Pertanyaan FAQ berhasil disimpan!');
              setTimeout(() => setActionSuccess(''), 2500);
            }} className="p-4 sm:p-6 space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="font-bold block mb-1">Pertanyaan</label>
                <input type="text" required value={editingFAQ.question} onChange={e => setEditingFAQ({ ...editingFAQ, question: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Jawaban Lengkap</label>
                <textarea rows={4} required value={editingFAQ.answer} onChange={e => setEditingFAQ({ ...editingFAQ, answer: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-800/60 mt-2">
                {faqItems.some(f => f.id === editingFAQ.id) ? (
                  <button
                    type="button"
                    onClick={async () => {
                      askConfirmation(
                        'Hapus Pertanyaan FAQ?',
                        'Apakah Anda yakin ingin menghapus pertanyaan FAQ ini?',
                        async () => {
                          const updated = faqItems.filter(f => f.id !== editingFAQ.id);
                          setFAQItems(updated);
                          await saveCMSFAQ(updated);
                          setIsFAQModalOpen(false);
                          setActionSuccess('Pertanyaan FAQ berhasil dihapus!');
                          setTimeout(() => setActionSuccess(''), 2500);
                        },
                        { confirmText: 'Hapus FAQ', variant: 'danger' }
                      );
                    }}
                    className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus FAQ</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsFAQModalOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 font-bold text-white rounded-xl">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT PARTNER */}
      {isPartnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-sm sm:text-base font-extrabold">Form Edit Logo Mitra / Klien</h3>
              <button type="button" onClick={() => setIsPartnerModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const updated = partners.some(p => p.id === editingPartner.id)
                ? partners.map(p => p.id === editingPartner.id ? editingPartner : p)
                : [...partners, editingPartner];
              setPartners(updated);
              await saveCMSPartners(updated);
              setIsPartnerModalOpen(false);
              setActionSuccess('Logo mitra berhasil disimpan!');
              setTimeout(() => setActionSuccess(''), 2500);
            }} className="p-4 sm:p-6 space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="font-bold block mb-1">Nama Mitra / Organisasi</label>
                <input type="text" required value={editingPartner.name} onChange={e => setEditingPartner({ ...editingPartner, name: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Peran / Kategori Mitra</label>
                <input type="text" required value={editingPartner.role} onChange={e => setEditingPartner({ ...editingPartner, role: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Jenis Tampilan</label>
                <CustomSelect
                  options={[
                    { value: 'badge', label: 'Teks Badge Komunitas' },
                    { value: 'svg', label: 'Logo Vektor SVG / Image' },
                  ]}
                  value={editingPartner.type}
                  onChange={(val) => setEditingPartner({ ...editingPartner, type: val as any })}
                  isDark={isDark}
                />
              </div>
              {editingPartner.type === 'badge' ? (
                <div>
                  <label className="font-bold block mb-1">Teks Badge</label>
                  <input type="text" value={editingPartner.customText || ''} onChange={e => setEditingPartner({ ...editingPartner, customText: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-bold block mb-1">URL Logo Dark Mode</label>
                    <input type="text" value={editingPartner.logoDark || ''} onChange={e => setEditingPartner({ ...editingPartner, logoDark: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">URL Logo Light Mode</label>
                    <input type="text" value={editingPartner.logoLight || ''} onChange={e => setEditingPartner({ ...editingPartner, logoLight: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
                  </div>
                </>
              )}
              <div className="pt-3 flex items-center justify-between border-t border-slate-800/60 mt-2">
                {partners.some(p => p.id === editingPartner.id) ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(editingPartner.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Mitra</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsPartnerModalOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 font-bold text-white rounded-xl">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT WORKFLOW STEP */}
      {isWorkflowModalOpen && editingWorkflowStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-sm sm:text-base font-extrabold">Form Edit Alur Produksi</h3>
              <button type="button" onClick={() => setIsWorkflowModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const updated = workflowSteps.map(step => step.id === editingWorkflowStep.id ? editingWorkflowStep : step);
              setWorkflowSteps(updated);
              await saveCMSWorkflow(updated);
              setIsWorkflowModalOpen(false);
              setActionSuccess('Tahapan alur produksi berhasil disimpan!');
              setTimeout(() => setActionSuccess(''), 2500);
            }} className="p-4 sm:p-6 space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="font-bold block mb-1">Nomor Tahap (01, 02, ...)</label>
                <input type="text" required value={editingWorkflowStep.stepNumber} onChange={e => setEditingWorkflowStep({ ...editingWorkflowStep, stepNumber: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Judul Tahapan</label>
                <input type="text" required value={editingWorkflowStep.title} onChange={e => setEditingWorkflowStep({ ...editingWorkflowStep, title: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi Tahapan</label>
                <textarea rows={3} required value={editingWorkflowStep.description} onChange={e => setEditingWorkflowStep({ ...editingWorkflowStep, description: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-800/60 mt-2">
                {workflowSteps.some(s => s.id === editingWorkflowStep.id) ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteWorkflowStep(editingWorkflowStep.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Tahapan</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsWorkflowModalOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 font-bold text-white rounded-xl">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT HERO SLIDE */}
      {isHeroSlideModalOpen && editingHeroSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-sm sm:text-base font-extrabold">Form Edit Slide Carousel Hero</h3>
              <button type="button" onClick={() => setIsHeroSlideModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (heroConfig) {
                const currentSlides = heroConfig.slides || [];
                const idx = currentSlides.findIndex(s => s.id === editingHeroSlide.id);
                let updated: CMSHeroSlide[];
                if (idx >= 0) {
                  updated = [...currentSlides];
                  updated[idx] = editingHeroSlide;
                } else {
                  updated = [...currentSlides, editingHeroSlide];
                }
                setHeroConfig({ ...heroConfig, slides: updated });
              }
              setIsHeroSlideModalOpen(false);
            }} className="p-4 sm:p-6 space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="font-bold block mb-1">Judul Slide Jersey</label>
                <input type="text" required value={editingHeroSlide.title} onChange={e => setEditingHeroSlide({ ...editingHeroSlide, title: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} placeholder="Gesa Wazo Custom Edition" />
              </div>
              <div>
                <label className="font-bold block mb-1">Subtitle / Keterangan Kain</label>
                <input type="text" value={editingHeroSlide.subtitle || ''} onChange={e => setEditingHeroSlide({ ...editingHeroSlide, subtitle: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} placeholder="Dark Burgundy • Signature Motif Tenun Zawo Autentik" />
              </div>
              <div>
                <label className="font-bold block mb-1">Harga Display (Opsional)</label>
                <input type="text" value={editingHeroSlide.price || ''} onChange={e => setEditingHeroSlide({ ...editingHeroSlide, price: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} placeholder="Rp 95.000 / pcs" />
              </div>
              <div>
                <label className="font-bold block mb-1">URL Foto Slide Gambar</label>
                <input type="text" required value={editingHeroSlide.src} onChange={e => setEditingHeroSlide({ ...editingHeroSlide, src: e.target.value })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`} placeholder="/hero/gesa-wazo-jersey.jpg atau https://..." />
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-800/60 mt-2">
                {heroConfig?.slides && heroConfig.slides.some(s => s.id === editingHeroSlide.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      askConfirmation(
                        'Hapus Slide Hero?',
                        'Apakah Anda yakin ingin menghapus slide carousel hero ini?',
                        () => {
                          if (heroConfig) {
                            const updated = (heroConfig.slides || []).filter(s => s.id !== editingHeroSlide.id);
                            setHeroConfig({ ...heroConfig, slides: updated });
                          }
                          setIsHeroSlideModalOpen(false);
                        },
                        { confirmText: 'Hapus Slide', variant: 'danger' }
                      );
                    }}
                    className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Slide</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsHeroSlideModalOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 font-bold text-white rounded-xl">Simpan Slide</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODERN GLASSMORPHIC CONFIRMATION DIALOG MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-sm sm:max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-7 text-center space-y-5 animate-scale-up relative ${
              isDark
                ? 'bg-[#0E1322] border-slate-800/90 text-white shadow-2xl shadow-rose-950/20'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            {/* Ambient Top Highlight Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
              confirmModal.variant === 'warning'
                ? 'from-amber-500 via-amber-400 to-amber-600'
                : confirmModal.variant === 'info'
                ? 'from-brand-600 via-rose-500 to-amber-500'
                : 'from-rose-600 via-red-500 to-rose-700'
            }`} />

            {/* Top Center Icon Badge */}
            <div className="flex justify-center pt-2">
              <div
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 ${
                  confirmModal.variant === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/10'
                    : confirmModal.variant === 'info'
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-400 shadow-brand-500/10'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/10'
                }`}
              >
                {confirmModal.variant === 'warning' ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : confirmModal.variant === 'info' ? (
                  <HelpCircle className="w-7 h-7" />
                ) : (
                  <Trash2 className="w-7 h-7" />
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                {confirmModal.title}
              </h3>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed px-2 ${
                isDark ? 'text-slate-300/90' : 'text-slate-600'
              }`}>
                {confirmModal.message}
              </p>
            </div>

            {/* Equal-Width Symmetrical Action Buttons */}
            <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold transition-all text-xs border flex items-center justify-center cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 border-slate-700/80 hover:border-slate-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {confirmModal.cancelText || 'Batal'}
              </button>

              <button
                type="button"
                onClick={async () => {
                  const cb = confirmModal.onConfirm;
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  if (cb) {
                    await cb();
                  }
                }}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-black transition-all text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  confirmModal.variant === 'warning'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/25 active:scale-98'
                    : confirmModal.variant === 'info'
                    ? 'bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white shadow-brand-600/25 active:scale-98'
                    : 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30 active:scale-98'
                }`}
              >
                {confirmModal.variant === 'warning' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : confirmModal.variant === 'info' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{confirmModal.confirmText || 'Ya, Lanjutkan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
