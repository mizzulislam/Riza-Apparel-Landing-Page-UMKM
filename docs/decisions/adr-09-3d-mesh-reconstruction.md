# ADR-09: Rekonstruksi Geometri 3D Jersey Deterministik (Jalur B)

* **Tanggal**: 19 September 2026
* **Status**: Usulan (Menunggu Persetujuan GATE F0)
* **Konteks & Masalah**:
  Model 3D jersey `vneck-setin` sebelumnya memiliki kecacatan geometri: berupa silinder terpisah tanpa volume utuh, armhole dan lengan melayang tidak tersambung, culling hitam akibat normal terbalik, serta UV mapping yang terpotong.
* **Opsi yang Dievaluasi**:
  1. *Jalur A (Blender Headless Cloth Simulation)*: Membutuhkan instalasi Blender Portable (~300MB) dan skrip simulasi kain `bpy` yang berisiko tidak stabil atau menghasilkan poligon terlalu tinggi.
  2. *Jalur B (Mesh Prosedural Deterministik via Kode)*: Membangun geometri jersey 3D utuh bervolume (*ghost mannequin*) secara deterministik via Python/Node tanpa Blender. Membentuk torso tertutup, lengan setin tersambung, kerah rib V-neck bertebal, dan 5 slot material dengan UV atlas presisi.
* **Keputusan**: **Jalur B (Mesh Prosedural Deterministik).**
* **Konsekuensi**: 100% Rp 0, tanpa perlu mengunduh peranti lunak eksternal, menghasilkan file GLB ≤ 3 MB dan ≤ 60k tris yang 100% kompatibel dengan Three.js.
