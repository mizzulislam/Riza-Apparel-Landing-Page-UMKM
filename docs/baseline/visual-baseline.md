# Baseline Visual & Layout Freeze Log — Riza Apparel Web

> **Dokumen rujukan visual dan protokol layout freeze MVP Riza Apparel**
> **Tanggal audit:** 19 September 2026
> **Referensi:** Super Prompt §4.3, §5 (Protokol Layout Freeze)

---

## 1. Protokol Layout Freeze

Sesuai aturan **R3 (Layout Dibekukan)** dan **§5 Super Prompt**:
* **Definisi Perubahan Layout (Wajib Konfirmasi LCR)**:
  * Mengubah struktur, urutan, atau hierarki section/komponen pada halaman yang sudah ada.
  * Mengubah grid, spacing, ukuran, posisi, breakpoint, navigasi, header/footer, atau pola responsif.
  * Menambah, menghapus, atau memindahkan elemen visual pada halaman publik yang sudah ada.
  * Merancang layout halaman baru (mis. panel admin `/admin`, tracking pesanan `/status-pesanan`, form lead capture, halaman legal).
* **Tanpa Konfirmasi (Bebas LCR)**: Perubahan non-visual (metadata dynamic, JSON-LD, sitemap, backend proxy, rate-limiting, security rules, refactor internal).

---

## 2. Peta Tangkapan Layar Baseline Visual (375px, 768px, 1280px)

Tangkapan layar rujukan baseline disimpan di `docs/baseline/screenshots/` (atau dicatat statusnya di bawah ini) untuk pengujian perbandingan visual (visual regression testing):

### 2.1 Halaman Beranda (`/`)

| Viewport | Target Komponen / Section | File Tangkapan Layar Rujukan | Status Baseline |
|---|---|---|---|
| **Mobile (375 px)** | Header sticky, Hero banner, Katalog grid 1 kolom, Accordion FAQ, Footer map | `docs/baseline/screenshots/home-375px.png` | Terdokumentasi |
| **Tablet (768 px)** | Header logo + Hamburger, Katalog grid 2 kolom, Footer 2 kolom | `docs/baseline/screenshots/home-768px.png` | Terdokumentasi |
| **Desktop (1280 px)**| Top bar promo, Navigasi desktop 5 link, Hero full-bleed slideshow, Katalog grid 3 kolom, Footer 12 kolom | `docs/baseline/screenshots/home-1280px.png` | Terdokumentasi |

---

### 2.2 Halaman Design Studio (`/#studio`)

| Viewport | Target Komponen / Section | File Tangkapan Layar Rujukan | Status Baseline |
|---|---|---|---|
| **Mobile (375 px)** | 2D Canvas viewport, Inspector compact drawer, Size selector horizontal, AI Vector drawer | `docs/baseline/screenshots/studio-375px.png` | Terdokumentasi |
| **Tablet (768 px)** | Canvas layout 2 kolom, Color picker panel, 3D orbit preview toggle | `docs/baseline/screenshots/studio-768px.png` | Terdokumentasi |
| **Desktop (1280 px)**| Canvas 3D Orbit & 2D side-by-side, Studio sidebar penuh, Inspector panel desktop, Floating AI widget | `docs/baseline/screenshots/studio-1280px.png` | Terdokumentasi |

---

## 3. Matriks Toleransi Selisih Visual (Zero-Pixel Shift Check)

Selama Fase 1 (Prerender & Backend Proxy AI) dan Fase-fase berikutnya:
* Setiap perubahan non-visual wajib diverifikasi bahwa tidak ada pergeseran tata letak (0 pixel vertical/horizontal shift) pada breakpoint 375px, 768px, dan 1280px.
* Hasil verifikasi wajib dilaporkan pada laporan GATE-1 hingga GATE-4.
