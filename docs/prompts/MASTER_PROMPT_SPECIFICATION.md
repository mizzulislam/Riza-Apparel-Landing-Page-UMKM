# MASTER PROMPT & TECHNICAL SPECIFICATION
## Riza Apparel — Digital Experience & Production Tracking Platform (Ende, NTT)

> **Dokumen Terpadu (Single Source of Truth)**
> Menggabungkan Super Prompt MMP, PRD, Use Case Modelling, Spesifikasi Mockup 3D Sublimasi, Project Management Roadmap, dan Design System UMKM Ende.

---

## 📋 DAFTAR ISI

1. [BAGIAN 1: SUPER PROMPT & ARSITEKTUR SISTEM (MMP TO MLP)](#bagian-1-super-prompt--arsitektur-sistem-mmp-to-mlp)
2. [BAGIAN 2: PRODUCT REQUIREMENTS DOCUMENT (PRD) & USE CASES](#bagian-2-product-requirements-document-prd--use-cases)
3. [BAGIAN 3: SPESIFIKASI MOCKUP 3D & UV ATLAS SUBLIMASI (ITERASI 2)](#bagian-3-spesifikasi-mockup-3d--uv-atlas-sublimasi-iterasi-2)
4. [BAGIAN 4: MANAJEMEN PROYEK, TASK BREAKDOWN, & TIMELINE](#bagian-4-manajemen-proyek-task-breakdown--timeline)
5. [BAGIAN 5: DESIGN SYSTEM & PANDUAN KONTRASTING VISUAL UMKM](#bagian-5-design-system--panduan-kontrasting-visual-umkm)

---

## BAGIAN 1: SUPER PROMPT & ARSITEKTUR SISTEM (MMP TO MLP)

### 1.1 Visi Produk & Identitas Lokal
Platform digital **Riza Apparel** dirancang untuk mentransformasi konveksi pakaian olahraga lokal di Ende, Nusa Tenggara Timur (NTT). Platform ini menghubungkan kebudayaan khas NTT (seperti motif tenun ikat *Ende Diamond / Zawo*) dengan teknologi terkini:
- **Landing Page Interaktif**: Menampilkan identitas lokal Ende NTT, jaminan mutu sublimasi 1440 DPI, keunggulan harga grosir/satuan, dan ulasan kapten tim regional.
- **Studio Simulator 3D**: Memungkinkan kapten tim merancang jersey olahraga secara real-time dengan pilihan kerah, warna, motif tenun NTT, sponsor, dan kustomisasi nama/nomor.
- **Portal Terpisah (CMS & CRM)**:
  - **Portal CMS**: Mengelola seluruh konten landing page 1:1 secara real-time (Hero Banner, Tentang Kami, Katalog Produk, Pustaka Motif Tenun R7, Paket Promo, Alur Produksi, FAQ, Testimoni & Logo Mitra, serta Footer).
  - **Portal CRM**: Mengelola prospek pelanggan (Lead Capture), tracking pesanan pelanggan via Token Unik, Papan Kanban Produksi, Riwayat LTV Pelanggan, Generator WA Auto, Hub CSAT, dan Knowledge Base.

### 1.2 Arsitektur Teknis & Bebas Biaya (Spark Tier $0)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Three.js (WebGL 3D Studio).
- **Hosting & Pre-rendering**: Firebase Hosting dengan Pre-rendering SSG Static HTML Injection (`scripts/prerender.js`) untuk SEO maksimal.
- **Backend & Database**: Cloud Firestore + Firebase Authentication (Email/Password Admin Login).
- **AI Engine**: Gemini 1.5 Flash via Serverless Proxy (`src/lib/ai-client.ts`) dengan Circuit Breaker otomatis (1.000 RPD) untuk menjamin operasional Rp 0.

---

## BAGIAN 2: PRODUCT REQUIREMENTS DOCUMENT (PRD) & USE CASES

### 2.1 Modul Fitur Utama
1. **Landing Page Public (`/`)**:
   - Header Navigation & Theme Toggle (Light/Dark Mode).
   - Hero Banner dengan Carousel Slideshow produk & CTA konsultasi WA.
   - Section Tentang Kami (Visi, Misi, Pilar Nilai Ende).
   - Section Katalog Varian Produk & Pustaka Motif Tenun NTT (dengan atribusi R7 wajib).
   - Section Paket & Promo (Diskon Tim, Kode Voucher).
   - Section Alur Produksi (5 Tahapan Waktu Kerja).
   - Section FAQ Accordion Interaktif.
   - Section Testimoni Klien & Logo Mitra Regional (Regarsport, Regarmarket, Ende United FC).
   - Section Estimator Biaya Custom & Tracker Status Pesanan via Token Unik.
   - Floating AI Assistant Chatbot (Gemini 1.5 Flash) & Form Lead Capture.

2. **Studio Simulator 3D (`/studio`)**:
   - Canvas 3D WebGL (Three.js) dengan OrbitControls, pencahayaan studio 3-point, dan efek rotasi smooth.
   - Pilihan Model Mesh 3D Jersey (`raglan-crew.glb`, `vneck-setin.glb`, `jersey_tigres.glb`).
   - Penataan Layer & Motif Tenun Ikat NTT.
   - Canva Color Picker untuk Ubah Warna Base, Kerah, Motif, dan Teks.
   - Element Inspector Panel untuk atur rotasi, posisi X/Y, opacity, dan ukuran teks/sponsor.
   - Ekspor Desain PNG/SVG & Rincian Ukuran Tim (Size Chart).

3. **Portal Admin (`/admin`)**:
   - Switcher Toggle Portal CMS vs Portal CRM pada Sidebar.
   - **8 Section CMS Publik**: Form kelola Hero, About, Products, Promos, Workflow, FAQ, Testimonials & Mitra, Contact.
   - **7 Section CRM Operational**: Lead Management, Order Tracking Token, Kanban Board, Customer LTV Tiers, Generator Templat WA, Rating Hub CSAT, KB Chatbot.

---

## BAGIAN 3: SPESIFIKASI MOCKUP 3D & UV ATLAS SUBLIMASI (ITERASI 2)

### 3.1 Resolusi Texture & Akurasi Sublimasi
- **UV Atlas Canvas**: 2048x2048 sRGB texture map (`src/lib/atlas-renderer.ts`).
- **Edge Dilation Padding**: Bleed padding 16px di sekeliling panel UV untuk mengeliminasi garis seam hitam saat rendering WebGL.
- **Panel Mapping**:
  - Front Panel: (x: 41, y: 41, w: 942, h: 1290)
  - Back Panel: (x: 1065, y: 41, w: 942, h: 1290)
  - Left Sleeve: (x: 41, y: 1392, w: 881, h: 410)
  - Right Sleeve: (x: 1126, y: 1392, w: 881, h: 410)
  - Collar Rib: (x: 41, y: 1843, w: 1966, h: 164)

---

## BAGIAN 4: MANAJEMEN PROYEK, TASK BREAKDOWN, & TIMELINE

### 4.1 Milestone Pengembangan
- **Fase 1**: Landasan Core App, Landing Page, SEO Prerender, & AI Proxy ($0 Spark Tier).
- **Fase 2**: Integrasi Studio 3D Three.js, UV Canvas Atlas Generator, & Exporter PDF/PNG.
- **Fase 3**: Implementasi Portal Terpisah CMS & CRM (15 Menu Kelola 1:1).
- **Fase 4**: Perapihan Struktur Codebase, Audit Dead Code (Knip), & Refactoring Clean Architecture.

---

## BAGIAN 5: DESIGN SYSTEM & PANDUAN KONTRASTING VISUAL UMKM

### 5.1 Skema Warna & Kontras Mode Terang/Gelap
- **Mode Gelap (Dark Mode)**:
  - Background Utama: `#0E1322` / `#05070E`
  - Border Glassmorphic: `border-slate-800`
  - Teks Utama: `text-white` / `text-slate-300` / `text-slate-400`
- **Mode Terang (Light Mode)**:
  - Background Utama: `bg-slate-50` / `bg-white`
  - Border: `border-slate-200`
  - Teks Utama: `text-slate-900` / `text-slate-700` / `text-slate-600` (Wajib kontras tinggi agar tidak buram).
- **Warna Aksen Brand**:
  - Primary Brand Red/Rose: `#E11D48` (`brand-600`)
  - Heritage Zawo Gold: `#F59E0B` (`heritage-zawo`)
  - Emerald Green: `#059669` (`emerald-600`)
