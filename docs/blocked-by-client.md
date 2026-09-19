# Blocked by Client Tracker — Riza Apparel Web

> **Daftar pelacakan item yang membutuhkan konfirmasi / input materi dari klien (Riza Apparel)**
> **Tanggal pembaruan:** 19 September 2026
> **Referensi:** PRD §12 (Pertanyaan Terbuka untuk Klien), Super Prompt §9

---

## Tabel Item Tertunda (Client Dependency Matrix)

| No | Item / Input Terbuka | FR / UC Terdampak | Dampak Jika Tertunda | Strategi Mitigasi Teknis (Default / Fallback) | Status |
|---|---|---|---|---|---|
| 1 | **Struktur & Tarif Harga Aktual**: per jenis bahan (Milano, Serena, Waffle), tingkat kompleksitas, dan tingkatan kuantitas pesanan. | FR-B4, UC3 (Estimator Harga) | Estimator harga tidak dapat menampilkan angka pasti kepada calon pelanggan. | Fitur dibangun berbasis konfigurasi tabel tarif di CMS Admin. Sebelum data disetujui, fitur diletakkan di balik *feature flag* (tidak tayang publik). | ⏳ Menunggu Klien |
| 2 | **Spesifikasi Teknis Mesin Sublimasi**: resolusi cetak (DPI), margin bleed (mm), kelonggaran jahitan, dan profil warna (CMYK/RGB). | FR-D4, UC7 (Ekspor Siap Cetak) | Berkas ekspor bisa jadi tidak presisi saat dicetak di mesin produksi klien. | Parameter bleed & DPI dibangun sebagai variabel konfigurasi dengan nilai awal `[PLACEHOLDER — Bleed 10mm, 150 DPI]`. | ⏳ Menunggu Klien |
| 3 | **Materi Tambahan Knowledge Base**: daftar 10-20 pertanyaan & jawaban yang sering ditanyakan pembeli riil di Ende/NTT. | FR-E1, FR-E2, UC14 (Chatbot KB) | Jawaban chatbot kurang mencakup kasus khusus pemesanan lokal. | Memakai materi awal FAQ MVP (5 item di `FAQ_DATA`) dan memasang pencatatan *"pertanyaan belum terjawab"* ke Firestore. | ⏳ Menunggu Klien |
| 4 | **Aset Foto Portofolio & Testimoni Asli**: foto pesanan tim terdahulu beresolusi tinggi & kutipan testimoni otentik. | FR-B5, UC2 (Sinyal Kepercayaan) | Bagian portofolio menggunakan sampel awal. | Menyediakan modul CMS Portofolio & Testimoni agar foto dapat diunggah pemilik kapan saja secara mandiri. | ⏳ Menunggu Klien |
| 5 | **Sumber & Atribusi Motif Kebudayaan**: kepastian lisensi/hak guna dan kalimat atribusi resmi untuk motif *Ende Diamond Zawo* & *Flores Ocean Waves*. | FR-C2, UC17 (Pustaka Motif) | Risiko klaim hak cipta / kesalahpahaman kebudayaan lokal. | Menambahkan kolom `atribusi_sumber` di Firestore CMS yang wajib diisi admin sebelum motif diaktifkan ke publik. | ⏳ Menunggu Klien |

---

## Kuesioner Ringkas untuk Klien (Draft Input Client)

1. *Struktur Harga*: Berapa tarif jersey futsal/sepakbola per pcs untuk pesanan 1-5 pcs, 6-12 pcs, dan >12 pcs?
2. *Spesifikasi Cetak*: Berapa milimeter kelonggaran lipatan jahitan (bleed) yang dibutuhkan tim produksi saat mencetak pola kertas sublimasi?
3. *Foto Produk*: Mohon kirimkan 5-10 foto jersey hasil cetak tim lokal Ende yang sudah pernah diproduksi untuk dipajang di galeri portofolio.
