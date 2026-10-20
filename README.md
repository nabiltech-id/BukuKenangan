# Buku Kenangan Interaktif 3D (Studio Ghibli Edition)
**Octavia Nurrafendra Ramadhani — 23 October 2026**

Aplikasi buku cerita / *scrapbook* interaktif 3D dengan efek membalik halaman fisik (*3D page-turning*), membalik foto Polaroid 3D, animasi loading pembuka, dan kotak musik *Waltz* otomatis saat halaman dibuka.

---

## 1. Cara Menjalankan Project di Laptop (VS Code)

Pastikan di laptop sudah ter-install **Node.js** (versi 18 ke atas) dan **Git**.

1. **Ekstrak (Unzip)** file `buku-kenangan.zip`, lalu buka folder `buku-kenangan` di **VS Code**.
2. Buka **Terminal** di VS Code (`Ctrl + ~` atau menu `Terminal -> New Terminal`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan server lokal:
   ```bash
   npm run dev
   ```
5. Buka link yang muncul di terminal (biasanya `http://localhost:5173`) di browser.

---

## 2. Cara Mengedit Teks, Foto, atau Lagu

- **Edit Teks, Tanggal, & Isi Surat**:
  Buka file `src/data/storyData.js`, ubah teks di dalam tanda kutip (`"..."`), lalu tekan `Ctrl + S`.
- **Lokasi Foto**:
  - `public/foto/` berisi 6 ilustrasi bergaya Studio Ghibli (`sampul.jpg`, `awal-kenal.jpg`, `first-date.jpg`, `momen-1.jpg`, `momen-2.jpg`, `momen-3.jpg`) dan latar meja kayu (`ghibli-bg.jpg`).
  - `public/foto-asli/` berisi cadangan ke-6 foto asli sebelum diubah ke gaya Ghibli.
- **Mengganti Lagu Latar dengan MP3 Sendiri (Opsional)**:
  Taruh file lagu misalnya `lagu-kita.mp3` ke dalam folder `public/`, lalu isi `urlMp3: '/lagu-kita.mp3'` pada bagian `musik` di `src/data/storyData.js`.

---

## 3. Cara Push Project ke GitHub

1. Login ke [github.com](https://github.com) lalu klik tombol **`+` (New repository)** di pojok kanan atas.
2. Beri nama repository (misalnya: `buku-kenangan-octavia`), biarkan kosong (**jangan** centang *Add a README file*), lalu klik **Create repository**.
3. Kembali ke **Terminal VS Code** di dalam folder `buku-kenangan`, lalu jalankan perintah berikut satu per satu:

```bash
git init
git add .
git commit -m "Initial commit: Buku kenangan 3D Octavia Nurrafendra Ramadhani"
git branch -M main
git remote add origin https://github.com/USERNAME_KAMU/buku-kenangan-octavia.git
git push -u origin main
```
*(Ganti `USERNAME_KAMU` dan nama repo sesuai link repository GitHub yang kamu buat).*

---

## 4. Cara Deploy Gratis ke Vercel (Agar Bisa Dibuka Lewat Link HP/Laptop)

1. Buka [vercel.com](https://vercel.com) dan login menggunakan akun **GitHub** kamu.
2. Klik **Add New... -> Project**.
3. Pilih repository **`buku-kenangan-octavia`** lalu klik **Import**.
4. Langsung klik **Deploy** (pengaturan Vite sudah terdeteksi otomatis).
5. Dalam ~30 detik, kamu akan mendapatkan link (contoh: `https://buku-kenangan-octavia.vercel.app`) yang siap dikirimkan ke Octavia!
