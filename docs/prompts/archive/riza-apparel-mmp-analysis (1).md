# Riza Apparel — Analisis Sistem Fase MVP → MMP

> **Proyek:** Landing Page Riza Apparel (UMKM custom jersey & sportswear, Ende — NTT)
> **URL MVP:** https://rizaapparel-2026.web.app/
> **Dokumen ini mencakup:** (1) Cause and Effect Analysis, (2) System Improvement Objectives, (3) PIECES Classification of System Requirements
> **Status:** Draft awal untuk fase MMP (Minimum Marketable Product)

---

## 1. Ringkasan Konteks

Riza Apparel adalah UMKM produsen custom jersey dan sportswear berbasis di Ende, Nusa Tenggara Timur, dengan diferensiasi motif autentik **Ende Diamond Zawo** dan **Flores Ocean Waves**. MVP landing page telah live dan mencakup: halaman utama, AI chatbot, halaman **Studio** untuk kustomisasi desain jersey (2D dan orbit-view pseudo-3D), serta AI agent yang menghasilkan desain dari gambar referensi dan prompt teks.

Catatan teknis: permintaan HTTP langsung ke root URL hanya mengembalikan metadata (title, meta description, OG tags) tanpa konten body — indikasi kuat situs adalah Single Page Application (SPA) tanpa SSR/prerender. Temuan ini mendasari objektif OBJ-1 di bagian 3.

Dokumen ini disusun sebagai langkah awal untuk merumuskan pengembangan fase MMP secara terarah, terukur, dan tepat guna.

---

## 2. Cause and Effect Analysis

### A. Manajemen Konten dan Data

| Problem or Opportunity | Causes and Effect |
|---|---|
| **P-01** — Landing page belum memiliki Content Management System sehingga seluruh aset dan konten tertanam secara hardcode di dalam kode sumber. | **Penyebab:** Fase MVP diprioritaskan pada kecepatan validasi fitur, sehingga konten disisipkan langsung ke komponen tanpa lapisan abstraksi data; belum ada pemisahan antara logika presentasi dan sumber konten. **Akibat:** Setiap pembaruan promo, katalog, atau harga menuntut intervensi developer dan deployment ulang; klien kehilangan kemandirian operasional; biaya pemeliharaan jangka panjang meningkat; respons bisnis terhadap momentum pasar menjadi lambat. |
| **P-02** — Belum tersedia Customer Relationship Management untuk mencatat, memantau, dan mengelola data pengunjung serta interaksi dengan pelanggan maupun calon pelanggan. | **Penyebab:** Ruang lingkup MVP terbatas pada penyajian informasi satu arah, belum mencakup perancangan basis data pelanggan, formulir penangkapan prospek, maupun integrasi kanal komunikasi. **Akibat:** Seluruh prospek yang masuk tidak terdokumentasi dan hilang setelah sesi berakhir; tidak ada follow-up terstruktur maupun segmentasi pelanggan; tingkat konversi tidak dapat diukur; landing page gagal berfungsi sebagai instrumen akuisisi, hanya sebagai brosur digital. |
| **P-24** — Situs belum dilengkapi instrumentasi analitik untuk mengukur perilaku pengunjung dan kinerja funnel konversi. | **Penyebab:** Pemasangan tracking belum masuk dalam definisi selesai MVP karena fokus pengembangan tertuju pada fungsionalitas fitur, bukan pengukuran dampaknya. **Akibat:** Keputusan perbaikan pada fase MMP terpaksa bersandar pada asumsi; tidak ada baseline pembanding; anggaran dan waktu pengembangan berisiko dialokasikan ke masalah yang bukan hambatan sesungguhnya. |

### B. Keterjangkauan dan Penemuan (Discoverability)

| Problem or Opportunity | Causes and Effect |
|---|---|
| **P-09** — Situs dirender sepenuhnya di sisi klien tanpa SSR maupun prerender sehingga permintaan crawler hanya menerima metadata tanpa konten bodi. | **Penyebab:** Arsitektur dibangun sebagai Single Page Application murni di atas Firebase Hosting tanpa lapisan rendering server atau prerender saat build. **Akibat:** Konten berisiko tidak terindeks mesin pencari; trafik organik nyaris nihil; pratinjau tautan di WhatsApp/medsos miskin konteks; defek fundamental — bukan sekadar optimasi lanjutan — bagi produk yang tujuannya akuisisi pelanggan. |
| **P-10** — Belum ada strategi Local SEO untuk menangkap permintaan pasar di Ende dan wilayah NTT. | **Penyebab:** Belum ada riset kata kunci lokal, belum terdaftar/tertaut Google Business Profile, belum diterapkan structured data Schema.org dan sitemap. **Akibat:** Pencarian bernilai konversi tertinggi seperti "konveksi jersey Ende" tidak menjangkau situs; calon pelanggan lokal berpaling ke pesaing; keunggulan geografis tidak termonetisasi. |
| **P-11** — Metadata halaman bersifat global dan seragam, belum dibedakan per rute. | **Penyebab:** Tidak ada mekanisme pengelolaan metadata dinamis per halaman pada arsitektur SPA saat ini. **Akibat:** Seluruh halaman bersaing dengan sinyal relevansi identik di mesin pencari; halaman bernilai tinggi seperti Studio kehilangan peluang tampil pada kueri spesifik; kartu tautan saat dibagikan tidak dapat disesuaikan konteks. |

### C. Konversi dan Funnel Penjualan

| Problem or Opportunity | Causes and Effect |
|---|---|
| **P-12** — Belum ada jalur konversi eksplisit bagi pengguna setelah menyelesaikan desain di Studio. | **Penyebab:** Perancangan fitur berorientasi kapabilitas teknis, bukan alur bisnis, sehingga titik akhir perjalanan pengguna tidak didefinisikan. **Akibat:** Nilai interaksi paling intensif menguap pada titik intensi tertinggi; pengguna meninggalkan situs tanpa jejak; seluruh fitur unggulan di hulu kehilangan justifikasi komersial karena ujung funnel buntu. |
| **P-13** — Belum ada mekanisme lead capture pada momen pengguna menyimpan/mengunduh/membagikan desain. | **Penyebab:** Belum ada pemetaan titik intensi tinggi; ketiadaan CRM (P-02) membuat data prospek tidak memiliki tempat penyimpanan. **Akibat:** Pengunjung dengan intensi beli terkuat tetap anonim; biaya akuisisi terbuang; tim penjualan tidak punya antrean prospek untuk ditindaklanjuti. |
| **P-14** — Belum ada estimator harga atau transparansi biaya. | **Penyebab:** Struktur harga variabel terhadap jumlah, bahan, dan kompleksitas desain, belum diformalkan menjadi logika kalkulasi otomatis. **Akibat:** Ketidakjelasan harga menjadi hambatan konversi utama; prospek menunda/batal kontak; volume pertanyaan berulang membebani admin; banyak percakapan berakhir tanpa pesanan. |
| **P-15** — Situs belum menampilkan sinyal kepercayaan: portofolio, testimoni, spesifikasi bahan, size chart, lead time, skema pembayaran. | **Penyebab:** Konten pendukung membutuhkan pengumpulan aset dari klien yang belum terlaksana; ketiadaan CMS (P-01) membuat penambahannya mahal secara teknis. **Akibat:** Calon pelanggan menghadapi risiko dipersepsikan tinggi untuk produsen belum dikenal; keraguan memicu perbandingan dengan pesaing mapan; negosiasi memanjang. |
| **P-26** — Peluang menjadikan desain buatan pengguna sebagai materi promosi yang dapat dibagikan. | **Penyebab:** Fitur berbagi, watermark, galeri komunitas belum dirancang karena fokus MVP berhenti di pembuatan desain, bukan distribusinya. **Akibat (peluang belum diraih):** Setiap desain berpotensi jadi iklan gratis di jaringan sosial pengguna; tanpa ini, pertumbuhan bergantung penuh pada iklan berbayar yang tidak selaras anggaran UMKM. |

### D. Fitur Inti — Design Studio dan AI

| Problem or Opportunity | Causes and Effect |
|---|---|
| **P-04** — Halaman Studio sudah punya kerangka fungsional namun masih banyak defek tampilan. | **Penyebab:** Pengembangan diarahkan ke fungsionalitas dasar dalam tenggat MVP; kompleksitas tata letak kanvas dengan banyak state interaktif memperbesar peluang defek; belum ada siklus pengujian lintas peramban/resolusi. **Akibat:** Fitur diferensiasi utama justru menurunkan persepsi profesionalisme; pengguna kehilangan kepercayaan pada pratinjau; tingkat penyelesaian sesi desain menurun. |
| **P-05** — Aset jersey kosong belum layak jual; mode "3D" sesungguhnya orbit-view dari aset 2D. | **Penyebab:** Pembuatan model 3D sesungguhnya menuntut keahlian dan waktu produksi jauh lebih besar, sehingga MVP menempuh simulasi berbiaya rendah. **Akibat:** Pratinjau tidak merepresentasikan bentuk/jatuhnya bahan/jahitan secara akurat; kesenjangan ekspektasi digital vs fisik berisiko memicu komplain; kredibilitas fitur 3D sebagai nilai jual melemah. |
| **P-06** — AI agent generate desain dari referensi + prompt belum akurat. | **Penyebab:** Keterbatasan inheren model generatif menjaga konsistensi struktur pakaian; belum ada rekayasa prompt terstruktur, pengondisian citra referensi yang tepat, atau batasan domain khusus jersey. **Akibat:** Keluaran tak diandalkan sebagai dasar produksi; kekecewaan pada titik interaksi yang dipromosikan sebagai daya tarik utama; biaya API terbuang; fitur berisiko dipersepsikan gimmick. |
| **P-07** — Koleksi font terbatas, belum terintegrasi Google Fonts/font lokal perangkat. | **Penyebab:** Font dimuat statis dalam jumlah terbatas untuk menjaga ukuran bundel pada fase MVP. **Akibat:** Ruang ekspresi desain menyempit khususnya pada nama/nomor punggung; pengguna dengan preferensi tipografi spesifik beralih ke perancang eksternal. |
| **P-16** — Keluaran Studio belum terhubung ke kebutuhan berkas siap cetak untuk produksi sublimasi. | **Penyebab:** Studio dirancang sebagai alat pratinjau pemasaran; keluaran berupa mockup layar RGB resolusi rendah, tanpa pertimbangan resolusi cetak, ukuran pola aktual, bleed, kelonggaran jahitan. **Akibat:** Desain yang disetujui tetap harus digambar ulang manual tim produksi; berpotensi selisih antara desain disetujui dan dicetak; Studio tetap demonstrasi teknologi, bukan alat produksi. |
| **P-19** — Kelayakan Studio di perangkat mobile belum terverifikasi padahal mayoritas akses via ponsel. | **Penyebab:** Perkakas kanvas dengan drag/resize/rotate inheren sulit dipindahkan ke layar sentuh kecil; pengembangan/pengujian dominan di desktop. **Akibat:** Bila tidak dapat digunakan tuntas di ponsel, mayoritas trafik tidak dapat konversi sama sekali — defek kritis, bukan penyempurnaan. |

### E. Pengalaman Pengguna dan Kinerja

| Problem or Opportunity | Causes and Effect |
|---|---|
| **P-03** — Knowledge base AI chatbot sangat terbatas, jawaban seragam dan repetitif. | **Penyebab:** Materi bersumber dari satu sesi wawancara awal; belum ada struktur dokumen terkurasi, mekanisme retrieval tepat, atau siklus pembaruan berdasarkan pertanyaan riil. **Akibat:** Chatbot gagal sebagai kanal informasi pra-pembelian; kredibilitas fitur AI tergerus; beban pertanyaan tetap jatuh ke admin manusia. |
| **P-08** — Animasi transisi antarsection/antarhalaman masih dasar dan minim variasi. | **Penyebab:** Belum ada sistem motion terdefinisi (durasi, easing, hierarki gerak) karena prioritas MVP pada fungsionalitas. **Akibat:** Persepsi kualitas di bawah posisi merek sebagai penyedia jasa kreatif; situs terasa generik; dampak terhadap konversi relatif tidak langsung dibanding hambatan struktural lain. |
| **P-18** — Risiko kinerja dari kombinasi renderer 3D, aset gambar, dan pemanggilan AI pada konteks jaringan NTT. | **Penyebab:** Belum ada performance budget; aset kemungkinan belum dioptimasi format modern; modul berat belum dipisah via code splitting/lazy loading. **Akibat:** Waktu muat lama meningkatkan bounce rate; konsumsi kuota membebani pengguna di wilayah berbiaya internet relatif tinggi; Core Web Vitals buruk memperparah P-09. |
| **P-20** — Aksesibilitas dan state loading/error/empty/offline belum ditangani memadai. | **Penyebab:** Pengujian aksesibilitas dan pemetaan seluruh kondisi antarmuka umumnya dilewati pada MVP yang mengejar happy path. **Akibat:** Sebagian pengguna terhambat akses; pada fitur AI berlatensi tinggi, ketiadaan umpan balik jelas membuat pengguna mengira sistem rusak dan meninggalkan halaman. |
| **P-25** — Peluang memaksimalkan diferensiasi motif Ende Diamond Zawo dan Flores Ocean Waves, saat ini baru klaim di metadata. | **Penyebab:** Aset motif belum diolah jadi komponen produk/pilar konten karena keterbatasan waktu dan ketiadaan CMS untuk mengelolanya. **Akibat (peluang belum diraih):** Keunggulan sulit ditiru pesaing Jawa tidak termanfaatkan sebagai preset di Studio maupun narasi pemasaran; produk berisiko dipersepsikan setara konveksi generik. |

### F. Tata Kelola, Risiko, dan Kepatuhan

| Problem or Opportunity | Causes and Effect |
|---|---|
| **P-17** — Belum ada alur kerja pasca-pesanan untuk konfirmasi desain, pelacakan status produksi, dan penagihan. | **Penyebab:** Ruang lingkup MVP berhenti sebelum pesanan terbentuk, proses operasional pascatransaksi belum dipetakan ke sistem. **Akibat:** Koordinasi berlangsung manual dan mudah tercecer; pelanggan berulang menanyakan status; risiko kesalahan produksi akibat konfirmasi desain tak terdokumentasi. |
| **P-21** — Fitur AI generatif belum punya pengendalian biaya/penyalahgunaan (rate limiting, kuota, keamanan kredensial). | **Penyebab:** Pengendalian kuota/autentikasi belum diimplementasikan karena volume MVP masih terbatas. **Akibat:** Peluang penyalahgunaan yang membebani klien secara finansial; bila kredensial API terekspos di sisi klien, risiko meningkat ke skala besar. |
| **P-22** — Rencana CRM belum disertai kepatuhan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. | **Penyebab:** Aspek legal umumnya belum jadi pertimbangan pada tahap pembuktian konsep; kebijakan privasi dan mekanisme persetujuan belum disusun. **Akibat:** Risiko sanksi administratif; ketiadaan kebijakan privasi menurunkan kepercayaan pengguna menyerahkan kontak; penambahan kepatuhan belakangan lebih mahal daripada dirancang sejak awal. |
| **P-23** — Belum ada ketentuan penggunaan yang mengatur risiko IP atas unggahan pengguna dan desain hasil AI. | **Penyebab:** Dokumen Terms of Service dan kebijakan konten belum disusun sebagai bagian MVP. **Akibat:** Pengguna dapat unggah logo/merek berlisensi; AI dapat hasilkan desain menyerupai merek terdaftar; kepemilikan desain kolaboratif tidak jelas; Riza Apparel terpapar risiko sengketa hukum. |

### Rantai Ketergantungan Antarmasalah

1. **P-09 → P-10 → P-18** — Arsitektur tanpa SSR menyebabkan konten tidak terindeks sekaligus memperburuk Core Web Vitals yang menurunkan peringkat pencarian. Perbaikan rendering menyelesaikan tiga masalah sekaligus.
2. **P-02 → P-13 → P-22** — CRM, lead capture, dan kepatuhan PDP membentuk satu kesatuan fungsional; dirancang terpisah akan menghasilkan pengerjaan ulang.
3. **P-12 → P-04, P-05, P-06, P-07** — Perbaikan kualitas Studio hanya berdampak bisnis bila jalur konversi di ujungnya sudah terbentuk.

---

## 3. System Improvement Objectives

Dua puluh enam poin problem/opportunity dikonsolidasikan menjadi lima objektif sistem berdasarkan kedekatan akar penyebab dan ketergantungan teknis, agar setiap objektif dapat dieksekusi sebagai satu paket kerja yang utuh.

> Angka target pada kolom *System Objective* bersifat usulan awal dan perlu dikalibrasi ulang setelah baseline pengukuran tersedia serta dikonfirmasi bersama klien.

### OBJ-1 — Keterjangkauan dan Kinerja (P-09, P-10, P-11, P-18)

| Kolom | Isi |
|---|---|
| **Problem or Opportunity** | Situs tidak dapat ditemukan oleh pasar sasaran. Landing page dirender sepenuhnya di sisi klien tanpa SSR/prerender, metadata bersifat global, belum menerapkan Local SEO, dan berisiko berat pada konteks jaringan Nusa Tenggara Timur. |
| **Causes and Effects** | **Penyebab:** Arsitektur dibangun sebagai SPA murni di atas Firebase Hosting tanpa lapisan rendering server; belum ada riset kata kunci lokal, structured data, maupun performance budget. **Akibat:** Konten berisiko tidak terindeks sehingga trafik organik nyaris nihil; kueri bernilai konversi tertinggi jatuh ke pesaing; pratinjau tautan di WhatsApp miskin konteks; waktu muat lama meningkatkan bounce rate sekaligus memperburuk peringkat pencarian. |
| **System Objective** | Mengubah arsitektur penyajian halaman agar seluruh konten utama dapat dirender dan diindeks tanpa eksekusi JavaScript, serta menjadikan situs sebagai hasil pencarian utama untuk jersey kustom di wilayah Ende dan sekitarnya. **Indikator:** seluruh rute publik terindeks di Google Search Console; metadata dan OG image unik per rute; structured data `LocalBusiness`, `Product`, `FAQPage` tervalidasi; LCP ≤ 2,5 detik dan CLS ≤ 0,1 pada simulasi jaringan 4G lambat; tertaut Google Business Profile aktif. |
| **System Constraint** | • Harus tetap berjalan di atas Firebase Hosting, migrasi hanya diperbolehkan ke opsi setara biaya.<br>• Tidak boleh mengganti basis kode total; ditempuh via prerendering atau adopsi SSR bertahap per rute.<br>• Tidak ada anggaran iklan berbayar — akuisisi bertumpu sepenuhnya pada kanal organik.<br>• Total payload halaman utama dibatasi demi hemat kuota pengguna NTT.<br>• Konten dan kata kunci wajib berbahasa Indonesia dengan istilah lokal. |

### OBJ-2 — Konversi, CRM, dan Pengukuran (P-12, P-13, P-02, P-14, P-15, P-24)

| Kolom | Isi |
|---|---|
| **Problem or Opportunity** | Interaksi pengunjung tidak berubah menjadi prospek yang terkelola. Belum ada jalur konversi eksplisit, lead capture, CRM, transparansi harga, sinyal kepercayaan, maupun instrumentasi analitik. |
| **Causes and Effects** | **Penyebab:** Perancangan fitur berorientasi kapabilitas teknis alih-alih alur bisnis; struktur harga belum diformalkan; pengukuran belum masuk definisi selesai MVP. **Akibat:** Nilai interaksi paling intensif menguap pada titik intensi tertinggi; prospek tetap anonim; ketidakjelasan harga jadi hambatan konversi utama sekaligus membebani admin; tanpa baseline, keberhasilan MMP tidak dapat dibuktikan. |
| **System Objective** | Membangun jalur konversi ujung-ke-ujung yang terukur, dari kunjungan hingga prospek tercatat, dengan setiap tahapan terinstrumentasi. **Indikator:** aksi lanjutan jelas pada setiap penyelesaian desain; data prospek tersimpan otomatis ke basis data terpusat beserta lampiran desain; estimator harga dapat diakses mandiri; halaman menampilkan portofolio/testimoni/size chart/lead time/skema pembayaran; GA4 merekam event pada seluruh titik funnel; rasio konversi terukur dan terpantau mingguan. |
| **System Constraint** | • Kanal komunikasi utama wajib WhatsApp mengikuti kebiasaan pasar dan proses bisnis klien saat ini.<br>• Pengumpulan data pribadi wajib tunduk UU No. 27 Tahun 2022 PDP — persetujuan eksplisit dan kebijakan privasi jadi prasyarat.<br>• Formulir prospek diminimalkan agar tidak menaikkan friksi pada titik intensi tertinggi.<br>• **Anggaran 100% gratis — CRM/basis data wajib beroperasi selamanya di dalam tier gratis penyedia layanan; tidak ada langganan berbayar dalam bentuk apa pun.**<br>• Logika estimasi harga bergantung pada formalisasi tarif dari klien (ketergantungan eksternal). |

### OBJ-3 — Kemandirian Konten dan Diferensiasi Kultural (P-01, P-25)

| Kolom | Isi |
|---|---|
| **Problem or Opportunity** | Pengelolaan konten sepenuhnya bergantung pada developer. Seluruh aset dan konten tertanam hardcode, termasuk motif autentik Ende Diamond Zawo dan Flores Ocean Waves yang belum diolah menjadi aset produk maupun pilar konten. |
| **Causes and Effects** | **Penyebab:** Fase MVP memprioritaskan kecepatan validasi fitur sehingga konten disisipkan langsung ke komponen tanpa pemisahan presentasi dan data. **Akibat:** Setiap pembaruan promo/katalog/harga menuntut deployment ulang; klien kehilangan kemandirian operasional; keunggulan kultural yang sulit ditiru pesaing Jawa tidak termanfaatkan, menyeret produk ke persaingan harga alih-alih nilai. |
| **System Objective** | Memindahkan seluruh konten dinamis dari basis kode ke sistem pengelolaan konten dengan antarmuka admin, sehingga klien dapat memperbarui katalog, promo, portofolio, dan pustaka motif secara mandiri. **Indikator:** nihil konten bisnis tersisa hardcode; perubahan konten tayang tanpa deployment ulang; pustaka motif tersedia sebagai preset yang dapat dipilih langsung di Studio dan dikelola dari panel admin. |
| **System Constraint** | • Panel admin wajib berbahasa Indonesia dan dapat dioperasikan tanpa latar belakang teknis, termasuk via mobile.<br>• **Anggaran 100% gratis — solusi CMS wajib tier gratis, bukan sekadar "berbiaya rendah"; tidak ada biaya langganan berulang dalam bentuk apa pun.**<br>• Penambahan CMS tidak boleh mengorbankan kemampuan indeksasi dari OBJ-1.<br>• Motif tradisional wajib digunakan secara etis dengan atribusi kultural tepat dan persetujuan klien.<br>• Unggahan aset gambar wajib melalui kompresi otomatis untuk menjaga performance budget. |

### OBJ-4 — Kesiapan Komersial Design Studio (P-04, P-05, P-16, P-19, P-07, P-08)

| Kolom | Isi |
|---|---|
| **Problem or Opportunity** | Design Studio belum layak dipasarkan maupun dipakai untuk produksi: masih ada defek tampilan, aset 2D/3D belum berkualitas (mode "3D" hanya orbit dari aset 2D), keluaran belum siap cetak, kelayakan mobile belum terverifikasi, font terbatas, dan transisi antarmuka masih elementer. |
| **Causes and Effects** | **Penyebab:** Pengembangan diarahkan ke fungsionalitas dasar dalam tenggat MVP; pemodelan 3D sesungguhnya menuntut keahlian dan waktu jauh lebih besar; Studio dirancang sebagai alat pratinjau pemasaran sehingga keluarannya mockup layar RGB resolusi rendah; pengujian dominan di desktop. **Akibat:** Fitur diferensiasi utama menurunkan persepsi profesionalisme; kesenjangan ekspektasi digital vs fisik berisiko memicu komplain; desain disetujui tetap digambar ulang manual; bila tak dapat dipakai tuntas di ponsel, mayoritas trafik tak dapat konversi. |
| **System Objective** | Menaikkan Design Studio dari status demonstrasi teknologi menjadi perkakas komersial yang menghasilkan keluaran bernilai produksi dan dapat digunakan tuntas di perangkat mobile. **Indikator:** nihil defek visual blocker/major pada peramban utama; sesi desain dapat diselesaikan penuh di layar ponsel; pratinjau merepresentasikan bentuk dan jahitan secara akurat; Studio mengekspor berkas siap cetak resolusi memadai pada ukuran pola aktual beserta bleed; pustaka font terintegrasi Google Fonts; sistem motion terdefinisi dan diterapkan konsisten. |
| **System Constraint** | • Keahlian pemodelan 3D dan biaya produksi aset menjadi kendala nyata — peningkatan ditempuh bertahap, prioritas akurasi representasi sebelum realisme visual.<br>• Spesifikasi berkas siap cetak wajib mengikuti standar mesin/proses sublimasi yang benar-benar dipakai klien.<br>• Perkakas kanvas wajib mendukung interaksi sentuh sepenuhnya, bukan sekadar layout responsif.<br>• Modul 3D dan pustaka font wajib dimuat lazy agar tak melanggar performance budget OBJ-1.<br>• Font yang disediakan wajib berlisensi bebas untuk penggunaan komersial. |

### OBJ-5 — Keandalan Layanan AI dan Tata Kelola (P-03, P-06, P-21, P-22, P-23, P-17, P-20)

| Kolom | Isi |
|---|---|
| **Problem or Opportunity** | Layanan cerdas dan tata kelola sistem belum memadai: knowledge base chatbot sangat terbatas, AI design generator belum akurat, belum ada pengendalian biaya/penyalahgunaan, belum ada ketentuan penggunaan dan perlindungan data, alur kerja pasca-pesanan belum ada, serta penanganan state antarmuka belum lengkap. |
| **Causes and Effects** | **Penyebab:** Materi knowledge base bersumber dari satu sesi wawancara awal tanpa siklus pembaruan; keterbatasan inheren model generatif diperparah ketiadaan rekayasa prompt terstruktur; pengendalian kuota, dokumen legal, dan proses pascatransaksi belum masuk ruang lingkup MVP. **Akibat:** Chatbot gagal sebagai kanal informasi pra-pembelian; keluaran AI tak akurat membuang biaya API dan mengecewakan pengguna; terbuka risiko penyalahgunaan yang membebani klien; paparan risiko hukum atas pelanggaran merek dan pemrosesan data tanpa dasar sah. |
| **System Objective** | Menjadikan layanan berbasis AI dapat diandalkan, terkendali biayanya, dan beroperasi dalam kerangka tata kelola yang sah. **Indikator:** knowledge base tersusun terstruktur dengan retrieval tepat dan siklus pembaruan berkala; tingkat jawaban relevan chatbot terukur dan meningkat terhadap baseline; akurasi AI generator meningkat melalui prompt terstruktur dan pengondisian citra referensi; berlaku rate limiting dan kuota per sesi dengan pagu biaya bulanan terpantau; nihil kredensial API terekspos di sisi klien; tersedia kebijakan privasi dan ketentuan penggunaan; setiap pesanan memiliki status tertelusuri; seluruh state loading/error/empty/offline tertangani dengan umpan balik jelas. |
| **System Constraint** | • **Anggaran 100% gratis — seluruh pemanggilan model AI wajib beroperasi di dalam batas tier gratis penyedia layanan; sistem wajib menutup akses otomatis begitu kuota gratis habis, tidak diperkenankan beralih ke penagihan berbayar.**<br>• Seluruh pemanggilan model wajib melalui backend; tidak diperkenankan kredensial di sisi klien.<br>• Keterbatasan inheren model generatif tak dapat dihilangkan sepenuhnya — target diarahkan pada peningkatan akurasi terukur, bukan kesempurnaan.<br>• Pemutakhiran knowledge base bergantung pada ketersediaan informasi dari pemilik usaha (ketergantungan eksternal).<br>• Ketentuan penggunaan wajib memuat hak atas unggahan pengguna, kepemilikan desain hasil sistem, dan hak menolak pesanan yang melanggar merek.<br>• Seluruh dokumen legal tunduk pada peraturan perundang-undangan Republik Indonesia. |

---

## 4. PIECES Classification of System Requirements

Klasifikasi berikut memetakan seluruh temuan dari Cause and Effect Analysis dan System Improvement Objectives ke enam kategori PIECES (Performance, Information, Economy, Control and Security, Efficiency, Service).

> **Batasan anggaran:** seluruh pengembangan tunduk pada batasan **100% gratis** — tidak ada alokasi biaya berulang dalam bentuk apa pun (hosting, basis data, CMS, maupun pemanggilan API AI). Ini secara khusus membentuk kategori Economy di bawah dan menjadi acuan lintas kategori lainnya.

| Nonfunctional Requirement Type | Explanation |
|---|---|
| **Performance** | Sistem saat ini berisiko tinggi pada kinerja pemuatan halaman akibat kombinasi renderer 3D, aset gambar tak teroptimasi, dan pemanggilan AI dalam satu arsitektur SPA tanpa SSR/prerender maupun performance budget *(P-09, P-18)*. Konsekuensinya, waktu muat berpotensi melampaui ambang batas yang wajar terutama pada jaringan 3G/4G di wilayah Nusa Tenggara Timur, meningkatkan bounce rate sebelum konten sempat tampil. Sistem yang diharapkan harus mencapai Largest Contentful Paint ≤ 2,5 detik dan Cumulative Layout Shift ≤ 0,1 pada simulasi jaringan lambat *(OBJ-1)*, didukung lazy-loading pada modul 3D dan AI generator agar throughput halaman utama tidak terbebani oleh fitur yang belum tentu diakses setiap pengunjung *(OBJ-4)*. Kapasitas sistem juga perlu memperhitungkan skenario permintaan bersamaan ke AI agent tanpa menyebabkan degradasi waktu respons chatbot maupun Studio. |
| **Information** | Terdapat dua defisiensi informasi yang saling terkait. Pertama, basis pengetahuan chatbot masih sangat kecil dan tidak terstruktur, menghasilkan jawaban yang seragam dan tidak relevan terhadap variasi pertanyaan pengguna *(P-03)*. Kedua, sistem belum menghasilkan maupun menyimpan informasi operasional yang seharusnya tercipta dari interaksi pengguna — data pengunjung, riwayat prospek, dan status pesanan tidak terekam sama sekali karena ketiadaan CRM *(P-02, P-17)*. Akibatnya, keputusan bisnis maupun pengembangan produk pada fase MMP tidak memiliki data historis untuk dipijak, dan instrumentasi analitik pun belum terpasang sehingga tidak ada baseline pengukuran *(P-24)*. Kebutuhan sistem ke depan mencakup basis pengetahuan yang terkurasi dan dapat diperbarui berkala *(OBJ-5)*, serta penyimpanan data prospek dan pesanan yang terstruktur dan dapat diaudit *(OBJ-2)*. |
| **Economy** | Seluruh pengembangan sistem tunduk pada batasan anggaran nol rupiah — tidak ada alokasi biaya berulang (recurring cost) dalam bentuk apa pun, baik untuk hosting, basis data, CMS, maupun pemanggilan API AI. Ini mengubah sifat masalah pada P-21 dari sekadar "pengendalian biaya" menjadi **penghindaran biaya sepenuhnya**: fitur AI generatif dan chatbot wajib beroperasi di dalam batas tier gratis penyedia layanan (mis. kuota permintaan gratis per bulan), dengan mekanisme yang secara otomatis menutup akses begitu kuota gratis tersebut habis, alih-alih membiarkan sistem beralih ke penagihan berbayar. Ketiadaan CMS yang menyebabkan biaya waktu developer untuk setiap pembaruan konten *(P-01)* juga harus diselesaikan melalui platform CMS bertingkat gratis (free tier), bukan layanan berlangganan. Demikian pula seluruh peluang pertumbuhan — SEO organik, Local SEO, dan mekanisme berbagi desain pengguna — menjadi jalur akuisisi **satu-satunya** yang diizinkan, karena belanja iklan berbayar sama sekali berada di luar batasan *(P-10, P-26, OBJ-1)*. Implikasinya, setiap pilihan teknologi pada OBJ-1 sampai OBJ-5 harus lolos uji "dapatkah berjalan selamanya di tier gratis pada skala UMKM kecil", bukan sekadar "murah". |
| **Control and Security** | Ditemukan sejumlah celah kendali dan keamanan yang berdampak langsung pada risiko finansial dan hukum. Belum ada rate limiting maupun autentikasi ringan pada fitur AI generatif, membuka peluang penyalahgunaan yang membebani klien secara finansial, dan belum ada kepastian bahwa kredensial API tidak terekspos di sisi klien *(P-21)*. Dari sisi kepatuhan, rencana pengumpulan data pengunjung melalui CRM belum disertai kebijakan privasi maupun mekanisme persetujuan yang selaras dengan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi *(P-22)*. Selain itu, belum ada ketentuan penggunaan yang mengatur hak atas materi unggahan pengguna maupun potensi pelanggaran kekayaan intelektual pada desain yang dihasilkan AI *(P-23)*. Sistem yang diharapkan mewajibkan seluruh pemanggilan model AI melalui backend tanpa kredensial di sisi klien, kuota per sesi yang selaras dengan batasan tier gratis (lihat Economy), serta dokumen legal (kebijakan privasi dan ketentuan penggunaan) yang tunduk pada peraturan Republik Indonesia *(OBJ-5)*. |
| **Efficiency** | Proses operasional saat ini masih sangat bergantung pada intervensi manual yang seharusnya dapat diotomasi. Setiap pembaruan konten menuntut siklus deployment developer alih-alih pembaruan mandiri melalui panel admin *(P-01, OBJ-3)*. Volume pertanyaan seputar harga yang berulang membebani admin karena tidak ada estimator harga otomatis *(P-14)*. Koordinasi status pesanan pascatransaksi berlangsung sepenuhnya manual melalui percakapan yang mudah tercecer, tanpa sistem pelacakan status yang dapat diakses pelanggan secara mandiri *(P-17)*. Prospek yang masuk juga tidak tertangkap secara otomatis ke dalam basis data yang dapat ditindaklanjuti tim penjualan *(P-13)*. Sistem yang diharapkan meminimalkan pekerjaan berulang yang bersifat manual ini melalui estimator harga mandiri, alur status pesanan yang transparan, dan pencatatan prospek otomatis *(OBJ-2)*. |
| **Service** | Kualitas layanan kepada pengguna akhir terhambat pada beberapa titik kritis. Halaman Design Studio — fitur layanan inti produk — masih mengandung defek tampilan dan belum sepenuhnya dapat digunakan pada perangkat mobile, padahal ini adalah kanal akses mayoritas pengguna *(P-04, P-19)*. Fitur AI design generator belum menghasilkan keluaran yang akurat sesuai instruksi pengguna, mengecewakan pengguna pada titik interaksi yang dipromosikan sebagai nilai jual utama *(P-06)*. Penanganan kondisi loading, error, empty, dan offline pada antarmuka belum memadai, sehingga pengguna berisiko mengira sistem gagal berfungsi dan meninggalkan halaman di tengah proses, khususnya pada fitur AI yang berlatensi tinggi *(P-20)*. Sistem yang diharapkan menjamin sesi desain dapat diselesaikan tuntas di perangkat mobile, menyediakan umpan balik yang jelas pada setiap state antarmuka, dan meningkatkan akurasi keluaran AI secara terukur terhadap baseline — seluruhnya dicapai dalam batas tier gratis *(OBJ-4, OBJ-5)*. |

---

## 5. Urutan Eksekusi yang Disarankan

1. **OBJ-1** lebih dahulu — perubahan arsitektur rendering berdampak pada seluruh objektif lain dan jauh lebih mahal bila ditunda.
2. **OBJ-2** menyusul — penentu utama kelayakan komersial sekaligus penyedia data pengukuran bagi perbaikan berikutnya.
3. **OBJ-3** paralel dengan OBJ-2 — konten pendukung sinyal kepercayaan membutuhkan CMS agar dapat dikelola berkelanjutan.
4. **OBJ-4** setelah jalur konversi terbentuk — agar penyempurnaan fitur menghasilkan dampak bisnis nyata.
5. **OBJ-5** bersifat lintas fase — komponen tata kelola dan kepatuhan wajib selesai bersamaan dengan OBJ-2 karena keduanya menyangkut pemrosesan data pribadi.

---

*Dokumen ini disusun sebagai artefak analisis sistem untuk fase MMP Riza Apparel — mencakup Cause and Effect Analysis, System Improvement Objectives, dan PIECES Classification — dan dapat digunakan sebagai konteks acuan bagi AI coding agent dalam merumuskan rencana implementasi, backlog, atau spesifikasi teknis lanjutan. Batasan anggaran 100% gratis berlaku pada seluruh keputusan teknis di dokumen ini.*
