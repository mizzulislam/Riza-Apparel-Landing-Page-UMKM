# Panduan Operasional Bebas Biaya Rp 0 Selamanya (Firebase Spark Plan & Free Tier Cloudflare Worker)

Dokumen ini memuat panduan arsitektur dan operasional teknis untuk menjamin aplikasi **RIZA APPAREL** beroperasi **100% Rp 0 Selamanya** tanpa tagihan kartu kredit atau langganan berbayar.

---

## 1. Arsitektur Bebas Biaya (Rp 0 Architecture)

```
[ Pengguna Publik ]
       │
       ├─► Static HTML / Assets (Firebase Hosting Free Tier - 10 GB Storage, 360 MB/Hari Transfer)
       ├─► Database Firestore (Free Tier - 1 GB Storage, 50K Reads/Hari, 20K Writes/Hari)
       ├─► Client-Side WebP Compression (Canvas API Browser - Rp 0)
       ├─► Proxy AI Gemini 1.5 Flash (Cloudflare Worker Free Tier - 100K Requests/Hari)
       └─► Circuit Breaker & WhatsApp Fallback (Bila Quota Spark Terlampaui - Rp 0)
```

---

## 2. Batas Gratis (Limits & Thresholds)

| Layanan | Provider | Batas Gratis (Free Tier) | Strategi Penghematan |
|---|---|---|---|
| **Hosting & Prerender** | Firebase Hosting | 10 GB Storage, 360 MB/Hari Transfer | Prerender build-time static HTML, minifikasi CSS/JS |
| **Database** | Cloud Firestore | 1 GB Data, 50.000 Read/Hari, 20.000 Write/Hari | Cache local storage & index terarah |
| **Auth** | Firebase Auth | 50.000 MAU (Monthly Active Users) | Auth hanya digunakan untuk akun Admin |
| **AI Gemini 1.5 Flash** | Google AI Studio | 15 Request / Menit, 1.500 Request / Hari | Quota tracker, circuit breaker, WhatsApp fallback |
| **Serverless Proxy AI** | Cloudflare Workers | 100.000 Request / Hari | Mengamankan API Key Gemini di backend serverless free |

---

## 3. Implementasi Circuit Breaker & Fallback WhatsApp (FR-E6)

Guna menghindari error 429 (Too Many Requests) atau penutupan layanan dari Google AI Studio:

1. **Quota Tracker (`src/lib/ai-client.ts`)**:
   - Menghitung jumlah panggilan API per menit dan per hari secara lokal di memori & sessionStorage.
2. **Circuit Breaker Mode**:
   - `NORMAL` (<80% limit): AI menjawab pertanyaan pelanggan secara interaktif.
   - `APPROACHING_LIMIT` (80-95% limit): Peringatan kuota pada Dasbor Admin.
   - `QUOTA_EXCEEDED` (100% limit): Layanan AI dinonaktifkan sementara dan dialihkan secara transparan ke tombol WhatsApp Admin RIZA APPAREL (+6281246917740).

---

## 4. Kompresi Gambar Client-Side WebP (FR-C3)

- Sebelum diunggah ke Firestore/Storage, gambar produk dan motif dikompresi menggunakan Canvas WebP Encoder (`src/lib/image-compressor.ts`).
- Mengurangi ukuran file hingga 80% (rata-rata <150KB per foto), menghemat kuota Firestore & bandwidth transfer secara drastis.

---

## 5. Prerender SEO Static HTML Build-Time (FR-A1)

- Tanpa membutuhkan SSR Server berbayar (seperti Vercel Pro atau Next.js SSR), aplikasi menggunakan skrip build `scripts/prerender.js`.
- Konten SEO (title, meta description, JSON-LD Structured Data, heading h1) diinjeksi langsung ke `dist/index.html` saat `npm run build`.
- Hasil build di-host pada Firebase Hosting Classic yang 100% gratis.
