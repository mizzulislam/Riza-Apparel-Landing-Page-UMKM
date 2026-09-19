# Technical Decision Record (TDR Baseline Usulan) — Riza Apparel Web

> **Dokumen Catatan Keputusan Teknis (Technical Decision Records / ADR) untuk Fase MMP**
> **Tanggal audit & verifikasi tier gratis:** 19 September 2026
> **Referensi:** Super Prompt §4.5, PRD §7 (Constraints), R1 (Aturan Nol Rupiah Selamanya)

---

## TDR-01: Arsitektur Rendering untuk SEO (FR-A1)

* **Konteks & Masalah**: Situs saat ini adalah Single Page Application (SPA) murni di Firebase Hosting. Permintaan HTTP dari crawler mesin pencari hanya menerima `<div id="root"></div>` kosong (P-09). Target pasar di Ende & NTT membutuhkan keterhitungan organik tanpa iklan (FR-A7).
* **Opsi yang Dievaluasi**:
  1. *SSR Dinamis via Firebase Cloud Functions / App Hosting*: Membutuhkan paket Firebase Blaze (harus mendaftarkan kartu kredit & berpotensi timbul biaya penagihan). **Ditolak (Melanggar R1).**
  2. *Prerendering Statis (SSG / Static HTML Generation) per Rute*: Menghasilkan file HTML statis berisi konten lengkap untuk setiap rute publik (`/`, `/#katalog`, `/#tentang-kami`, `/#faq`, `/#kontak`) saat proses `npm run build`. Tetap di-host 100% gratis di Firebase Hosting Spark Plan.
  3. *Dynamic Rendering via Third-Party Renderer (Prerender.io)*: Tier gratis terbatas dan berisiko berbayar saat kuota habis.
* **Verifikasi Tier Gratis**:
  * Penyedia: Firebase Hosting (Spark Plan).
  * Batas Kuota: 10 GB penyimpanan, 360 MB/hari transfer data gratis. Kartu kredit **tidak diperlukan**.
  * Tanggal Cek: 19 September 2026 (Dokumentasi Resmi Firebase Hosting).
* **Keputusan & Rekomendasi**: **Opsi 2 (Prerendering Statis per Rute saat Build).**
* **Konsekuensi**: Crawler Googlebot dan WhatsApp link preview menerima HTML utuh tanpa JavaScript. Rebuild statis dapat dipicu via GitHub Actions / Cloudflare Pages / Vercel gratis saat admin memperbarui CMS.

---

## TDR-02: Backend Proxy untuk Layanan AI & Keamanan Kredensial (FR-E6, FR-E4)

* **Konteks & Masalah**: API Key AI (Gemini) tidak boleh disimpan di kode klien, bundle JS, atau repo git (R5, P-21). Klien membutuhkan proxy backend yang menangani penyembunyian kunci dan rate-limiting kuota gratis.
* **Opsi yang Dievaluasi**:
  1. *Firebase Cloud Functions V2*: Membutuhkan upgrade ke paket Blaze (kartu kredit). **Ditolak (Melanggar R1).**
  2. *Serverless Proxy Gratis (Cloudflare Workers / Vercel Serverless)*: Cloudflare Workers menyediakan 100.000 request/hari gratis selamanya tanpa kartu kredit. Vercel Serverless menyediakan 100.000 request/bulan gratis.
  3. *Netlify Functions Free Tier*: 125.000 request/bulan gratis.
* **Verifikasi Tier Gratis**:
  * Penyedia: Cloudflare Workers (Free Plan).
  * Batas Kuota: 100.000 requests per hari, 10ms CPU time per request. Tanpa kartu kredit.
  * Tanggal Cek: 19 September 2026 (Dokumentasi Resmi Cloudflare Workers).
* **Keputusan & Rekomendasi**: **Opsi 2 (Cloudflare Workers / Vercel Serverless Proxy).**
* **Konsekuensi**: Kredensial Gemini API tersimpan aman di Environment Secrets Worker. Klien memanggil endpoint worker (`/api/chat`, `/api/generate-vector`), worker mengeksekusi rate limiting per IP/sesi dan meneruskan ke Gemini API.

---

## TDR-03: Basis Data Prospek (CRM), Pesanan, dan CMS (FR-B3, FR-C1, FR-E9)

* **Konteks & Masalah**: Membutuhkan basis data terpusat untuk menyimpan data prospek lead capture, status pesanan pelanggan, katalog produk, testimoni, dan pustaka motif tenun.
* **Opsi yang Dievaluasi**:
  1. *Cloud Firestore (Spark Plan)*: Sudah terpasang di proyek (`firebase-applet-config.json`).
  2. *Supabase Free Tier*: Postgres database (500 MB data, 50.000 monthly active users).
  3. *MongoDB Atlas Free Tier*: 512 MB storage.
* **Verifikasi Tier Gratis**:
  * Penyedia: Cloud Firestore (Firebase Spark Plan).
  * Batas Kuota: 1 GB penyimpanan data, 50.000 operasi baca/hari, 20.000 operasi tulis/hari, 20.000 operasi hapus/hari 100% gratis selamanya.
  * Tanggal Cek: 19 September 2026 (Dokumentasi Resmi Firebase Firestore).
* **Keputusan & Rekomendasi**: **Opsi 1 (Cloud Firestore).**
* **Konsekuensi**: Tidak menambah ketergantungan penyedia baru; aturan keamanan `firestore.rules` dikonfigurasi ketat (publik hanya `create` prospek dengan validasi schema; admin terautentikasi memiliki akses penuh `read/write/update`).

---

## TDR-04: Penyimpanan dan Kompresi Aset Gambar (FR-C3)

* **Konteks & Masalah**: Gambar produk dan motif yang diunggah admin CMS harus dikompresi otomatis ke format WebP agar hemat kuota dan menjaga performance budget (FR-A6, P-18).
* **Opsi yang Dievaluasi**:
  1. *Cloudinary Free Tier*: 25 GB penyimpanan/bandwidth bulanan, transformasi gambar otomatis di URL (`f_auto,q_auto` -> WebP/AVIF).
  2. *Firebase Cloud Storage (Spark Plan)*: 5 GB storage, 1 GB/hari download, tanpa kompresi otomatis bawaan (harus kompresi di browser sebelum upload).
  3. *Imgbb API Free Tier*: Fitur terbatas.
* **Verifikasi Tier Gratis**:
  * Penyedia: Cloudinary Free Tier atau Firebase Cloud Storage + Client Canvas Compression.
  * Batas Kuota: Cloudinary (25 Kredit / ~25 GB transformasi/bulan gratis selamanya). Firebase Storage (5 GB free).
  * Tanggal Cek: 19 September 2026 (Dokumentasi Resmi Cloudinary & Firebase).
* **Keputusan & Rekomendasi**: **Browser Canvas Client-Side Compression + Cloudinary / Firebase Storage.** Gambar dikompresi di browser via HTML5 Canvas (`toDataURL('image/webp', 0.82)`) sebelum diunggah, menjamin ukuran file < 200KB tanpa ketergantungan plugin berbayar.

---

## TDR-05: Autentikasi Admin Portal (FR-C1)

* **Konteks & Masalah**: Modul CMS admin (`/admin`) memerlukan proteksi autentikasi agar hanya pemilik Riza Apparel yang dapat mengubah konten dan melihat data prospek.
* **Opsi yang Dievaluasi**:
  1. *Firebase Authentication (Email/Password)*: 100% gratis tanpa batas pengguna aktif harian pada Spark Plan.
  2. *Custom Hardcoded Password*: Berisiko keamanan tinggi.
  3. *Auth0 Free Tier*: Terbatas 7.000 MAU.
* **Verifikasi Tier Gratis**:
  * Penyedia: Firebase Authentication (Spark Plan).
  * Batas Kuota: Unlimited Email/Password sign-ins 100% gratis.
  * Tanggal Cek: 19 September 2026 (Dokumentasi Resmi Firebase Auth).
* **Keputusan & Rekomendasi**: **Opsi 1 (Firebase Authentication).** Dipadu dengan *email allowlist* di `firestore.rules` (hanya UID/email terdaftar yang memiliki hak `admin`).

---

## TDR-06: Penyedia AI & Pengendalian Kuota Gratis (FR-E3, FR-E4, FR-E5)

* **Konteks & Masalah**: Pemanggilan model AI untuk chatbot dan design generator wajib 100% gratis tanpa risiko penagihan otomatis saat kuota habis (R1, FR-E5).
* **Opsi yang Dievaluasi**:
  1. *Google Gemini 1.5 Flash (via Google AI Studio Free API Key)*:
     * Free Tier: 15 Requests Per Minute (RPM), 1.000.000 Tokens Per Minute (TPM), 1.500 Requests Per Day (RPD).
     * Tanpa kartu kredit. Begitu kuota habis, API mengembalikan HTTP 429 (Rate Limit).
  2. *OpenAI GPT-4o-mini*: Membutuhkan saldo berbayar (paid credit). **Ditolak.**
  3. *Hugging Face Free Inference API*: Latensi tidak stabil.
* **Verifikasi Tier Gratis**:
  * Penyedia: Google AI Studio (Gemini 1.5 Flash).
  * Batas Kuota: 15 RPM / 1.500 RPD 100% gratis tanpa billing account.
  * Tanggal Cek: 19 September 2026 (Dokumentasi Resmi Gemini API / Google AI Studio).
* **Keputusan & Rekomendasi**: **Opsi 1 (Gemini 1.5 Flash via Google AI Studio Key).**
* **Pengendali Kuota (Internal Circuit Breaker)**:
  * Kuota internal ditetapkan **20% di bawah batas gratis** (misal: maks 10 RPD per sesi pengguna, 1.000 RPD total harian sistem).
  * Saat HTTP 429 atau kuota harian habis, sistem secara otomatis mengunci widget AI ke status `kuota_habis`, menampilkan pesan ramah Bahasa Indonesia, dan mengalihkan ke tombol WhatsApp Owner.

---

## TDR-07: Mekanisme CMS Portal Admin (FR-C1)

* **Konteks & Masalah**: Pemilik Riza Apparel membutuhkan antarmuka yang sangat mudah dipakai di HP untuk mengubah katalog, promo, testimoni, dan motif tenun tanpa developer.
* **Opsi yang Dievaluasi**:
  1. *Integrated Admin Portal (`/admin` subroute)*: Dibangun dalam proyek Vite/React yang sama menggunakan komponen Tailwind & Firestore SDK, di-code-split agar tidak menambah beban muat halaman publik (`lazy loading`).
  2. *External Headless CMS (Strapi / Sanity / Decap CMS)*: Menambah kompleksitas hosting dan potensi biaya berulang.
* **Verifikasi Tier Gratis**:
  * Biaya: Rp 0 (berjalan di atas infrastruktur Vite & Firebase Spark yang sudah ada).
* **Keputusan & Rekomendasi**: **Opsi 1 (Integrated Admin Portal di rute `/admin`).**
* **Konsekuensi**: 100% konsisten dengan Design System MVP (R2), mobile-first responsive, berbahasa Indonesia penuh, `noindex`, dan terlindungi autentikasi Firebase.

---

## TDR-08: Perkakas Ekspor Berkas Siap Cetak (FR-D4)

* **Konteks & Masalah**: Design Studio harus dapat mengekspor berkas desain resolusi tinggi (≥ 150 DPI) pada ukuran pola aktual dengan bleed margin untuk mesin cetak sublimasi klien.
* **Opsi yang Dievaluasi**:
  1. *Client-Side Offscreen Canvas Rendering*: Menggunakan HTML5 OffscreenCanvas / Canvas API untuk merender SVG vektor ke raster PNG/PDF resolusi 300 DPI secara asynchronous di browser.
  2. *Server-Side Puppeteer / Canvas Renderer*: Membutuhkan Node.js server aktif (potensi biaya server).
* **Verifikasi Tier Gratis**:
  * Biaya: Rp 0 (dieksekusi penuh di browser pengguna).
* **Keputusan & Rekomendasi**: **Opsi 1 (Client-Side Offscreen Canvas Rendering).**
* **Konsekuensi**: Menghemat memori ponsel dengan merender per lapisan pola, dilengkapi pilihan format PNG/PDF dan parameter bleed yang dapat dikonfigurasi dari admin.
