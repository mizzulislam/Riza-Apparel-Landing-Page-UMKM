import type { 
  CMSMotif, 
  CMSLead, 
  CMSOrder, 
  UnansweredQuestion,
  CMSHeroConfig,
  CMSPortfolioItem,
  CMSTestimonialItem,
  CMSUSPItem,
  CMSContactConfig,
  CMSCustomerTier,
  CMSWATemplate,
  CMSCSATRating,
  CMSAboutConfig,
  CMSPromoItem,
  CMSWorkflowStep,
  CMSFAQItem,
  CMSPartnerItem,
  CMSCatalogConfig,
  CMSPromoHeaderConfig,
  CMSWorkflowHeaderConfig,
  CMSFAQHeaderConfig,
  CMSTestimonialsHeaderConfig
} from './cms-service';
import { CatalogItem } from '../types';
import { saveCMSProduct, saveCMSMotif } from './cms-service';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const INITIAL_CATALOG_SEED: CMSCatalogConfig = {
  tagBadgeText: 'TRANSPARANSI HARGA CITITEX–STANDARD',
  sectionTitle: 'Katalog Produk & Batas Harga Mulai Dari',
  sectionSubtitle: 'Harga terbuka dan jelas tanpa biaya tersembunyi. Termasuk gratis desain motif tenun ikat, custom nama & nomor punggung, serta promo Beli 2 Bonus 1 Pcs.',
};

export const INITIAL_PROMO_HEADER_SEED: CMSPromoHeaderConfig = {
  tagBadgeText: 'PAKET & PROMO SPESIAL RIZA APPAREL',
  sectionTitle: 'Nikmati Penawaran Hemat Pemesanan',
  sectionSubtitle: 'Pilihan paket promo beli 2 bonus 1, gratis ongkir Ende & NTT, serta layanan 100% bebas biaya desain.',
};

export const INITIAL_WORKFLOW_HEADER_SEED: CMSWorkflowHeaderConfig = {
  tagBadgeText: 'ALUR PRODUKSI PRESISI',
  sectionTitle: 'Dari Draf Desain Hingga Jersey Siap Tanding',
  sectionSubtitle: 'Langkah transparan dan terkontrol untuk memastikan setiap set seragam tiba tepat waktu dan sesuai spesifikasi.',
};

export const INITIAL_FAQ_HEADER_SEED: CMSFAQHeaderConfig = {
  tagBadgeText: 'PERTANYAAN UMUM (FAQ)',
  sectionTitle: 'Hal yang Sering Ditanyakan Pelanggan',
  sectionSubtitle: 'Informasi penting mengenai cara pemesanan, minimal order, estimasi waktu, hingga penawaran promo custom jersey RIZA APPAREL.',
};

export const INITIAL_TESTIMONIALS_HEADER_SEED: CMSTestimonialsHeaderConfig = {
  testiTagBadgeText: 'ULASAN & TESTIMONI PELANGGAN',
  testiSectionTitle: 'Dipercaya oleh Atlet, Tim & Komunitas Regional',
  testiSectionSubtitle: 'Pengalaman nyata pelanggan dari berbagai klub dan event dalam menggunakan produk jersey sublimasi RIZA APPAREL.',
  partnerTagBadgeText: 'MITRA & KLIEN KAMI',
  partnerSectionTitle: 'Dipercaya oleh Perusahaan & Ekosistem Industri',
  partnerSectionSubtitle: 'Sinergi berkelanjutan bersama produsen sublimasi nasional, jaringan distributor, dan komunitas terkemuka.',
};

export const INITIAL_PRODUCTS_SEED: CatalogItem[] = [
  {
    id: '1',
    name: 'Jersey Pro Sepak Bola & Futsal',
    category: 'team',
    startingPrice: 90000,
    priceUnit: 'pcs',
    secondaryPrice: 85000,
    secondaryPriceUnit: 'pcs',
    secondaryPriceLabel: 'Grosir Tim ≥ 12 Pcs',
    minOrderBadge: 'Bisa Satuan (1 Pcs)',
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
    isActive: true,
  },
  {
    id: '2',
    name: 'Jersey Tim Voli & Basket',
    category: 'team',
    startingPrice: 95000,
    priceUnit: 'pcs',
    secondaryPrice: 90000,
    secondaryPriceUnit: 'pcs',
    secondaryPriceLabel: 'Paket Tim ≥ 10 Pcs',
    minOrderBadge: 'Promo Spesial Tim',
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
    priceUnit: 'pcs',
    secondaryPrice: 95000,
    secondaryPriceUnit: 'pcs',
    secondaryPriceLabel: 'Komunitas ≥ 15 Pcs',
    minOrderBadge: 'Bisa Satuan (1 Pcs)',
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
    priceUnit: 'pcs',
    secondaryPrice: 90000,
    secondaryPriceUnit: 'pcs',
    secondaryPriceLabel: 'Klan Esports ≥ 5 Pcs',
    minOrderBadge: 'Bisa Satuan (1 Pcs)',
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
    priceUnit: 'pcs',
    secondaryPrice: 105000,
    secondaryPriceUnit: 'pcs',
    secondaryPriceLabel: 'Seragam Panitia ≥ 12 Pcs',
    minOrderBadge: 'Bisa Satuan (1 Pcs)',
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
    priceUnit: 'pcs',
    secondaryPrice: 135000,
    secondaryPriceUnit: 'pcs',
    secondaryPriceLabel: 'Outerwear Tim ≥ 6 Pcs',
    minOrderBadge: 'Minimal Pemesanan 6 Pcs',
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

export const INITIAL_MOTIFS_SEED: CMSMotif[] = [
  {
    id: 'motif-1',
    nama_motif: 'Ende Diamond Zawo Gold',
    kategori_kultural: 'ende-zawo',
    file_aset: 'ende-diamond',
    atribusi_sumber: 'Motif Tenun Ikat Tradisional Ende Flores NTT — Dokumentasi Riza Apparel Ende 2026',
    status_aktif: true,
  },
  {
    id: 'motif-2',
    nama_motif: 'Flores Ocean Waves',
    kategori_kultural: 'flores-waves',
    file_aset: 'flores-wave',
    atribusi_sumber: 'Inspirasi Gelombang Laut Pesisir Flores NTT — Aset Publik Riza Apparel',
    status_aktif: true,
  },
  {
    id: 'motif-3',
    nama_motif: 'Kelimutu Tri-Crater Poly',
    kategori_kultural: 'kelimutu',
    file_aset: 'kelimutu-crater',
    atribusi_sumber: 'Gradasi 3 Warna Danau Kawah Kelimutu Ende NTT',
    status_aktif: true,
  },
];

export const INITIAL_LEADS_SEED: CMSLead[] = [
  {
    id: 'lead-1',
    nama: 'Karel Wua',
    nomor_whatsapp: '081234567890',
    nama_tim: 'Ende United FC',
    estimasi_jumlah_pesanan: 18,
    ringkasan_desain: 'Jersey Pro Sepak Bola - Motif Ende Diamond Zawo Gold (Ukuran M=10, L=8)',
    status_tindak_lanjut: 'jadi_pesanan',
    penerimaan_pdp: true,
    tanggal_masuk: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'lead-2',
    nama: 'Siti Rahmawati',
    nomor_whatsapp: '082198765432',
    nama_tim: 'Komunitas Lari Nusa Bunga',
    estimasi_jumlah_pesanan: 25,
    ringkasan_desain: 'Jersey Komunitas Lari & Sepeda - Motif Kelimutu Tri-Crater',
    status_tindak_lanjut: 'baru',
    penerimaan_pdp: true,
    tanggal_masuk: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'lead-3',
    nama: 'Emanuel Nono',
    nomor_whatsapp: '085239182390',
    nama_tim: 'Voli Flores Youth',
    estimasi_jumlah_pesanan: 14,
    ringkasan_desain: 'Jersey Tim Voli Sleeveless - Aksen Flores Ocean Waves Gradasi',
    status_tindak_lanjut: 'dihubungi',
    penerimaan_pdp: true,
    tanggal_masuk: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const INITIAL_ORDERS_SEED: CMSOrder[] = [
  {
    id: 'order-1',
    id_prospek_terkait: 'lead-1',
    nama_pemesan: 'Karel Wua',
    nomor_whatsapp: '081234567890',
    nama_tim: 'Ende United FC',
    status_pesanan: 'Diproduksi',
    jumlah_item: 18,
    rincian_desain: 'Jersey Pro Sepak Bola - Motif Ende Diamond Zawo Gold',
    tanggal_konfirmasi: new Date(Date.now() - 2 * 86400000).toISOString(),
    estimasi_selesai: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    token_akses_unik: 'rz-98a2f4k1m992',
    catatan_admin: 'Sublimasi full print selesai, proses jahit & finishing.',
  },
  {
    id: 'order-2',
    nama_pemesan: 'Emanuel Nono',
    nomor_whatsapp: '085239182390',
    nama_tim: 'Voli Flores Youth',
    status_pesanan: 'Diterima',
    jumlah_item: 14,
    rincian_desain: 'Jersey Tim Voli Sleeveless - Flores Ocean Waves',
    tanggal_konfirmasi: new Date(Date.now() - 1 * 86400000).toISOString(),
    estimasi_selesai: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    token_akses_unik: 'rz-4k2m991b88a9',
    catatan_admin: 'Uang muka (DP) diterima. File mockup disetujui.',
  },
];

export const INITIAL_HERO_SEED: CMSHeroConfig = {
  headlineTitle: 'Mewujudkan Identitas Melalui Pakaian Berkualitas',
  headlineHighlight: 'Konveksi Jersey Custom & Sublimasi Presisi',
  subtext: 'Spesialis custom jersey & sportswear sublimasi presisi bermotif autentik Ende Diamond Zawo.',
  primaryCtaText: 'Mulai Mendesain',
  secondaryCtaText: 'Konsultasi via WhatsApp',
  bannerBadgeText: 'PROMO SPESIAL ENDE & NTT: Beli 2 Bonus 1 Pcs Jersey • Gratis Ongkir Area NTT • 100% Bebas Biaya Desain',
  ratingBadgeText: '⭐ 4.9/5 Kepuasan (150+ Tim Olahraga & Komunitas NTT)',
  slides: [
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
    }
  ]
};

export const INITIAL_PORTFOLIO_SEED: CMSPortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Jersey Home Ende United FC',
    category: 'Sepak Bola',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    clientName: 'Ende United FC',
    location: 'Ende, Flores, NTT',
    description: 'Sublimasi full-print motif Ende Diamond Zawo Gold dengan jahitan rantai profesional standar liga.',
    orderQuantity: 18,
  },
  {
    id: 'port-2',
    title: 'Jersey Voli Flores Ocean Waves',
    category: 'Voli',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    clientName: 'Voli Flores Youth',
    location: 'Maumere, Sikka, NTT',
    description: 'Pola sleeveless singlet adem anti-bakteri dari Dry-Fit Serena Soft Flex.',
    orderQuantity: 14,
  },
  {
    id: 'port-3',
    title: 'Jersey Lari Maraton Kelimutu',
    category: 'Lari',
    imageUrl: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&w=800&q=80',
    clientName: 'Komunitas Lari Nusa Bunga',
    location: 'Bajawa, Ngada, NTT',
    description: 'Gradasi 3 warna kawah Kelimutu dengan reflective strip pemantul cahaya untuk lari malam.',
    orderQuantity: 25,
  },
  {
    id: 'port-4',
    title: 'Polo Shirt Panitia Fest Kelimutu',
    category: 'Panitia',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    clientName: 'Panitia Festival Kelimutu',
    location: 'Ende, Flores, NTT',
    description: 'Kerah rajut polo eksklusif dengan aksen tenun Zawo di dada & ujung lengan.',
    orderQuantity: 45,
  }
];

export const INITIAL_TESTIMONIALS_SEED: CMSTestimonialItem[] = [
  {
    id: 'testi-1',
    clientName: 'Karel Wua',
    teamOrOrg: 'Manager Ende United FC',
    location: 'Ende, NTT',
    quote: 'Kualitas sublimasi Riza Apparel sangat tajam! Motif tenun Ende Zawo di bagian bahu jersey tim kami langsung jadi sorotan di turnamen daerah. Bahan adem dan proses pengerjaan tepat 5 hari.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verifiedOrder: true,
  },
  {
    id: 'testi-2',
    clientName: 'Maria Lado',
    teamOrOrg: 'Komunitas Lari Nusa Bunga',
    location: 'Bajawa, NTT',
    quote: 'Sudah 3 kali re-order jersey komunitas di Riza Apparel. Fitur preview 3D memudahkan kami mufakat warna sebelum DP. Pelayanan admin ramah & bisa pesan satuan!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    verifiedOrder: true,
  },
  {
    id: 'testi-3',
    clientName: 'Fransiskus X. Nono',
    teamOrOrg: 'Kapten Voli Flores Youth',
    location: 'Maumere, NTT',
    quote: 'Bahan Dry-Fit Serena halus sekali, tidak panas saat dipakai tanding outdoor. Fitur tracking via token juga bikin kami tenang karena bisa pantau status jahit tiap hari.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verifiedOrder: true,
  }
];

export const INITIAL_USP_SEED: CMSUSPItem[] = [
  {
    id: 'usp-1',
    title: 'Mesin Sublimasi EPSON 1440 DPI',
    description: 'Warna tajam anti-luntur, aman dicuci mesin berkali-kali tanpa memudar.',
    iconName: 'Printer',
    highlightTag: 'Garansi Warna 100%',
  },
  {
    id: 'usp-2',
    title: 'Akulturasi Motif Tenun NTT',
    description: 'Atribusi motif lokal Ende Zawo, Flores Waves, & Kelimutu resmi terdaftar.',
    iconName: 'Sparkles',
    highlightTag: 'Warisan Budaya Lokal',
  },
  {
    id: 'usp-3',
    title: 'Bahan Kain Dry-Fit Premium',
    description: 'Sirkulasi udara optimal, cepat kering, dan perlakuan anti-bakteri.',
    iconName: 'ShieldCheck',
    highlightTag: 'Bahan Impor QC',
  },
  {
    id: 'usp-4',
    title: '3D Studio & Tracking Token',
    description: 'Simulator jersey 3D real-time & lacak status pengerjaan via token unik.',
    iconName: 'Zap',
    highlightTag: 'Teknologi Digital',
  }
];

export const INITIAL_CONTACT_SEED: CMSContactConfig = {
  whatsappNumber: '6281234567890',
  addressText: 'Jl. Kelimutu No. 45, Kel. Onekore, Kec. Ende Tengah, Kabupaten Ende, Flores, NTT 86318',
  operationalHours: 'Senin - Sabtu: 08.00 - 18.00 WITA',
  instagramHandle: '@riza_apparel_ende',
  tiktokHandle: '@rizaapparel.ntt',
  email: 'info@rizaapparel.id',
  mapEmbedUrl: 'https://maps.google.com/?q=Ende+NTT',
};

export const INITIAL_CUSTOMER_TIERS_SEED: CMSCustomerTier[] = [
  {
    id: 'cust-1',
    nama: 'Karel Wua',
    nomor_whatsapp: '081234567890',
    nama_tim: 'Ende United FC',
    total_pesanan: 3,
    total_pengeluaran: 4850000,
    tier: 'VIP Club',
    terakhir_pesan: '2026-09-15',
    catatan: 'Pelanggan setia turnamen sepak bola Ende.',
  },
  {
    id: 'cust-2',
    nama: 'Maria Lado',
    nomor_whatsapp: '082198765432',
    nama_tim: 'Komunitas Lari Nusa Bunga',
    total_pesanan: 2,
    total_pengeluaran: 2500000,
    tier: 'Setia',
    terakhir_pesan: '2026-09-10',
    catatan: 'Re-order seragam marathon 25 pcs.',
  },
  {
    id: 'cust-3',
    nama: 'Emanuel Nono',
    nomor_whatsapp: '085239182390',
    nama_tim: 'Voli Flores Youth',
    total_pesanan: 1,
    total_pengeluaran: 1330000,
    tier: 'Reguler',
    terakhir_pesan: '2026-09-18',
    catatan: 'Pesan jersey voli sleeveless 14 pcs.',
  },
];

export const INITIAL_WA_TEMPLATES_SEED: CMSWATemplate[] = [
  {
    id: 'tpl-1',
    nama_templat: 'Pengingat DP & Konfirmasi Desain',
    kategori: 'dp_reminder',
    isi_pesan: 'Halo Kak {NAMA} dari {TIM}! 👋 Terima kasih telah melakukan konsultasi di Riza Apparel Ende. Desain jersey {DESAIN} Anda telah kami siapkan. Silakan lakukan pembayaran DP 50% untuk memulai proses cetak sublimasi. Lacak status pesanan Anda kapan saja di: {LINK}',
  },
  {
    id: 'tpl-2',
    nama_templat: 'Persetujuan Proofing Cetak',
    kategori: 'proofing',
    isi_pesan: 'Halo Kak {NAMA}! Hasil proofing layout cetak sublimasi untuk tim {TIM} sudah siap disetujui. Mohon periksa kembali ejaan nama & nomor punggung sebelum kami naikkan ke mesin cetak: {LINK}',
  },
  {
    id: 'tpl-3',
    nama_templat: 'Kabar Pesanan Selesai & Siap Kirim',
    kategori: 'selesai',
    isi_pesan: 'Hore! 🎉 Pesanan jersey tim {TIM} sejumlah {JUMLAH} pcs telah selesai diproduksi & lulus QC di workshop Riza Apparel Ende. Siap kami kirim/diambil. Cek foto hasil jadi di tautan tracking Anda: {LINK}',
  },
  {
    id: 'tpl-4',
    nama_templat: 'Permintaan Ulasan & Rating CSAT',
    kategori: 'csat_review',
    isi_pesan: 'Terima kasih telah mempercayakan pembuatan jersey tim {TIM} kepada Riza Apparel Ende! 🙏 Bagikan ulasan & pengalaman Anda untuk membantu kemajuan UMKM lokal Ende NTT di: {LINK}',
  },
];

export const INITIAL_CSAT_SEED: CMSCSATRating[] = [
  {
    id: 'csat-1',
    nama_pelanggan: 'Karel Wua',
    nama_tim: 'Ende United FC',
    bintang: 5,
    ulasan: 'Jahitan super rapi, motif Ende Zawo presisi banget! Sangat puas.',
    tanggal: '2026-09-16',
    token_akses: 'rz-98a2f4k1m992',
    status_publikasi: true,
  },
  {
    id: 'csat-2',
    nama_pelanggan: 'Emanuel Nono',
    nama_tim: 'Voli Flores Youth',
    bintang: 5,
    ulasan: 'Pelayanan cepat dan ramah via WA. Hasil cetak warna cerah dan tajam!',
    tanggal: '2026-09-19',
    token_akses: 'rz-4k2m991b88a9',
    status_publikasi: true,
  }
];

export const INITIAL_UNANSWERED_SEED: UnansweredQuestion[] = [
  {
    id: 'unans-1',
    pertanyaan: 'Apakah ada diskon pemesanan untuk tim sepak bola sekolah?',
    frekuensi: 3,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'unans-2',
    pertanyaan: 'Berapa biaya pengiriman luar pulau Flores?',
    frekuensi: 2,
    timestamp: new Date().toISOString(),
  }
];

export const INITIAL_ABOUT_SEED: CMSAboutConfig = {
  sectionTitle: 'Mengenal RIZA APPAREL Lebih Dekat',
  sectionSubtitle: 'Spesialis Konveksi & Sublimasi Jersey Beridentitas Budaya Ende NTT',
  companyOverview: 'RIZA APPAREL berkomitmen menghadirkan jersey dan sportswear custom kelas premium yang memadukan estetika desain modern dengan presisi teknis tinggi. Perkuat karakter, semangat, dan kebanggaan tim Anda bersama kami sekarang.',
  visionTitle: 'Visi Utama',
  visionText: 'Menjadi produsen jersey custom dan sportswear terdepan di Nusa Tenggara Timur yang mengangkat nilai warisan budaya lokal ke kancah nasional melalui inovasi teknologi sublimasi digital dan kualitas garmen terbaik.',
  missionTitle: 'Misi Utama',
  missionText: 'Memproduksi apparel olahraga berkualitas tinggi dengan bahan Dry-Fit premium, melestarikan motif tenun ikat khas Ende Flores, dan memberikan pelayanan profesional tanpa batas minimal pemesanan.',
};

export const INITIAL_PROMO_SEED: CMSPromoItem[] = [
  {
    id: 'promo-1',
    title: 'Promo Spesial Beli 2 Bonus 1 Pcs',
    description: 'Setiap pemesanan kelipatan 2 pcs jersey custom, dapatkan gratis 1 pcs jersey tambahan untuk anggota tim Anda!',
    badge: '🔥 PALING POPULER',
    code: 'BELI2BONUS1',
  },
  {
    id: 'promo-2',
    title: 'Gratis Ongkir Seluruh Wilayah NTT',
    description: 'Bebas biaya pengiriman ke area Ende, Maumere, Bajawa, Ruteng, Labuan Bajo, Kupang & seluruh pelosok Nusa Tenggara Timur.',
    badge: '🚚 GRATIS ONGKIR',
    code: 'FREEONGKIRNTT',
  },
  {
    id: 'promo-3',
    title: 'Diskon Seragam Tim ≥ 12 Pcs',
    description: 'Potongan harga khusus untuk pemesanan seragam tim sepak bola, futsal, voli, basket, dan kontingen event.',
    badge: '🏆 DISKON TIM',
    code: 'PROMOTIM12',
  },
];

export const INITIAL_WORKFLOW_SEED: CMSWorkflowStep[] = [
  {
    id: 'wf-1',
    stepNumber: '01',
    title: 'Desain & Draf 2D/3D',
    description: 'Eksplorasi motif tenun ikat & warna di studio web 3D, lalu kirimkan ringkasan draf ke WhatsApp admin.',
    iconName: 'Sparkles',
  },
  {
    id: 'wf-2',
    stepNumber: '02',
    title: 'Approval & Proofing',
    description: 'Tim desainer merapikan file vektor, layout sponsor, serta daftar nama & nomor punggung pemain.',
    iconName: 'FileCheck',
  },
  {
    id: 'wf-3',
    stepNumber: '03',
    title: 'Cetak Sublim 1440 DPI',
    description: 'Pencetakan tinta original anti-luntur pada kertas transfer khusus berstandar garmen ekspor.',
    iconName: 'Printer',
  },
  {
    id: 'wf-4',
    stepNumber: '04',
    title: 'Press Suhu Tinggi & Jahit',
    description: 'Proses transfer sublimasi disusul penjahitan rantai rapi oleh penjahit garmen profesional.',
    iconName: 'Scissors',
  },
  {
    id: 'wf-5',
    stepNumber: '05',
    title: 'QC & Kirim Bebas Ongkir',
    description: 'Pemeriksaan jahitan dan ukuran, packing rapi, dan dikirim bebas ongkir ke seluruh pelosok NTT.',
    iconName: 'Truck',
  },
];

export const INITIAL_FAQ_SEED: CMSFAQItem[] = [
  {
    id: 'faq-1',
    question: 'Berapa minimal jumlah pemesanan (minimal order) di Riza Apparel?',
    answer: 'Tidak ada minimum order! Di RIZA APPAREL, Anda bisa memesan Satuan (1 Pcs) maupun untuk seragam seluruh tim/kontingen dengan standar kualitas sublimasi presisi yang sama tingginya.',
  },
  {
    id: 'faq-2',
    question: 'Berapa lama estimasi waktu pengerjaan jersey custom?',
    answer: 'Estimasi produksi presisi kami berkisar antara 3 hingga 5 hari kerja (tergantung antrean slot dan jumlah pcs), disertai garansi kepatuhan waktu dan kustomisasi sesuai kesepakatan.',
  },
  {
    id: 'faq-3',
    question: 'Bagaimana cara klaim Promo Beli 2 Bonus 1 Pcs & Gratis Ongkir NTT?',
    answer: 'Promo Beli 2 Bonus 1 Pcs dan Gratis Ongkir area Ende & NTT otomatis berlaku untuk setiap pemesanan kelipatan 2 pcs. Anda cukup memilih varian jersey yang diinginkan di Studio 2D atau via WhatsApp.',
  },
  {
    id: 'faq-4',
    question: 'Apakah tim Riza Apparel bisa membantu membuatkan desain jika belum memiliki file vektor?',
    answer: 'Tentu saja! Kami memberikan layanan 100% Bebas Biaya Desain & Revisi. Tim desainer kami akan memvektorisasi ide, sketsa, logo, maupun motif tenun ikat Ende Zawo Anda hingga siap cetak.',
  },
  {
    id: 'faq-5',
    question: 'Apakah harga di katalog sudah termasuk cetak nama, nomor punggung, & logo sponsor?',
    answer: 'Ya! Harga transparan kami (Mulai Rp90.000 / pcs) sudah mencakup pencetakan sublimasi full print anti-luntur, custom nama pemain, nomor punggung, serta logo sponsor tanpa biaya tersembunyi.',
  },
];

export const INITIAL_PARTNERS_SEED: CMSPartnerItem[] = [
  {
    id: 'part-1',
    name: 'REGARSPORT',
    role: 'Mitra Utama Ekosistem Apparel',
    type: 'svg',
    logoDark: '/logos/logo-regarsport-dark.svg',
    logoLight: '/logos/logo-regarsport-light.svg',
  },
  {
    id: 'part-2',
    name: 'REGARMARKET',
    role: 'Jaringan Distribusi Reseller',
    type: 'svg',
    logoDark: '/logos/logo-regar-market-dark.svg',
    logoLight: '/logos/logo-regar-market-light.svg',
  },
  {
    id: 'part-3',
    name: 'GESA WAZO ENDE',
    role: 'Mitra Komunitas Kebudayaan Flores',
    type: 'badge',
    customText: 'GESA WAZO ENDE',
  },
  {
    id: 'part-4',
    name: 'ENDE UNITED FC',
    role: 'Klub Futsal & Sepak Bola Regional',
    type: 'badge',
    customText: 'ENDE UNITED FC',
  },
  {
    id: 'part-5',
    name: 'NUSA BUNGA RUNNERS',
    role: 'Komunitas Lari & Athletics NTT',
    type: 'badge',
    customText: 'NUSA BUNGA RUNNERS',
  },
  {
    id: 'part-6',
    name: 'FLORES YOUTH VOLLEY',
    role: 'Akademi Olahraga Voli NTT',
    type: 'badge',
    customText: 'FLORES YOUTH VOLLEY',
  },
];

export async function seedInitialFirestoreData(): Promise<{ success: boolean; count: number }> {
  try {
    let count = 0;
    for (const prod of INITIAL_PRODUCTS_SEED) {
      await saveCMSProduct(prod);
      count++;
    }
    for (const m of INITIAL_MOTIFS_SEED) {
      await saveCMSMotif(m);
      count++;
    }
    for (const lead of INITIAL_LEADS_SEED) {
      const docRef = doc(db, 'leads', lead.id!);
      await setDoc(docRef, lead, { merge: true });
      count++;
    }
    for (const order of INITIAL_ORDERS_SEED) {
      const docRef = doc(db, 'orders', order.id!);
      await setDoc(docRef, order, { merge: true });
      count++;
    }
    for (const unans of INITIAL_UNANSWERED_SEED) {
      const docRef = doc(db, 'unansweredQuestions', unans.id!);
      await setDoc(docRef, unans, { merge: true });
      count++;
    }
    return { success: true, count };
  } catch (e) {
    console.warn('Data seeding note:', e);
    return { success: false, count: 0 };
  }
}

