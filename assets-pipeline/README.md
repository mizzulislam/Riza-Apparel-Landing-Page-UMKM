# Pipeline Pembuat Aset Jersey 2D/3D — Riza Apparel

> **Direktori Terisolasi Hasil Eksekusi Aset (Layout Freeze R3 Compliance)**
> **Tanggal Pembuatan:** 19 September 2026

---

## 📁 Struktur Direktori & Aset

```
assets-pipeline/
├── patterns/                     # Pola 2D Flat Vector SVG Siap Cetak
│   ├── vneck-setin.svg           # Pola V-Neck Set-In (1200x900mm, Cut/Seam/Bleed lines)
│   └── raglan-crew.svg           # Pola Raglan Crew-Neck (1200x900mm, Cut/Seam/Bleed lines)
├── models/                       # Model 3D Binary GLB (Standard & Mobile)
│   ├── vneck-setin.glb           # 54.43 KB, 2.120 tris, 5 material slots
│   ├── vneck-setin.mobile.glb    # 27.39 KB, mobile optimized
│   ├── raglan-crew.glb           # 54.43 KB, 2.120 tris, 5 material slots
│   └── raglan-crew.mobile.glb    # 27.39 KB, mobile optimized
├── textures/                     # Tekstur Uji Distorsi UV Grid
│   └── uv-test-grid.png          # 2048 x 2048 px PNG
├── scripts/                      # Skrip Generator Otomatis
│   ├── generate-2d-patterns.js   # Skrip pembuat pola 2D SVG
│   ├── generate-test-texture.py  # Skrip pembuat tekstur grid UV
│   └── build-jersey-glb.py       # Skrip pembuat 3D GLB mesh
└── reports/                      # Laporan Rubrik QA
    ├── qa-rubric-vneck-setin.md  # Laporan evaluasi G1 vneck-setin
    └── qa-rubric-raglan-crew.md  # Laporan evaluasi G2 raglan-crew
```

---

## 🏷️ Kontrak Material Slots (5 Panel Sub-Mesh)

Seluruh model 3D GLB dikonstruksi dengan 5 slot material terpisah sehingga dapat diwarnai dan disublimasi secara independen oleh Studio 3D:

1. `mat_torso_front` (Badan Depan)
2. `mat_torso_back` (Badan Belakang)
3. `mat_sleeve_left` (Lengan Kiri)
4. `mat_sleeve_right` (Lengan Kanan)
5. `mat_collar` (Rib Kerah)

---

## ⚡ Ringkasan Performa (Performance Budget)

- **Target Ukuran File**: ≤ 3.0 MB
  - **Realisasi `vneck-setin.glb`**: 54.43 KB (98.2% lebih hemat dari budget!)
  - **Realisasi `vneck-setin.mobile.glb`**: 27.39 KB
- **Target Poligon**: ≤ 60.000 Segitiga
  - **Realisasi `vneck-setin`**: 2.120 Segitiga (1.210 Vertices)
- **Status Kepatuhan Aturan**: 100% Rp 0, 100% CC0/Buatan Sendiri, Zero Layout Regression (R3).
