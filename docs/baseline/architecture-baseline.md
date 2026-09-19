# Architecture Baseline — Riza Apparel Web (Fase MVP → MMP)

> **Dokumen audit baseline arsitektur teknis MVP Riza Apparel**
> **Tanggal audit:** 19 September 2026
> **Referensi requirement:** PRD §5 (FR-A1..FR-[#E10]), Analisis Masalah (P-01..P-26), Super Prompt §4.1

---

## 1. Stack Teknologi Aktual

| Layer / Komponen | Teknologi & Versi | Catatan & Lokasi di Repo |
|---|---|---|
| **Framework Utama** | React `v18.3.1` + TypeScript `v5.7.2` | Components di `src/components/`, types di `src/types.ts` |
| **Build Tool / Bundler** | Vite `v6.0.5` | `vite.config.ts` |
| **Styling & CSS** | Tailwind CSS `v3.4.17`, PostCSS `v8.4.49`, Autoprefixer `v10.4.20` | `tailwind.config.js`, `src/index.css` |
| **Ikonografi** | Lucide React `v0.469.0` | Diimpor langsung di komponen UI |
| **Renderer 3D & Kanvas** | Three.js `v0.186.0` (`@types/three v0.185.4`), HTML5 Canvas & Inline SVG | `JerseyMockup3D.tsx`, `JerseySVG2D.tsx`, `DesignStudio2D.tsx` |
| **State Management** | React Local State (`useState`, `useEffect`) | Tidak ada Redux/Zustand; state diposisikan di komponen `LandingPage.tsx` & `DesignStudio.tsx` |
| **Routing** | Single Page Application (SPA) murni berbasis state (`currentPage: 'home' \| 'studio'`) | Tanpa `react-router-dom`; navigasi via hash link & state internal |
| **Backend & Cloud Services** | Firebase SDK `v12.19.0` (Hosting, Firestore, Auth) | Config di `firebase-applet-config.json`, initialization di `src/lib/firebase.ts` |
| **Engine Node.js** | `>= 20.0.0` | `package.json` |

---

## 2. Peta Rute Publik dan Struktur Komponen

Seluruh antarmuka publik MVP saat ini di-render melalui satu komponen utama `src/components/LandingPage.tsx` yang mengelola dua "rute konseptual":

### 2.1 Rute Beranda (`/`)
* **Header / Navigasi (`renderHeader`)**:
  * Announcement Top Bar (Promo Beli 2 Bonus 1).
  * Brand Logo Riza Apparel (SVG dark/light mode).
  * Navigasi Desktop & Mobile Menu Drawer: *Tentang Kami*, *Katalog Produk*, *Testimoni & Mitra*, *FAQ*, *Kontak*.
  * Theme Switcher (Dark/Light mode via `localStorage`).
  * Tombol CTA *Mulai Mendesain* (mengalihkan ke rute Studio).
* **Hero Section**:
  * Slideshow foto jersey real (`HERO_GALLERY_IMAGES`).
  * Headline: *"Mewujudkan Identitas Melalui Pakaian Berkualitas"*.
  * CTA *Mulai Mendesain Custom Jersey* & *Lihat Katalog Produk*.
* **Tentang Kami & Keunggulan (`#tentang-kami`)**:
  * Narasi UMKM Ende, NTT & diferensiasi motif *Ende Diamond Zawo* & *Flores Ocean Waves*.
* **Katalog Produk (`#katalog`)**:
  * Grid 6 produk (`CATALOG_DATA`): Jersey Sepakbola/Futsal, Voli/Basket, Komunitas Lari, Esports, Polo Sublim, Jaket Windbreaker.
  * Filter kategori (*Semua*, *Tim*, *Komunitas*, *Kasual*).
* **Mitra & Testimoni (`#social-proof`)**:
  * Carousel mitra (`PARTNERS_DATA`: Regarsport, Regarmarket, Gesa Wazo Ende, Ende United FC, dll.).
  * Testimoni pelanggan (`TESTIMONIALS`).
* **FAQ (`#faq`)**:
  * Accordion 5 pertanyaan umum (`FAQ_DATA`).
* **Kontak & Footer (`#kontak`, `renderFooter`)**:
  * Alamat fisik Ende Timur, jam operasional, kontak WhatsApp owner.
  * Embedded Google Maps iframe (`-8.843675, 121.670762`).
* **Widget AI Assistant (`AIAssistantWidget.tsx`)**:
  * Floating widget di sudut kanan bawah.

### 2.2 Rute Design Studio (`/#studio`)
* **Container Utama (`DesignStudio.tsx`)**:
  * **2D Canvas Editor (`DesignStudio2D.tsx`)**: Kanvas interaktif kustomisasi jersey, pemilihan warna primer/sekunder/trim, rotasi, penambahan teks nama/nomor, dan pengunduhan draf.
  * **3D Orbit Preview (`JerseyMockup3D.tsx`)**: Canvas Three.js untuk pratinjau pseudo-3D orbit.
  * **AI Vector Generator (`AIVectorGenerator.tsx`)**: Generator motif SVG & emblem perisai berbasis prompt teks/preset.
  * **Color Picker (`CanvaColorPicker.tsx`)**: Palet warna kustom.
  * **Inspector Panel (`ElementInspectorPanel.tsx`)**: Panel pengatur layer elemen kanvas.
  * **Studio Sidebar (`StudioSidebar.tsx`)**: Navigasi preset warna, font, dan motif tenun.
  * **Size Selector (`JerseySizeSelector.tsx`)**: Pemilihan ukuran S/M/L/XL & kuantitas pesanan.
  * **Modals (`SizeChartModal.tsx`, `PrintGuidelinesModal.tsx`)**: Modal panduan ukuran & panduan cetak sublimasi.

---

## 3. Audit Konfigurasi Firebase

* **Project ID**: `rizaapparel-2026` (linked GCP project `gen-lang-client-0462193489`).
* **Firebase Hosting (`firebase.json`)**:
  * Public directory: `dist`
  * Rewrites: `**` -> `/index.html` (Single Page Application murni).
  * Domain live: `https://rizaapparel-2026.web.app/`
* **Firestore Database (`firestore.rules`)**:
  * Named database ID: `ai-studio-rizaapparelaistu-2fd5705a-9fa4-4af4-b661-ea3fea00b4fa`
  * Aturan keamanan saat ini:
    ```javascript
    match /customOrders/{orderId} {
      allow create: if request.resource.data.customerName is string &&
                       request.resource.data.whatsapp is string &&
                       request.resource.data.jerseyType is string;
      allow read, update, delete: if request.auth != null;
    }
    ```
  * *Audit Keamanan:* Publik dapat membuat dokumen di `customOrders`, namun belum ada schema validation lengkap, rate-limiting, atau proteksi spam.
* **Paket / Plan Firebase**: **Spark Plan (Tier Gratis 100%)**.

---

## 4. Daftar Inventaris Konten Hardcode (Target Migrasi CMS - P-01)

Seluruh konten berikut saat ini tertanam langsung di kode sumber TSX dan wajib dimigrasikan ke Firestore (CMS):

1. `CATALOG_DATA` di `src/components/LandingPage.tsx`: Daftar 6 produk, harga awal, fitur, jenis kain, dan URL gambar.
2. `PARTNERS_DATA` di `src/components/LandingPage.tsx`: Daftar 6 mitra & klub lokal beserta logo.
3. `TESTIMONIALS` di `src/components/LandingPage.tsx`: Nama pelanggan, organisasi, ulasan, dan rating.
4. `FAQ_DATA` di `src/components/LandingPage.tsx`: Daftar 5 pertanyaan dan jawaban umum.
5. `HERO_GALLERY_IMAGES` di `src/components/LandingPage.tsx`: 3 gambar slide hero beserta judul dan harga.
6. `INITIAL_MESSAGES` & `processQuery()` di `src/components/AIAssistantWidget.tsx`: Teks jawaban FAQ, daftar harga, dan info kontak.
7. `PRESET_PROMPTS` di `src/components/AIVectorGenerator.tsx`: 8 preset prompt motif dan emblem.
8. `StudioSidebar.tsx`: Daftar swatch warna preset, nama motif tenun default, dan daftar font.
9. `SizeChartModal.tsx` & `PrintGuidelinesModal.tsx`: Tabel dimensi ukuran (cm) dan instruksi teknis cetak.

---

## 5. Audit Integrasi AI & Keamanan Kredensial (P-21)

* **Chatbot (`AIAssistantWidget.tsx`)**:
  * *Mekanisme saat ini:* Evaluasi kata kunci secara lokal di browser (`if-else` matching pada string pencarian pengguna) dengan simulasi delay 400ms.
  * *API External:* **Belum memanggil API LLM luar.**
* **AI Design Generator (`AIVectorGenerator.tsx`)**:
  * *Mekanisme saat ini:* Generator SVG prosedural lokal (`generateAccurateVectorSVG`) menggunakan template string SVG dan manipulasi warna.
  * *API External:* **Belum memanggil model generatif gambar/vektor luar.**
* **Keamanan Kredensial**:
  * `firebase-applet-config.json` memuat API Key Web SDK Firebase publik (`apiKey: "AIzaSyAFm8WqLWuo..."`).
  * Belum ada backend proxy atau rate limiting untuk pemanggilan AI (P-21). Kunci API Gemini belum dipasang di backend.

---

## 6. Defek Visual Studio (P-04) & Hambatan Layar Sentuh Mobile (P-19)

1. **Interaksi Sentuh Mobile**:
   * Perkakas kanvas pada `DesignStudio2D.tsx` mengandalkan event mouse desktop. Pengguna ponsel mengalami hambatan saat menggeser (drag), mengubah ukuran (resize), atau memutar (rotate) elemen teks/logo karena layar ikut tergulung (scroll page conflict).
   * Ukuran hit target tombol kontrol kanvas dan color picker pada breakpoint 375px masih di bawah standar minimal 44x44px.
2. **Representasi 3D vs Realita**:
   * Mode "3D" pada `JerseyMockup3D.tsx` menggunakan mesh Three.js sederhana yang menampilkan texture canvas 2D. Tampilan ini belum diberi label yang jujur sebagai *"Pratinjau 360°"*, berisiko menimbulkan kesenjangan ekspektasi pelanggan (P-05).
3. **Ekspor Siap Cetak (P-16)**:
   * Fitur ekspor saat ini menghasilkan gambar PNG resolusi layar (72 DPI) RGB. Belum menyediakan kelonggaran jahitan (bleed margin), ukuran pola aktual, atau resolusi cetak ≥ 150 DPI untuk mesin sublimasi.

---

## 7. Performance Budget & Ukuran Aset (P-18)

* **Skenario Muat Saat Ini**:
  * Bundle JavaScript utama memuat Three.js (`three`), Lucide icons, dan seluruh 15 komponen UI sekaligus dalam 1 chunk tanpa code splitting.
  * Gambar katalog dimuat dari Unsplash/lokal tanpa format WebP terkompresi atau `srcset` responsif.
  * Font *Plus Jakarta Sans* dimuat secara sinkron melalui `index.html`.
* **Target Performance Budget MMP**:
  * Largest Contentful Paint (LCP) ≤ 2,5 detik pada simulasi 4G lambat (mobile).
  * Cumulative Layout Shift (CLS) ≤ 0,1.
  * Modul Three.js (3D), AI generator, dan font eksternal dimuat secara lazy (lazy loading & code splitting).
