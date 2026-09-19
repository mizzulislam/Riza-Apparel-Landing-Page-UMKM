# Panduan Operasional Portal Admin & CMS — RIZA APPAREL

Dokumen ini merupakan panduan lengkap pengelolaan situs web **RIZA APPAREL** melalui Portal Admin (`/#admin`).

---

## 1. Akses Portal Admin
- **URL Akses**: `https://rizaapparel.web.app/#admin` (atau `http://localhost:5173/#admin` saat pengembangan lokal)
- **Autentikasi**: Menggunakan Firebase Authentication (Email & Password).
- **Akun Default Admin**: `admin@rizaapparel.com`

---

## 2. Fitur & Modul Utama Portal Admin

### 📊 A. Ringkasan Dasbor & Kuota AI (UC18, UC19)
- **Status Kuota AI**: Menampilkan batas kuota harian Gemini 1.5 Flash (Batas Spark Rp 0: 15 Request / Menit, 1.500 Request / Hari).
- **Circuit Breaker Status**:
  - `normal`: Penggunaan aman di bawah 80%.
  - `approaching_limit`: Penggunaan mencapai 80-95%.
  - `quota_exceeded`: Penggunaan 100%. Fitur AI dialihkan secara otomatis ke tombol WhatsApp Admin.
- **Rincian Prospek & Pesanan**: Total prospek masuk, pesanan diproses, dan pesan belum dijawab.

---

### 📦 B. Kelola Katalog & Motif Heritage (UC16, UC17, FR-C1, FR-C3)
- **Tambah / Edit Produk**:
  - Judul Produk, Harga (Rp), Kategori, Deskripsi, Spesifikasi Bahan (Drifit Milano 160GSM).
  - Kompresi Gambar Otomatis: Setiap foto produk diunggah dikompresi di sisi klien menjadi format WebP berkualitas tinggi dengan ukuran <200KB (FR-C3).
- **Kelola Motif Budaya NTT (Ende Zawo & Flores Waves)**:
  - Setiap motif heritage Wajib menyantumkan field `atribusi_sumber` (Contoh: *"Motif Tenun Ikat Zawo Ende-Lio, NTT — Hak Cipta & Warisan Budaya Nusantara"*).
  - Kepatuhan Syarat R7: Tidak boleh mengklaim harga atau motif fiktif tanpa atribusi sumber budaya yang valid.

---

### 📥 C. CRM Prospek Masuk & Lead Capture (UC11, FR-B3, FR-E7)
- **Penyimpanan Prospek**: Menyimpan data calon pembeli dari Lead Capture Form.
- **Informasi Prospek**: Nama Lengkap, Nomor WhatsApp, Nama Tim / Instansi, Jumlah Pesanan (Pcs), Rincian Desain Terkait, serta Persetujuan Eksplisit UU PDP.
- **Tautan WhatsApp Langsung**: Klik tombol *"Hubungi via WA"* untuk membuka percakapan WhatsApp praterisi dengan menyantumkan rincian desain pelanggan.

---

### 🏷️ D. Tracking Status Pesanan & Token Unik Pelanggan (UC12, FR-E9)
- **Generator Token Unik**: Setiap pesanan baru mendapatkan 12-karakter token unik acak (Contoh: `RZ-98A2F4K1`).
- **Pelacakan Pelanggan**: Pelanggan dapat mengecek progress pesanan tanpa perlu login di `/#status-pesanan?token=RZ-98A2F4K1`.
- **Perubahan Status**: Admin dapat memperbarui tahapan pesanan:
  1. `Desain Disetujui`
  2. `Proses Sublimasi & Cetak`
  3. `Jahit & Finishing`
  4. `Siap Dikirim`
  5. `Selesai`

---

### 🧠 E. Knowledge Base & Log Pertanyaan Belum Terjawab (UC15, FR-E2)
- **Log AI Assistant**: Semua pertanyaan pengguna yang tidak dapat dijawab oleh AI Assistant akan masuk ke log `Pertanyaan Belum Terjawab`.
- **Tindakan Admin**: Admin dapat menambahkan jawaban resmi ke Knowledge Base Firestore agar AI Assistant lebih cerdas pada percakapan selanjutnya.

---

## 3. Prosedur Keamanan & Kepatuhan PDP (UU No. 27/2022)
- **Prinsip Kerahasiaan**: Data pribadi pelanggan (nama, nomor WA) hanya dapat diakses oleh Admin terautentikasi.
- **Penghapusan Data**: Admin wajib menghapus data prospek jika pelanggan mengajukan permohonan penarikan persetujuan sesuai UU PDP.
