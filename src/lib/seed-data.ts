import { saveCMSProduct, saveCMSMotif, CMSMotif } from './cms-service';
import { CatalogItem } from '../types';

export const INITIAL_PRODUCTS_SEED: CatalogItem[] = [
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

export const INITIAL_MOTIFS_SEED: CMSMotif[] = [
  {
    nama_motif: 'Ende Diamond Zawo Gold',
    kategori_kultural: 'ende-zawo',
    file_aset: 'ende-diamond',
    atribusi_sumber: 'Motif Tenun Ikat Tradisional Ende Flores NTT — Dokumentasi Riza Apparel Ende 2026',
    status_aktif: true,
  },
  {
    nama_motif: 'Flores Ocean Waves',
    kategori_kultural: 'flores-waves',
    file_aset: 'flores-wave',
    atribusi_sumber: 'Inspirasi Gelombang Laut Pesisir Flores NTT — Aset Publik Riza Apparel',
    status_aktif: true,
  },
  {
    nama_motif: 'Kelimutu Tri-Crater Poly',
    kategori_kultural: 'kelimutu',
    file_aset: 'kelimutu-crater',
    atribusi_sumber: 'Gradasi 3 Warna Danau Kawah Kelimutu Ende NTT',
    status_aktif: true,
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
    return { success: true, count };
  } catch (e) {
    console.warn('Data seeding note:', e);
    return { success: false, count: 0 };
  }
}
