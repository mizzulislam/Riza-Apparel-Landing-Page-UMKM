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

export interface CMSKnowledgeEntry {
  id?: string;
  kategori: 'produk' | 'proses' | 'kebijakan' | 'umum';
  pertanyaan_referensi: string;
  jawaban_baku: string;
  status_aktif: boolean;
}

export interface UnansweredQuestion {
  id?: string;
  pertanyaan: string;
  timestamp: string;
  frekuensi: number;
}

export interface PriceConfig {
  harga_satuan_base: Record<string, number>; // e.g. { Milano: 90000, Serena: 95000, Waffle: 100000 }
  diskon_kuantitas: { min_pcs: number; diskon_persen: number }[];
  biaya_kerah_polo: number;
  biaya_jaket: number;
  is_active: boolean;
}

// ===== CMS SERVICE METHODS =====

// --- 1. KATALOG PRODUK ---
export async function getCMSProducts(): Promise<CatalogItem[]> {
  try {
    const q = query(collection(db, 'products'), orderBy('id', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CatalogItem));
  } catch (e) {
    console.warn('Error fetching CMS products, fallback local:', e);
    return [];
  }
}

export async function saveCMSProduct(product: CatalogItem): Promise<void> {
  const docRef = doc(db, 'products', product.id);
  await setDoc(docRef, product, { merge: true });
}

// --- 2. PUSTAKA MOTIF TENUN (FR-C2) ---
export async function getCMSMotifs(): Promise<CMSMotif[]> {
  try {
    const q = query(collection(db, 'motifs'), orderBy('nama_motif', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CMSMotif));
  } catch (e) {
    return [];
  }
}

export async function saveCMSMotif(motif: CMSMotif): Promise<string> {
  if (!motif.atribusi_sumber || !motif.atribusi_sumber.trim()) {
    throw new Error('Atribusi sumber kultural wajib diisi untuk motif tenun.');
  }
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
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CMSLead));
  } catch (e) {
    return [];
  }
}

export async function updateLeadStatus(id: string, status: CMSLead['status_tindak_lanjut']): Promise<void> {
  await updateDoc(doc(db, 'leads', id), { status_tindak_lanjut: status });
}

// --- 4. PESANAN & TRACKING STATUS TOKEN UNIK (FR-E9, UC10, UC12) ---
// Generate token acak yang sulit ditebak (16 karakter hex)
export function generateOrderToken(): string {
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
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CMSOrder));
  } catch (e) {
    return [];
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
    const q = query(collection(db, 'orders'), where('token_akses_unik', '==', token.trim()), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0].data() as CMSOrder;
    // Sanitasi data: HANYA tampilkan bidang aman bagi pelanggan publik
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
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UnansweredQuestion));
  } catch (e) {
    return [];
  }
}
