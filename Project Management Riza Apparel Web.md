# PROJECT MANAGEMENT — RIZA APPAREL WEB

| | |
|---|---|
| **Project** | Riza Apparel Landing Page |
| **Project Manager** | Muhammad Izzul Islam |
| **Created by** | Muhammad Izzul Islam |
| **Date Created** | 09 September 2026 |
| **Last Update by** | Izzul |
| **Date Last Update** | 09 September 2026 |
| **Anggaran Proyek** | Rp0 (bootstrap, tanpa biaya infrastruktur berbayar) |

---

## Daftar Isi

1. [Cause-and-Effect Analysis](#1-cause-and-effect-analysis)
2. [System Improvement Objectives](#2-system-improvement-objectives)
3. [PIECES Classification of System Requirements](#3-pieces-classification-of-system-requirements)
4. [Fishbone Diagram](#4-fishbone-diagram)
5. [Product Requirements Document (PRD)](#5-product-requirements-document-prd)
6. [Use Case Modelling](#6-use-case-modelling)
7. [Tambahan: Manajemen Proyek & Rekomendasi Lanjutan](#7-tambahan-manajemen-proyek--rekomendasi-lanjutan)
8. [Lampiran — Data Mentah Hasil Wawancara](#8-lampiran--data-mentah-hasil-wawancara)

---

## 1. Cause-and-Effect Analysis

| No | Problem or Opportunity | Causes and Effects |
|----|--------------------------|----------------------|
| 1 | Belum ada kehadiran digital (website/landing page) untuk usaha | **Cause:** Selama ini interaksi produk & pemesanan hanya melalui WhatsApp/chat personal dengan owner. **Effect:** Jangkauan pasar terbatas pada jaringan referral lokal, sulit membangun kredibilitas brand di mata calon customer baru, dan tidak ada kanal yang bisa diakses 24 jam. |
| 2 | Pertanyaan repetitif dari calon customer (harga, jenis produk, proses custom desain) ditangani manual | **Cause:** Tidak ada sistem FAQ/informasi otomatis; owner harus merespons satu per satu via chat. **Effect:** Respons lambat saat volume order tinggi, potensi lead hilang, dan beban waktu owner meningkat, terutama saat musim ramai produksi. |
| 3 | Narasi brand sudah kuat (Visi, Misi, konsep Heritage Series) tapi belum tersaji secara visual/menarik | **Cause:** Konten brand baru berupa teks mentah hasil wawancara, belum diformat menjadi tampilan profesional. **Effect:** Positioning premium yang dimiliki RIZA APPAREL tidak terasa oleh calon customer, ekuitas brand belum dimanfaatkan optimal. |
| 4 | Harga produk belum transparan (disebut "variatif", jersey mulai 90rb) | **Cause:** Belum ada price list/katalog produk yang tersistematisasi. **Effect:** Calon customer ragu sebelum menghubungi owner, tingkat konversi inquiry berpotensi rendah karena ketidakpastian biaya. |
| 5 | Sudah punya mitra/customer (REGARSPORT, REGARMARKET, GESA WAZO) namun belum ditampilkan sebagai social proof | **Cause:** Tidak ada kanal portofolio/showcase kemitraan. **Effect:** Kepercayaan calon customer baru lebih rendah karena tidak ada bukti track record yang terlihat. |
| 6 | Belum tersedia dokumentasi visual (foto produk/proses produksi) | **Cause:** Owner belum mengumpulkan/mengorganisir aset foto secara khusus untuk kebutuhan promosi digital. **Effect:** Landing page berisiko kurang meyakinkan secara visual, menurunkan daya tarik dan tingkat konversi. |
| 7 | Sifat bisnis custom (logo, typography, motif tematik) sangat cocok diintegrasikan dengan AI chatbot/agent | **Cause:** Proses konsultasi desain saat ini sepenuhnya manual via chat pribadi owner. **Effect:** Chatbot/agent AI berpotensi menyaring kebutuhan desain di awal (pre-qualifying), mempercepat alur kerja, dan mengurangi beban komunikasi owner. |
| 8 | **[Baru]** Modul konsultasi desain yang direncanakan (AI chatbot) masih berbasis teks murni, belum mengakomodasi kebutuhan visualisasi langsung sebelum pemesanan | **Cause:** Preferensi warna, motif tenun, dan posisi nama/nomor punggung jauh lebih mudah dikomunikasikan lewat tampilan visual dibanding deskripsi teks percakapan. **Effect:** Tanpa visualisasi real-time, calon pelanggan tetap harus membayangkan sendiri hasil akhir jersey, berisiko menimbulkan revisi berulang setelah desain masuk tahap produksi sublimasi, serta mengurangi rasa percaya diri untuk langsung memesan. |

> Catatan: data sertifikat & testimoni yang sebelumnya belum lengkap tetap menjadi item follow-up terbuka (lihat Bab 7.4 — Checklist Pengumpulan Konten).

---

## 2. System Improvement Objectives

| No | Problem/Opportunity | Causes and Effect | System Objective | System Constraint |
|----|----------------------|--------------------|--------------------|---------------------|
| 1 | Belum ada kehadiran digital | Interaksi hanya via WA personal; jangkauan & kredibilitas rendah | Menyediakan landing page yang dapat diakses publik kapan saja, memuat identitas usaha (nama, logo, tagline, visi-misi, sejarah) secara terstruktur | Harus tetap ringan (loading cepat) mengingat target audiens sebagian besar mengakses via mobile/koneksi daerah; anggaran hosting/domain terbatas sesuai kapasitas UMKM |
| 2 | Pertanyaan repetitif ditangani manual | Tidak ada otomatisasi; respons lambat, beban owner tinggi | Mengimplementasikan AI chatbot/agent yang mampu menjawab pertanyaan umum (produk, harga, proses custom) secara otomatis dan real-time | Chatbot harus dilatih hanya dengan data yang tersedia dari hasil wawancara (belum ada basis pengetahuan luas); perlu mekanisme eskalasi ke owner untuk pertanyaan di luar cakupan |
| 3 | Narasi brand kuat tapi belum visual | Konten masih teks mentah; positioning premium tidak terasa | Mendesain ulang konten "Tentang Kami" (visi, misi, Heritage Series) ke dalam layout visual yang profesional dan konsisten dengan identitas brand | Desain harus dapat dikerjakan tanpa tim desainer khusus (menggunakan template/aset yang efisien); konsistensi visual harus tetap terjaga meski aset foto/logo masih terbatas |
| 4 | Harga belum transparan | Tidak ada price list sistematis; konversi rendah | Membangun halaman/fitur katalog produk & price list yang jelas per kategori/jenis produk | Harga produk custom bersifat variatif (tergantung desain/bahan/jumlah), sehingga sistem harus mengakomodasi format "mulai dari" atau estimasi, bukan harga fix mutlak |
| 5 | Mitra/customer belum ditampilkan | Tidak ada kanal showcase; trust rendah | Menambahkan section "Mitra & Customer" sebagai social proof pada landing page | Bergantung pada izin/persetujuan mitra terkait pencantuman nama/logo; data mitra saat ini masih terbatas (baru 3 nama tanpa detail visual) |
| 6 | Belum ada dokumentasi visual | Aset foto belum terorganisir; kurang meyakinkan | Mengumpulkan dan mengkurasi foto produk & proses produksi untuk ditampilkan sebagai galeri pada landing page | Bergantung sepenuhnya pada ketersediaan & kualitas foto dari owner (di luar kendali tim developer); perlu deadline pengumpulan aset sebelum tahap build dimulai |
| 7 | Bisnis custom cocok AI chatbot | Konsultasi desain manual; beban komunikasi tinggi | Mengembangkan fitur AI agent untuk pre-qualifying kebutuhan desain (logo, typography, motif) sebelum diteruskan ke owner | Kompleksitas AI agent harus disesuaikan dengan skala UMKM (bukan sistem enterprise); perlu batasan agar AI tidak memberikan komitmen harga/waktu produksi tanpa validasi owner |
| 8 | **[Baru]** Modul konsultasi desain masih berbasis teks murni, belum ada visualisasi langsung | Preferensi warna/motif/posisi nama-nomor lebih mudah dikomunikasikan secara visual; tanpa itu berisiko revisi berulang & menurunkan rasa percaya diri memesan | **Menyediakan modul Studio Desain 2D** — kanvas visual interaktif yang menampilkan pratinjau real-time jersey (tampilan depan & belakang) berdasarkan pilihan warna, template motif Heritage Series, nama, dan nomor punggung yang diinput pengguna, sebelum dikonversi menjadi brief pesanan ke WhatsApp admin | Rendering visual wajib dilakukan di sisi klien (client-side, berbasis vektor/SVG ringan) tanpa memanggil API AI berbayar setiap kali pengguna mengubah parameter — agar selaras dengan batasan anggaran UMKM (**Rp0**) dan tetap ringan diakses lewat koneksi seluler daerah |

---

## 3. PIECES Classification of System Requirements

| Nonfunctional Requirement Type | Explanation |
|---|---|
| **Performance** | Landing page harus dapat diakses dengan cepat (loading time singkat) meskipun diakses melalui koneksi internet daerah/mobile, mengingat target audiens tersebar termasuk di luar kota besar. Sistem AI chatbot juga harus mampu merespons pertanyaan customer secara real-time tanpa jeda yang signifikan, agar tidak mengulang masalah lambatnya respons manual yang selama ini terjadi via WhatsApp. **Modul Studio Desain 2D wajib merender ulang pratinjau (warna, teks, toggle depan/belakang) dalam waktu kurang dari 300ms setiap interaksi, tanpa reload halaman penuh, agar pengalaman kustomisasi terasa instan.** |
| **Information** | Sistem harus mampu menyajikan informasi bisnis (Tentang Kami, produk & price list, promo, mitra) secara akurat, terstruktur, dan selalu update, termasuk kemampuan untuk menampilkan data secara fleksibel meski sebagian informasi (sertifikat, testimoni, foto) masih belum lengkap saat ini. Chatbot juga harus dibekali basis pengetahuan yang konsisten dengan data resmi dari owner agar tidak memberikan jawaban yang salah/menyesatkan ke calon customer. |
| **Economy** | Solusi (landing page + chatbot) harus dibangun dengan biaya pengembangan, hosting, dan pemeliharaan yang sesuai dengan skala UMKM (**GRATIS/Rp0**), menghindari penggunaan infrastruktur atau layanan AI berbiaya tinggi yang tidak sebanding dengan omzet usaha. Tujuannya agar sistem memberi nilai tambah (efisiensi waktu owner, potensi peningkatan penjualan) yang melebihi biaya operasionalnya. **Studio Desain 2D dirancang sebagai komponen rendering vektor sisi klien (bukan pemanggilan model AI), sehingga eksplorasi warna/motif oleh pengguna tidak menambah beban biaya API sama sekali.** |
| **Control (and Security)** | Sistem harus memiliki mekanisme kontrol agar AI chatbot tidak memberikan komitmen sepihak terkait harga, waktu produksi, atau detail teknis di luar kewenangannya, termasuk fitur eskalasi otomatis ke owner untuk pertanyaan kompleks. Selain itu, data kontak customer (jika ada fitur form/pemesanan) perlu dijaga keamanannya dan hanya dapat diakses oleh pihak yang berwenang (owner/admin). **Estimasi harga yang tampil di dalam Studio Desain 2D tetap berstatus indikatif/tidak mengikat, konsisten dengan aturan estimasi harga pada modul lain, bukan harga final checkout.** |
| **Efficiency** | Sistem harus mampu mengurangi beban kerja manual owner dalam menjawab pertanyaan repetitif (harga, produk, proses custom desain) dengan mengotomatisasi respons melalui chatbot, sehingga owner dapat lebih fokus pada proses produksi dan pengembangan desain. Proses pengumpulan dan penataan konten (foto, katalog produk) juga perlu dirancang seefisien mungkin agar tidak membebani owner yang keterbatasan waktu/sumber daya. |
| **Service** | Sistem harus memberikan pengalaman yang mudah, transparan, dan memuaskan bagi calon customer, sejalan dengan misi bisnis RIZA APPAREL sendiri. Ini mencakup kemudahan navigasi landing page, respons chatbot yang ramah dan informatif, serta kanal yang jelas bagi customer untuk melanjutkan proses pemesanan/konsultasi desain setelah berinteraksi dengan sistem. **Pengguna dapat mengulang (reset) konfigurasi desain di Studio 2D kapan saja tanpa kehilangan progres pengisian data lain di halaman, dan hasil akhir desain dapat langsung dikonversi menjadi draf pesan WhatsApp terformat.** |

---

## 4. Fishbone Diagram

![Fishbone Diagram RIZA APPAREL](Fishbone_RIZA_APPAREL.png)

*Gambar 1. Fishbone diagram enam kategori PIECES sebagai penyebab menuju efek utama: sistem digital & AI chatbot RIZA APPAREL belum optimal.*

> **Catatan revisi:** kebutuhan modul Studio Desain 2D (poin 8 pada Cause-and-Effect Analysis) menambah nuansa baru pada kategori **Service** dan **Information** — yaitu keterbatasan modalitas komunikasi (teks-saja) dalam menyampaikan preferensi visual pelanggan. Disarankan diagram ini diperbarui pada revisi berikutnya untuk mencerminkan cabang tambahan tersebut secara eksplisit.

---

## 5. Product Requirements Document (PRD)

**Landing Page & AI Chatbot/Agent + Studio Desain 2D — RIZA APPAREL**

| | |
|---|---|
| Dokumen | Product Requirements Document (Draft) |
| Klien | RIZA APPAREL (custom jersey & sportswear) |
| Disusun oleh | Muhammad Izzul Islam |
| Status | Draft v1.1 |
| Sumber data | Wawancara online dengan pemilik usaha |
| Anggaran | Rp0 (tanpa biaya infrastruktur/API berbayar) |

### 5.1 Latar Belakang

RIZA APPAREL adalah UMKM yang bergerak di bidang jasa konveksi dan custom apparel, dengan fokus utama pada jersey dan sportswear. Usaha ini berlokasi di Ende, Nusa Tenggara Timur, dan selama ini beroperasi dengan mengandalkan komunikasi manual melalui WhatsApp untuk seluruh proses, mulai dari pengenalan produk, konsultasi desain, penentuan harga, hingga pemesanan.

Berdasarkan hasil Cause and Effect Analysis, System Improvement Objectives, dan PIECES Classification, teridentifikasi bahwa ketiadaan kehadiran digital menyebabkan keterbatasan jangkauan pasar, beban kerja manual yang tinggi bagi owner, kurangnya kredibilitas visual dari brand yang sebenarnya memiliki narasi kuat (Heritage Series), serta **keterbatasan modalitas konsultasi desain yang masih berbasis teks murni**.

Project ini bertujuan membangun landing page dengan beberapa fitur unggulan, **AI chatbot/agent**, serta **modul Studio Desain 2D** sebagai solusi nilai tambah bagi RIZA APPAREL — seluruhnya dikembangkan dengan anggaran Rp0.

### 5.2 Tujuan Produk

a. Menyediakan kehadiran digital resmi bagi RIZA APPAREL yang dapat diakses publik kapan saja.
b. Menyampaikan identitas brand (visi, misi, sejarah, keunggulan) secara profesional dan menarik.
c. Menyajikan katalog produk/jasa beserta price list secara transparan.
d. Menyediakan AI chatbot/agent yang mampu menjawab pertanyaan umum dan membantu proses konsultasi desain custom secara otomatis.
e. Meningkatkan efisiensi operasional owner dengan mengurangi beban komunikasi manual repetitif.
f. Membangun kepercayaan calon customer melalui social proof (mitra, testimoni, sertifikat).
g. **[Baru]** Menyediakan pengalaman visualisasi desain jersey secara real-time (Studio Desain 2D) agar calon customer dapat melihat gambaran hasil akhir sebelum memesan, tanpa menambah biaya operasional.

### 5.3 Target Pengguna

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| Calon customer individu | Ingin memesan jersey/apparel custom untuk komunitas, tim olahraga, atau kebutuhan pribadi | Info produk & harga jelas, proses custom desain mudah, respons cepat, **bisa melihat pratinjau desain** |
| Calon customer instansi/komunitas | Organisasi, tim, sekolah, atau event yang butuh apparel dalam jumlah besar | Kepercayaan (portofolio, mitra, testimoni), estimasi harga & waktu produksi |
| Owner RIZA APPAREL | Pemilik usaha yang mengelola operasional & produksi | Mengurangi beban respons manual, mendapatkan lead terkualifikasi (termasuk draf desain visual) dari chatbot/Studio 2D |

### 5.4 Ruang Lingkup

**In-Scope:**
- Landing page single-page atau multi-section dengan struktur informasi bisnis lengkap
- Fitur AI chatbot/agent terintegrasi untuk FAQ dan pre-qualifying kebutuhan desain
- Halaman/section katalog produk & price list
- Section promo & paket
- Section mitra/customer (social proof)
- Section sertifikat & testimoni (dengan graceful degradation jika data belum tersedia)
- Galeri foto produk & proses produksi
- Kanal lanjutan pemesanan (CTA ke WhatsApp/kontak resmi)
- **[Baru] Modul Studio Desain 2D** — kanvas kustomisasi visual jersey (client-side, vektor/SVG ringan)

**Out-of-Scope (fase awal):**
- Sistem pemesanan & pembayaran online (e-commerce penuh)
- Dashboard admin/CMS kompleks untuk owner
- Aplikasi mobile native
- Multi-bahasa (fase awal hanya Bahasa Indonesia)
- Kustomisasi desain 3D/rendering fotorealistik (Studio 2D dibatasi pada representasi vektor 2 dimensi)

### 5.5 Kebutuhan Fungsional — Landing Page

| ID | Fitur | Deskripsi |
|---|---|---|
| F-01 | Hero Section | Nama, logo, tagline, dan CTA utama ("Konsultasi Desain", "Lihat Produk") |
| F-02 | Tentang Kami | Visi, misi, sejarah singkat, dan keunggulan (Desain Presisi, Sentuhan Autentik, Kualitas Material, Proses Terstandar) |
| F-03 | Katalog Produk & Price List | Daftar produk/jasa dengan deskripsi singkat dan estimasi harga (mis. "Jersey mulai Rp90.000") |
| F-04 | Galeri Foto | Foto produk dan/atau proses produksi (placeholder jika aset belum tersedia) |
| F-05 | Paket & Promo | Beli 2 bonus 1, gratis ongkir, bisa desain sesuai keinginan |
| F-06 | Mitra & Customer | Menampilkan mitra (REGARSPORT, REGARMARKET, GESA WAZO) sebagai social proof |
| F-07 | Sertifikat | Ditampilkan bila data tersedia (opsional) |
| F-08 | Testimoni | Ditampilkan bila data tersedia (opsional) |
| F-09 | Informasi Kontak & Alamat | Alamat lengkap, nomor telepon/WhatsApp, peta lokasi (jika memungkinkan) |
| F-10 | CTA Pemesanan | Tombol/link mengarah ke WhatsApp resmi atau form kontak |

### 5.6 Kebutuhan Fungsional — AI Chatbot/Agent

| ID | Fitur | Deskripsi |
|---|---|---|
| C-01 | FAQ Otomatis | Menjawab pertanyaan umum seputar produk, harga, bahan, dan proses pemesanan |
| C-02 | Konsultasi Desain Awal | Menggali kebutuhan custom (jenis produk, jumlah, elemen desain) sebelum diteruskan ke owner |
| C-03 | Estimasi Harga Kasar | Estimasi berbasis rentang (bukan harga final/mengikat) |
| C-04 | Eskalasi ke Owner | Arahkan ke kontak WhatsApp owner bila di luar cakupan chatbot |
| C-05 | Riwayat Percakapan | Simpan histori chat dalam sesi (opsional) |

### 5.7 Kebutuhan Fungsional — Studio Desain 2D **(Baru)**

| ID | Fitur | Deskripsi |
|---|---|---|
| S-01 | Pilih Template Motif | Pengguna memilih template motif dari Koleksi Tenun/Heritage Series (mis. Ende Diamond Zawo, Flores Ocean Waves, Modern Solid Athletic, dll.) |
| S-02 | Pilih Warna Dasar | Pengguna memilih warna dasar jersey dari palet yang tersedia |
| S-03 | Input Nama & Nomor Punggung | Pengguna mengisi teks nama dan nomor punggung yang langsung tampil pada pratinjau |
| S-04 | Unggah Logo (Opsional) | Pengguna dapat mengunggah logo/sponsor untuk ditempatkan pada posisi tertentu di jersey |
| S-05 | Pratinjau Real-Time Depan/Belakang | Kanvas menampilkan hasil kustomisasi secara instan, dengan toggle tampilan depan dan belakang |
| S-06 | Reset Konfigurasi | Pengguna dapat mengulang konfigurasi kapan saja tanpa kehilangan data lain di halaman |
| S-07 | Konversi ke Draf Brief WhatsApp | Hasil akhir desain dikonversi menjadi draf pesan terformat yang siap dikirim ke WhatsApp admin |

### 5.8 Kebutuhan Non-Fungsional (PIECES)

Lihat Bab 3 — PIECES Classification of System Requirements (sudah mencakup ketentuan khusus Studio Desain 2D).

### 5.9 Alur Pengguna (Ringkas)

**Flow 1 — Menjelajah produk:**
1. Buka landing page → lihat Hero & Tentang Kami
2. Scroll ke Katalog Produk & Price List
3. Lihat Galeri & Mitra/Customer sebagai validasi kepercayaan
4. Klik CTA "Konsultasi Desain" → diarahkan ke chatbot, Studio Desain 2D, atau WhatsApp

**Flow 2 — Interaksi chatbot:**
1. Membuka widget chatbot dari landing page
2. Mengajukan pertanyaan (harga, bahan, proses)
3. Chatbot menjawab berdasarkan data resmi bisnis
4. Jika ingin custom desain, chatbot menggali detail kebutuhan
5. Chatbot memberikan estimasi awal dan mengarahkan ke WhatsApp owner untuk konfirmasi final

**Flow 3 — Menggunakan Studio Desain 2D (Baru):**
1. Pengguna membuka modul Studio Desain 2D
2. Memilih template motif dan warna dasar
3. Mengisi nama & nomor punggung, opsional mengunggah logo
4. Melihat pratinjau real-time (depan/belakang) yang ter-render di sisi klien
5. Mengonfirmasi desain → sistem menyusun draf brief pesanan terformat
6. Draf brief dikirim/disalin ke WhatsApp admin untuk ditindaklanjuti

### 5.10 Arsitektur Teknis (Usulan)

| Komponen | Rekomendasi |
|---|---|
| Frontend | Landing page statis/SSR ringan (Next.js atau HTML/CSS/JS sederhana) untuk performa cepat |
| Chatbot/Agent | Terintegrasi via API model bahasa dengan knowledge base dari data bisnis resmi |
| **Studio Desain 2D** | **Rendering vektor/SVG di sisi klien (client-side), tanpa pemanggilan API AI berbayar; state disimpan sementara di browser (in-memory/local)** |
| Hosting | Layanan hosting ringan dan terjangkau sesuai skala UMKM — **hosting ai.studio** |
| Media/Aset | Penyimpanan foto produk & galeri terkompresi untuk performa loading |
| Kontak/CTA | Integrasi langsung ke WhatsApp Business API atau tautan wa.me |

> **Catatan anggaran:** anggaran project saat ini adalah **Rp0**. Pemilihan teknologi final harus konsisten dengan batasan ini — memprioritaskan layanan gratis/tier gratis dan komponen yang tidak menimbulkan biaya berulang.

### 5.11 Metrik Keberhasilan

| Metrik | Target Indikatif |
|---|---|
| Jumlah kunjungan landing page | Meningkat secara bertahap pasca-peluncuran |
| Tingkat interaksi dengan chatbot | Persentase pengunjung yang memulai percakapan |
| Tingkat konversi ke WhatsApp/kontak | Persentase interaksi yang berlanjut ke kontak owner |
| Waktu respons rata-rata chatbot | Dalam hitungan detik |
| Pengurangan beban chat manual owner | Penurunan volume pertanyaan repetitif manual |
| **[Baru] Tingkat penggunaan Studio Desain 2D** | **Persentase pengunjung yang menyelesaikan konfigurasi desain hingga tahap "kirim ke WhatsApp"** |
| **[Baru] Tingkat revisi desain pasca-order** | **Penurunan jumlah revisi desain setelah order dibanding sebelum ada Studio 2D (baseline dari histori chat manual)** |

### 5.12 Risiko & Batasan

| Risiko/Batasan | Mitigasi |
|---|---|
| Data sertifikat & testimoni belum lengkap | Section graceful degradation; follow-up wawancara |
| Ketersediaan foto produk/proses masih terbatas | Koordinasi pengumpulan aset sebelum build konten visual |
| Harga produk bersifat variatif, bukan fix | Format estimasi/"mulai dari", bukan harga final mutlak |
| Chatbot berpotensi memberi jawaban di luar konteks | Dibatasi knowledge base resmi + mekanisme eskalasi |
| Anggaran & kapasitas UMKM terbatas (Rp0) | Solusi hemat biaya, hindari infrastruktur/AI berbayar |
| **[Baru]** Rendering Studio Desain 2D bisa berat/tidak konsisten di perangkat/browser lama | Gunakan library vektor ringan, uji di beberapa perangkat low-end sebelum launch |
| **[Baru]** Aset template motif (Heritage Series) belum tersedia dalam format vektor siap pakai | Perlu proses digitalisasi/vektorisasi motif tenun sebagai tahap awal pengembangan Studio 2D |

### 5.13 Asumsi & Pertanyaan Terbuka

**Asumsi:**
- Owner bersedia menyediakan data tambahan (sertifikat, testimoni, foto) pada tahap follow-up
- Owner memiliki nomor WhatsApp aktif yang dapat diintegrasikan sebagai kanal lanjutan
- Owner dapat menyediakan referensi visual motif Heritage Series untuk didigitalisasi menjadi template Studio 2D

**Pertanyaan terbuka:**
- Apakah owner menginginkan chatbot berbasis teks saja atau juga mendukung pengiriman gambar referensi desain?
- Apakah dibutuhkan multi-admin untuk menangani eskalasi chatbot?
- Apakah ada rencana ekspansi fitur pemesanan online di fase berikutnya?
- **[Baru]** Berapa banyak varian template motif Heritage Series yang perlu tersedia di rilis pertama Studio Desain 2D?
- **[Baru]** Apakah hasil konfigurasi Studio 2D perlu disimpan (mis. via akun/nomor WA) agar bisa diakses kembali, atau cukup sekali pakai per sesi?

---

## 6. Use Case Modelling

### 6.1 Actors Table

| Actor Categories | Actors | Explanation |
|---|---|---|
| Primary Business Actor | Calon Customer | Pengguna yang berinteraksi langsung dengan landing page, chatbot, dan Studio Desain 2D untuk mencari informasi produk, harga, serta melakukan konsultasi/kustomisasi desain custom. Aktor ini memperoleh manfaat langsung (nilai bisnis) dari use case. |
| Primary System Actor | Owner/Admin RIZA APPAREL | Pemilik usaha yang menginisiasi penggunaan sistem untuk mengelola informasi bisnis dan menerima eskalasi percakapan/draf desain yang memerlukan konfirmasi manual. |
| External Server Actor | AI Chatbot/Agent Engine | Layanan/model AI eksternal yang merespons permintaan sistem untuk menghasilkan jawaban otomatis atas pertanyaan customer, berdasarkan knowledge base resmi bisnis. |
| External Server Actor | WhatsApp Business (API/Link) | Layanan eksternal yang menerima permintaan dari sistem untuk meneruskan pesan/eskalasi/draf brief desain ke kontak resmi owner. |
| External Receiving Actor | Owner (via WhatsApp) | Menerima notifikasi/eskalasi/draf brief pesan dari sistem secara pasif untuk ditindaklanjuti manual. |

> **Catatan:** Calon Customer berperan sebagai actor utama yang mendapat manfaat bisnis (business actor), sementara Owner/Admin adalah actor yang menginisiasi penggunaan sistem secara langsung (system actor). AI Chatbot/Agent Engine dan WhatsApp diklasifikasikan sebagai *external server actor* karena keduanya adalah layanan pihak ketiga yang merespons permintaan dari dalam sistem, bukan pengguna manusia yang berinteraksi langsung dengan antarmuka.

### 6.2 Identifying Business Requirements Use Case

#### Actor: Calon Customer

**a. Apa tugas utama actor ini?**
- Mencari informasi tentang RIZA APPAREL (profil, visi-misi, keunggulan)
- Melihat katalog produk/jasa beserta price list
- Melihat galeri foto produk dan proses produksi
- Melihat promo/paket yang sedang berlaku
- Melihat mitra, sertifikat, dan testimoni sebagai bahan pertimbangan
- Berkonsultasi mengenai kebutuhan desain custom melalui chatbot
- Menghubungi owner untuk melanjutkan proses pemesanan
- **[Baru]** Mengonfigurasi desain jersey secara visual di Studio 2D (memilih template motif, warna dasar, mengisi nama/nomor punggung, opsional unggah logo) sebelum mengirim brief ke admin

**b. Informasi apa yang dibutuhkan actor ini dari sistem?**
- Profil dan identitas bisnis (nama, logo, tagline, visi-misi, sejarah)
- Daftar produk/jasa beserta deskripsi dan estimasi harga
- Informasi promo dan paket yang berlaku
- Foto produk dan proses produksi
- Daftar mitra/customer, sertifikat, dan testimoni (jika tersedia)
- Jawaban atas pertanyaan yang diajukan ke chatbot
- Estimasi harga awal dan alur selanjutnya untuk pemesanan
- **[Baru]** Pratinjau visual real-time hasil kustomisasi (tampilan depan & belakang), daftar template motif yang tersedia, dan estimasi harga indikatif yang menyesuaikan konfigurasi

**c. Informasi apa yang diberikan actor ini ke sistem?**
- Pertanyaan seputar produk, harga, atau layanan
- Detail kebutuhan desain custom (jenis produk, jumlah, elemen desain)
- Data kontak (opsional)
- **[Baru]** Pilihan template motif, warna dasar, teks nama & nomor punggung, file logo (opsional)

**d. Apakah sistem perlu menginformasikan perubahan/kejadian kepada actor ini?**
Ya, sistem perlu menampilkan status ketersediaan promo terbaru, serta memberi notifikasi dalam percakapan chatbot ketika permintaan telah dieskalasi ke owner.

**e. Apakah actor ini perlu menginformasikan perubahan/kejadian kepada sistem?**
Tidak secara langsung — actor ini bersifat pasif dalam memberi informasi perubahan; ia hanya menyampaikan permintaan/pertanyaan/konfigurasi baru, bukan mengubah data yang tersimpan di sistem.

#### Actor: Owner/Admin RIZA APPAREL

**a. Apa tugas utama actor ini?**
- Menyediakan dan memperbarui data bisnis (profil, produk, harga, promo, foto, mitra, sertifikat, testimoni)
- Menerima dan menindaklanjuti eskalasi percakapan dari chatbot yang memerlukan konfirmasi manual
- Memberikan konfirmasi akhir terkait harga, waktu produksi, dan detail pesanan

**b. Informasi apa yang dibutuhkan actor ini dari sistem?**
- Ringkasan kebutuhan desain custom yang telah digali chatbot
- Notifikasi/eskalasi pertanyaan yang tidak dapat dijawab chatbot
- Riwayat singkat percakapan sebagai konteks

**c. Informasi apa yang diberikan actor ini ke sistem?**
- Data dan konten bisnis terbaru
- Konfirmasi/keputusan final terkait harga dan waktu produksi

**d. Apakah sistem perlu menginformasikan perubahan/kejadian kepada actor ini?**
Ya, sistem perlu memberi notifikasi setiap kali ada eskalasi baru dari chatbot yang membutuhkan tindak lanjut manual.

**e. Apakah actor ini perlu menginformasikan perubahan/kejadian kepada sistem?**
Ya, owner perlu memperbarui data bisnis agar informasi yang ditampilkan ke customer maupun basis pengetahuan chatbot tetap akurat dan terkini.

#### Actor: AI Chatbot/Agent Engine

**a. Apa tugas utama actor ini?**
- Memproses pertanyaan dari calon customer dan menghasilkan jawaban berdasarkan basis pengetahuan resmi bisnis
- Menggali kebutuhan desain custom melalui rangkaian pertanyaan terstruktur
- Menentukan kapan suatu permintaan perlu dieskalasi ke owner

**b. Informasi apa yang dibutuhkan actor ini dari sistem?**
- Basis pengetahuan (knowledge base) berisi data resmi bisnis
- Riwayat percakapan dalam sesi berjalan

**c. Informasi apa yang diberikan actor ini ke sistem?**
- Hasil jawaban yang dihasilkan untuk ditampilkan ke customer
- Ringkasan kebutuhan desain untuk diteruskan ke owner saat eskalasi

**d. Apakah sistem perlu menginformasikan perubahan/kejadian kepada actor ini?**
Ya, sistem perlu menyampaikan pembaruan pada knowledge base agar jawaban chatbot tetap konsisten dengan data terbaru.

**e. Apakah actor ini perlu menginformasikan perubahan/kejadian kepada sistem?**
Ya, chatbot perlu menandai/melaporkan setiap kali suatu percakapan dieskalasi ke owner.

#### Actor: WhatsApp Business (API/Link)

**a. Apa tugas utama actor ini?**
Meneruskan pesan eskalasi (termasuk draf brief hasil Studio Desain 2D) dari chatbot/sistem ke nomor kontak resmi owner.

**b. Informasi apa yang dibutuhkan actor ini dari sistem?**
Isi pesan eskalasi/draf brief beserta tujuan pengiriman (nomor kontak owner).

**c. Informasi apa yang diberikan actor ini ke sistem?**
Status pengiriman pesan (berhasil/gagal terkirim), sebagai konfirmasi teknis.

**d. Apakah sistem perlu menginformasikan perubahan/kejadian kepada actor ini?**
Tidak — actor ini hanya menerima permintaan pengiriman pesan dari sistem.

**e. Apakah actor ini perlu menginformasikan perubahan/kejadian kepada sistem?**
Ya, secara terbatas — konfirmasi status pengiriman pesan (opsional, tergantung tingkat integrasi teknis).

#### Actor: Owner (via WhatsApp)

**a. Apa tugas utama actor ini?**
Menerima pesan eskalasi/notifikasi/draf brief desain dari sistem melalui WhatsApp untuk ditindaklanjuti secara manual.

**b. Informasi apa yang dibutuhkan actor ini dari sistem?**
Isi pesan eskalasi berisi ringkasan kebutuhan calon customer.

**c. Informasi apa yang diberikan actor ini ke sistem?**
Tidak ada — actor ini bersifat pasif, hanya menerima output dari sistem.

**d. Apakah sistem perlu menginformasikan perubahan/kejadian kepada actor ini?**
Ya, ini adalah fungsi utamanya.

**e. Apakah actor ini perlu menginformasikan perubahan/kejadian kepada sistem?**
Tidak — interaksi lanjutan terjadi di luar sistem, langsung antara owner dan customer via WhatsApp.

### 6.3 Daftar Business Requirements Use Case per Actor

| Actor | ID | Use Case | Deskripsi Singkat |
|---|---|---|---|
| Calon Customer | UC-01 | Lihat Profil & Informasi Bisnis | Melihat identitas, visi-misi, dan keunggulan RIZA APPAREL |
| | UC-02 | Lihat Katalog Produk & Price List | Melihat daftar produk/jasa beserta estimasi harga |
| | UC-03 | Konsultasi AI Assistant | Berinteraksi dengan chatbot untuk bertanya dan mengajukan kebutuhan desain custom |
| | UC-04 | Lihat Galeri, Promo, Mitra & Testimoni | Melihat foto produk/proses, promo aktif, mitra, sertifikat, dan testimoni |
| | UC-05 | Lanjutkan Kontak ke Owner | Melanjutkan proses pemesanan melalui WhatsApp resmi |
| | **UC-15** | **Gunakan Studio Desain 2D** | **Mengonfigurasi tampilan jersey secara visual (template motif, warna, nama, nomor punggung, logo) dan melihat pratinjau real-time sebelum mengirim brief ke WhatsApp admin** |
| Owner/Admin RIZA APPAREL | UC-06 | Kelola Data Bisnis | Memperbarui data produk, harga, promo, foto, sertifikat, testimoni, dan mitra |
| | UC-07 | Terima Notifikasi Eskalasi | Menerima ringkasan percakapan yang dieskalasi oleh chatbot |
| | UC-08 | Tindak Lanjuti Konsultasi Customer | Memberi konfirmasi akhir harga dan waktu produksi secara manual |
| AI Chatbot/Agent Engine | UC-09 | Jawab Pertanyaan Umum (FAQ) | Merespons pertanyaan customer berdasarkan knowledge base resmi |
| | UC-10 | Gali Kebutuhan Desain Custom | Menanyakan detail kebutuhan desain secara terstruktur |
| | UC-11 | Eskalasikan Percakapan | Meneruskan percakapan ke owner saat di luar cakupan pengetahuan chatbot |
| | UC-12 | Sinkronisasi Knowledge Base | Menerima pembaruan data bisnis agar jawaban tetap akurat |
| WhatsApp Business (API/Link) | UC-13 | Teruskan Pesan Eskalasi | Mengirim ringkasan eskalasi dari sistem ke nomor owner |
| Owner (via WhatsApp) | UC-14 | Terima Pesan Eskalasi | Menerima notifikasi eskalasi untuk ditindaklanjuti manual |

### 6.4 Fully Dressed Use Case Specification — UC-03: Konsultasi AI Assistant

| Field | Deskripsi |
|---|---|
| **Use Case ID** | UC-03 |
| **Use Case Name** | Konsultasi AI Assistant |
| **Primary Actor** | Calon Customer |
| **Secondary Actor(s)** | AI Chatbot/Agent Engine, Owner/Admin RIZA APPAREL (via eskalasi) |
| **Stakeholders & Interests** | **Calon Customer** — jawaban cepat & akurat, bantuan konsultasi desain tanpa menunggu respons manual. **Owner/Admin** — mengurangi beban menjawab pertanyaan repetitif, hanya menangani percakapan yang perlu keputusan manual. **RIZA APPAREL (bisnis)** — meningkatkan konversi lead menjadi pemesanan. |
| **Preconditions** | Landing page telah dimuat dan widget AI Assistant tersedia; knowledge base chatbot sudah berisi data resmi bisnis. |
| **Postconditions (Success Guarantee)** | Customer memperoleh jawaban dan/atau kebutuhan desain tercatat; ringkasan percakapan dieskalasi ke owner bila diperlukan. |
| **Trigger** | Calon Customer membuka widget AI Assistant dan mengetikkan pertanyaan/permintaan konsultasi. |
| **Main Success Scenario** | 1. Customer membuka widget AI Assistant.<br>2. Sistem menampilkan sapaan awal & opsi pertanyaan.<br>3. Customer mengetikkan pertanyaan.<br>4. Chatbot memproses pertanyaan berdasarkan knowledge base.<br>5. Sistem menampilkan jawaban.<br>6. Customer menyampaikan ingin custom desain.<br>7. Chatbot mengajukan pertanyaan terstruktur (jenis produk, jumlah, elemen desain).<br>8. Customer memberikan detail kebutuhan.<br>9. Sistem merangkum & memberi estimasi harga awal.<br>10. Sistem menawarkan lanjut ke Owner via WhatsApp (atau mengarahkan ke Studio Desain 2D bila customer ingin visualisasi terlebih dahulu).<br>11. Customer setuju, sistem meneruskan ringkasan sebagai eskalasi ke Owner. |
| **Extensions** | **3a.** Pertanyaan di luar knowledge base → langsung eskalasi ke Owner.<br>**7a.** Info tidak lengkap → klarifikasi ulang maksimal 2 kali, lalu tetap lanjut ke eskalasi.<br>**9a.** Estimasi tidak dapat dihitung → lewati estimasi, langsung eskalasi manual.<br>**10a.** Customer ingin visualisasi desain → sistem mengarahkan ke UC-15 (Gunakan Studio Desain 2D) sebelum kembali melanjutkan eskalasi.<br>**11a.** Customer menolak lanjut → sesi diakhiri tanpa eskalasi, ringkasan tersimpan dalam sesi. |
| **Special Requirements** | Chatbot tidak boleh memberi komitmen harga/waktu produksi final. Respons real-time tanpa jeda signifikan. |
| **Assumptions** | Knowledge base selalu sinkron dengan data terbaru (lihat UC-12). Nomor WhatsApp owner aktif. |
| **Frequency of Use** | Tinggi — titik kontak utama sebelum keputusan pemesanan. |
| **Open Issues** | Dukungan unggah gambar referensi desain; durasi penyimpanan sesi percakapan sebelum kedaluwarsa. |

### 6.5 Actor Glossary

| Term | Synonym | Description |
|---|---|---|
| Calon Customer | Pengunjung, Visitor, Pelanggan Potensial | Individu/perwakilan instansi/komunitas yang mengakses landing page untuk info produk & konsultasi/kustomisasi desain, tanpa akses pengelolaan data bisnis. |
| Owner/Admin RIZA APPAREL | Pemilik Usaha, Pengelola Bisnis | Pihak internal yang mengelola data bisnis dan menindaklanjuti eskalasi chatbot secara manual. |
| AI Chatbot/Agent Engine | AI Assistant, Chatbot, Asisten Virtual | Komponen sistem berbasis model bahasa yang merespons pertanyaan customer & menggali kebutuhan desain custom. |
| WhatsApp Business (API/Link) | Kanal WhatsApp, WA Business | Layanan pihak ketiga yang meneruskan pesan eskalasi/draf brief dari sistem ke nomor kontak resmi owner. |
| Owner (via WhatsApp) | Penerima Eskalasi | Representasi Owner sebagai penerima pasif notifikasi eskalasi, ditindaklanjuti manual di luar sistem. |
| Knowledge Base | Basis Pengetahuan, KB | Kumpulan data resmi bisnis yang menjadi acuan chatbot dalam menjawab pertanyaan. |
| Eskalasi | Escalation, Handoff | Proses pengalihan percakapan/draf brief dari chatbot atau Studio 2D ke owner saat perlu keputusan manual. |
| **Studio Desain 2D** | **Design Studio, Kanvas Kustomisasi** | **Modul kanvas visual interaktif berbasis vektor/SVG di sisi klien yang memungkinkan pengguna mengonfigurasi tampilan jersey secara real-time sebelum memesan.** |

### 6.6 Use Case Glossary

| Use Case Name | Use Case Description | Participating Actors and Roles |
|---|---|---|
| Lihat Profil & Info Bisnis (UC-01) | Menampilkan identitas bisnis: nama, logo, tagline, visi-misi, sejarah. | Calon Customer (initiator) |
| Lihat Katalog & Price List (UC-02) | Menampilkan daftar produk/jasa dengan deskripsi & estimasi harga. | Calon Customer (initiator) |
| Konsultasi AI Assistant (UC-03) | Tanya jawab produk & konsultasi desain custom melalui chatbot, dengan opsi eskalasi. | Calon Customer (primary); AI Chatbot Engine (supporting); Owner/Admin (receiving) |
| Lihat Galeri, Promo, Mitra & Testimoni (UC-04) | Menampilkan foto, promo aktif, mitra, sertifikat, testimoni. | Calon Customer (initiator) |
| Lanjutkan Kontak ke Owner (UC-05) | Mengarahkan pengguna ke kanal WhatsApp resmi untuk pemesanan. | Calon Customer (primary); WhatsApp Business (supporting) |
| Kelola Data Bisnis (UC-06) | Memperbarui produk, harga, promo, foto, sertifikat, testimoni, mitra. | Owner/Admin (primary) |
| Terima Notifikasi Eskalasi (UC-07) | Menampilkan notifikasi setiap ada percakapan yang dieskalasi. | Owner/Admin (primary); AI Chatbot Engine (supporting) |
| Tindak Lanjuti Konsultasi Customer (UC-08) | Konfirmasi akhir harga, waktu produksi, dan detail pesanan. | Owner/Admin (primary); Owner via WhatsApp (supporting) |
| Jawab Pertanyaan Umum/FAQ (UC-09) | Merespons pertanyaan umum berdasarkan data resmi bisnis. | AI Chatbot Engine (primary); Calon Customer (receiving) |
| Gali Kebutuhan Desain Custom (UC-10) | Mengajukan pertanyaan terstruktur untuk memahami kebutuhan desain. | AI Chatbot Engine (primary); Calon Customer (supporting) |
| Eskalasikan Percakapan (UC-11) | Meneruskan ringkasan percakapan ke owner bila di luar cakupan chatbot. | AI Chatbot Engine (primary); WhatsApp Business (supporting); Owner via WhatsApp (receiving) |
| Sinkronisasi Knowledge Base (UC-12) | Memperbarui basis pengetahuan chatbot agar konsisten dengan data terbaru. | AI Chatbot Engine (primary); Owner/Admin (supporting) |
| Teruskan Pesan Eskalasi (UC-13) | Mengirim ringkasan pesan eskalasi ke nomor kontak resmi owner. | WhatsApp Business (primary); AI Chatbot Engine (supporting) |
| Terima Pesan Eskalasi (UC-14) | Menerima notifikasi eskalasi untuk ditindaklanjuti manual. | Owner via WhatsApp (primary) |
| **Gunakan Studio Desain 2D (UC-15)** | **Memungkinkan pengunjung mengonfigurasi desain jersey secara visual — memilih template motif Heritage Series, warna dasar, mengisi nama & nomor punggung, opsional unggah logo sponsor — dengan pratinjau real-time tampilan depan/belakang, lalu mengonversi hasil akhir menjadi draf brief pesanan terformat ke WhatsApp.** | **Calon Customer (initiator/primary actor); WhatsApp Business (supporting actor)** |

### 6.7 Use Case Model Diagram

![Use Case Model Diagram RIZA APPAREL](UseCaseDiagram_RIZA_APPAREL.png)

*Gambar 2. Use case model diagram — 5 actor dan 15 use case, termasuk UC-15 (Gunakan Studio Desain 2D, ditandai warna oranye) yang ditambahkan berdasarkan kebutuhan visualisasi desain.*

### 6.8 Use-Case Entity Glossary

| Use Case | Entity | Atribut |
|---|---|---|
| Lihat Profil & Info Bisnis (UC-01) | Profil Bisnis | nama_usaha, logo, tagline, visi, misi, sejarah |
| Lihat Katalog & Price List (UC-02) | Produk | nama_produk, kategori, deskripsi, harga_estimasi, satuan |
| Konsultasi AI Assistant (UC-03) | Percakapan | id_sesi, isi_pesan, timestamp, status_sesi |
| | Kebutuhan Desain | jenis_produk, jumlah, elemen_desain, catatan_tambahan |
| Lihat Galeri, Promo, Mitra & Testimoni (UC-04) | Galeri Foto | url_foto, kategori, deskripsi_singkat |
| | Promo | nama_promo, deskripsi, periode_berlaku |
| | Mitra | nama_mitra, logo_mitra |
| | Testimoni | nama_customer, isi_testimoni, rating |
| Lanjutkan Kontak ke Owner (UC-05) | Permintaan Kontak | nomor_tujuan, ringkasan_pesan, waktu_kirim |
| Kelola Data Bisnis (UC-06) | Data Bisnis | jenis_data, konten, tanggal_pembaruan, status_publikasi |
| Terima Notifikasi Eskalasi (UC-07) | Notifikasi | id_notifikasi, isi_pesan, waktu_terima, status_baca |
| Tindak Lanjuti Konsultasi Customer (UC-08) | Konfirmasi Pesanan | harga_final, estimasi_waktu_produksi, catatan_konfirmasi |
| Jawab Pertanyaan Umum/FAQ (UC-09) | FAQ Knowledge Base | pertanyaan, jawaban, kategori |
| Gali Kebutuhan Desain Custom (UC-10) | Kebutuhan Desain | jenis_produk, jumlah, logo, typography, motif |
| Eskalasikan Percakapan (UC-11) | Eskalasi | id_eskalasi, ringkasan_percakapan, alasan_eskalasi, waktu_eskalasi |
| Sinkronisasi Knowledge Base (UC-12) | Knowledge Base Entry | id_entry, kategori, konten, tanggal_update |
| Teruskan Pesan Eskalasi (UC-13) | Pesan WhatsApp | nomor_tujuan, isi_pesan, status_pengiriman |
| Terima Pesan Eskalasi (UC-14) | Pesan Eskalasi | isi_pesan, waktu_terima, status_tindak_lanjut |
| **Gunakan Studio Desain 2D (UC-15)** | **Konfigurasi Desain** | **design_id, template_motif (Ende Diamond Zawo / Flores Ocean Waves / Modern Solid Athletic / dll — mengacu Koleksi Tenun), base_color, view_side (depan/belakang), player_name, player_number, logo_url (opsional), logo_position, created_at** |
| | **Sesi Studio** | **session_id, is_saved_local, last_modified, linked_estimation_id (relasi ke entity Produk/estimasi harga pada UC-02)** |

### 6.9 Activity Diagram — AI Assistant Workflow

![Activity Diagram AI Assistant Workflow](ActivityDiagram_AI_Assistant.png)

*Gambar 3. Activity diagram alur kerja AI Assistant — dari pembukaan widget hingga eskalasi ke owner. (Alur Studio Desain 2D merupakan flow terpisah yang dapat diakses baik dari landing page maupun dari titik "10a" pada UC-03; disarankan dibuat activity diagram tersendiri pada revisi berikutnya.)*

---

## 7. Tambahan: Manajemen Proyek & Rekomendasi Lanjutan

Bagian ini melengkapi hasil sesi brainstorming dan planning sebelumnya dengan beberapa aspek manajemen proyek yang relevan untuk eksekusi, termasuk penyesuaian akibat penambahan modul Studio Desain 2D dan konfirmasi anggaran Rp0.

### 7.1 Timeline & Milestone Proyek (Indikatif)

| Fase | Aktivitas | Estimasi Durasi |
|---|---|---|
| 1. Discovery & Follow-up | Melengkapi data yang belum tersedia (sertifikat, testimoni, foto produk/proses, referensi visual motif Heritage Series untuk Studio 2D); finalisasi copywriting | 1–2 minggu |
| 2. Desain (UI/UX) | Merancang wireframe & visual landing page; merancang UX kanvas Studio Desain 2D | 1–2 minggu |
| 3. Vektorisasi Aset Motif | Mendigitalisasi motif tenun Heritage Series menjadi aset vektor/SVG siap pakai | 1 minggu (paralel dengan fase 2) |
| 4. Pengembangan Frontend | Membangun landing page sesuai desain & kebutuhan fungsional (F-01 s.d. F-10) | 2–3 minggu |
| 5. Pengembangan AI Chatbot | Menyusun knowledge base, integrasi model AI, alur eskalasi ke WhatsApp (C-01 s.d. C-05) | 2–3 minggu |
| 6. Pengembangan Studio Desain 2D | Membangun kanvas rendering client-side, integrasi template motif & konversi ke draf brief (S-01 s.d. S-07) | 2–3 minggu (dapat paralel dengan fase 5) |
| 7. Integrasi & Testing | Uji fungsional, uji respons chatbot, uji performa render Studio 2D (<300ms), uji tampilan lintas perangkat | 1–2 minggu |
| 8. Peluncuran (Launch) | Deploy ke hosting produksi (ai.studio), pengujian akhir, serah terima ke owner | 2–3 hari |
| 9. Monitoring Pasca-Launch | Pemantauan performa, akurasi chatbot, tingkat penggunaan Studio 2D, dan masukan pengguna awal | Berkelanjutan (2–4 minggu pertama intensif) |

### 7.2 Matriks Tanggung Jawab (RACI)

| Aktivitas | Owner RIZA APPAREL | Tim Developer | AI Chatbot Vendor/API |
|---|---|---|---|
| Menyediakan data & konten bisnis | A/R | C | – |
| Menyediakan referensi visual motif Heritage Series | A/R | C | – |
| Desain & pengembangan landing page | C | A/R | – |
| Menyusun & melatih knowledge base chatbot | C | A/R | R |
| Pengembangan Studio Desain 2D (rendering client-side) | I | A/R | – |
| Pengujian fungsional & UAT | C | A/R | – |
| Deploy & konfigurasi hosting | I | A/R | – |
| Menindaklanjuti eskalasi customer / draf brief desain | A/R | I | – |
| Pemeliharaan & update konten pasca-launch | R | C/A | – |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

### 7.3 Risk Register

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Data konten (foto, sertifikat, testimoni) terlambat dilengkapi owner | Sedang | Tinggi | Tetapkan deadline pengumpulan aset di awal fase Discovery; gunakan graceful degradation pada section terkait |
| Chatbot memberikan jawaban tidak akurat/di luar konteks | Sedang | Tinggi | Batasi jawaban hanya dari knowledge base resmi; uji dengan skenario pertanyaan umum sebelum launch |
| Ketergantungan penuh pada satu owner untuk validasi & update data | Tinggi | Sedang | Dokumentasikan proses update data secara sederhana agar dapat didelegasikan ke staf lain bila ada |
| Izin penggunaan logo/nama mitra belum terkonfirmasi tertulis | Rendah | Sedang | Konfirmasi izin pencantuman logo/nama mitra sebelum publikasi landing page |
| Nomor WhatsApp owner tidak aktif/berganti | Rendah | Tinggi | Gunakan konfigurasi nomor kontak yang mudah diperbarui tanpa perlu deploy ulang sistem |
| Keterbatasan literasi digital owner dalam mengelola konten | Sedang | Sedang | Sediakan panduan sederhana (SOP singkat) untuk update konten dasar |
| **[Baru]** Aset vektor motif Heritage Series belum tersedia/berkualitas rendah | Sedang | Tinggi | Alokasikan waktu khusus untuk vektorisasi di awal proyek; mulai dengan 3–4 motif prioritas untuk rilis pertama |
| **[Baru]** Performa render Studio 2D tidak konsisten di perangkat/browser lama (umum di daerah) | Sedang | Sedang | Gunakan library vektor ringan, uji di perangkat low-end, sediakan fallback tampilan statis bila render gagal |
| **[Baru]** Dengan anggaran Rp0, ketergantungan pada layanan tier-gratis berisiko terkena limit/downtime | Sedang | Sedang | Pilih penyedia dengan tier gratis yang stabil (mis. hosting ai.studio); pantau limit penggunaan secara berkala |
| **[Baru]** Draf brief hasil Studio 2D tidak konsisten formatnya sehingga sulit dibaca owner | Rendah | Sedang | Standardisasi template teks draf brief (mis. daftar poin: motif, warna, nama, nomor, catatan logo) |

### 7.4 Checklist Pengumpulan Konten

- [ ] Logo resmi RIZA APPAREL (format vektor/PNG resolusi tinggi)
- [ ] Minimal 8–10 foto produk (jersey/apparel) dengan pencahayaan baik
- [ ] Foto/video singkat proses produksi (opsional, untuk galeri "proses")
- [ ] Sertifikat usaha/legalitas (jika ada) dalam format gambar/PDF
- [ ] Testimoni customer (nama, isi testimoni, idealnya foto produk terkait)
- [ ] Konfirmasi tertulis izin pencantuman nama/logo mitra (REGARSPORT, REGARMARKET, GESA WAZO)
- [ ] Daftar lengkap harga per kategori produk beserta variasi (bahan, ukuran, jumlah minimum order)
- [ ] Nomor WhatsApp resmi untuk CTA dan eskalasi chatbot
- [ ] **[Baru]** Referensi visual/foto motif tenun Heritage Series (minimal 3–4 motif prioritas) untuk didigitalisasi menjadi template Studio Desain 2D
- [ ] **[Baru]** Daftar pilihan warna dasar jersey yang tersedia secara produksi (agar pilihan warna di Studio 2D sesuai kapasitas produksi riil)

### 7.5 Rencana Monitoring & Pemeliharaan Pasca-Peluncuran

- Tinjau berkala (bulanan) akurasi jawaban chatbot berdasarkan log percakapan, perbarui knowledge base bila diperlukan.
- Pantau metrik dasar (kunjungan, interaksi chatbot, klik CTA WhatsApp, **tingkat penyelesaian konfigurasi Studio 2D**) untuk mengevaluasi efektivitas landing page.
- Perbarui harga, promo, dan katalog produk secara rutin agar tetap konsisten dengan kondisi bisnis terkini.
- Backup berkala data/konten landing page dan riwayat konfigurasi knowledge base.
- Evaluasi triwulanan terhadap kebutuhan fitur tambahan (mis. sistem pemesanan online, penambahan template motif baru) berdasarkan pertumbuhan bisnis.

### 7.6 Pertimbangan Legal & Kepemilikan Konten

Perlu dipastikan bahwa seluruh konten yang ditampilkan (logo mitra, foto produk, testimoni customer, **motif tenun Heritage Series yang didigitalisasi**) memiliki izin penggunaan yang jelas dari pihak terkait, mengingat saat ini belum ada konfirmasi tertulis dari mitra bisnis. Data kontak customer yang mungkin dikumpulkan melalui chatbot atau Studio Desain 2D (nomor telepon, kebutuhan desain, konfigurasi jersey) sebaiknya diperlakukan sebagai data pribadi yang hanya digunakan untuk keperluan tindak lanjut pemesanan, tidak dibagikan ke pihak ketiga di luar kebutuhan operasional RIZA APPAREL.

### 7.7 Next Steps / Action Items

1. Follow-up wawancara dengan owner untuk melengkapi data sertifikat, testimoni, foto produk/proses, dan referensi visual motif Heritage Series.
2. Konfirmasi tertulis izin pencantuman logo/nama mitra pada landing page.
3. Finalisasi pilihan teknologi (frontend, hosting ai.studio, penyedia API AI chatbot tier-gratis) sesuai anggaran Rp0.
4. Mulai tahap desain UI/UX berdasarkan PRD dan Use Case Modelling pada dokumen ini, termasuk wireframe Studio Desain 2D.
5. Menyusun SOP sederhana bagi owner untuk memperbarui data bisnis pasca-peluncuran.
6. Prioritaskan 3–4 motif Heritage Series untuk divektorisasi sebagai template awal Studio 2D.

---

## 8. Lampiran — Data Mentah Hasil Wawancara

**Alamat:** JL. Gatot Subroto Gg. Sabar RT.022/RW.011, Mautapaga, Kec. Ende Timur, Kabupaten Ende, NTT 86317
**Kontak:** +62 812-4691-7740
**Harga:** Variatif, jersey mulai Rp90.000
**Promo:** Beli 2 bonus 1 pcs, gratis ongkir, bisa desain sesuai keinginan
**Mitra:** REGARSPORT, REGARMARKET, GESA WAZO
**Anggaran Proyek:** Rp0
**Hosting:** ai.studio

---

*Dokumen ini merangkum seluruh hasil sesi analisis dan perencanaan (Cause-and-Effect Analysis hingga Use-Case Entity Glossary), dilengkapi dengan informasi modul Studio Desain 2D yang sebelumnya belum tersampaikan dalam sesi chat, serta rekomendasi manajemen proyek tambahan (timeline, RACI, risk register, checklist konten, rencana pemeliharaan, dan pertimbangan legal).*
