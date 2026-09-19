# Design System Baseline — Riza Apparel Web

> **Dokumen ekstraksi dan pemetaan Design System aktual MVP Riza Apparel**
> **Tanggal audit:** 19 September 2026
> **Referensi:** `tailwind.config.js`, `src/index.css`, `design-system-umkm-skill.md`, Super Prompt §4.2, Aturan Mutlak R2

---

## 1. Design Tokens Aktual (Grounded from Code)

### 1.1 Palet Warna (Color Tokens)

Riza Apparel menggunakan sistem warna 60-30-10 dengan warna identitas budaya Ende & Flores NTT:

| Token Tailwind | Kode Hex / Nilai | Peran & Penggunaan |
|---|---|---|
| **Dominant Neutral (60%)** | | |
| `brand-dark` | `#111827` (Gray 900) | Latar belakang utama mode gelap (Dark Charcoal - Haram `#000000` pekat) |
| `bg-[#0B0F19]` | `#0B0F19` | Deep Obsidian background untuk landing page & studio |
| `brand-light` | `#F9FAFB` (Slate 50) | Latar belakang utama mode terang (Off-White) |
| `brand-body` | `#374151` (Gray 700) | Teks bodi standar pada mode terang |
| **Secondary & Accents (30%)** | | |
| `heritage-zawo` | `#F59E0B` (Amber 500) | Warna Kultural 1: Gold / Amber motif Ende Diamond Zawo |
| `heritage-zawoDark` | `#D97706` (Amber 600) | Varian Zawo gelap |
| `heritage-ocean` | `#0284C7` (Sky 600) | Warna Kultural 2: Flores Ocean Wave Deep Sky Blue |
| `heritage-oceanDark` | `#0369A1` (Sky 700) | Varian Ocean Wave gelap |
| **Primary Accent CTA (10%)** | | |
| `brand-600` | `#E11D48` (Rose/Crimson 600) | Warna Aksi Utama (Primary CTA Button & Active Highlights) |
| `brand-500` | `#F43F5E` (Rose 500) | Hover state CTA |
| `brand-700` | `#BE123C` (Rose 700) | Dark state CTA |
| **Semantic & Status** | | |
| `promo-emerald` | `#10B981` (Emerald 500) | Status sukses, badge promo, notifikasi WA |
| `promo-emeraldDark` | `#059669` (Emerald 600) | Hover state WhatsApp |
| `amber-400` | `#FBBF24` | Bintang rating testimoni & highlight penawaran |

---

### 1.2 Tipografi (Typography System)

* **Font Family**:
  * Primary: `"Plus Jakarta Sans", "Inter", system-ui, sans-serif`
  * Display: `"Plus Jakarta Sans", sans-serif`
* **Skala Tipografi Responsif**:

| Elemen | Desktop Utility | Mobile Utility | Weight & Leading |
|---|---|---|---|
| **H1 (Hero Title)** | `text-5xl` s.d `text-6xl` (48-60px) | `text-3xl` s.d `text-4xl` (30-36px) | `font-black`, `leading-tight` |
| **H2 (Section Title)** | `text-3xl` s.d `text-4xl` (30-36px) | `text-2xl` (24px) | `font-bold` / `font-extrabold` |
| **H3 (Card / Sub-section)** | `text-xl` s.d `text-2xl` (20-24px) | `text-lg` (18px) | `font-bold` |
| **Body Text** | `text-sm` s.d `text-base` (14-16px) | `text-xs` s.d `text-sm` (12-14px) | `font-normal` / `font-medium`, `leading-relaxed` |
| **Caption / Small Badges** | `text-xs` (12px) | `text-[10px]` - `text-[11px]` | `font-semibold` / `font-extrabold` |

---

### 1.3 Sistem Spasi (8-Point Grid Alignment)

Seluruh margin, padding, dan gap pada komponen mengacu pada kelipatan 8px (dengan variasi 4px untuk komponen sangat rapat):

| Skala (px) | Tailwind Utility | Penggunaan Utama pada Codebase |
|---|---|---|
| **4px** | `p-1`, `m-1`, `gap-1` | Badge status, ikon kecil, indikator dot |
| **8px** | `p-2`, `m-2`, `gap-2` | Spasi dalam tombol kecil, chip filter, tombol opsi AI |
| **12px** | `p-3`, `m-3`, `gap-3` | Jarak dalam item daftar, input field compact |
| **16px** | `p-4`, `m-4`, `gap-4` | Padding internal kartu produk, modal header, gap grid mobile |
| **24px** | `p-6`, `m-6`, `gap-6` | Padding modal besar, gap grid desktop |
| **32px** | `p-8`, `m-8`, `gap-8` | Padding seksi medium, margin hero |
| **48px / 72px** | `py-12`, `h-18` (72px) | Spasi vertikal seksi mobile & header desktop |
| **64px / 96px** | `py-16`, `py-24` | Spasi vertikal seksi desktop (`#katalog`, `#tentang-kami`, `#faq`) |

---

### 1.4 Corner Radius (Rounding Tokens)

* **Small (`rounded-md` / `rounded-lg` / 6-8px)**: Badge promo, input field kecil, chip filter, ikon wrapper.
* **Medium (`rounded-xl` / `rounded-2xl` / 12-16px)**: Kartu katalog produk, modal dialog, panel kontrol Studio, drawer AI.
* **Large (`rounded-3xl` / `rounded-full` / 24px+)**: Container hero banner, tombol floating CTA, avatar testimoni.

---

### 1.5 Shadow & Glassmorphism Utilities

* `shadow-glow-brand`: `0 0 20px -5px rgba(225, 29, 72, 0.4)`
* `shadow-glow-emerald`: `0 0 20px -5px rgba(16, 185, 129, 0.4)`
* `shadow-card-hover`: `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`
* `.glass-panel-dark`: `background: rgba(17, 24, 39, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1);`
* `.glass-panel-header`: `backdrop-filter: blur(20px);`

---

### 1.6 Sistem Motion & Animasi Keyframe

* `animate-float-slow`: `float-slow 4s ease-in-out infinite` (efek melayang elemen hero & badge)
* `animate-pulse-subtle`: `pulse-subtle 3s ease-in-out infinite` (efek glow lembut)
* `animate-slide-up-fade`: `slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards` (transisi masuk halaman/modal)
* `animate-glow-spin`: `glow-spin 12s linear infinite` (efek putaran latar belakang)
* `animate-text-shimmer`: `text-shimmer 6s ease infinite` (efek kilau teks judul)

---

## 2. Pustaka Komponen UI Baku

1. **Primary Button (CTA Utama)**:
   * Class: `h-10 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 min-h-[44px]`
2. **Secondary Button**:
   * Class: `px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all`
3. **WhatsApp CTA Button**:
   * Class: `bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-all min-h-[44px]`
4. **Form Input (Standard)**:
   * Class: `w-full rounded-xl px-3.5 py-2.5 text-xs bg-slate-900/95 border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors`
5. **Product Card Container**:
   * Class: `rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md overflow-hidden hover:shadow-card-hover hover:border-brand-500/50 transition-all duration-300 p-4`

---

## 3. Laporan Selisih (Discrepancy Report) dengan Panduan Skill

Sesuai instruksi §4.2 Super Prompt, berikut adalah perbandingan antara `design-system-umkm-skill.md` (panduan umum) dan kode aktual MVP Riza Apparel:

| Elemen Design System | Panduan Umum (`design-system-umkm-skill.md`) | Kode Aktual MVP Riza Apparel | Keputusan & Acuan Otoritatif |
|---|---|---|---|
| **Warna Accent Utama** | Indigo (`#4F46E5` / `indigo-600`) | Crimson Red (`#E11D48` / `brand-600`) + Heritage Amber (`#F59E0B`) | **Kode Aktual Riza Apparel Menang (R2).** Crimson Red & Ende Gold merepresentasikan identitas lokal NTT & semangat atletis. |
| **Neutral Background Dark** | `gray-900` (`#111827`) | `brand-dark` (`#111827`) & Deep Obsidian (`#0B0F19`) | **Selaras.** Menggunakan Charcoal/Obsidian gelap, bukan hitam pekat `#000000`. |
| **Grid Padding Desktop** | `px-20` (80px) s.d `px-32` (120px) | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | **Kode Aktual Menang.** Padding 16-32px pada container max-w-7xl lebih fleksibel untuk layar laptop/desktop. |
| **Target Sentuh Mobile** | Minimal 44px (`py-3 px-6`) | Sebagian tombol `min-h-[44px]`, namun beberapa control kanvas Studio masih < 44px | **Wajib Ditingkatkan pada Fase 3 (FR-D2).** Seluruh tombol interaktif akan disesuaikan ke minimal 44x44px. |
| **Teks Bodi Utama** | Inter / Plus Jakarta Sans (`text-sm` s.d `text-base`) | Plus Jakarta Sans (`text-sm` / `text-base`) | **Selaras.** Memakai Plus Jakarta Sans sebagai font sans-serif utama. |

> **Keputusan Mutlak:** Seluruh modul baru (Portal Admin, CRM, Halaman Status Pesanan, Estimator) **wajib mewarisi token warna Crimson/Zawo/Ocean, tipografi Plus Jakarta Sans, dan komponen dari `design-system-baseline.md`** ini tanpa memperkenalkan framework visual baru.
