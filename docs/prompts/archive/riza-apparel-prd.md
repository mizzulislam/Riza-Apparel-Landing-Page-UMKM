# Product Requirements Document (PRD)
## Riza Apparel — Landing Page & Design Platform (Fase MMP)

| | |
|---|---|
| **Produk** | Landing page, AI chatbot, dan Design Studio kustomisasi jersey untuk Riza Apparel |
| **Klien** | Riza Apparel — produsen custom jersey & sportswear, Ende, Nusa Tenggara Timur |
| **URL MVP** | https://rizaapparel-2026.web.app/ |
| **Fase** | MVP → MMP (Minimum Marketable Product) |
| **Status dokumen** | Draft v1.0 |
| **Dokumen rujukan** | Cause and Effect Analysis, System Improvement Objectives, PIECES Classification (lampiran proyek sebelumnya) |
| **Batasan anggaran** | **100% gratis** — tidak ada biaya berulang dalam bentuk apa pun (hosting, basis data, CMS, API AI) |

---

## 1. Ringkasan Eksekutif

Riza Apparel adalah UMKM produsen custom jersey dan sportswear berbasis di Ende, NTT, dengan diferensiasi motif autentik **Ende Diamond Zawo** dan **Flores Ocean Waves**. MVP landing page telah live dan mencakup empat komponen: halaman pemasaran utama, AI chatbot, halaman **Studio** untuk kustomisasi desain jersey (2D dan orbit-view pseudo-3D), serta AI agent generatif untuk membuat desain dari gambar referensi dan prompt teks.

Audit terhadap MVP menemukan bahwa produk secara teknis berfungsi namun secara komersial belum layak jual: situs tidak terindeks mesin pencari akibat arsitektur client-side rendering murni, tidak ada jalur konversi dari sesi desain menjadi prospek tercatat, seluruh konten tertanam hardcode, beberapa fitur inti (Studio, AI generator) memiliki kualitas keluaran di bawah standar layak jual, dan belum ada tata kelola risiko (biaya AI, kepatuhan data pribadi, kekayaan intelektual).

PRD ini merumuskan kebutuhan produk untuk fase MMP: versi yang cukup lengkap, cukup andal, dan cukup dapat dipasarkan untuk mulai menghasilkan prospek dan pesanan nyata — dikerjakan seluruhnya dalam batasan anggaran nol rupiah.

---

## 2. Latar Belakang dan Masalah

Ringkasan temuan audit (rincian lengkap pada dokumen Cause and Effect Analysis terlampir):

- **Tidak dapat ditemukan** — situs dirender sepenuhnya di sisi klien tanpa SSR/prerender; crawler mesin pencari hanya menerima metadata tanpa konten. Local SEO belum dibangun sama sekali, padahal target pasar memiliki komponen geografis kuat (Ende, NTT).
- **Tidak berkonversi** — tidak ada jalur eksplisit dari "selesai mendesain" menjadi "prospek tercatat"; tidak ada CRM, lead capture, estimator harga, maupun sinyal kepercayaan (portofolio, testimoni, size chart).
- **Tidak mandiri secara konten** — seluruh teks, gambar, dan katalog tertanam hardcode di kode sumber, sehingga setiap perubahan menuntut developer dan deployment ulang.
- **Fitur inti belum layak jual** — Design Studio memiliki defek visual dan belum tentu dapat digunakan tuntas di ponsel; mode "3D" sebenarnya adalah orbit-view dari aset 2D; AI design generator belum menghasilkan keluaran akurat; keluaran desain belum berupa berkas siap cetak untuk produksi.
- **Tata kelola belum ada** — tidak ada pengendalian biaya/kuota pada fitur AI, tidak ada kebijakan privasi maupun ketentuan penggunaan, tidak ada instrumentasi analitik untuk mengukur apa pun.

---

## 3. Tujuan Produk

### 3.1 Tujuan Bisnis
1. Menjadikan landing page sebagai kanal akuisisi pelanggan aktif — bukan sekadar brosur digital — dengan prospek tercatat yang dapat ditindaklanjuti.
2. Menjadikan situs dapat ditemukan secara organik oleh pasar target di Ende dan NTT tanpa belanja iklan berbayar.
3. Memberikan klien kemandirian penuh mengelola konten tanpa bergantung pada developer.
4. Menjadikan Design Studio sebagai alat produksi nyata, bukan sekadar demonstrasi teknologi.
5. Memastikan seluruh operasional berjalan tanpa biaya berulang, selaras dengan kapasitas finansial UMKM.

### 3.2 Tujuan Pengguna
- **Calon pelanggan** dapat dengan cepat memahami penawaran, melihat bukti kualitas, mengestimasi biaya, mendesain jersey sesuai keinginan, dan menghubungi Riza Apparel dengan friksi minimal.
- **Pemilik/admin Riza Apparel** dapat mengelola konten, memantau prospek, dan melacak status pesanan tanpa keterlibatan developer.

### 3.3 Non-Tujuan (Out of Scope untuk MMP)
- Sistem pembayaran online terintegrasi (checkout/payment gateway) — transaksi tetap ditutup secara manual via WhatsApp pada fase ini.
- Aplikasi mobile native.
- Multi-bahasa (Inggris) — MMP berfokus penuh pada Bahasa Indonesia.
- Model 3D jersey fotorealistik penuh (peningkatan bertahap, lihat Roadmap §11).
- Marketplace multi-vendor atau ekspansi ke produk di luar jersey/sportswear.

---

## 4. Target Pengguna dan Persona

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Pemesan Tim/Komunitas** (persona utama) | Pengurus tim futsal, klub olahraga sekolah, panitia turnamen, atau komunitas di Ende/NTT yang memesan jersey dalam jumlah 10–50+ potong. | Kepastian harga, bukti kualitas produk, kemudahan menyampaikan desain tim, kejelasan waktu produksi. |
| **Pemesan Individu/Kecil** | Individu yang ingin custom jersey pribadi atau dalam jumlah kecil. | Proses desain yang cepat dan menyenangkan, estimasi harga transparan untuk kuantitas kecil. |
| **Admin/Pemilik Riza Apparel** | Pengelola bisnis sehari-hari, kemungkinan tidak berlatar belakang teknis. | Panel pengelolaan konten yang sederhana, notifikasi prospek baru, visibilitas status pesanan. |
| **Mesin pencari & AI crawler** (persona teknis) | Googlebot dan crawler sejenis. | Konten yang dapat dirender dan diindeks tanpa eksekusi JavaScript penuh. |

---

## 5. Ruang Lingkup Fungsional

Ruang lingkup disusun mengikuti lima area objektif dari System Improvement Objectives (OBJ-1 s.d. OBJ-5). Setiap kebutuhan fungsional (FR) diberi kode unik untuk ditelusuri kembali ke dokumen analisis sebelumnya.

### 5.1 Area A — Keterjangkauan & Kinerja (mengacu OBJ-1)

| Kode | Requirement | Deskripsi |
|---|---|---|
| FR-A1 | Server-side rendering / prerendering | Seluruh rute publik (beranda, Studio, katalog, tentang) harus menghasilkan HTML bermuatan konten penuh saat diakses tanpa eksekusi JavaScript, dapat dicapai melalui SSR, SSG, atau prerendering statis per rute. |
| FR-A2 | Metadata dinamis per halaman | Setiap rute memiliki `<title>`, meta description, dan Open Graph image yang unik dan relevan terhadap kontennya. |
| FR-A3 | Structured data | Implementasi Schema.org `LocalBusiness`, `Product`, `Offer`, dan `FAQPage` pada rute yang relevan. |
| FR-A4 | Sitemap & robots | `sitemap.xml` dan `robots.txt` tersedia dan terdaftar di Google Search Console. |
| FR-A5 | Google Business Profile | Profil bisnis Riza Apparel terdaftar dan tertaut dari situs. |
| FR-A6 | Performance budget | Modul berat (renderer 3D, pustaka font eksternal, AI generator) dimuat secara lazy dan tidak membebani waktu muat halaman yang tidak membutuhkannya. |
| FR-A7 | Konten lokal | Salinan pemasaran memuat istilah pencarian lokal yang relevan (mis. "konveksi jersey Ende", "sablon sportswear NTT") secara alami, bukan keyword stuffing. |

### 5.2 Area B — Konversi, CRM & Pengukuran (mengacu OBJ-2)

| Kode | Requirement | Deskripsi |
|---|---|---|
| FR-B1 | Call-to-action pasca-desain | Setiap sesi di Design Studio yang selesai menampilkan aksi lanjutan yang jelas: simpan desain, minta penawaran, atau hubungi via WhatsApp. |
| FR-B2 | Lead capture form | Formulir ringkas (nama, kontak WhatsApp, nama tim/instansi opsional, estimasi jumlah pesanan) terpicu pada titik intensi tertinggi — penyelesaian desain atau klik "minta penawaran". |
| FR-B3 | Penyimpanan prospek terpusat | Data prospek tersimpan otomatis ke basis data terpusat beserta lampiran/tautan desain terkait, dapat diakses admin. |
| FR-B4 | Estimator harga | Kalkulator interaktif berbasis jumlah pesanan, jenis bahan, dan tingkat kompleksitas desain, menghasilkan kisaran harga tanpa perlu menghubungi admin. |
| FR-B5 | Konten sinyal kepercayaan | Halaman menampilkan portofolio pesanan terdahulu, testimoni klien, spesifikasi bahan, size chart dengan ukuran aktual, estimasi lead time, dan skema pembayaran/DP. |
| FR-B6 | Instrumentasi analitik | Google Analytics 4 terpasang dengan event kustom pada titik-titik funnel: kunjungan Studio, desain dimulai, desain selesai, lead capture terkirim, klik WhatsApp. |
| FR-B7 | Integrasi WhatsApp | Tombol/tautan WhatsApp dengan pesan prasi (pre-filled) yang menyertakan ringkasan desain atau konteks kunjungan, untuk mengurangi friksi follow-up. |

### 5.3 Area C — Kemandirian Konten & Diferensiasi Kultural (mengacu OBJ-3)

| Kode | Requirement | Deskripsi |
|---|---|---|
| FR-C1 | Panel admin CMS | Antarmuka administratif berbahasa Indonesia untuk mengelola teks, gambar, katalog produk, dan promo tanpa menyentuh kode sumber. |
| FR-C2 | Pengelolaan pustaka motif | Admin dapat menambah, mengedit, dan mengaktifkan/menonaktifkan motif (termasuk Ende Diamond Zawo dan Flores Ocean Waves) sebagai preset yang muncul di Design Studio. |
| FR-C3 | Kompresi aset otomatis | Gambar yang diunggah melalui panel admin dikompresi dan dikonversi ke format modern (WebP) secara otomatis untuk menjaga performance budget (FR-A6). |
| FR-C4 | Riwayat perubahan konten (opsional/nice-to-have) | Admin dapat melihat riwayat perubahan konten sederhana untuk memudahkan pemulihan bila terjadi kesalahan input. |

### 5.4 Area D — Kesiapan Komersial Design Studio (mengacu OBJ-4)

| Kode | Requirement | Deskripsi |
|---|---|---|
| FR-D1 | Perbaikan defek visual Studio | Seluruh defek tampilan berkategori blocker dan major pada halaman Studio diperbaiki dan diverifikasi pada peramban utama (Chrome, Safari mobile). |
| FR-D2 | Dukungan penuh perangkat sentuh | Seluruh interaksi kustomisasi (drag, resize, rotate, pemilihan warna/motif) dapat diselesaikan penuh melalui layar sentuh pada ponsel, tanpa memerlukan mouse/trackpad. |
| FR-D3 | Peningkatan aset jersey dasar | Aset blank mockup 2D ditingkatkan kualitas visualnya; mode tampilan 3D didokumentasikan secara jujur sebagai "pratinjau 360°" bila belum berupa model 3D sesungguhnya, atau ditingkatkan menjadi model 3D nyata sesuai kapasitas pada fase lanjutan (lihat Roadmap §11). |
| FR-D4 | Ekspor berkas siap cetak | Studio menghasilkan berkas ekspor beresolusi cetak (≥150 DPI pada ukuran pola aktual) dengan bleed dan kelonggaran jahitan sesuai standar produksi sublimasi yang dipakai klien. |
| FR-D5 | Integrasi Google Fonts | Pustaka font pada modul kustomisasi diperluas melalui integrasi Google Fonts (lisensi bebas komersial), dimuat secara lazy. |
| FR-D6 | Sistem motion terdefinisi | Transisi antarsection dan antarhalaman mengikuti sistem motion yang konsisten (durasi, easing, hierarki gerak) yang terdokumentasi. |

### 5.5 Area E — Keandalan Layanan AI & Tata Kelola (mengacu OBJ-5)

| Kode | Requirement | Deskripsi |
|---|---|---|
| FR-E1 | Restrukturisasi knowledge base chatbot | Basis pengetahuan chatbot disusun ulang secara terstruktur (kategori FAQ, produk, proses pemesanan, kebijakan) dengan mekanisme retrieval yang tepat. |
| FR-E2 | Siklus pembaruan knowledge base | Tersedia proses (dapat manual pada MMP) untuk menambahkan pertanyaan riil pengguna yang belum terjawab ke dalam knowledge base secara berkala. |
| FR-E3 | Perbaikan akurasi AI design generator | Prompt engineering terstruktur dan pengondisian citra referensi diterapkan untuk meningkatkan kesesuaian keluaran terhadap instruksi pengguna. |
| FR-E4 | Rate limiting & kuota AI | Seluruh endpoint yang memanggil model AI (chatbot maupun design generator) dibatasi melalui rate limiting dan kuota per sesi/per hari yang selaras dengan batas tier gratis penyedia layanan. |
| FR-E5 | Penutupan otomatis saat kuota habis | Sistem menonaktifkan fitur AI secara otomatis dan menampilkan pesan yang jelas kepada pengguna begitu kuota gratis bulanan habis, tanpa beralih ke penagihan berbayar. |
| FR-E6 | Kredensial di backend | Seluruh kunci API AI disimpan dan dipanggil hanya dari sisi backend/server; tidak ada kredensial yang terekspos di kode sisi klien. |
| FR-E7 | Kebijakan privasi | Halaman kebijakan privasi yang menjelaskan data apa yang dikumpulkan, tujuan pemrosesan, dan hak subjek data, selaras UU No. 27 Tahun 2022 PDP. |
| FR-E8 | Ketentuan penggunaan | Halaman ketentuan penggunaan yang mengatur pernyataan hak pengguna atas materi unggahan, kepemilikan desain yang dihasilkan, dan hak Riza Apparel menolak pesanan yang melanggar kekayaan intelektual pihak ketiga. |
| FR-E9 | Status pesanan sederhana | Admin dapat memperbarui status pesanan (mis. Diterima → Diproduksi → Selesai) yang dapat dilihat pelanggan melalui tautan unik, mengurangi pertanyaan status berulang. |
| FR-E10 | Penanganan state antarmuka | Seluruh permukaan yang bergantung pada proses asinkron (chatbot, AI generator, pengiriman form) memiliki state loading, error, dan empty yang eksplisit dengan pesan yang jelas bagi pengguna. |

---

## 6. Kebutuhan Non-Fungsional (PIECES)

Ringkasan kebutuhan non-fungsional berikut merujuk penuh pada dokumen PIECES Classification terlampir; tabel di bawah menyarikan target terukur yang wajib dipenuhi.

| Kategori | Target Terukur |
|---|---|
| **Performance** | LCP ≤ 2,5 detik dan CLS ≤ 0,1 pada simulasi jaringan 4G lambat; modul 3D dan AI generator dimuat lazy. |
| **Information** | Knowledge base chatbot terstruktur dan dapat diperbarui; data prospek dan status pesanan tersimpan terstruktur dan dapat diaudit. |
| **Economy** | **Nol biaya berulang.** Seluruh komponen (hosting, basis data, CMS, API AI) wajib beroperasi selamanya di tier gratis; tidak ada belanja iklan berbayar — akuisisi bertumpu pada SEO organik dan pertumbuhan berbasis berbagi konten. |
| **Control & Security** | Kredensial API tidak pernah di sisi klien; rate limiting aktif pada seluruh endpoint AI; kepatuhan UU PDP; ketentuan penggunaan mengatur risiko IP. |
| **Efficiency** | Pembaruan konten tanpa deployment developer; estimator harga mandiri; pencatatan prospek otomatis; status pesanan tertelusuri mandiri oleh pelanggan. |
| **Service** | Sesi desain dapat diselesaikan tuntas di ponsel; seluruh state antarmuka (loading/error/empty) memiliki umpan balik jelas; akurasi AI generator meningkat terukur terhadap baseline. |

---

## 7. Batasan Teknis (Constraints)

1. **Anggaran 100% gratis** — kriteria kelulusan untuk setiap pilihan teknologi adalah "dapatkah berjalan selamanya di tier gratis pada skala UMKM kecil", bukan sekadar "murah". Ini berlaku pada hosting, basis data, layanan CMS, dan API AI generatif.
2. **Tetap di atas Firebase Hosting** — perubahan arsitektur (SSR/prerender) tidak boleh menuntut migrasi keluar dari Firebase kecuali opsi pengganti tetap gratis dan setara kemudahan operasionalnya.
3. **Tidak ada perombakan basis kode total** — perbaikan ditempuh secara bertahap per rute/fitur, bukan penulisan ulang menyeluruh.
4. **Bahasa Indonesia sepenuhnya** — seluruh antarmuka, termasuk panel admin, salinan pemasaran, dan pesan sistem.
5. **Kanal komunikasi utama WhatsApp** — bukan email atau formulir kontak tradisional sebagai jalur utama tindak lanjut.
6. **Kepatuhan hukum Indonesia** — kebijakan privasi dan ketentuan penggunaan wajib tunduk pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi dan peraturan terkait lainnya.
7. **Ketergantungan eksternal pada klien** — logika estimator harga (FR-B4) memerlukan formalisasi struktur tarif dari pemilik usaha; pemutakhiran knowledge base (FR-E2) memerlukan input berkelanjutan dari pemilik usaha.
8. **Aset motif kultural** — penggunaan motif Ende Diamond Zawo dan Flores Ocean Waves harus disertai persetujuan eksplisit dan atribusi yang tepat dari sumber/klien.

---

## 8. Metrik Keberhasilan (Success Metrics)

| Metrik | Baseline | Target MMP |
|---|---|---|
| Halaman terindeks Google Search Console | Tidak terukur/berisiko 0 | 100% rute publik terindeks |
| Rasio kunjungan → prospek tercatat | Tidak terukur (belum ada CRM) | Ditetapkan setelah 4–6 minggu pengumpulan baseline |
| LCP (mobile, 4G lambat) | Belum diukur | ≤ 2,5 detik |
| Sesi Studio selesai di mobile | Belum diverifikasi | ≥ 90% sesi tuntas tanpa kendala teknis |
| Pertanyaan chatbot terjawab relevan | Belum diukur | Ditetapkan setelah baseline; ditingkatkan dari nilai awal |
| Biaya operasional bulanan | Tidak terkendali (berisiko) | Rp 0 — seluruh layanan dalam tier gratis |
| Waktu admin memperbarui konten | Menunggu developer (tidak terukur) | Dapat dilakukan mandiri < 5 menit per perubahan |

---

## 9. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Tier gratis layanan AI/CMS/basis data memiliki kuota terbatas dan dapat berubah kebijakan penyedia sewaktu-waktu | Fitur AI atau CMS berhenti berfungsi tanpa peringatan | Pemantauan penggunaan kuota berkala; mekanisme penutupan otomatis (FR-E5) sebagai jaring pengaman; evaluasi penyedia alternatif gratis sebagai cadangan. |
| Migrasi arsitektur rendering (SSR/prerender) berpotensi memperkenalkan bug pada fitur yang sudah berjalan | Regresi fungsional pada fitur MVP yang sudah stabil | Migrasi bertahap per rute, disertai pengujian manual pada setiap rute yang dipindahkan sebelum lanjut ke rute berikutnya. |
| Ketergantungan pada input klien (struktur harga, materi knowledge base) dapat memperlambat linimasa | Fitur FR-B4 dan FR-E2 tertunda | Menyusun template/kuesioner terstruktur untuk mempercepat pengumpulan input dari klien di awal fase. |
| Keterbatasan inheren model AI generatif (FR-E3) tidak dapat sepenuhnya dihilangkan | Ekspektasi pengguna terhadap fitur AI generator tetap berisiko tidak terpenuhi sepenuhnya | Target ditetapkan sebagai peningkatan akurasi terukur terhadap baseline, bukan jaminan hasil sempurna; UI secara jujur mengomunikasikan sifat "draf awal" dari hasil AI. |
| Model 3D jersey nyata membutuhkan keahlian dan waktu di luar cakupan MMP | FR-D3 berisiko tidak tercapai penuh pada fase ini | Ditempatkan sebagai peningkatan bertahap (lihat Roadmap §11); MMP hanya mewajibkan transparansi label pada mode pratinjau saat ini. |

---

## 10. Urutan Implementasi yang Disarankan

Mengikuti urutan eksekusi pada dokumen System Improvement Objectives:

1. **Area A** (Keterjangkauan & Kinerja) — dikerjakan lebih dahulu karena perubahan arsitektur rendering berdampak pada seluruh area lain.
2. **Area B** (Konversi, CRM & Pengukuran) — penentu utama kelayakan komersial sekaligus penyedia data pengukuran bagi perbaikan berikutnya.
3. **Area C** (Kemandirian Konten) — dikerjakan paralel dengan Area B karena konten sinyal kepercayaan (FR-B5) membutuhkan CMS agar dapat dikelola berkelanjutan.
4. **Area D** (Kesiapan Komersial Studio) — ditempatkan setelah jalur konversi terbentuk, agar penyempurnaan fitur menghasilkan dampak bisnis nyata.
5. **Area E** (Keandalan AI & Tata Kelola) — bersifat lintas fase; komponen kepatuhan (FR-E7, FR-E8) wajib selesai bersamaan dengan Area B karena keduanya menyangkut pemrosesan data pribadi; komponen pengendalian biaya AI (FR-E4–FR-E6) wajib selesai sebelum atau bersamaan dengan Area A karena menyangkut risiko finansial yang aktif sejak fitur AI pertama kali diakses publik.

---

## 11. Roadmap Pasca-MMP (Di Luar Cakupan Dokumen Ini)

Kebutuhan berikut diidentifikasi selama audit namun sengaja tidak dimasukkan ke ruang lingkup MMP, untuk dipertimbangkan pada fase berikutnya setelah validasi pasar:

- Model 3D jersey fotorealistik sesungguhnya (bukan orbit-view dari aset 2D).
- Integrasi payment gateway untuk pembayaran DP/pelunasan online.
- Mekanisme berbagi desain ke media sosial dengan watermark sebagai kanal pertumbuhan organik (galeri komunitas/showcase pelanggan).
- Multi-bahasa (Inggris) untuk menjangkau pasar di luar Indonesia.
- Otomasi penuh alur kerja pasca-pesanan (notifikasi otomatis, invoicing digital).

---

## 12. Pertanyaan Terbuka untuk Klien

Butir berikut memerlukan konfirmasi atau input dari Riza Apparel sebelum implementasi dapat dimulai penuh pada area terkait:

1. Struktur harga aktual (per jenis bahan, tingkat kompleksitas desain, dan tingkatan kuantitas) untuk FR-B4.
2. Standar teknis mesin/proses sublimasi yang digunakan (resolusi, profil warna, ukuran pola) untuk FR-D4.
3. Materi tambahan untuk knowledge base chatbot — pertanyaan yang paling sering diajukan calon pelanggan — untuk FR-E1.
4. Aset portofolio (foto pesanan terdahulu, testimoni) yang dapat digunakan untuk FR-B5.
5. Persetujuan eksplisit dan sumber referensi motif Ende Diamond Zawo dan Flores Ocean Waves untuk atribusi kultural yang tepat (FR-C2).
6. Preferensi penyedia layanan AI generatif yang tier gratisnya sudah dikenal/dipakai klien, bila ada, untuk FR-E3–FR-E5.

---

*Dokumen ini adalah draf awal PRD dan bersifat hidup — akan diperbarui seiring konfirmasi dari klien atas pertanyaan terbuka pada §12 dan seiring temuan baru selama implementasi. Disusun berdasarkan Cause and Effect Analysis, System Improvement Objectives, dan PIECES Classification pada dokumen proyek sebelumnya, dan dapat digunakan sebagai konteks acuan bagi AI coding agent dalam merumuskan rencana sprint, backlog teknis, atau spesifikasi implementasi lanjutan.*
