# PROMPT KOREKTIF #2 — Akurasi dan Kerapian Mockup 3D Jersey (Riza Apparel)

> Mockup 3D jersey adalah **salah satu fitur utama** website ini. Ia harus **akurat** (bentuk, proporsi, warna, paritas dengan desain 2D) dan **rapi** (tanpa artefak visual). Dokumen ini adalah instruksi tunggal untuk iterasi kedua. Baca semua berkas yang disebut langsung dari disk; jangan meminta saya menempelkan isinya. Kerjakan **berurutan per tahap**, dan **BERHENTI** di tiap gerbang.
>
> Arti kata perintah: **WAJIB** = harus dilakukan. **DILARANG** = tidak boleh dilakukan dalam kondisi apa pun. **BERHENTI** = hentikan pekerjaan, tulis laporan, tunggu jawaban saya.

---

## 1. PERAN DAN HIERARKI

Kamu adalah **Senior Full-Stack Engineer + Technical Lead + 3D/Visual QA Lead** proyek **Riza Apparel** (UMKM custom jersey sublimasi, Ende, NTT). Saya adalah developer dan pemegang keputusan akhir. Saya **tidak punya Blender maupun keahlian 3D**, jadi kamu membangun dan menilai hasilnya lewat kode dan render, dan saya menyetujui di tiap gerbang.

**Hierarki otoritas jika ada konflik:** instruksi terbaru saya di chat → dokumen ini → `prompt-koreksi-model-3d-jersey.md` → `prompt-master-jalankan-aset-jersey.md` → `prompt-generate-aset-jersey-2d-3d.md` → PRD → Use Case Modelling → Analisis MMP. Bila dua sumber bertentangan atau ambigu, **tanyakan, jangan menebak.**

**Berkas yang WAJIB dibaca (cari dengan nama berkas; nama bisa berakhiran seperti `__1_`):**

| # | Berkas | Fungsi |
|---|---|---|
| 1 | `prompt-master-jalankan-aset-jersey.md` | Aturan mutlak proyek (§4 di dalamnya **tetap berlaku**) |
| 2 | `prompt-generate-aset-jersey-2d-3d.md` | Pipeline pola-ke-kain, struktur keluaran |
| 3 | `prompt-koreksi-model-3d-jersey.md` | Iterasi pertama (diagnosis F0, kriteria K-01…K-13) |
| 4 | `docs/reports/f0-diagnosis.md`, `docs/reports/f1-*.md` (jika ada) | Hasil kerja iterasi pertama |
| 5 | `riza-apparel-prd.md` | FR-A6, FR-D3, FR-D4 |
| 6 | `riza-apparel-use-case-modelling.md` | UC4, UC6, UC17 dan Entity Glossary |
| 7 | `docs/evidence/iter2/3d-sebelum.png` dan `docs/evidence/iter2/2d-sebelum.png` | Bukti kondisi saat ini (3D Orbit View dan 2D Studio Vector) |
| 8 | `docs/reference-local/vneck-referensi.png` | Referensi bentuk target (**aset pihak ketiga, hanya untuk dilihat**, tidak boleh ter-commit) |

Jika #1–#3, #5–#6 tidak ada: **BERHENTI** dan laporkan. Jika #7 atau #8 tidak ada: **BERHENTI** dan minta saya menaruhnya. **DILARANG** mencari gambar pengganti di internet. Jalankan `git check-ignore -v docs/reference-local/vneck-referensi.png`; jika tidak ter-ignore, tambahkan hanya satu baris itu ke `.gitignore` dan laporkan.

---

## 2. ATURAN MUTLAK (ringkasan; rujukan lengkap di prompt master §4)

1. **Rp 0 selamanya.** Tidak ada layanan berbayar. Paket/perangkat lunak baru hanya dipasang dari sumber resmi **setelah saya izinkan** (sebutkan sumber, versi, ukuran, dampak). Pustaka 3D yang sudah dipakai repo boleh dipakai penuh, termasuk modul bawaannya.
2. **Aset dari nol.** **DILARANG** menyalin, men-trace, atau memakai piksel gambar referensi / aset pihak ketiga sebagai geometri atau texture. Sumber luar hanya boleh CC0, dengan persetujuan saya, dan dicatat di `docs/assets-licenses.md`.
3. **Layout Freeze.** **DILARANG** mengubah tata letak halaman, komponen UI, atau design system. Perubahan di dalam `src/` hanya lewat **Layout Change Request (LCR)** yang saya setujui ("DISETUJUI"). Pekerjaan awal dilakukan di luar `src/` (§7).
4. **Jangan merusak MVP.** Kerjakan di branch `fix/jersey-3d-akurasi` (dari branch aktif; jika `git status --short` tidak bersih, **BERHENTI** dan tanyakan). Simpan versi lama di `assets/jersey/_arsip/`; jangan menimpa.
5. **Jangan mengarang.** Ukuran, harga, data klien, dan motif budaya **tidak boleh dibuat**. Data yang belum ada ditandai `[PLACEHOLDER — menunggu klien]`. Template motif yang **sudah ada** di aplikasi (mis. Tenun Ikat Ende) boleh dipakai sebagai skenario uji regresi, tetapi **tidak boleh diubah atau dibuat baru**.
6. **Verifikasi sebelum klaim.** Jangan menulis "akurat", "sempurna", "premium", atau "setara mockup profesional" tanpa bukti render 8 sudut dan rubrik (§8) terisi. Laporkan kekurangan yang tersisa dengan jujur.
7. **Bahasa Indonesia** untuk laporan dan dokumentasi. Keputusan penting dicatat sebagai ADR singkat di `docs/decisions/`.
8. Gunakan `find-skills` untuk mencari skill yang relevan (three.js, PBR/material kain, glTF, visual QA); seleksi ketat, catat di `docs/skills-log.md`.

---

## 3. KONDISI SAAT INI (temuan awal dari screenshot; WAJIB diverifikasi)

Screenshot menunjukkan kemajuan: model kini punya volume, leher V, dan lengan. Tetapi **belum akurat dan belum rapi**. Temuan visual awal (screenshot beresolusi kecil, jadi **verifikasi tiap butir dengan render sendiri**, jangan hanya mengandalkan daftar ini):

| ID | Temuan | Dugaan penyebab (belum fakta) |
|---|---|---|
| C-01 | **Lengan hampir hitam dan mencuat ke atas/samping** seperti sayap, bukan menggantung dari bahu. Di 2D lengan berwarna oranye dengan aksen abu-abu. | Sudut/orientasi lengan salah; UV lengan di luar area texture (jatuh ke warna dasar hitam) |
| C-02 | **Badan berbentuk trapesium kotak**, tepi samping dan hem gelap. Kurang meruncing, kurang lengkungan hem. | Penampang torso kasar; texture tidak menutup sampai jahitan samping |
| C-03 | **Desain tampak "ditempel" sebagai persegi** dengan batas tajam di tengah dada; tidak membungkus badan penuh seperti di 2D. | Texture dari tangkapan tampak depan 2D, bukan atlas per panel |
| C-04 | **Kerah hitam** dan sayap hitam di sisi leher; di 2D kerah V berwarna oranye. | Slot kerah tidak terpetakan; penampang kerah salah |
| C-05 | **Warna tidak sama antara 2D dan 3D** (badan marun, lengan oranye, kerah oranye di 2D). | Tidak ada satu sumber kebenaran desain untuk 2D dan 3D |
| C-06 | **Bayangan persegi keras melayang** di bawah model. | Bidang bayangan terpisah, bukan bayangan kontak lembut |
| C-07 | **Teks "RIZA SPORT" dan nomor tampak pudar/blur**; kontras rendah. | Resolusi atlas rendah, tidak ada mipmap/anisotropy |
| C-08 | **Pencahayaan datar dan gelap**; lipatan tak terbaca; siluet hilang di latar gelap. | Cahaya tunggal, tanpa environment/rim light |
| C-09 | **Tidak ada detail kain dan jahitan** sehingga terlihat seperti plastik/kain polos. | Tidak ada normal map, material kain generik |
| C-10 | Bagian dalam leher/hem tampak **hitam pekat**, bukan bagian dalam kain. | Back-face culling/material sisi dalam tidak diatur |

---

## 4. PRINSIP ARSITEKTUR (WAJIB)

Akar kesalahan yang paling mungkin: **desain 2D dan model 3D tidak berbagi satu sumber kebenaran.** Perbaikannya adalah arsitektur ini:

1. **Design State (satu-satunya sumber kebenaran):** warna per panel, motif, teks/nomor, logo, layer. Sudah ada di aplikasi; **temukan dan pakai apa adanya**, jangan bikin state kedua.
2. **Pattern Spec (JSON, satuan mm):** poligon panel `body_front`, `body_back`, `sleeve_left`, `sleeve_right`, `collar` (dan `cuff` bila dipisah), lengkap dengan titik-titik jahitan yang berpasangan. Parameter dari `lebar_dada`, `panjang_baju`, `lebar_bahu` (nilai klien belum ada: `[PLACEHOLDER — menunggu klien]`). Spec ini adalah dasar untuk **tiga hal sekaligus**: (a) layout UV model 3D, (b) ekspor cetak SVG pola datar (FR-D4, dengan bleed dan seam allowance sebagai parameter), (c) pratinjau 2D bila memungkinkan.
3. **Atlas Renderer:** satu fungsi yang merender Design State menjadi **atlas texture per panel** sesuai layout UV. Aturan atlas:
   - Resolusi default **2048 px** (opsi 4096 px untuk desktop; mobile 1024–2048 px), ruang warna sRGB.
   - **Padding/edge bleeding 8–16 px** di tepi tiap pulau UV (dilation) agar tidak ada garis hitam di jahitan.
   - Mipmap aktif dan anisotropy tinggi (mis. 8–16, dibatasi kemampuan perangkat).
4. **Model 3D** memakai UV dari Pattern Spec yang sama. **DILARANG** memakai tangkapan layar tampak depan 2D sebagai texture seluruh model.
5. **Paritas 2D ↔ 3D:** untuk Design State yang sama, warna dan posisi elemen di 3D harus sama dengan 2D. Sediakan **mode debug unlit** (tanpa pencahayaan) untuk membuktikannya.

Perubahan pada logika Design State atau tampilan 2D **DILARANG** kecuali saya setujui lewat LCR. Tugasmu adalah mengonsumsi state itu di sisi 3D.

---

## 5. SPESIFIKASI TARGET

Nilai angka di bawah adalah **nilai awal (default)** untuk disetel lewat iterasi visual terhadap referensi. Jika kamu ingin mengubah ambang, minta persetujuan; **DILARANG** menurunkan ambang diam-diam.

### 5.1 Geometri
| ID | Spesifikasi |
|---|---|
| G-01 | **Torso bervolume dan tertutup.** Bahu miring alami (bukan datar), dada → pinggang → hem agak mengecil (parameter `taper`, mulai dari lebar hem ≈ 92–98% lebar dada), hem sedikit melengkung ke bawah di tengah depan/belakang. |
| G-02 | **Lengan pendek set-in menggantung ke bawah** dari lubang lengan, dengan sumbu lengan miring **15°–35° dari vertikal** (pose-A). **DILARANG** mencuat ke atas atau horizontal. Bentuk lengan meruncing halus, ujung lengan (cuff) rapi dan bertebal kecil. |
| G-03 | **Leher V** dengan kedalaman awal ≈ 12–16% `panjang_baju` dan **kerah rib** bertebal (lebar strip awal ≈ 20–30 mm). Bagian dalam kerah punggung terlihat di balik lubang leher. |
| G-04 | **Permukaan dalam (ghost mannequin):** bagian dalam kain dimodelkan sebagai **shell terpisah** (normal terbalik, offset tebal kain ±1 mm) dengan material bagian-dalam yang lebih gelap-lembut, **bukan hitam pekat**. |
| G-05 | **Jahitan bahu dan samping terbaca** (detail normal map atau geometri tipis, bukan garis yang ditempel di texture). Hem dan ujung lengan punya ketebalan/lipatan. |
| G-06 | **Drape/kerut halus** (seed tetap, deterministik) terkonsentrasi di ketiak, hem, dan lipatan lengan. **DILARANG** kerutan berlebihan yang merusak siluet. |
| G-07 | Lima slot material dengan nama **persis**: `body_front`, `body_back`, `sleeve_left`, `sleeve_right`, `collar`. Tiap panel bisa diwarnai/di-texture sendiri. |
| G-08 | Mesh bersih: `boundaryLoopCount = 4` untuk shell luar, komponen tersambung, tanpa segitiga degenerate/non-manifold, normal konsisten (lihat K-01…K-04 di iterasi pertama, tetap berlaku). |

### 5.2 Material dan pencahayaan (semua di dalam canvas 3D)
| ID | Spesifikasi |
|---|---|
| M-01 | Material kain poliester: fisik/PBR, **roughness ≈ 0,75–0,9, metalness 0**, sheen halus (sheen ≈ 0,3–0,5). Tidak boleh terlihat seperti plastik mengkilap. |
| M-02 | **Normal map anyaman/jaring halus** yang dibangkitkan secara prosedural (tanpa gambar pihak ketiga), tiling tanpa moiré (mipmap + anisotropy). Intensitas halus: terlihat saat zoom, tidak mengganggu desain. |
| M-03 | **Pencahayaan tiga titik (key, fill, rim) + environment prosedural** (mis. RoomEnvironment atau gradien yang dibuat sendiri). **DILARANG** memakai HDRI eksternal kecuali CC0, disetujui, dan tercatat. Tone mapping filmik dan output sRGB. Jersey putih tidak boleh terbakar (clip); jersey gelap tetap menampakkan lipatan. |
| M-04 | **Bayangan kontak lembut** (blur radial, opasitas rendah) di bawah model, atau tanpa bayangan. **DILARANG** bidang bayangan persegi keras yang melayang. |
| M-05 | Latar canvas **transparan** mengikuti tema aplikasi (gelap/terang). Siluet harus terbaca di kedua tema (rim light membantu). |
| M-06 | Anti-aliasing aktif; `devicePixelRatio` dibatasi maks. 2 (lebih rendah di mobile). |
| M-07 | Teks/nomor dan logo di atlas **tajam dan terbaca** pada screenshot 1920×1080 di ukuran kanvas standar aplikasi. |

### 5.3 Interaksi (di dalam canvas; tanpa mengubah layout)
| ID | Spesifikasi |
|---|---|
| I-01 | Kamera otomatis **membingkai** model dari bounding box (model selalu utuh dan di tengah pada semua viewport). |
| I-02 | OrbitControls halus (damping), batas jarak dan sudut polar, tanpa panning liar. |
| I-03 | Preset Depan/Belakang/Kiri/Kanan bergerak **beranimasi** dengan easing ke sudut yang tepat; **status tombol, label kamera, dan slider derajat selalu sinkron** (satu state). Perubahan UI di `src/` hanya lewat LCR. |

### 5.4 Performa (FR-A6, P-18)
GLB desktop **≤ 3 MB dan ≤ 60.000 segitiga**; varian mobile lebih ringan (usulan awal ≤ 25.000 segitiga dan ≤ 1,5 MB; konfirmasi ke saya). Pemuatan lazy. Frame rate interaktif yang mulus di perangkat menengah (catat hasil pengukurannya).

---

## 6. TAHAP I0 — AUDIT (hanya membaca + alat ukur; lalu BERHENTI)

**Batas tulis I0:** hanya `tools/jersey/`, `docs/reports/`, `docs/evidence/iter2/`. Tidak ada perubahan `src/`, tidak ada instalasi, tidak ada aset final.

**Langkah pembuka:** `git status --short` (harus bersih, atau BERHENTI), lalu `git switch -c fix/jersey-3d-akurasi`.

Jawab **setiap** tugas dengan bukti (perintah + keluaran, berkas + nomor baris, hash commit, gambar):

- **A-01 Peta alur data.** Telusuri dari Design State → 2D Studio → 3D Orbit View. Gambar diagramnya (teks/Mermaid) di laporan: di mana state disimpan, bagaimana texture 3D dibuat, berkas dan barisnya. Jalankan `git grep -n -i -E "GLTFLoader|useGLTF|\.glb|CanvasTexture|toDataURL|toBlob|drawImage|OrbitControls|MeshStandardMaterial|MeshPhysicalMaterial|DoubleSide|shadow" -- src` sebagai titik awal.
- **A-02 Sumber texture.** Jawab tegas: texture 3D berasal dari tangkapan tampak depan 2D, atlas per panel, atau lainnya? Bukti dari kode dan render debug.
- **A-03 Verifikasi C-01…C-10** satu per satu: **terbukti / ditolak / belum bisa dibuktikan**, dengan render pendukung di `docs/evidence/iter2/`. Tambahkan cacat baru yang kamu temukan.
- **A-04 Statistik mesh** (skrip `tools/jersey/inspect-mesh.mjs`; gunakan ulang dari iterasi pertama jika ada): tris, vertex, bbox, boundary loop, komponen, non-manifold, degenerate, rentang dan tumpang tindih UV, daftar material.
- **A-05 Render inspeksi 8 sudut** (0/45/90/135/180/225/270/315°) memakai halaman uji **`tools/jersey/viewer-test.html`** (di luar `src/`), untuk: (a) desain saat ini, (b) texture checker, (c) mode unlit. Gunakan browser bawaan IDE untuk screenshot; jika tidak tersedia, usulkan Playwright dan **minta izin**.
- **A-06 Paritas warna 2D ↔ 3D:** tabel warna per panel di 2D vs di render unlit 3D, dengan selisihnya.
- **A-07 Cek lingkungan (hanya membaca):** `node -v`, `npm -v`, `python --version`, `blender --version`. Laporkan yang ada/tidak; rencanakan izin bila perlu.
- **A-08 Status sinkronisasi UI** (tombol sudut, label kamera, slider): sinkron atau tidak, dengan bukti. Hanya laporkan.
- **A-09 Akar masalah:** tabel Hipotesis / Bukti / Putusan untuk tiap C-xx, lalu **rencana perbaikan** (§7) dengan estimasi risiko, opsi cadangan, dan daftar izin yang diperlukan.

**Keluaran:** `docs/reports/i2-audit.md` (ringkasan maks. 10 baris, bukti, tabel akar masalah, rencana, izin, pertanyaan terbuka maks. 5 masing-masing dengan default yang kamu sarankan). Tulis di chat: **"TAHAP I0 SELESAI — menunggu DISETUJUI."** dan **BERHENTI.**

---

## 7. TAHAP I1 — PEMBANGUNAN DAN SIKLUS PERBAIKAN VISUAL (setelah "DISETUJUI")

**Semua pekerjaan I1 dilakukan di luar `src/`:** `tools/jersey/` (skrip pembangun, atlas renderer, harness), `assets/jersey/vneck-setin/` (Pattern Spec, GLB), `docs/`.

### 7.1 Tugas
| ID | Perintah |
|---|---|
| B-01 | Buat `assets/jersey/vneck-setin/pattern.json` (Pattern Spec, §4) dengan parameter `[PLACEHOLDER]` yang dapat diubah. |
| B-02 | Bangun model sesuai G-01…G-08. Jalur pembuatan: ikuti keputusan ADR iterasi pertama (Blender headless dari pola, atau mesh prosedural berkode). Jika kualitas mentok, lihat §11. |
| B-03 | Buat **Atlas Renderer** (fungsi murni yang mengubah Design State → atlas per panel) dengan padding/bleeding (§4). |
| B-04 | Buat material dan pencahayaan sesuai M-01…M-07 di harness `tools/jersey/viewer-test.html`. |
| B-05 | Buat **`tools/jersey/validate-jersey.mjs`** yang memeriksa otomatis: kriteria mesh (G-08), UV (tanpa tumpang tindih, dalam 0–1, distorsi checker ≤ 25%), slot material, ukuran GLB dan jumlah segitiga, dan **paritas warna unlit** (selisih per kanal ≤ 5/255 dari Design State). Keluar dengan kode non-nol jika ada yang gagal. |
| B-06 | Satu perintah membangun ulang semuanya (mis. `node tools/jersey/build.mjs`), dapat dijalankan tanpa keahlian 3D; jalankan dua kali dan bandingkan hash (atau catat seed). |
| B-07 | Buat GLB desktop dan mobile. Ikuti struktur keluaran di berkas #2. |

### 7.2 Siklus perbaikan visual (WAJIB, maksimal 5 iterasi)
Ulangi sampai rubrik §8 lulus atau iterasi habis:
1. Render matriks uji §9 (semua skenario) ke `docs/evidence/iter2/iterasi-N/`.
2. Isi rubrik §8 dengan jujur, dengan alasan singkat per butir.
3. Tulis **3 cacat terbesar** yang tersisa dan hipotesis penyebabnya.
4. Perbaiki **hanya** tiga cacat itu. **DILARANG** mengubah banyak hal sekaligus tanpa bukti sebelum/sesudah.
5. Simpan perbandingan sebelum/sesudah dan catat di `docs/reports/i2-iterasi-N.md` (maks. 15 baris).

Jika setelah iterasi ke-3 skor tidak naik, ubah pendekatan (bukan sekadar menyetel parameter) dan jelaskan alasannya. Jika iterasi ke-5 belum lulus, lihat §11.

**Keluaran I1:** `docs/reports/i2-hasil.md` dengan tabel rubrik akhir, perbandingan berdampingan 8 sudut (sebelum vs sesudah vs referensi; referensi tidak di-commit), hasil `validate-jersey.mjs`, daftar kekurangan tersisa, ADR, pembaruan `docs/assets-licenses.md`, dan bukti `git diff --name-only <branch-dasar>...HEAD` tanpa berkas `src/`. Tulis di chat: **"TAHAP I1 SELESAI — menunggu DISETUJUI."** dan **BERHENTI.**

---

## 8. RUBRIK KUALITAS (nilai 0 / 1 / 2 per butir; dinilai dari 8 sudut)

0 = gagal / tampak salah. 1 = dapat diterima tetapi ada cacat terlihat. 2 = bersih, meyakinkan.

| ID | Butir | Yang dinilai |
|---|---|---|
| Q-01 ★ | Siluet dan proporsi | Torso, bahu, taper, hem sesuai G-01 dan referensi |
| Q-02 | Leher dan kerah | V-neck, ketebalan kerah rib, bagian dalam punggung kerah |
| Q-03 ★ | Lengan | Menggantung alami dari lubang lengan, menyatu di bahu, cuff rapi (G-02) |
| Q-04 | Jahitan dan detail | Jahitan bahu/samping, hem, cuff terbaca |
| Q-05 | Kain dan material | Tampak kain sublimasi, bukan plastik; anyaman halus tanpa moiré |
| Q-06 | Pencahayaan dan bayangan | Lipatan terbaca, tidak datar/terbakar, bayangan kontak lembut |
| Q-07 | Kejelasan desain | Teks/nomor/logo tajam; motif tidak melar |
| Q-08 ★ | Kerapian tepi | Tanpa garis hitam di jahitan, tanpa "tempelan" persegi, tanpa artefak UV |
| Q-09 ★ | Paritas 2D ↔ 3D | Warna dan posisi elemen konsisten dengan 2D untuk Design State yang sama |
| Q-10 | Kebersihan adegan | Tanpa objek/bayangan melayang; bagian dalam tidak hitam pekat |
| Q-11 | Interaksi | Orbit halus, preset beranimasi, kamera membingkai, status tombol/label/slider sinkron |
| Q-12 | Performa | Sesuai §5.4; frame rate mulus |

**Lulus jika:** butir bertanda ★ (Q-01, Q-03, Q-08, Q-09) semuanya bernilai **2**, butir lain ≥ **1**, dan total ≥ **20 dari 24**. Keputusan akhir ada pada saya.

---

## 9. MATRIKS UJI (untuk setiap iterasi dan laporan akhir)

| Dimensi | Nilai |
|---|---|
| Desain uji | (1) putih polos; (2) tiap panel warna kontras berbeda; (3) garis + teks + nomor + logo placeholder netral; (4) template motif yang sudah ada di aplikasi (regresi saja, tidak dimodifikasi) |
| Sudut | 0/45/90/135/180/225/270/315° |
| Tema | gelap dan terang |
| Viewport | desktop 1920×1080 dan mobile 390×844 |

Juga uji ekstrem: warna hitam pekat, putih murni, dan warna sangat terang; teks panjang; nomor dua digit.

---

## 10. LARANGAN KHUSUS

1. **DILARANG** menyembunyikan cacat: `DoubleSide` untuk menutupi normal terbalik pada shell luar, memutar/memperbesar kamera agar cacat tak terlihat, menambah cahaya berlebih, memotret hanya dari sudut yang bagus, atau memanggang bayangan/lipatan palsu ke dalam texture desain.
2. **DILARANG** menyatakan lulus dari satu sudut atau satu desain uji.
3. **DILARANG** memakai gambar referensi atau tangkapan layarnya sebagai texture, latar, atau template geometri.
4. **DILARANG** membuat atau memodifikasi motif budaya; **DILARANG** mengubah logika Design State atau tampilan 2D tanpa LCR.
5. **DILARANG** menyentuh `src/`, layout, atau design system tanpa LCR yang saya setujui.
6. **DILARANG** memasang perangkat lunak/paket tanpa izin atau memakai layanan berbayar.
7. **DILARANG** mengarang ukuran, harga, atau data klien.
8. **DILARANG** menurunkan ambang diam-diam atau menyebut "sebagian lulus" sebagai "lulus".

---

## 11. JIKA KUALITAS MENTOK (setelah iterasi ke-5 belum lulus)

**BERHENTI** dan laporkan jujur: butir rubrik yang gagal, bukti render, penyebab yang kamu duga, dan opsi berikut dengan risiko, biaya, dan estimasi masing-masing. **Jangan memilih sendiri.**

- **Opsi 1 — Basis mesh CC0:** cari model kaos/jersey berlisensi CC0 dari sumber resmi, dengan persetujuan saya dan tercatat di `docs/assets-licenses.md`; petakan ulang UV dari Pattern Spec. Risiko: UV dan topologi mungkin tidak cocok.
- **Opsi 2 — Modeler 3D manusia sekali saja** untuk membuat mesh dasar berkualitas tinggi (berbiaya; keputusan ada pada saya). Pipeline atlas, material, dan Design State tetap dipakai.
- **Opsi 3 — Pratinjau 360° berbasis gambar:** putar rangkaian render dari model terbaik; beri label jujur "Pratinjau 360°" sesuai FR-D3. Kurang interaktif.

Bila menurutmu target "akurat dan sempurna" tidak realistis dengan batasan Rp 0 dan tanpa keahlian 3D, **katakan terus terang**. Kejujuran lebih penting daripada hasil yang tampak lengkap.

---

## 12. TAHAP I2 — INTEGRASI KE STUDIO (hanya setelah saya menjawab "APPROVED" pada laporan I1)

1. Ajukan **Layout Change Request** yang merinci berkas `src/` yang akan diubah, alasan, risiko, dan bukti bahwa **tata letak halaman tidak berubah** (hanya isi canvas 3D, pemuat aset, dan pemakaian Atlas Renderer). Sertakan usulan perbaikan sinkronisasi status UI bila A-08 menemukan ketidaksinkronan. **Tunggu "DISETUJUI".**
2. Integrasikan: muat GLB secara lazy (desktop/mobile), hubungkan Design State → Atlas Renderer → material model, terapkan interaksi §5.3.
3. **Uji regresi:** `npm run build` lolos, halaman lain dan 2D Studio tidak berubah, ekspor cetak tidak terganggu. Ulangi matriks uji §9 **pada aplikasi nyata** (`localhost:5173`, Studio → 3D Orbit View) dan lampirkan bukti.
4. Tulis `docs/reports/i2-integrasi.md`. **BERHENTI.**

---

## 13. FORMAT LAPORAN TIAP GERBANG

Bahasa Indonesia, di chat dan di `docs/reports/`:

1. **Ringkasan** (maks. 10 baris).
2. **Bukti:** perintah + keluaran, tautan berkas, gambar render.
3. **Tabel rubrik §8 dan hasil `validate-jersey.mjs`** (lulus / gagal / sebagian, dengan bukti).
4. **Risiko dan kekurangan yang tersisa** (termasuk yang belum berhasil).
5. **Izin yang diminta** (jika ada).
6. **Pertanyaan terbuka** (maks. 5, masing-masing dengan default yang kamu sarankan).

---

**Mulai sekarang dengan §1 (berkas wajib dan bukti visual), lalu Tahap I0.**
