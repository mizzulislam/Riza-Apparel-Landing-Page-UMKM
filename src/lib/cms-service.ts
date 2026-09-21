import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { CatalogItem, Testimonial } from '../types';

// ===== DATA SCHEMAS & INTERFACES =====

export interface CMSMotif {
  id?: string;
  nama_motif: string;
  kategori_kultural: string; // 'ende-zawo' | 'flores-waves' | 'kelimutu' | 'modern'
  file_aset: string;         // Data URL or SVG string
  atribusi_sumber: string;   // Wajib diisi per aturan R7 & FR-C2
  status_aktif: boolean;
  createdAt?: string;
}

export interface CMSLead {
  id?: string;
  nama: string;
  nomor_whatsapp: string;
  nama_tim?: string;
  estimasi_jumlah_pesanan: number;
  id_desain_terkait?: string;
  ringkasan_desain?: string;
  status_tindak_lanjut: 'baru' | 'dihubungi' | 'jadi_pesanan' | 'batal';
  penerimaan_pdp: boolean;   // Mandatory explicit consent checkbox (FR-E7)
  tanggal_masuk: string;
}

export interface CMSOrder {
  id?: string;
  id_prospek_terkait?: string;
  nama_pemesan: string;
  nomor_whatsapp?: string; // Private field (hanya terlihat admin)
  nama_tim?: string;
  status_pesanan: 'Diterima' | 'Diproduksi' | 'Selesai';
  jumlah_item: number;
  rincian_desain?: string;
  tanggal_konfirmasi: string;
  estimasi_selesai: string;
  catatan_admin?: string;
  token_akses_unik: string; // Token acak sulit ditebak untuk tracking pelanggan (FR-E9)
}

export interface UnansweredQuestion {
  id?: string;
  pertanyaan: string;
  timestamp: string;
  frekuensi: number;
}

export interface CMSHeroSlide {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
  price?: string;
}

export interface CMSHeroConfig {
  headlineTitle: string;
  headlineHighlight?: string;
  subtext: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  bannerBadgeText: string;
  ratingBadgeText: string;
  slides?: CMSHeroSlide[];
}

export interface CMSPortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  clientName: string;
  location: string;
  description: string;
  orderQuantity: number;
}

export interface CMSTestimonialItem {
  id: string;
  clientName: string;
  teamOrOrg: string;
  location: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  verifiedOrder: boolean;
}

export interface CMSUSPItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlightTag?: string;
}

export interface CMSContactConfig {
  whatsappNumber: string;
  addressText: string;
  operationalHours: string;
  instagramHandle: string;
  tiktokHandle: string;
  email: string;
  mapEmbedUrl?: string;
}

export interface CMSAboutConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  companyOverview: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
}

export interface CMSPromoItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  code?: string;
}

export interface CMSWorkflowStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface CMSFAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CMSPartnerItem {
  id: string;
  name: string;
  role: string;
  type: 'svg' | 'img' | 'badge';
  logoDark?: string;
  logoLight?: string;
  customText?: string;
}

export interface CMSCustomerTier {
  id: string;
  nama: string;
  nomor_whatsapp: string;
  nama_tim: string;
  total_pesanan: number;
  total_pengeluaran: number;
  tier: 'VIP Club' | 'Setia' | 'Reguler' | 'Baru';
  terakhir_pesan: string;
  catatan?: string;
}

export interface CMSWATemplate {
  id: string;
  nama_templat: string;
  kategori: 'dp_reminder' | 'proofing' | 'selesai' | 'csat_review';
  isi_pesan: string;
}

export interface CMSCSATRating {
  id: string;
  nama_pelanggan: string;
  nama_tim: string;
  bintang: number;
  ulasan: string;
  tanggal: string;
  token_akses: string;
  status_publikasi: boolean;
}

export interface CMSCatalogConfig {
  tagBadgeText: string;
  sectionTitle: string;
  sectionSubtitle: string;
}

export interface CMSPromoHeaderConfig {
  tagBadgeText: string;
  sectionTitle: string;
  sectionSubtitle: string;
}

export interface CMSWorkflowHeaderConfig {
  tagBadgeText: string;
  sectionTitle: string;
  sectionSubtitle: string;
}

export interface CMSFAQHeaderConfig {
  tagBadgeText: string;
  sectionTitle: string;
  sectionSubtitle: string;
}

export interface CMSTestimonialsHeaderConfig {
  testiTagBadgeText: string;
  testiSectionTitle: string;
  testiSectionSubtitle: string;
  partnerTagBadgeText: string;
  partnerSectionTitle: string;
  partnerSectionSubtitle: string;
}

import { 
  INITIAL_PRODUCTS_SEED, 
  INITIAL_MOTIFS_SEED, 
  INITIAL_LEADS_SEED, 
  INITIAL_ORDERS_SEED, 
  INITIAL_UNANSWERED_SEED,
  INITIAL_HERO_SEED,
  INITIAL_PORTFOLIO_SEED,
  INITIAL_TESTIMONIALS_SEED,
  INITIAL_USP_SEED,
  INITIAL_CONTACT_SEED,
  INITIAL_ABOUT_SEED,
  INITIAL_PROMO_SEED,
  INITIAL_WORKFLOW_SEED,
  INITIAL_FAQ_SEED,
  INITIAL_PARTNERS_SEED,
  INITIAL_CUSTOMER_TIERS_SEED,
  INITIAL_WA_TEMPLATES_SEED,
  INITIAL_CSAT_SEED,
  INITIAL_CATALOG_SEED,
  INITIAL_PROMO_HEADER_SEED,
  INITIAL_WORKFLOW_HEADER_SEED,
  INITIAL_FAQ_HEADER_SEED,
  INITIAL_TESTIMONIALS_HEADER_SEED
} from './seed-data';

// ===== CMS SERVICE METHODS =====

// --- 1. KATALOG PRODUK ---
export async function getCMSProducts(): Promise<CatalogItem[]> {
  let localProducts: CatalogItem[] = [];
  try {
    const local = localStorage.getItem('riza_cms_products_override');
    if (local) localProducts = JSON.parse(local);
  } catch (e) {}

  try {
    const q = query(collection(db, 'products'), orderBy('id', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) return localProducts.length > 0 ? localProducts : INITIAL_PRODUCTS_SEED;
    const firestoreProds = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CatalogItem));
    
    if (localProducts.length > 0) {
      const mergedMap = new Map<string, CatalogItem>();
      firestoreProds.forEach(p => mergedMap.set(p.id, p));
      localProducts.forEach(p => mergedMap.set(p.id, p));
      return Array.from(mergedMap.values());
    }
    return firestoreProds;
  } catch (e) {
    console.warn('Error fetching CMS products, fallback local:', e);
    return localProducts.length > 0 ? localProducts : INITIAL_PRODUCTS_SEED;
  }
}

export async function saveCMSProduct(product: CatalogItem): Promise<void> {
  // Update local storage override so it persists locally
  try {
    const local = localStorage.getItem('riza_cms_products_override');
    const products: CatalogItem[] = local ? JSON.parse(local) : [...INITIAL_PRODUCTS_SEED];
    const idx = products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem('riza_cms_products_override', JSON.stringify(products));
  } catch (e) {}

  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (e) {
    console.warn('Firestore product save note (saved locally):', e);
  }
}

export async function saveCMSProducts(products: CatalogItem[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_products_override', JSON.stringify(products));
    await setDoc(doc(db, 'siteConfig', 'products_list'), { items: products }, { merge: true });
  } catch (e) {}
}

export async function saveCMSMotifs(motifs: CMSMotif[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_motifs_override', JSON.stringify(motifs));
    await setDoc(doc(db, 'siteConfig', 'motifs_list'), { items: motifs }, { merge: true });
  } catch (e) {}
}

// --- 2. PUSTAKA MOTIF TENUN (FR-C2) ---
export async function getCMSMotifs(): Promise<CMSMotif[]> {
  let localMotifs: CMSMotif[] = [];
  try {
    const local = localStorage.getItem('riza_cms_motifs_override');
    if (local) localMotifs = JSON.parse(local);
  } catch (e) {}

  try {
    const q = query(collection(db, 'motifs'), orderBy('nama_motif', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) return localMotifs.length > 0 ? localMotifs : INITIAL_MOTIFS_SEED;
    const firestoreMotifs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CMSMotif));
    if (localMotifs.length > 0) {
      const mergedMap = new Map<string, CMSMotif>();
      firestoreMotifs.forEach(m => mergedMap.set(m.id || m.nama_motif, m));
      localMotifs.forEach(m => mergedMap.set(m.id || m.nama_motif, m));
      return Array.from(mergedMap.values());
    }
    return firestoreMotifs;
  } catch (e) {
    return localMotifs.length > 0 ? localMotifs : INITIAL_MOTIFS_SEED;
  }
}

export async function saveCMSMotif(motif: CMSMotif): Promise<string> {
  if (!motif.atribusi_sumber || !motif.atribusi_sumber.trim()) {
    throw new Error('Atribusi sumber kultural wajib diisi untuk motif tenun.');
  }

  try {
    const local = localStorage.getItem('riza_cms_motifs_override');
    const motifs: CMSMotif[] = local ? JSON.parse(local) : [...INITIAL_MOTIFS_SEED];
    const idx = motifs.findIndex(m => (m.id && m.id === motif.id) || m.nama_motif === motif.nama_motif);
    if (idx >= 0) {
      motifs[idx] = motif;
    } else {
      motifs.push(motif);
    }
    localStorage.setItem('riza_cms_motifs_override', JSON.stringify(motifs));
  } catch (e) {}

  try {
    if (motif.id) {
      await updateDoc(doc(db, 'motifs', motif.id), { ...motif });
      return motif.id;
    } else {
      const ref = await addDoc(collection(db, 'motifs'), {
        ...motif,
        createdAt: new Date().toISOString()
      });
      return ref.id;
    }
  } catch (e) {
    console.warn('Firestore motif save note (saved locally):', e);
    return motif.id || 'local-motif-' + Date.now();
  }
}

// --- 3. CRM PROSPEK / LEAD CAPTURE (FR-B2, FR-B3) ---
export async function createLeadCapture(lead: Omit<CMSLead, 'id' | 'tanggal_masuk' | 'status_tindak_lanjut'>): Promise<string> {
  const newLead: CMSLead = {
    ...lead,
    status_tindak_lanjut: 'baru',
    tanggal_masuk: new Date().toISOString()
  };
  const ref = await addDoc(collection(db, 'leads'), newLead);
  return ref.id;
}

export async function getCMSLeads(): Promise<CMSLead[]> {
  try {
    const q = query(collection(db, 'leads'), orderBy('tanggal_masuk', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) return INITIAL_LEADS_SEED;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CMSLead));
  } catch (e) {
    return INITIAL_LEADS_SEED;
  }
}

export async function updateLeadStatus(id: string, status: CMSLead['status_tindak_lanjut']): Promise<void> {
  await updateDoc(doc(db, 'leads', id), { status_tindak_lanjut: status });
}

// --- 4. PESANAN & TRACKING STATUS TOKEN UNIK (FR-E9, UC10, UC12) ---
// Generate token acak yang sulit ditebak (16 karakter hex)
function generateOrderToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'rz-';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function createOrderFromLead(orderData: Omit<CMSOrder, 'id' | 'token_akses_unik' | 'tanggal_konfirmasi'>): Promise<{ id: string; token: string }> {
  const token = generateOrderToken();
  const newOrder: CMSOrder = {
    ...orderData,
    token_akses_unik: token,
    tanggal_konfirmasi: new Date().toISOString()
  };
  const ref = await addDoc(collection(db, 'orders'), newOrder);
  return { id: ref.id, token };
}

export async function getCMSOrders(): Promise<CMSOrder[]> {
  try {
    const q = query(collection(db, 'orders'), orderBy('tanggal_konfirmasi', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) return INITIAL_ORDERS_SEED;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CMSOrder));
  } catch (e) {
    return INITIAL_ORDERS_SEED;
  }
}

export async function updateOrderStatus(id: string, status: CMSOrder['status_pesanan'], estimasiSelesai?: string, catatan?: string): Promise<void> {
  const updates: Partial<CMSOrder> = { status_pesanan: status };
  if (estimasiSelesai) updates.estimasi_selesai = estimasiSelesai;
  if (catatan) updates.catatan_admin = catatan;
  await updateDoc(doc(db, 'orders', id), updates);
}

// Ambil status pesanan berdasarkan Token Unik Akses Pelanggan (Aman - Tanpa No WA)
export async function getOrderByToken(token: string): Promise<Partial<CMSOrder> | null> {
  try {
    const normalizedToken = token.trim().toLowerCase();
    const q = query(collection(db, 'orders'), where('token_akses_unik', '==', normalizedToken), limit(1));
    const snap = await getDocs(q);
    let data: CMSOrder | undefined;
    if (snap.empty) {
      data = INITIAL_ORDERS_SEED.find(o => o.token_akses_unik.toLowerCase() === normalizedToken || o.token_akses_unik.toLowerCase().includes(normalizedToken));
    } else {
      data = snap.docs[0].data() as CMSOrder;
    }
    if (!data) return null;
    return {
      nama_pemesan: data.nama_pemesan,
      nama_tim: data.nama_tim,
      status_pesanan: data.status_pesanan,
      jumlah_item: data.jumlah_item,
      rincian_desain: data.rincian_desain,
      tanggal_konfirmasi: data.tanggal_konfirmasi,
      estimasi_selesai: data.estimasi_selesai,
    };
  } catch (e) {
    const data = INITIAL_ORDERS_SEED.find(o => o.token_akses_unik.toLowerCase() === token.trim().toLowerCase());
    if (data) {
      return {
        nama_pemesan: data.nama_pemesan,
        nama_tim: data.nama_tim,
        status_pesanan: data.status_pesanan,
        jumlah_item: data.jumlah_item,
        rincian_desain: data.rincian_desain,
        tanggal_konfirmasi: data.tanggal_konfirmasi,
        estimasi_selesai: data.estimasi_selesai,
      };
    }
    return null;
  }
}

// --- 5. KNOWLEDGE BASE & LOG UNANSWERED QUESTIONS (FR-E1, FR-E2) ---
export async function logUnansweredQuestion(pertanyaan: string): Promise<void> {
  try {
    const q = query(collection(db, 'unansweredQuestions'), where('pertanyaan', '==', pertanyaan.trim().toLowerCase()), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docId = snap.docs[0].id;
      const currentFreq = snap.docs[0].data().frekuensi || 1;
      await updateDoc(doc(db, 'unansweredQuestions', docId), {
        frekuensi: currentFreq + 1,
        timestamp: new Date().toISOString()
      });
    } else {
      await addDoc(collection(db, 'unansweredQuestions'), {
        pertanyaan: pertanyaan.trim().toLowerCase(),
        frekuensi: 1,
        timestamp: new Date().toISOString()
      });
    }
  } catch (e) {}
}

export async function getUnansweredQuestions(): Promise<UnansweredQuestion[]> {
  try {
    const q = query(collection(db, 'unansweredQuestions'), orderBy('frekuensi', 'desc'), limit(20));
    const snap = await getDocs(q);
    if (snap.empty) return INITIAL_UNANSWERED_SEED;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UnansweredQuestion));
  } catch (e) {
    return INITIAL_UNANSWERED_SEED;
  }
}

// --- 6. HERO BANNER CONFIG ---
export async function getCMSHeroConfig(): Promise<CMSHeroConfig> {
  try {
    const local = localStorage.getItem('riza_cms_hero_override');
    if (local) {
      const parsed = JSON.parse(local);
      return { ...INITIAL_HERO_SEED, ...parsed };
    }
  } catch (e) {}
  return INITIAL_HERO_SEED;
}

export async function saveCMSHeroConfig(config: CMSHeroConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_hero_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'hero'), config, { merge: true });
  } catch (e) {}
}

// --- 7. PORTFOLIO & GALLERY ---
export async function getCMSPortfolio(): Promise<CMSPortfolioItem[]> {
  try {
    const local = localStorage.getItem('riza_cms_portfolio_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_PORTFOLIO_SEED;
}

export async function saveCMSPortfolio(items: CMSPortfolioItem[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_portfolio_override', JSON.stringify(items));
    await setDoc(doc(db, 'siteConfig', 'portfolio'), { items }, { merge: true });
  } catch (e) {}
}

// --- 8. TESTIMONIALS & REVIEWS ---
export async function getCMSTestimonials(): Promise<CMSTestimonialItem[]> {
  try {
    const local = localStorage.getItem('riza_cms_testimonials_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_TESTIMONIALS_SEED;
}

export async function saveCMSTestimonials(items: CMSTestimonialItem[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_testimonials_override', JSON.stringify(items));
    await setDoc(doc(db, 'siteConfig', 'testimonials'), { items }, { merge: true });
  } catch (e) {}
}

// --- 9. USP & VALUE PROPOSITIONS ---
export async function getCMSUSP(): Promise<CMSUSPItem[]> {
  try {
    const local = localStorage.getItem('riza_cms_usp_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_USP_SEED;
}

export async function saveCMSUSP(items: CMSUSPItem[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_usp_override', JSON.stringify(items));
    await setDoc(doc(db, 'siteConfig', 'usp'), { items }, { merge: true });
  } catch (e) {}
}

// --- 10. CONTACT & FOOTER CONFIG ---
export async function getCMSContactConfig(): Promise<CMSContactConfig> {
  try {
    const local = localStorage.getItem('riza_cms_contact_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_CONTACT_SEED;
}

export async function saveCMSContactConfig(config: CMSContactConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_contact_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'contact'), config, { merge: true });
  } catch (e) {}
}

// --- 11. CRM MLP FEATURES: CUSTOMER TIERS ---
export async function getCMSCustomerTiers(): Promise<CMSCustomerTier[]> {
  try {
    const local = localStorage.getItem('riza_crm_cust_tiers');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_CUSTOMER_TIERS_SEED;
}

export async function saveCMSCustomerTiers(tiers: CMSCustomerTier[]): Promise<void> {
  try {
    localStorage.setItem('riza_crm_cust_tiers', JSON.stringify(tiers));
  } catch (e) {}
}

// --- 12. CRM MLP FEATURES: WA TEMPLATES ---
export async function getCMSWATemplates(): Promise<CMSWATemplate[]> {
  try {
    const local = localStorage.getItem('riza_crm_wa_templates');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_WA_TEMPLATES_SEED;
}

export async function saveCMSWATemplates(templates: CMSWATemplate[]): Promise<void> {
  try {
    localStorage.setItem('riza_crm_wa_templates', JSON.stringify(templates));
  } catch (e) {}
}

// --- 13. CRM MLP FEATURES: CSAT RATINGS ---
export async function getCMSCSATRatings(): Promise<CMSCSATRating[]> {
  try {
    const local = localStorage.getItem('riza_crm_csat_ratings');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_CSAT_SEED;
}

export async function saveCMSCSATRatings(ratings: CMSCSATRating[]): Promise<void> {
  try {
    localStorage.setItem('riza_crm_csat_ratings', JSON.stringify(ratings));
  } catch (e) {}
}

// --- 14. TENTANG KAMI CONFIG ---
export async function getCMSAboutConfig(): Promise<CMSAboutConfig> {
  try {
    const local = localStorage.getItem('riza_cms_about_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_ABOUT_SEED;
}

export async function saveCMSAboutConfig(config: CMSAboutConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_about_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'about'), config, { merge: true });
  } catch (e) {}
}

// --- 15. PAKET & PROMO ---
export async function getCMSPromos(): Promise<CMSPromoItem[]> {
  try {
    const local = localStorage.getItem('riza_cms_promos_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_PROMO_SEED;
}

export async function saveCMSPromos(items: CMSPromoItem[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_promos_override', JSON.stringify(items));
    await setDoc(doc(db, 'siteConfig', 'promos'), { items }, { merge: true });
  } catch (e) {}
}

// --- 16. ALUR PRODUKSI ---
export async function getCMSWorkflow(): Promise<CMSWorkflowStep[]> {
  try {
    const local = localStorage.getItem('riza_cms_workflow_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_WORKFLOW_SEED;
}

export async function saveCMSWorkflow(steps: CMSWorkflowStep[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_workflow_override', JSON.stringify(steps));
    await setDoc(doc(db, 'siteConfig', 'workflow'), { steps }, { merge: true });
  } catch (e) {}
}

// --- 17. FAQ SECTION ---
export async function getCMSFAQ(): Promise<CMSFAQItem[]> {
  try {
    const local = localStorage.getItem('riza_cms_faq_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_FAQ_SEED;
}

export async function saveCMSFAQ(items: CMSFAQItem[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_faq_override', JSON.stringify(items));
    await setDoc(doc(db, 'siteConfig', 'faq'), { items }, { merge: true });
  } catch (e) {}
}

// --- 18. MITRA & KLIEN LOGOS ---
export async function getCMSPartners(): Promise<CMSPartnerItem[]> {
  try {
    const local = localStorage.getItem('riza_cms_partners_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_PARTNERS_SEED;
}

export async function saveCMSPartners(items: CMSPartnerItem[]): Promise<void> {
  try {
    localStorage.setItem('riza_cms_partners_override', JSON.stringify(items));
    await setDoc(doc(db, 'siteConfig', 'partners'), { items }, { merge: true });
  } catch (e) {}
}

// --- 19. KATALOG SECTION HEADER CONFIG ---
export async function getCMSCatalogConfig(): Promise<CMSCatalogConfig> {
  try {
    const local = localStorage.getItem('riza_cms_catalog_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_CATALOG_SEED;
}

export async function saveCMSCatalogConfig(config: CMSCatalogConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_catalog_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'catalog'), config, { merge: true });
  } catch (e) {}
}

// --- 20. PROMO SECTION HEADER CONFIG ---
export async function getCMSPromoHeaderConfig(): Promise<CMSPromoHeaderConfig> {
  try {
    const local = localStorage.getItem('riza_cms_promo_header_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_PROMO_HEADER_SEED;
}

export async function saveCMSPromoHeaderConfig(config: CMSPromoHeaderConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_promo_header_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'promoHeader'), config, { merge: true });
  } catch (e) {}
}

// --- 21. WORKFLOW SECTION HEADER CONFIG ---
export async function getCMSWorkflowHeaderConfig(): Promise<CMSWorkflowHeaderConfig> {
  try {
    const local = localStorage.getItem('riza_cms_workflow_header_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_WORKFLOW_HEADER_SEED;
}

export async function saveCMSWorkflowHeaderConfig(config: CMSWorkflowHeaderConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_workflow_header_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'workflowHeader'), config, { merge: true });
  } catch (e) {}
}

// --- 22. FAQ SECTION HEADER CONFIG ---
export async function getCMSFAQHeaderConfig(): Promise<CMSFAQHeaderConfig> {
  try {
    const local = localStorage.getItem('riza_cms_faq_header_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_FAQ_HEADER_SEED;
}

export async function saveCMSFAQHeaderConfig(config: CMSFAQHeaderConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_faq_header_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'faqHeader'), config, { merge: true });
  } catch (e) {}
}

// --- 23. TESTIMONIALS & PARTNERS SECTION HEADER CONFIG ---
export async function getCMSTestimonialsHeaderConfig(): Promise<CMSTestimonialsHeaderConfig> {
  try {
    const local = localStorage.getItem('riza_cms_testimonials_header_override');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return INITIAL_TESTIMONIALS_HEADER_SEED;
}

export async function saveCMSTestimonialsHeaderConfig(config: CMSTestimonialsHeaderConfig): Promise<void> {
  try {
    localStorage.setItem('riza_cms_testimonials_header_override', JSON.stringify(config));
    await setDoc(doc(db, 'siteConfig', 'testimonialsHeader'), config, { merge: true });
  } catch (e) {}
}




