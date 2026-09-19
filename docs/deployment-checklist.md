# Deployment & Launch Checklist — RIZA APPAREL MMP

Panduan langkah demi langkah untuk mendeploy aplikasi ke **Firebase Hosting** dan mendaftarkan indeks SEO pada **Google Search Console (GSC)** dan **Google Business Profile (GBP)**.

---

## 📋 Checklist Pra-Deployment

- [x] **1. Build Verification**
  - Jalankan `npm run build` dan pastikan tidak ada error TypeScript maupun esbuild.
  - Verifikasi output `dist/index.html` berisi hasil injeksi prerender static HTML & JSON-LD.
- [x] **2. Security Rules Audit**
  - Verifikasi `firestore.rules` mengunci akses write publik untuk produk, motif, dan pesanan.
  - Verifikasi lead capture mewajibkan `penerimaan_pdp == true`.
- [x] **3. Environment Variables Check**
  - Pastikan `.env` terkonfigurasi dengan Firebase Project ID yang benar (`rizaapparel`).
  - Pastikan `.env` masuk dalam `.gitignore` (Secrets backend & API key aman).

---

## 🚀 Langkah Deploy ke Firebase Hosting (Rp 0)

1. **Inisialisasi Project Firebase**:
   ```bash
   firebase use rizaapparel
   ```
2. **Build Production Asset & Prerender SEO**:
   ```bash
   npm run build
   ```
3. **Deploy Ke Firebase Hosting**:
   ```bash
   firebase deploy --only hosting,firestore:rules
   ```

---

## 🌐 Verifikasi Pasca-Deploy & Indeks SEO (GSC & GBP)

1. **Uji URL Publik**:
   - Beranda: `https://rizaapparel.web.app`
   - Portal Admin: `https://rizaapparel.web.app/#admin`
   - Tracking Pesanan: `https://rizaapparel.web.app/#status-pesanan?token=RZ-SAMPLE`
2. **Submit Sitemap ke Google Search Console (GSC)**:
   - Buka [Google Search Console](https://search.google.com/search-console)
   - Tambahkan Properti domain `https://rizaapparel.web.app`
   - Kirimkan sitemap URL: `https://rizaapparel.web.app/sitemap.xml`
3. **Pendaftaran Google Business Profile (GBP)**:
   - Nama Bisnis: **RIZA APPAREL — Custom Jersey Sublimasi Ende Flores**
   - Kategori: Produsen Pakaian Olahraga / Konveksi Sublimasi
   - Lokasi: Jalan Kelimutu No. 14, Kota Ende, Nusa Tenggara Timur
   - Nomor Kontak: `+62 812-4691-7740`
