# Panduan Manual Pendaftaran Google Search Console & Google Business Profile (FR-A4, FR-A5)

> **Panduan praktis langkah demi langkah untuk Pemilik Riza Apparel (Ende, NTT)**
> **Tujuan**: Mendaftarkan domain `https://rizaapparel-2026.web.app/` ke Google Search Console (GSC) dan Google Business Profile (GBP) agar situs terindeks 100% dan muncul di hasil pencarian lokal Google Maps area Ende & Flores.

---

## 📍 BAGIAN 1: Pendaftaran & Klaim Google Business Profile (GBP) — FR-A5

Google Business Profile adalah kunci utama untuk memenangkan kueri pencarian lokal seperti **"konveksi jersey Ende"** atau **"sablon jersey terdekat"**.

### Langkah-langkah Pemilik:
1. Buka link [Google Business Profile Manager](https://www.google.com/business/).
2. Login menggunakan akun Gmail resmi Riza Apparel.
3. Klik **"Tambahkan bisnis Anda ke Google"** (*Add your business to Google*).
4. Isi data identitas usaha:
   - **Nama Bisnis**: `Riza Apparel — Custom Jersey & Sportswear Ende`
   - **Kategori Bisnis**: `Toko Pakaian Olahraga` (*Sportswear store*) atau `Konveksi` (*Custom apparel manufacturer*).
5. Isi Alamat Fisik Presisi:
   - **Alamat**: `JL. Gatot Subroto Gg. Sabar RT.022/RW.011, Mautapaga, Kec. Ende Timur`
   - **Kota / Kabupaten**: `Kabupaten Ende`
   - **Provinsi**: `Nusa Tenggara Timur`
   - **Kode Pos**: `86317`
6. Tentukan Titik Peta Google Maps:
   - Geser pin peta tepat pada titik koordinat lokasi workshop Ende: `-8.843675, 121.670762`.
7. Masukkan Kontak & Website:
   - **Nomor Telepon / WA**: `+62 812-4691-7740`
   - **URL Website**: `https://rizaapparel-2026.web.app/`
8. **Verifikasi Usaha**:
   - Pilih metode verifikasi yang tersedia (rekaman video lokasi workshop/papan nama atau surat verifikasi).

---

## 🔍 BAGIAN 2: Pendaftaran & Pengiriman Sitemap ke Google Search Console (GSC) — FR-A4

Google Search Console memastikan seluruh halaman produk dan studio diindeks penuh oleh Googlebot.

### Langkah-langkah Pemilik:
1. Buka [Google Search Console](https://search.google.com/search-console/).
2. Klik **"Add property"** (Tambah properti).
3. Pada opsi **URL prefix**, masukkan URL resmi:
   `https://rizaapparel-2026.web.app/`
4. **Verifikasi Kepemilikan (Ownership Verification)**:
   - Metode paling mudah: **HTML Tag** atau **Google Analytics 4**.
   - Copy tag `<meta name="google-site-verification" content="..." />` yang diberikan Google, kirim ke developer untuk ditempatkan di `index.html`.
5. **Kirim Peta Situs (Sitemap)**:
   - Setelah terverifikasi, buka menu **Sitemaps** di bilah kiri.
   - Pada kolom *Add a new sitemap*, ketik: `sitemap.xml`
   - Klik **Submit**.
   - Pastikan status berubah menjadi **Success** (Hijau).

---

## 📊 BAGIAN 3: Pendaftaran Google Analytics 4 (GA4) — FR-B6

1. Buka [Google Analytics Manager](https://analytics.google.com/).
2. Buat properti baru bernama `Riza Apparel Web`.
3. Pilih zona waktu `Indonesia (WITA - GMT+8)`.
4. Pilih Data Stream **Web**, masukkan URL `https://rizaapparel-2026.web.app/`.
5. Salin **Measurement ID** (format: `G-XXXXXXXXXX`).
6. Pasang Measurement ID pada file `.env` sebagai `VITE_GA_MEASUREMENT_ID`.
