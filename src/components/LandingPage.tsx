import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Zap, 
  Layers, 
  MessageCircle,
  Sun,
  Moon,
  Target,
  Compass,
  Award,
  Truck,
  Printer,
  FileCheck,
  Scissors,
  HelpCircle,
  ChevronDown,
  PenTool,
  Menu,
  X
} from 'lucide-react';
import { DesignStudio } from './DesignStudio';
import { AIAssistantWidget } from './AIAssistantWidget';
import { CatalogItem, Testimonial } from '../types';

const CATALOG_DATA: CatalogItem[] = [
  {
    id: '1',
    name: 'Jersey Pro Sepak Bola & Futsal',
    category: 'team',
    startingPrice: 90000,
    promoBadge: 'Beli 2 Bonus 1',
    description: 'Performa aerodinamis dengan aksen tenun ikat Ende Diamond Zawo dan cetak sublimasi 1440 DPI.',
    features: [
      'Bahan Dry-Fit Milano 160gsm (Sirkulasi Udara)',
      'Motif Tenun Sublimasi Full Print Anti-Luntur',
      'Termasuk Custom Nama, Nomor & Logo Tim',
      'Jahitan Rantai Standar Jersey Liga Profesional'
    ],
    fabricSpecs: 'Dry-Fit Milano 160gsm',
    leadTimeDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Jersey Tim Voli & Basket',
    category: 'team',
    startingPrice: 95000,
    promoBadge: 'Promo Spesial Tim',
    description: 'Ringan dan elastisitas tinggi untuk lompatan & kelincahan maksimal dengan tekstur adem.',
    features: [
      'Pola Sleeveless/Singlet atau Lengan Pendek',
      'Aksen Motif Flores Ocean Waves Gradasi Dinamis',
      'Tekstur Kain Lembut Tidak Memicu Iritasi',
      'Dry-Fit Serena Soft Flex Anti-Bakteri'
    ],
    fabricSpecs: 'Dry-Fit Serena Soft Flex',
    leadTimeDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Jersey Komunitas Lari & Sepeda',
    category: 'community',
    startingPrice: 100000,
    promoBadge: 'Best Seller',
    description: 'Proteksi sinar UV dengan ketahanan gesek dan bobot ultra ringan untuk olahraga maraton.',
    features: [
      'UPF 30+ Proteksi Matahari di Cuaca Flores',
      'Reflective Strip Aksen Punggung untuk Lari Malam',
      'Template Gradasi Tiga Warna Danau Kelimutu',
      'Bisa Pesan Satuan (1 Pcs)'
    ],
    fabricSpecs: 'Dry-Fit Waffle Anti-UV',
    leadTimeDays: 6,
    imageUrl: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Jersey Gaming Esports',
    category: 'community',
    startingPrice: 95000,
    promoBadge: 'Gaming Series',
    description: 'Desain modern tajam dengan identitas klan, warna cetak resolusi tinggi 1440 DPI, dan kerah V-Neck.',
    features: [
      'Pilihan Kerah V-Neck Pro Atletik Kekinian',
      'Kompatibel Mockup Nickname & Logo Sponsor',
      'Warna Cetak Tajam Sublimasi High Definition',
      'Bisa Pesan Satuan (1 Pcs)'
    ],
    fabricSpecs: 'Dry-Fit Milano Premium Gloss',
    leadTimeDays: 4,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Polo Shirt Sublimasi Tenun',
    category: 'casual',
    startingPrice: 115000,
    promoBadge: 'Premium Casual',
    description: 'Format tas kasual dengan kerah bergaris & motif tenun di dada/lengan untuk tampilan elegan.',
    features: [
      'Kerah Rajut Polo Premium Kancing Eksklusif',
      'Motif Tenun Zawo di Kerah & Ujung Lengan',
      'Cocok untuk Seragam Panitia, Kantor & Traveling',
      'Bisa Pesan Satuan (1 Pcs)'
    ],
    fabricSpecs: 'Lacoste Dry-Fit CVC Sublim',
    leadTimeDays: 7,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    name: 'Jaket Windbreaker Sport',
    category: 'casual',
    startingPrice: 145000,
    promoBadge: 'Outerwear Series',
    description: 'Outerwear tahan angin dengan furing jaring sirkulasi optimal dan motif tenun di lengan/hoodie.',
    features: [
      'Tahan Angin (Windproof) & Percikan Air Ringan',
      'Full Sublimasi Motif Tenun di Lengan & Hoodie',
      'Resleting YKK Lancar & Tahan Lama',
      'Minimal Pemesanan 6 Pcs'
    ],
    fabricSpecs: 'Taslan Milky / Despo Windproof',
    leadTimeDays: 10,
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
  },
];

interface PartnerItem {
  id: string;
  name: string;
  role: string;
  type: 'svg' | 'img' | 'badge';
  logoDark?: string;
  logoLight?: string;
  logo?: string;
  customText?: string;
  rotation: string;
  offsetY: string;
}

const PARTNERS_DATA: PartnerItem[] = [
  {
    id: '1',
    name: 'REGARSPORT',
    role: 'Mitra Utama Ekosistem Apparel',
    type: 'svg',
    logoDark: '/logos/logo-regarsport-dark.svg',
    logoLight: '/logos/logo-regarsport-light.svg',
    rotation: '-rotate-1',
    offsetY: 'translate-y-1',
  },
  {
    id: '2',
    name: 'REGARMARKET',
    role: 'Jaringan Distribusi Reseller',
    type: 'svg',
    logoDark: '/logos/logo-regar-market-dark.svg',
    logoLight: '/logos/logo-regar-market-light.svg',
    rotation: 'rotate-1',
    offsetY: '-translate-y-1',
  },
  {
    id: '3',
    name: 'GESA WAZO ENDE',
    role: 'Mitra Komunitas Kebudayaan Flores',
    type: 'badge',
    customText: 'GESA WAZO ENDE',
    rotation: '-rotate-1.5',
    offsetY: 'translate-y-2',
  },
  {
    id: '4',
    name: 'ENDE UNITED FC',
    role: 'Klub Futsal & Sepak Bola Regional',
    type: 'badge',
    customText: 'ENDE UNITED FC',
    rotation: 'rotate-1',
    offsetY: '-translate-y-1.5',
  },
  {
    id: '5',
    name: 'NUSA BUNGA RUNNERS',
    role: 'Komunitas Lari & Athletics NTT',
    type: 'badge',
    customText: 'NUSA BUNGA RUNNERS',
    rotation: '-rotate-1',
    offsetY: 'translate-y-1',
  },
  {
    id: '6',
    name: 'FLORES YOUTH VOLLEY',
    role: 'Akademi Olahraga Voli NTT',
    type: 'badge',
    customText: 'FLORES YOUTH VOLLEY',
    rotation: 'rotate-1.5',
    offsetY: '-translate-y-2',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Karel Wua',
    role: 'Kapten Tim Futsal',
    organization: 'Ende United FC',
    quote: 'Hasil cetak sublimasi Riza Apparel sangat tajam! Motif Zawo khas Ende bikin tim kami tampil percaya diri dan beda di turnamen regional.',
    rating: 5,
    verifiedProduct: 'Heritage Series Ende Zawo',
  },
  {
    id: '2',
    name: 'Siti Rahmawati',
    role: 'Koordinator Event',
    organization: 'Komunitas Lari Nusa Bunga',
    quote: 'Promo Beli 2 Bonus 1 betul-betul memotong anggaran event kami! Bahannya adem banget dipakai lari jarak jauh di cuaca Ende.',
    rating: 5,
    verifiedProduct: 'Community Athletic Apparel',
  },
  {
    id: '3',
    name: 'Emanuel Nono',
    role: 'Ketua Pembina',
    organization: 'Voli Flores Youth',
    quote: 'Studio Desain 2D & 3D di websitenya sangat bantu kami membayangkan jersey dari segala angle. Kirim draf via WA langsung diproses ramah!',
    rating: 5,
    verifiedProduct: 'Pro Performance Team Jersey',
  },
];

const FAQ_DATA = [
  {
    id: '1',
    question: 'Berapa minimal jumlah pemesanan (minimal order) di Riza Apparel?',
    answer: 'Tidak ada minimum order! Di RIZA APPAREL, Anda bisa memesan Satuan (1 Pcs) maupun untuk seragam seluruh tim/kontingen dengan standar kualitas sublimasi presisi yang sama tingginya.'
  },
  {
    id: '2',
    question: 'Berapa lama estimasi waktu pengerjaan jersey custom?',
    answer: 'Estimasi produksi presisi kami berkisar antara 3 hingga 5 hari kerja (tergantung antrean slot dan jumlah pcs), disertai garansi kepatuhan waktu dan kustomisasi sesuai kesepakatan.'
  },
  {
    id: '3',
    question: 'Bagaimana cara klaim Promo Beli 2 Bonus 1 Pcs & Gratis Ongkir NTT?',
    answer: 'Promo Beli 2 Bonus 1 Pcs dan Gratis Ongkir area Ende & NTT otomatis berlaku untuk setiap pemesanan kelipatan 2 pcs. Anda cukup memilih varian jersey yang diinginkan di Studio 2D atau via WhatsApp.'
  },
  {
    id: '4',
    question: 'Apakah tim Riza Apparel bisa membantu membuatkan desain jika belum memiliki file vektor?',
    answer: 'Tentu saja! Kami memberikan layanan 100% Bebas Biaya Desain & Revisi. Tim desainer kami akan memvektorisasi ide, sketsa, logo, maupun motif tenun ikat Ende Zawo Anda hingga siap cetak.'
  },
  {
    id: '5',
    question: 'Apakah harga di katalog sudah termasuk cetak nama, nomor punggung, & logo sponsor?',
    answer: 'Ya! Harga transparan kami (Mulai Rp90.000 / pcs) sudah mencakup pencetakan sublimasi full print anti-luntur, custom nama pemain, nomor punggung, serta logo sponsor tanpa biaya tersembunyi.'
  }
];

const HERO_GALLERY_IMAGES = [
  {
    id: '1',
    src: '/hero/gesa-wazo-jersey.jpg',
    title: 'Gesa Wazo Custom Edition',
    subtitle: 'Dark Burgundy • Signature Motif Tenun Zawo Autentik',
    price: 'Rp 95.000 / pcs'
  },
  {
    id: '2',
    src: '/hero/heritage-light-green.jpg',
    title: 'Sage Ocean Zawo Edition',
    subtitle: 'Dry-Fit Milano 160gsm • Sublimasi High-Def 1440 DPI',
    price: 'Rp 90.000 / pcs'
  },
  {
    id: '3',
    src: '/hero/heritage-dark-green.jpg',
    title: 'Emerald Forest Zawo Edition',
    subtitle: 'V-Neck Pro Athletic • Kerah Rajut Premium',
    price: 'Rp 90.000 / pcs'
  },
];


export const LandingPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'team' | 'community' | 'casual'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('1');
  const [expandedCatalogIds, setExpandedCatalogIds] = useState<Record<string, boolean>>({});
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'studio'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#studio') {
      return 'studio';
    }
    return 'home';
  });
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('riza_apparel_theme_mode');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('riza_apparel_theme_mode', themeMode);
    } catch (e) {}
  }, [themeMode]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [partnerSlideIdx, setPartnerSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % HERO_GALLERY_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPartnerSlideIdx((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);


  const filteredCatalog = activeCategory === 'all' 
    ? CATALOG_DATA 
    : CATALOG_DATA.filter((item) => item.category === activeCategory);

  const goToStudioPage = () => {
    setIsMobileMenuOpen(false);
    setCurrentPage('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHomePage = () => {
    setIsMobileMenuOpen(false);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = hash;
        }
      }, 80);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage !== 'home') {
      goToHomePage();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDesignButtonClick = () => {
    if (currentPage !== 'studio') {
      goToStudioPage();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const toggleCatalogExpand = (id: string) => {
    setExpandedCatalogIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isDark = themeMode === 'dark';

  const renderHeader = () => (
    <>
      {/* ANNOUNCEMENT TOP BAR */}
      <div className="bg-gradient-to-r from-brand-700 via-rose-600 to-amber-600 text-white text-[11px] font-extrabold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
        <span>PROMO SPESIAL ENDE & NTT: Beli 2 Bonus 1 Pcs Jersey • Gratis Ongkir Area NTT • 100% Bebas Biaya Desain</span>
        <button onClick={handleDesignButtonClick} className="underline hover:text-amber-200 ml-2 hidden sm:inline">Klaim Sekarang →</button>
      </div>

      {/* SECTION 1: STICKY TRANSPARENT NAVIGATION BAR */}
      <header className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-md border-b ${isDark ? 'bg-[#0B0F19]/90 border-white/10 text-white' : 'bg-white/90 border-gray-900/10 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo Only */}
          <a href="#" onClick={handleLogoClick} className="flex items-center group">
            <img 
              src={isDark ? "/logos/logo-riza-apparel-dark.svg" : "/logos/logo-riza-apparel-light.svg"} 
              alt="RIZA APPAREL Logo" 
              className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* Nav Links (REWRITTEN REPRESENTATIVE NAMES) - DESKTOP ONLY (hidden lg:flex) */}
          <nav className={`hidden lg:flex items-center gap-8 text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
            <a href="#tentang-kami" onClick={(e) => handleNavClick(e, '#tentang-kami')} className="hover:text-heritage-zawo transition-colors">Tentang Kami</a>
            <a href="#katalog" onClick={(e) => handleNavClick(e, '#katalog')} className="hover:text-heritage-zawo transition-colors">Katalog Produk</a>
            <a href="#social-proof" onClick={(e) => handleNavClick(e, '#social-proof')} className="hover:text-heritage-zawo transition-colors">Testimoni & Mitra</a>
            <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-heritage-zawo transition-colors">FAQ</a>
            <a href="#kontak" onClick={(e) => handleNavClick(e, '#kontak')} className="hover:text-heritage-zawo transition-colors">Kontak</a>
          </nav>

          {/* Action Header: Theme Toggle (Sun/Moon Icons Only) + PROPORTIONAL Special Studio Button */}
          <div className="flex items-center gap-3">
            
            {/* SUN & MOON ICON-ONLY THEME SWITCHER BUTTON (DESKTOP ONLY: hidden lg:flex) */}
            <div 
              className={`p-1 rounded-xl border transition-all duration-300 hidden lg:flex items-center gap-1 shadow-md h-10 ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-700/80 text-white' 
                  : 'bg-white border-gray-300 text-gray-900 shadow-sm'
              }`}
            >
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`h-8 px-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  !isDark
                    ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-300 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                aria-label="Mode Terang"
                title="Beralih ke Mode Terang (Light Mode)"
              >
                <Sun className={`w-4 h-4 ${!isDark ? 'text-slate-950 fill-amber-950/20' : 'text-amber-400'}`} />
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`h-8 px-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  isDark
                    ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-500 font-bold'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                }`}
                aria-label="Mode Gelap"
                title="Beralih ke Mode Gelap (Dark Mode)"
              >
                <Moon className={`w-4 h-4 ${isDark ? 'text-white fill-white/20' : 'text-slate-700'}`} />
              </button>
            </div>

            {/* MATCHING HEIGHT NAVBAR BUTTON (EXACT 40PX H-10) */}
            <button
              type="button"
              onClick={handleDesignButtonClick}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <PenTool className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Mulai Mendesain</span>
              <span className="sm:hidden">Desain</span>
            </button>

            {/* HAMBURGER BUTTON - MOBILE & TABLET (lg:hidden) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`lg:hidden h-10 w-10 rounded-xl border flex items-center justify-center transition-colors active:scale-95 ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-700/80 text-white hover:bg-slate-800' 
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100 shadow-sm'
              }`}
              aria-label={isMobileMenuOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
              title="Menu Navigasi"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-heritage-zawo" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>

        {/* MOBILE & TABLET MENU DROPDOWN (lg:hidden) */}
        {isMobileMenuOpen && (
          <div 
            className={`lg:hidden border-b px-4 sm:px-6 py-5 shadow-2xl transition-all animate-slide-up-fade ${
              isDark 
                ? 'bg-[#0B0F19]/98 border-white/10 text-white' 
                : 'bg-white/98 border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex flex-col space-y-4">
              
              {/* Navigation Links wrapped inside hamburger */}
              <nav className="flex flex-col space-y-1">
                <a 
                  href="#tentang-kami" 
                  onClick={(e) => handleNavClick(e, '#tentang-kami')} 
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isDark 
                      ? 'hover:bg-slate-800/90 text-slate-200 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-800 hover:text-brand-600'
                  }`}
                >
                  <span>Tentang Kami</span>
                  <ChevronRight className="w-4 h-4 text-heritage-zawo opacity-70" />
                </a>
                <a 
                  href="#katalog" 
                  onClick={(e) => handleNavClick(e, '#katalog')} 
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isDark 
                      ? 'hover:bg-slate-800/90 text-slate-200 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-800 hover:text-brand-600'
                  }`}
                >
                  <span>Katalog Produk</span>
                  <ChevronRight className="w-4 h-4 text-heritage-zawo opacity-70" />
                </a>
                <a 
                  href="#social-proof" 
                  onClick={(e) => handleNavClick(e, '#social-proof')} 
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isDark 
                      ? 'hover:bg-slate-800/90 text-slate-200 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-800 hover:text-brand-600'
                  }`}
                >
                  <span>Testimoni & Mitra</span>
                  <ChevronRight className="w-4 h-4 text-heritage-zawo opacity-70" />
                </a>
                <a 
                  href="#faq" 
                  onClick={(e) => handleNavClick(e, '#faq')} 
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isDark 
                      ? 'hover:bg-slate-800/90 text-slate-200 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-800 hover:text-brand-600'
                  }`}
                >
                  <span>FAQ (Pertanyaan Umum)</span>
                  <ChevronRight className="w-4 h-4 text-heritage-zawo opacity-70" />
                </a>
                <a 
                  href="#kontak" 
                  onClick={(e) => handleNavClick(e, '#kontak')} 
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isDark 
                      ? 'hover:bg-slate-800/90 text-slate-200 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-800 hover:text-brand-600'
                  }`}
                >
                  <span>Kontak & Lokasi</span>
                  <ChevronRight className="w-4 h-4 text-heritage-zawo opacity-70" />
                </a>
              </nav>

              {/* Divider */}
              <div className={`h-px w-full ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />

              {/* Theme Switcher Button (Moved into Hamburger on Mobile) */}
              <div className="flex items-center justify-between px-3 py-1">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  Tema Tampilan
                </span>
                
                <div 
                  className={`p-1 rounded-xl border transition-all duration-300 flex items-center gap-1 shadow-sm h-10 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700/80 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`h-8 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      !isDark
                        ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-300 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                    aria-label="Mode Terang"
                  >
                    <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-slate-950 fill-amber-950/20' : 'text-amber-400'}`} />
                    <span>Terang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`h-8 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-500 font-bold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    aria-label="Mode Gelap"
                  >
                    <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-white fill-white/20' : 'text-slate-700'}`} />
                    <span>Gelap</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );

  const renderFooter = () => (
    <footer id="kontak" className="bg-[#070A10] text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800 items-start">
          
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-start">
              <img 
                src="/logos/logo-riza-apparel-dark.svg" 
                alt="RIZA APPAREL Logo" 
                className="h-14 sm:h-16 w-auto object-contain -mt-1" 
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Spesialis konveksi dan custom jersey sportswear modern beridentitas budaya Flores Ende, Nusa Tenggara Timur. Pengerjaan presisi sublimasi digital.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Alamat Resmi & Jam Operasional</h4>
            
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-slate-300">
                JL. Gatot Subroto Gg. Sabar RT.022/RW.011, MAUTAPAGA, KEC. ENDE TIMUR, KABUPATEN ENDE, NUSA TENGGARA TIMUR 86317
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <Clock className="w-4 h-4 text-heritage-zawo shrink-0" />
              <span>Senin - Sabtu (08:00 - 18:00 WITA)</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-white">+62 812-4691-7740 (WhatsApp Owner)</span>
            </div>

            {/* EMBEDDED MAP WIDGET */}
            <div className="pt-2">
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md relative group">
                <iframe
                  title="Peta Lokasi Presisi Riza Apparel Ende"
                  src="https://maps.google.com/maps?q=-8.843675,121.670762&hl=id&z=17&output=embed"
                  className="w-full h-32 border-0 grayscale contrast-125 opacity-85 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className="bg-slate-950/85 backdrop-blur-sm text-slate-300 text-[9px] font-mono px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    -8.843675, 121.670762
                  </span>
                </div>
                <a
                  href="https://maps.app.goo.gl/9qd4THZzMF9231wv7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-slate-950/90 hover:bg-brand-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700/80 shadow-md transition-colors flex items-center gap-1.5"
                  title="Buka Lokasi Presisi di Google Maps"
                >
                  <MapPin className="w-3 h-3 text-brand-400 group-hover/btn:text-white" />
                  <span>Buka Google Maps ↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Konsultasi Cepat</h4>
            <p className="text-xs text-slate-400">Hubungi langsung via WhatsApp untuk pertanyaan jumlah khusus & pemesanan tim.</p>
            
            <a
              href="https://wa.me/6281246917740?text=Halo%20Admin%20Riza%20Apparel,%20saya%20tertarik%20bertanya%20mengenai%20custom%20jersey..."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Admin WhatsApp</span>
            </a>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} RIZA APPAREL Ende. Hak Cipta Dilindungi.</p>
          <p>Designed with Pride in Ende, Nusa Tenggara Timur 🇮🇩</p>
        </div>

      </div>
    </footer>
  );

  if (currentPage === 'studio') {
    return (
      <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${isDark ? 'bg-[#0B0F19] text-white' : 'bg-slate-50 text-gray-900'}`}>
        
        {renderHeader()}

        {/* DEDICATED STUDIO MAIN CONTENT AREA */}
        <main className="flex-1">
          <DesignStudio isDark={isDark} />
        </main>

        {renderFooter()}

        <AIAssistantWidget isDark={isDark} />

      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${isDark ? 'bg-[#0B0F19] text-white' : 'bg-slate-50 text-gray-900'}`}>
      
      {renderHeader()}

      <main className="flex-1">

        {/* SECTION 2: CLEAN FULL-BLEED HERO DISPLAY WITH 3 REAL JERSEY PHOTOS SLIDESHOW */}
        <section className="relative min-h-[92vh] lg:min-h-[102vh] flex flex-col justify-between overflow-hidden bg-[#0B0F19]">
          
          {/* FULL-BLEED SLIDESHOW BACKGROUND IMAGE (3 REAL JERSEY PHOTOS ONLY) */}
          <div className="absolute inset-0 z-0">
            {HERO_GALLERY_IMAGES.map((img, idx) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  activeHeroIdx === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.75]"
                />
              </div>
            ))}

            {/* DARK GRADIENT OVERLAY FOR CRISP READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/55 to-black/30 z-20" />
            <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none z-20" />
          </div>

          {/* TOP SPACER FOR HEADER ALIGNMENT */}
          <div className="h-20" />

          {/* HERO CONTENT OVERLAY (SINGLE HEADLINE 2 LINES + SINGLE SHORT DESCRIPTION BELOW IT) */}
          <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1 flex flex-col justify-center">
            <div className="max-w-3xl text-left animate-slide-up-fade">
              
              {/* Single Short Headline (Formatted cleanly into 2 lines) */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                Mewujudkan Identitas <br />
                Melalui Pakaian Berkualitas
              </h1>

              {/* Single Short Description Sentence Below Headline */}
              <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-md">
                Spesialis custom jersey & sportswear sublimasi presisi bermotif autentik Ende Diamond Zawo.
              </p>

            </div>
          </div>

          {/* BOTTOM CENTER SLIDE ROTATOR INDICATORS (CENTERED, NO LEFT TAG) */}
          <div className="relative z-30 pb-10 flex items-center justify-center w-full">
            <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
              {HERO_GALLERY_IMAGES.map((img, idx) => {
                const isActive = activeHeroIdx === idx;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveHeroIdx(idx)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isActive 
                        ? 'w-10 bg-gradient-to-r from-brand-500 to-heritage-zawo shadow-glow-brand' 
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>

        </section>

        {/* SECTION 3: TENTANG KAMI, VISI MISI & 4 PILAR KEUNGGULAN */}
        <section id="tentang-kami" className={`py-16 md:py-24 border-y transition-colors duration-300 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-heritage-zawo bg-heritage-zawo/10 border border-heritage-zawo/30 px-3.5 py-1 rounded-full inline-block mb-3">
                Tentang RIZA APPAREL
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Mengenal RIZA APPAREL Lebih Dekat
              </h2>
              <p className={`mt-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                RIZA APPAREL berkomitmen menghadirkan jersey dan sportswear custom kelas premium yang memadukan estetika desain modern dengan presisi teknis tinggi. Perkuat karakter, semangat, dan kebanggaan tim Anda bersama kami sekarang.
              </p>
            </div>

            {/* VISI & MISI ROW LAYOUT */}
            <div className={`border-t border-b mb-16 divide-y transition-colors duration-300 ${
              isDark ? 'border-slate-800 divide-slate-800' : 'border-gray-300 divide-gray-300'
            }`}>
              
              {/* VISI ROW */}
              <div className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="md:col-span-5 lg:col-span-4">
                  <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Visi Utama
                  </h3>
                </div>
                <div className="md:col-span-7 lg:col-span-8">
                  <p className={`text-base sm:text-lg font-normal leading-relaxed text-justify ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Menjadi merek custom apparel pilihan utama yang dikenal akan inovasi desain, estetika yang kuat, dan kualitas produk yang terpercaya di setiap karya.
                  </p>
                </div>
              </div>

              {/* MISI ROW */}
              <div className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="md:col-span-5 lg:col-span-4">
                  <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Misi Kami
                  </h3>
                </div>
                <div className="md:col-span-7 lg:col-span-8">
                  <ul className={`space-y-2 text-base sm:text-lg font-normal leading-snug text-justify ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 font-bold select-none">-</span>
                      <span>Menghadirkan solusi pakaian kustom dengan standar desain visual tinggi dan presisi detail.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 font-bold select-none">-</span>
                      <span>Menggabungkan unsur estetika lokal (Ende Diamond Zawo) dan tren global ke dalam produk yang modern.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 font-bold select-none">-</span>
                      <span>Memberikan pengalaman pembuatan pakaian yang mudah, transparan, dan memuaskan bagi setiap klien.</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* 4 PILAR KEUNGGULAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* PILAR 1 */}
              <div className={`border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${isDark ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block mb-1">Pilar #01</span>
                  <h3 className={`text-sm sm:text-base font-extrabold truncate leading-snug mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} title="Desain Presisi Custom">
                    Desain Presisi Custom
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Dari penempatan logo, typography, hingga motif tematik mengekspresikan karakter tim secara tepat.
                  </p>
                </div>
              </div>

              {/* PILAR 2 */}
              <div className={`border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${isDark ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4 border border-sky-500/20">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-sky-500 uppercase tracking-wider block mb-1">Pilar #02</span>
                  <h3 className={`text-sm sm:text-base font-extrabold truncate leading-snug mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} title="Motif Autentik Tenun">
                    Motif Autentik Tenun
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Melahirkan konsep unik Heritage Series yang memadukan unsur budaya Ende Zawo dengan estetika modern.
                  </p>
                </div>
              </div>

              {/* PILAR 3 */}
              <div className={`border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${isDark ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">Pilar #03</span>
                  <h3 className={`text-sm sm:text-base font-extrabold truncate leading-snug mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} title="Material Dry-Fit Premium">
                    Material Dry-Fit Premium
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Bahan ringan, cepat menyerap keringat (Milano, Serena, Waffle Anti-UV), tahan lama di lapangan & kasual.
                  </p>
                </div>
              </div>

              {/* PILAR 4 */}
              <div className={`border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${isDark ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block mb-1">Pilar #04</span>
                  <h3 className={`text-sm sm:text-base font-extrabold truncate leading-snug mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} title="Standar Cetak 1440 DPI">
                    Standar Cetak 1440 DPI
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Konsistensi warna sublimasi, kekuatan jahitan rantai presisi, serta melayani pemesanan satuan (1 Pcs).
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: KATALOG & PRICE LIST (CITITEX BENCHMARK) */}
        <section id="katalog" className={`py-16 md:py-24 transition-colors duration-300 ${isDark ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <span className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 ${
                  isDark 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-amber-50 border-amber-300/80 text-amber-600'
                }`}>
                  TRANSPARANSI HARGA CITITEX–STANDARD
                </span>
                <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Katalog Produk & Batas Harga Mulai Dari
                </h2>
                <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Harga terbuka dan jelas tanpa biaya tersembunyi. Termasuk gratis desain motif tenun ikat, custom nama & nomor punggung, serta promo <span className="font-bold text-brand-600 dark:text-brand-400">Beli 2 Bonus 1 Pcs</span>.
                </p>
              </div>

              <div className={`p-1.5 rounded-2xl border flex flex-wrap items-center gap-1 self-start lg:self-end ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-gray-200/60 border-gray-200'
              }`}>
                {[
                  { id: 'all', label: 'Semua Kategori' },
                  { id: 'team', label: 'Jersey Tim' },
                  { id: 'community', label: 'Komunitas & Lari' },
                  { id: 'casual', label: 'Apparel Santai' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === tab.id
                        ? (isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-gray-900 shadow-xs')
                        : (isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MASONRY COLUMN LAYOUT: ONLY ACTIVE EXPANDED CARD GROWS IN HEIGHT, OTHER CARDS STAY AT NATURAL HEIGHT & CARDS BELOW SHIFT DOWN */}
            {(() => {
              const renderCard = (item: typeof CATALOG_DATA[0]) => (
                <div
                  key={item.id}
                  className={`border rounded-3xl shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group h-fit ${
                    isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 hover:shadow-xl'
                  }`}
                >
                  <div className="flex-1 flex flex-col">
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      {item.promoBadge && (
                        <span className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase shadow-md">
                          {item.promoBadge}
                        </span>
                      )}
                      <span className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                        isDark ? 'bg-slate-950/90 backdrop-blur-md text-slate-300 border-slate-800' : 'bg-white/90 backdrop-blur-md text-gray-700 border-gray-200'
                      }`}>
                        {item.fabricSpecs}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider mb-2 h-4">
                        <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                          {item.category === 'team' ? 'Jersey Tim Olahraga' : item.category === 'community' ? 'Event & Komunitas' : 'Apparel Kasual & Outerwear'}
                        </span>
                        <span className="text-emerald-500 font-bold">Est. {item.leadTimeDays} Hari Kerja</span>
                      </div>

                      <h3 className={`text-base sm:text-lg font-extrabold truncate leading-snug mb-2 group-hover:text-heritage-zawo transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`} title={item.name}>
                        {item.name}
                      </h3>
                      
                      <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>

                      {/* DROPDOWN TOGGLE BUTTON "Selengkapnya" */}
                      <div className="mt-4 border-t pt-3">
                        <button
                          type="button"
                          onClick={() => toggleCatalogExpand(item.id)}
                          className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                            expandedCatalogIds[item.id]
                              ? (isDark ? 'bg-slate-800 text-brand-400 border border-brand-500/30' : 'bg-brand-50 text-brand-600 border border-brand-200')
                              : (isDark ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200')
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-heritage-zawo" />
                            <span>Selengkapnya</span>
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedCatalogIds[item.id] ? 'rotate-180 text-brand-500' : 'text-slate-400'}`} />
                        </button>

                        {/* EXPANDABLE SPECIFICATION / DETAILS DROPDOWN */}
                        {expandedCatalogIds[item.id] && (
                          <div className="mt-3 animate-slide-up-fade">
                            <ul className={`space-y-2 text-xs p-3 rounded-xl border ${
                              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-gray-200 text-gray-700'
                            }`}>
                              {item.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <div className={`flex items-baseline justify-between mb-4 border-t pt-4 ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                      <div>
                        <span className={`text-[10px] font-medium block uppercase ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Batas Harga Mulai Dari:</span>
                        <span className="text-2xl font-black text-heritage-zawo">
                          Rp {item.startingPrice.toLocaleString('id-ID')}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}> /pcs</span>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-500/30">
                        Bisa Satuan (1 Pcs)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={goToStudioPage}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-3 rounded-xl shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 text-xs min-h-[44px]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-heritage-zawo" />
                        <span>Studio 2D</span>
                      </button>

                      <a
                        href={`https://wa.me/6281246917740?text=Halo%20Admin%20Riza%20Apparel,%20saya%20ingin%20memesan%20${encodeURIComponent(item.name)}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bold py-3 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs min-h-[44px] ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Order WA</span>
                      </a>
                    </div>
                  </div>
                </div>
              );

              return (
                <>
                  {/* Desktop (3 Columns Masonry Layout) */}
                  <div className="hidden lg:grid grid-cols-3 gap-8 items-start">
                    {[0, 1, 2].map((colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-8">
                        {filteredCatalog
                          .filter((_, idx) => idx % 3 === colIndex)
                          .map((item) => renderCard(item))}
                      </div>
                    ))}
                  </div>

                  {/* Tablet (2 Columns Masonry Layout) */}
                  <div className="hidden md:grid lg:hidden grid-cols-2 gap-8 items-start">
                    {[0, 1].map((colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-8">
                        {filteredCatalog
                          .filter((_, idx) => idx % 2 === colIndex)
                          .map((item) => renderCard(item))}
                      </div>
                    ))}
                  </div>

                  {/* Mobile (1 Column Vertical Layout) */}
                  <div className="grid md:hidden grid-cols-1 gap-8 items-start">
                    {filteredCatalog.map((item) => renderCard(item))}
                  </div>
                </>
              );
            })()}

          </div>
        </section>

        {/* SECTION 5: 3 DEDICATED PROMO & PAKET CARDS (ORANGE HIGHLIGHT) */}
        <section className="py-16 bg-gradient-to-r from-amber-600 via-brand-600 to-rose-600 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
                Paket & Promo Spesial Riza Apparel
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                Nikmati Penawaran Hemat Pemesanan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Promo Card 1 */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:scale-102 transition-transform">
                <div>
                  <div className="flex items-center mb-3">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      HEMAT HINGGA 33%
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black truncate leading-tight text-white mb-2" title="Beli 2 Bonus 1 Pcs">
                    Beli 2 Bonus 1 Pcs
                  </h3>
                  <p className="text-xs text-amber-100 leading-relaxed">
                    Setiap pemesanan kelipatan 2 pcs jersey varian apa saja, dapatkan 1 pcs ekstra bonus jersey secara gratis!
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-200">KODE: PROMO-B2B1</span>
                  <button onClick={goToStudioPage} className="text-xs font-extrabold underline hover:text-amber-200">Gunakan Sekarang →</button>
                </div>
              </div>

              {/* Promo Card 2 */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:scale-102 transition-transform">
                <div>
                  <div className="flex items-center mb-3">
                    <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      RP0 ONGKOS KIRIM
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black truncate leading-tight text-white mb-2" title="Gratis Ongkir Ende & NTT">
                    Gratis Ongkir Ende & NTT
                  </h3>
                  <p className="text-xs text-amber-100 leading-relaxed">
                    Pengiriman bebas biaya untuk seluruh area Kabupaten Ende dan subsidi ongkir hemat ke seluruh pelosok Nusa Tenggara Timur.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-200">KODE: FREE-ONGKIR</span>
                  <button onClick={goToStudioPage} className="text-xs font-extrabold underline hover:text-amber-200">Gunakan Sekarang →</button>
                </div>
              </div>

              {/* Promo Card 3 */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:scale-102 transition-transform">
                <div>
                  <div className="flex items-center mb-3">
                    <span className="bg-sky-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      100% BEBAS BIAYA DESAIN
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black truncate leading-tight text-white mb-2" title="Desain Sesuai Keinginan">
                    Desain Sesuai Keinginan
                  </h3>
                  <p className="text-xs text-amber-100 leading-relaxed">
                    Konsultasi dan kustomisasi desain motif tenun ikat Ende bebas biaya revisi sampai file siap cetak 100% fix.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-200">KODE: FREE-DESIGN</span>
                  <button onClick={goToStudioPage} className="text-xs font-extrabold underline hover:text-amber-200">Gunakan Sekarang →</button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 6: ALUR PRODUKSI PRESISI (5 STEPS TIMELINE) */}
        <section className={`py-16 md:py-24 border-b transition-colors duration-300 ${isDark ? 'bg-[#0B0F19]' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-500 bg-brand-600/10 border border-brand-500/30 px-3.5 py-1 rounded-full">
                Alur Produksi Presisi
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Dari Draf Desain Hingga Jersey Siap Tanding
              </h2>
              <p className={`mt-2.5 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Langkah transparan dan terkontrol untuk memastikan setiap set seragam tiba tepat waktu dan sesuai spesifikasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* Step 1 */}
              <div className={`border rounded-2xl p-5 relative transition-all hover:scale-102 flex flex-col justify-start h-full ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-gray-200 shadow-sm'}`}>
                <div className="text-2xl font-black text-brand-500 mb-2 h-7 flex items-center">01</div>
                <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm mb-2 h-10 truncate" title="Desain & Draf 2D">
                  <Sparkles className="w-4 h-4 text-heritage-zawo shrink-0" />
                  <span className="truncate">Desain & Draf 2D</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Eksplorasi motif tenun ikat & warna di web, lalu kirimkan ringkasan draf ke WhatsApp admin.
                </p>
              </div>

              {/* Step 2 */}
              <div className={`border rounded-2xl p-5 relative transition-all hover:scale-102 flex flex-col justify-start h-full ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-gray-200 shadow-sm'}`}>
                <div className="text-2xl font-black text-brand-500 mb-2 h-7 flex items-center">02</div>
                <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm mb-2 h-10 truncate" title="Approval & Proofing">
                  <FileCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">Approval & Proofing</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Tim merapikan file vektor, layout sponsor, serta daftar nama/nomor pemain.
                </p>
              </div>

              {/* Step 3 */}
              <div className={`border rounded-2xl p-5 relative transition-all hover:scale-102 flex flex-col justify-start h-full ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-gray-200 shadow-sm'}`}>
                <div className="text-2xl font-black text-brand-500 mb-2 h-7 flex items-center">03</div>
                <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm mb-2 h-10 truncate" title="Cetak Sublim 1440 DPI">
                  <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Cetak Sublim 1440 DPI</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Pencetakan dengan tinta original anti-luntur pada kertas transfer khusus berstandar industri.
                </p>
              </div>

              {/* Step 4 */}
              <div className={`border rounded-2xl p-5 relative transition-all hover:scale-102 flex flex-col justify-start h-full ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-gray-200 shadow-sm'}`}>
                <div className="text-2xl font-black text-brand-500 mb-2 h-7 flex items-center">04</div>
                <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm mb-2 h-10 truncate" title="Press & Jahit Rantai">
                  <Scissors className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Press & Jahit Rantai</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Proses transfer suhu tinggi ke serat kain disusul penjahitan rapi oleh penjahit garmen berpengalaman.
                </p>
              </div>

              {/* Step 5 */}
              <div className={`border rounded-2xl p-5 relative transition-all hover:scale-102 flex flex-col justify-start h-full ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-gray-200 shadow-sm'}`}>
                <div className="text-2xl font-black text-brand-500 mb-2 h-7 flex items-center">05</div>
                <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm mb-2 h-10 truncate" title="QC & Kirim NTT">
                  <Truck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">QC & Kirim NTT</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Pemeriksaan jahitan dan ukuran, packing rapi, dan dikirim bebas ongkir ke seluruh pelosok NTT.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 7: INTERACTIVE FAQ ACCORDION SECTION */}
        <section id="faq" className={`py-16 md:py-24 border-b transition-colors duration-300 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* LEFT COLUMN: FAQ Title & Description (Static on mobile to prevent overlapping, sticky on desktop) */}
              <div className="md:col-span-5 lg:col-span-5 static md:sticky md:top-28">
                <span className="text-xs font-extrabold uppercase tracking-widest text-heritage-zawo bg-heritage-zawo/10 border border-heritage-zawo/30 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-3">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Pertanyaan Umum (FAQ)</span>
                </span>
                <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Hal yang Sering <br className="hidden lg:inline" />Ditanyakan <br className="hidden lg:inline" />Pelanggan
                </h2>
                <p className={`mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Informasi penting mengenai cara pemesanan, minimal order, estimasi waktu, hingga penawaran promo custom jersey RIZA APPAREL.
                </p>

                <div className="mt-6 md:mt-8 bg-brand-600/15 border border-brand-500/30 rounded-2xl p-4 text-xs">
                  <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>Masih punya pertanyaan lain seputar custom jersey tim Anda? </span>
                  <a 
                    href="https://wa.me/6281246917740?text=Halo%20Admin%20Riza%20Apparel,%20saya%20ingin%20bertanya%20mengenai..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-heritage-zawo font-extrabold underline hover:text-amber-400 inline-block mt-1.5"
                  >
                    Chat Langsung via WhatsApp Owner →
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: FAQ Accordion Cards (Narrower & Padded) */}
              <div className="md:col-span-7 lg:col-span-7 space-y-4 max-w-xl lg:max-w-2xl w-full">
                {FAQ_DATA.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? (isDark ? 'bg-slate-800/90 border-brand-500/50 shadow-lg' : 'bg-white border-brand-200 shadow-md')
                          : (isDark ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 hover:shadow-md')
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base focus:outline-none"
                      >
                        <span className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <span className="w-7 h-7 rounded-xl bg-brand-600/20 text-brand-500 border border-brand-500/30 text-xs font-black flex items-center justify-center shrink-0">
                            Q{faq.id}
                          </span>
                          <span>{faq.question}</span>
                        </span>
                        <ChevronDown className={`w-5 h-5 text-heritage-zawo shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className={`px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-4 animate-slide-up-fade ${
                          isDark ? 'border-slate-800 text-slate-300' : 'border-gray-100 text-gray-600'
                        }`}>
                          <p className="text-justify">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 8: SOCIAL PROOF (TESTIMONI DULUAN, BARU MITRA CAROUSEL) */}
        <section id="social-proof" className={`py-16 md:py-24 border-b transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 1. TESTIMONI PELANGGAN (SEBELUM MITRA) */}
            <div className="mb-20">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-extrabold uppercase tracking-widest text-heritage-zawo bg-heritage-zawo/10 border border-heritage-zawo/30 px-3.5 py-1 rounded-full">
                  Ulasan & Testimoni Pelanggan
                </span>
                <h2 className={`text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Dipercaya oleh Atlet, Tim & Komunitas Regional
                </h2>
                <p className={`mt-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Pengalaman nyata pelanggan dari berbagai klub dan event dalam menggunakan produk jersey sublimasi RIZA APPAREL.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t) => (
                  <div key={t.id} className={`border rounded-3xl p-6 flex flex-col justify-between shadow-md transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-gray-200'}`}>
                    <div>
                      <div className="flex text-amber-400 mb-3">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className={`text-xs sm:text-sm italic leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        "{t.quote}"
                      </p>
                    </div>

                    <div className={`mt-6 pt-4 border-t flex items-center gap-3 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                      <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {t.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t.role} • {t.organization}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. MITRA & KLIEN KAMI (SETELAH TESTIMONI + AUTOSLIDE RIGHT EVERY 5s) */}
            <div className="pt-12 border-t border-slate-800/60">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-500 bg-brand-600/10 border border-brand-500/30 px-3.5 py-1 rounded-full">
                  Mitra & Klien Kami
                </span>
                <h2 className={`text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Dipercaya oleh Perusahaan & Ekosistem Industri
                </h2>
                <p className={`mt-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Sinergi berkelanjutan bersama produsen sublimasi nasional, jaringan distributor, dan komunitas terkemuka.
                </p>
              </div>

              {/* UNIK STAGGERED CAROUSEL CONTAINER (CONTINUOUS INFINITE FORWARD SLIDE TIAP 8 DETIK) */}
              <div className="relative overflow-hidden py-6">
                
                {/* Carousel Track with Endless Array for Continuous Forward Movement */}
                <div 
                  className="flex items-center transition-transform duration-1000 ease-in-out"
                  style={{
                    transform: `translateX(-${partnerSlideIdx * (100 / (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 1))}%)`
                  }}
                >
                  {Array.from({ length: 50 }).flatMap(() => PARTNERS_DATA).map((partner, idx) => (
                    <div
                      key={`${partner.id}-${idx}`}
                      className={`w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3 transition-all duration-500 transform ${partner.rotation} ${partner.offsetY}`}
                    >
                      <div className={`border rounded-2xl p-6 flex flex-col items-center justify-between text-center transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 ${
                        isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-gray-200'
                      }`}>
                        <div className="h-16 flex items-center justify-center w-full my-auto px-4">
                          {partner.type === 'svg' && (
                            <img 
                              src={isDark ? partner.logoDark : partner.logoLight} 
                              alt={partner.name} 
                              className="max-h-12 w-auto object-contain transition-all duration-300"
                            />
                          )}
                          {partner.type === 'img' && partner.logo && (
                            <img 
                              src={partner.logo} 
                              alt={partner.name} 
                              className="max-h-12 w-auto object-contain"
                            />
                          )}
                          {partner.type === 'img' && partner.logoDark && partner.logoLight && (
                            <img 
                              src={isDark ? partner.logoDark : partner.logoLight} 
                              alt={partner.name} 
                              className="max-h-12 w-auto object-contain"
                            />
                          )}
                          {partner.type === 'badge' && (
                            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-heritage-zawo/20 via-brand-600/20 to-amber-500/20 border border-heritage-zawo/30 shadow-xs">
                              <span className="text-sm font-black tracking-wider text-heritage-zawo">
                                {partner.customText}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={`mt-4 pt-3 border-t w-full ${isDark ? 'border-slate-800/80 text-slate-300' : 'border-gray-100 text-gray-800'}`}>
                          <div className="text-xs font-bold">{partner.name}</div>
                          <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{partner.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CAROUSEL INDICATOR DOTS */}
                <div className="flex justify-center items-center gap-2 mt-8">
                  {PARTNERS_DATA.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPartnerSlideIdx(idx)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (partnerSlideIdx % PARTNERS_DATA.length) === idx
                          ? 'w-8 bg-heritage-zawo shadow-glow-brand'
                          : 'w-2 bg-slate-600/40 hover:bg-slate-500'
                      }`}
                      aria-label={`Slide Mitra ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* SECTION 10: FOOTER */}
      {renderFooter()}

      <AIAssistantWidget isDark={isDark} />

    </div>
  );
};
