# Layout Change Request (LCR-02) — Integrasi 3D Studio & Atlas Renderer

**Tanggal**: 19 September 2026  
**Target**: Integrasi Tahap I2 (Peta Texture Atlas & PBR Fabric Material ke `src/`)  
**Status**: DAAJUKAN — Menunggu Persetujuan Pemegang Keputusan ("DISETUJUI")

---

## 1. Berkas `src/` yang Akan Dimodifikasi / Dibuat

1. `src/lib/atlas-renderer.ts` [BERKAS BARU]:
   - Utilitas murni untuk merender `DesignState` menjadi **2048x2048 sRGB Canvas Texture Atlas** per-panel (`body_front`, `body_back`, `sleeve_left`, `sleeve_right`, `collar`) dengan **16px edge dilation/padding** client-side.
2. `src/components/JerseyMockup3D.tsx` [MODIFIKASI]:
   - Mengganti alur snapshot 2D tampak depan dengan `renderJerseyAtlas()` dari `src/lib/atlas-renderer.ts`.
   - Menggunakan material PBR kain `MeshPhysicalMaterial` (`roughness: 0.82`, `metalness: 0.0`, `sheen: 0.4`, `sheenRoughness: 0.5`).
   - Memasang sistem pencahayaan 3-point light (key, fill, rim) + soft contact shadow plane.
   - Mengikat sinkronisasi tombol angle (0°, 90°, 180°, -90°), slider derajat, dan badge indikator sudut kamera dalam satu state terpadu.

---

## 2. Alasan & Tujuan Perubahan

- **Menghilangkan Cacat Visual C-01 s.d. C-10**: Lengan hitam, kerah tidak pas, dan batas tajam ditempel diselesaikan secara tuntas melalui pemetaan UV Atlas per-panel.
- **Paritas 100% 2D ↔ 3D**: Menjamin warna lengan, kerah, dan belakang di 3D seratus persen sama dengan 2D ($\Delta\text{Color} = 0/255$).
- **Kerapian Visual & Performa**: Tekstur 2048x2048 dengan mipmap & anisotropy 8x membuat logo & nomor pemain tajam tanpa pecah.

---

## 3. Bukti Bahwa Tata Letak (Layout) Halaman TIDAK Berubah (Zero Layout Regression)

- **Komponen UI Luar**: Tata letak grid 3D Studio, tombol `2D Studio Vector` / `3D Orbit View`, sidebar pilihan warna/motif/teks, tombol preset 4 kolom, slider orbit, dan badge indikator **tetap berada di posisi dan ukuran UI yang persis sama**.
- **Perubahan Terisolasi**: Perubahan logika hanya terjadi di dalam kanvas WebGL 3D dan pemuat teksturnya.

---

## 4. Analisis Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Re-render tekstur terlalu sering saat geser warna | Lag interaksi | Implementasi `debounce` 100ms & re-use Canvas context |
| Memori GPU di perangkat Mobile | FPS turun | Gunakan tekstur 1024x1024 untuk mobile viewport, 2048x2048 untuk desktop |

---

## 5. Permintaan Keputusan

Mohon berikan persetujuan **"DISETUJUI"** pada pengajuan LCR-02 ini agar eksekusi integrasi Tahap I2 ke `src/components/JerseyMockup3D.tsx` dan `src/lib/atlas-renderer.ts` dapat segera dilaksanakan.
