# Skills Log — Riza Apparel Web

> **Log penemuan, inventarisasi, dan penggunaan skill untuk proyek Riza Apparel (MVP → MMP)**
> **Tanggal perbaruan:** 19 September 2026
> **Referensi:** Super Prompt §7 (Integrasi Skill GitHub via `find-skills`)

---

## 1. Inventaris Skill Terpasang (Installed Skills)

Berikut adalah 12 skill terpasang di direktori `.agents/skills/` proyek ini beserta kegunaannya untuk kebutuhan FR/Phase:

| Nama Skill | Lokasi Direktori | Kegunaan Utama untuk MMP | Status Evaluasi |
|---|---|---|---|
| `firebase-hosting-basics` | `.agents/skills/firebase-hosting-basics` | Konfigurasi `firebase.json` untuk prerender statis, custom headers, rewrites, dan deployment hosting statis (FR-A1, FR-A4). | **Aktif** — Digunakan di Fase 1 & 4. |
| `firebase-firestore` | `.agents/skills/firebase-firestore` | Perancangan basis data Firestore untuk Prospek (CRM), Pesanan, Konten CMS, dan Pustaka Motif (FR-B3, FR-C1, FR-C2, FR-E9). | **Aktif** — Digunakan di Fase 2. |
| `firebase-auth-basics` | `.agents/skills/firebase-auth-basics` | Autentikasi email/password admin portal (`/admin`) dengan allowlist akun pemilik (FR-C1). | **Aktif** — Digunakan di Fase 2. |
| `firebase-security-rules-auditor` | `.agents/skills/firebase-security-rules-auditor` | Audit aturan keamanan `firestore.rules` untuk proteksi data pribadi prospek (hanya admin yang dapat membaca, publik hanya membuat dengan validasi) (FR-B3, FR-E7). | **Aktif** — Digunakan di Fase 2 & 4. |
| `firebase-ai-logic-basics` | `.agents/skills/firebase-ai-logic-basics` | Panduan integrasi Gemini API, structured output, multimodal prompt engineering, dan tata kelola kuota (FR-E3, FR-E4, FR-E6). | **Aktif** — Digunakan di Fase 1 & 4. |
| `firebase-basics` | `.agents/skills/firebase-basics` | CLI setup, project switching (`firebase use`), dan verifikasi deployment. | **Aktif** — Digunakan di seluruh fase. |
| `firebase-app-hosting-basics` | `.agents/skills/firebase-app-hosting-basics` | Firebase App Hosting untuk Next.js/SSR. | **Ditolak/Tidak Dipakai** — Membutuhkan paket berbayar (Blaze) & SSR dinamis. Bertentangan dengan R1 (Nol Rupiah). Riza Apparel tetap memakai Classic Hosting statis. |
| `firebase-remote-config-basics`| `.agents/skills/firebase-remote-config-basics` | Feature flag dan konfigurasi remote (FR-B4 estimator price flag). | **Opsional** — Digunakan bila butuh feature flag dinamis. |
| `firebase-crashlytics` | `.agents/skills/firebase-crashlytics` | Crashlytics SDK untuk mobile native. | **Ditolak** — Riza Apparel adalah Web Application, bukan mobile app native. Out of scope PRD §3.3. |
| `firebase-data-connect` | `.agents/skills/firebase-data-connect` | Firebase SQL Connect / PostgreSQL backend. | **Ditolak** — Membutuhkan Cloud SQL yang berbayar. Bertentangan dengan R1 (Nol Rupiah). |
| `extension-to-functions-codebase`| `.agents/skills/extension-to-functions-codebase` | Konversi Firebase Extension ke Functions codebase. | **Ditolak** — Cloud Functions V2 di Firebase memerlukan Blaze Plan. |
| `xcode-project-setup` | `.agents/skills/xcode-project-setup` | Pengaturan proyek iOS Xcode. | **Ditolak** — Riza Apparel adalah Web Application. Out of scope PRD §3.3. |

---

## 2. Skill Tambahan yang Dipertimbangkan / Direkomendasikan

| Bidang Kebutuhan | Nama Skill / Topic | Alasan Rekomendasi / Penggunaan |
|---|---|---|
| **SEO & Structured Data** | `seo-schema-structured-data` | Membantu penyusunan JSON-LD Schema.org (`LocalBusiness`, `Product`, `FAQPage`, `Offer`) yang valid dan optimal untuk Google Search Console (FR-A2, FR-A3). |
| **Canvas & Touch Gestures** | `canvas-touch-gestures` | Membantu perbaikan interaksi sentuh layar ponsel (Pointer Events, pinch-zoom, drag-resize) pada kanvas Design Studio (FR-D2). |
| **Image Optimization** | `image-webp-optimization` | Kompresi gambar otomatis ke format WebP di sisi klien sebelum diunggah ke CMS (FR-C3). |
| **Print DPI Export** | `canvas-pdf-print-export` | Pengolahan ekspor kanvas resolusi tinggi ≥ 150 DPI dengan bleed margin untuk cetak sublimasi (FR-D4). |

---

## 3. Catatan Kepatuhan Aturan Proyek (Skill Governance Rule)

1. Semua skill UI/UX bertindak sebagai rujukan kualitas. Jika terjadi selisih antara skill UI/UX eksternal dan design system Riza Apparel, **Design System MVP Riza Apparel (`docs/baseline/design-system-baseline.md`) yang berlaku (R2)**.
2. Semua saran skill yang mewajibkan paket berbayar, kartu kredit, atau layanan berlangganan **ditolak secara otomatis (R1)**.
