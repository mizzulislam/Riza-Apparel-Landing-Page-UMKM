# Laporan QA & Rubrik Evaluasi Aset 3D/2D — `raglan-crew` (Gerbang G2)

> **Model:** `raglan-crew` (Jersey Custom Raglan Sleeve Crew-Neck)  
> **Tanggal Evaluasi:** 19 September 2026  
> **Hasil Inspeksi CLI:** `@gltf-transform inspect assets-pipeline/models/raglan-crew.glb`

---

## 1. Tabel Rubrik Evaluasi Kualitas (QA Rubric)

| # | Kriteria Evaluasi | Target Standard | Hasil Aktual (`raglan-crew`) | Status |
|---|---|---|---|---|
| **1** | **Ukuran File Binary GLB** | ≤ 3.0 MB (3.072 KB) | **54.43 KB** (Standard) / **27.39 KB** (Mobile) | ✅ **LOLOS SANGAT BAIK** |
| **2** | **Jumlah Poligon (Triangles)** | ≤ 60.000 Segitiga | **2.120 Segitiga** (GLPrimitives) | ✅ **LOLOS SANGAT BAIK** |
| **3** | **Jumlah Vertex Upload GPU** | ≤ 35.000 Vertices | **1.210 Vertices** | ✅ **LOLOS** |
| **4** | **Material Slots / Panel ID** | 5 Sub-mesh Primitives Terpisah | 5 Slot: `mat_torso_front`, `mat_torso_back`, `mat_sleeve_left`, `mat_sleeve_right`, `mat_collar` | ✅ **LOLOS 100%** |
| **5** | **Kelengkapan Atribut Vertex** | POSITION, NORMAL, TEXCOORD_0 | `POSITION:f32`, `NORMAL:f32`, `TEXCOORD_0:f32` lengkap | ✅ **LOLOS** |
| **6** | **Distorsi UV Mapping** | Zero Overlap & Seamless Pattern Mapping | Mapped 1:1 terhadap UV Test Grid (`uv-test-grid.png`) | ✅ **LOLOS** |
| **7** | **Pola 2D Flat Vector (SVG)** | Skala mm, Cut Line, Seam Allowance, Bleed | File `assets-pipeline/patterns/raglan-crew.svg` (1200x900mm, Seam 10mm, Bleed 5mm) | ✅ **LOLOS** |
| **8** | **Kepatuhan Aturan R1 (Rp 0)** | 100% Gratis Tanpa Billing | Dihasilkan via skrip Python/Node open-source bawaan | ✅ **LOLOS** |
| **9** | **Kepatuhan R3 (Layout Freeze)** | Dilarang mengubah `src/` atau UI publik | Seluruh file tersimpan terisolasi di `/assets-pipeline/` | ✅ **LOLOS** |

---

## 2. Rincian Aset Hasil Generasi (Gerbang G2)

1. **Pola 2D Flat Vector SVG**:
   - Path: `assets-pipeline/patterns/raglan-crew.svg`
   - Ukuran Kanvas: 1200mm x 900mm (Size L Standar Raglan Jersey Futsal NTT)
   - Garis Pemotong (Cut Line): Merah Maroon `#E11D48`
   - Garis Jahitan (Seam Line): Biru Kelimutu `#0284C7` (10mm Seam Allowance)
   - Garis Bleed (Bleed Line): Emas Zawo `#F59E0B` (5mm Bleed Margin)

2. **Model 3D GLB (Standard)**:
   - Path: `assets-pipeline/models/raglan-crew.glb`
   - File Size: 54.43 KB
   - Primitive Count: 5 sub-meshes

3. **Model 3D GLB (Mobile Optimized)**:
   - Path: `assets-pipeline/models/raglan-crew.mobile.glb`
   - File Size: 27.39 KB
   - Primitive Count: 5 sub-meshes

---

## 3. Kesimpulan Gerbang G2
Seluruh aset model `raglan-crew` telah **memenuhi 100% kriteria Rubrik QA** tanpa pelanggaran batas performa, memuat 5 slot material presisi untuk kustomisasi Studio, dan terisolasi sepenuhnya di folder `assets-pipeline/`.
