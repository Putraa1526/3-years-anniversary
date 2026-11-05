# 💗 Hosting Gratis di Vercel — Panduan Lengkap

Website "Diraa & Pupaa — Our Little Universe" sudah dikonfigurasi untuk hosting **gratis** di Vercel. Vercel mendukung server + API routes + database, jadi **semua data tersimpan di server dan muncul di semua perangkat** — pesan dari laptop kamu langsung muncul di HP Diraa, dan edit-an admin kamu juga langsung terlihat semua orang.

---

## 🚀 Cara deploy — 5 langkah

### 1. Buat akun Vercel gratis
- Buka https://vercel.com/signup
- Sign up pakai **GitHub** (paling gampang) atau email
- Gratis selamanya untuk web pribadi

### 2. Push kode ke GitHub
Di terminal di folder proyek ini:
```bash
git init
git add .
git commit -m "Diraa & Pupaa — Our Little Universe 💗"
git branch -M main
git remote add origin https://github.com/<USERNAME-MU>/our-little-universe.git
git push -u origin main
```
Ganti `<USERNAME-MU>` dengan username GitHub kamu.

### 3. Import project di Vercel
- Login ke https://vercel.com/dashboard
- Klik **Add New** → **Project**
- Pilih repo `our-little-universe` dari daftar (atau klik "Import" → connect GitHub account dulu kalau belum)
- Vercel auto-detect Next.js — biarkan setting default
- Di bagian **Environment Variables**, tambahkan:
  - `ADMIN_PASSWORD` = password rahasia kamu (mis. `rahasia-diraa-2024`)
- Klik **Deploy**

### 4. Tunggu build selesai (1-2 menit)
- Vercel akan build + deploy otomatis
- Tunggu sampai ada confetti 🎉 dan tombol "Visit"

### 5. Buka webnya!
- Vercel kasih URL gratis seperti `our-little-universe-xxx.vercel.app`
- Buka, klik "Open Our World" ♡, lalu login admin (di footer → "Creator" → password kamu)
- Edit apa pun → **langsung tersimpan di server** → buka di HP/notebook lain → langsung kelihatan!

Selesai! Web kamu live gratis, data tersimpan permanen di server Vercel, muncul di semua perangkat. 💗

---

## 🔑 Ganti password admin

Di Vercel: **Settings** → **Environment Variables** → edit `ADMIN_PASSWORD` → **Redeploy**.

Lokal (development): edit `.env` → `ADMIN_PASSWORD=...` → restart dev server.

---

## 📸 Ganti foto, musik, dan semua teks

Semua bisa diedit **langsung dari website** lewat admin panel:
1. Buka web → scroll ke paling bawah (footer)
2. Klik tombol **"Creator"** (ikon gembok)
3. Masuk pakai password kamu
4. Panel editor terbuka dengan 7 tab: Brand & Hero, Days, Our Story, Gallery, Letter, Surprises, Footer
5. Upload foto, paste URL gambar/lagu, edit teks → klik **Save changes**
6. Perubahan **langsung tersimpan di server** dan muncul di semua perangkat yang buka web

### Foto galeri (default bawaan)
Foto bawaan ada di `public/images/gallery/photo-1.png` sampai `photo-6.png`. Ganti file di folder itu dengan foto kamu sendiri (nama sama), lalu commit & push — Vercel akan auto-rebuild.

### Musik
Login admin → section Music → klik **"Add our song"** → upload file (maks 25MB) atau paste URL lagu.

---

## 📱 Kenapa Vercel cocok untuk hadiah ke Diraa

| Aksi | Hasilnya |
|---|---|
| Kamu tulis pesan dari laptop | ✅ **Muncul di HP Diraa** (di server, shared) |
| Kamu edit surat/foto dari laptop | ✅ **Muncul di HP Diraa** |
| Kamu tambah lagu dari laptop | ✅ **Muncul di semua perangkat** |
| Diraa clear cache / ganti browser | ✅ **Data tetap ada** (di server) |
| Kapan pun web dibuka | ✅ **Selalu lihat data terbaru** |

Database-nya SQLite, file kecil (`db/custom.db`), cukup untuk hadiah pribadi. Kalau nanti butuh lebih besar (ribuan catatan), tinggal upgrade ke Supabase (gratis juga) — tanya saja nanti.

---

## 🧪 Tes lokal sebelum deploy

```bash
bun run dev      # jalan di http://localhost:3000
bun run lint     # cek kode
bun run db:push  # sinkronisasi schema database
```

---

## ❓ Troubleshooting

**Build gagal di Vercel**
- Cek tab "Build Logs" di Vercel untuk error detail
- Pastikan `ADMIN_PASSWORD` sudah di-set di Environment Variables

**Web live tapi data tidak muncul / API 500**
- Pastikan `bun run db:push` sudah dijalankan (kalau deploy manual)
- Di Vercel, database file auto-create saat pertama kali API dipanggil — tunggu 30 detik lalu refresh

**Mau pindah dari GitHub Pages ke Vercel**
- Vercel lebih cocok untuk web ini (karena butuh server + database)
- Kalau sebelumnya sudah deploy ke GitHub Pages, tinggal import repo yang sama ke Vercel — selesai

**Mau fitur lebih besar (login user, upload video, dll)**
- Vercel tetap gratis untuk fitur-fitur itu, tinggal tambah kodenya
- Atau tambah Supabase (gratis) untuk database besar — tanya nanti kalau mau

---

💗 Selamat! Web hadiah anniversary kamu sekarang live di internet, gratis, data tersimpan permanen, dan bisa dilihat Diraa dari mana saja. Beri tahu kalau ada yang ingin disesuaikan.
