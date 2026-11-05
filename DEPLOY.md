# 💗 Hosting Gratis di Vercel + Turso — Panduan Lengkap

Website "Diraa & Pupaa — Our Little Universe" sudah dikonfigurasi untuk hosting **gratis** di Vercel + Turso. Vercel jalanin server/API routes, Turso jadi database SQLite cloud (gratis) supaya **semua data tersimpan permanen dan muncul di semua perangkat** — pesan dari laptop kamu langsung muncul di HP Diraa, dan edit-an admin kamu juga langsung terlihat semua orang.

> ⚠️ **Kenapa butuh Turso?** Vercel serverless punya filesystem **ephemeral** (read-only) — SQLite file biasa tidak bisa persist writes di sana. Turso menyelesaikan ini dengan database SQLite yang jalan di cloud (gratis untuk web pribadi).

---

## 🚀 Cara Deploy — 7 langkah

### Langkah 1: Buat akun Vercel gratis
- Buka https://vercel.com/signup
- Sign up pakai **GitHub** (paling gampang)

### Langkah 2: Buat database Turso gratis
- Buka https://turso.tech → Sign up (pakai GitHub)
- Setelah login, klik **"New database"**
- Nama: `diraa-pupaa` (atau apa pun)
- Group/location: pilih yang terdekat (mis. Singapore `sin`)
- Klik **Create**
- Setelah jadi, klik database itu → tab **"Settings"** → scroll ke "Library URL" → copy URL `libsql://diraa-pupaa-xxx.turso.io`
- Di tab yang sama, cari **"Auth Tokens"** → klik **"Create auth token"** → copy token (mulai `eyJ...`)

Simpan kedua nilai itu (`DATABASE_URL` dan `TURSO_AUTH_TOKEN`) — kita butuh di Langkah 5.

### Langkah 3: Push kode ke GitHub
(Kalau sudah pernah push, lewati langkah ini.) Di terminal di folder proyek ini:
```bash
git push -u origin main
```

### Langkah 4: Import project di Vercel
- Login ke https://vercel.com/dashboard
- Klik **Add New** → **Project**
- Pilih repo kamu (mis. `3-years-anniversary`) → klik **Import**

### Langkah 5: Set Environment Variables (PENTING!)
Di halaman import Vercel, scroll ke bagian **"Environment Variables"**, klik **Add** dan tambahkan 3 variabel ini:

| Name | Value | Wajib? |
|---|---|---|
| `DATABASE_URL` | `libsql://diraa-pupaa-xxx.turso.io` (URL dari Langkah 2) | ✅ |
| `TURSO_AUTH_TOKEN` | `eyJ...` (token dari Langkah 2) | ✅ |
| `ADMIN_PASSWORD` | password rahasia kamu, mis. `rahasia-diraa-2024` | ✅ |

Klik **Add** untuk setiap variabel.

### Langkah 6: Deploy!
- Klik tombol biru besar **"Deploy"**
- Tunggu 1-2 menit (build + deploy)
- Kalau berhasil, ada confetti 🎉 dan tombol **"Visit"**

### Langkah 7: Inisialisasi schema database di Turso
⚠️ **PENTING:** Database Turso baru kosong. Kamu harus bikin tabelnya sekali. Ada 2 cara:

**Cara A (paling gampang) — pakai Turso CLI lokal:**
```bash
# Install Turso CLI (sekali saja):
# macOS/Linux:
curl -sSfL https://get.tur.so/install.sh | bash
# atau pakai bun:
bunx turso

# Login (akan buka browser):
bunx turso auth login

# Apply schema ke database kamu:
DATABASE_URL="libsql://diraa-pupaa-xxx.turso.io" TURSO_AUTH_TOKEN="eyJ..." bunx prisma db push
```

**Cara B — lewat web Turso:**
- Buka database kamu di https://turso.tech → klik tab **"SQL"**
- Paste SQL dari file `prisma/schema.sql` (bikin dulu: `bunx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/schema.sql`)
- Klik **Run**

### Langkah 8: Buka web-nya!
- Vercel kasih URL seperti `3-years-anniversary-xxx.vercel.app`
- Buka → klik "Open Our World" ♡
- Login admin: scroll ke bawah → klik **"Creator"** → masuk pakai password yang kamu set di Langkah 5
- Edit apa pun → **langsung tersimpan di database Turso** → muncul di semua perangkat!

Selesai! Web live gratis, data tersimpan permanen di cloud, muncul di semua perangkat. 💗

---

## 🎯 Cara deploy ulang (kalau ada perubahan kode)

Setelah kamu set up sekali (Langkah 1-8), untuk update kode:

1. Edit kode di sini
2. Saya commit + push ke GitHub untuk kamu
3. Vercel **auto-redeploy** — tunggu 1-2 menit, web update otomatis

(Tidak perlu ulang Langkah 1-8. Cukup push ke GitHub, sisanya otomatis.)

---

## 🔑 Ganti password admin

Di Vercel: **Settings** → **Environment Variables** → edit `ADMIN_PASSWORD` → **Redeploy**.

---

## 📸 Edit foto, musik, dan semua teks

Semua bisa diedit **langsung dari website** lewat admin panel:
1. Buka web → scroll ke paling bawah (footer)
2. Klik tombol **"Creator"** (ikon gembok)
3. Masuk pakai password kamu
4. Panel editor terbuka dengan 7 tab: Brand & Hero, Days, Our Story, Gallery, Letter, Surprises, Footer
5. Upload foto, paste URL gambar/lagu, edit teks → klik **Save changes**
6. Perubahan **langsung tersimpan di Turso** dan muncul di semua perangkat

---

## 📱 Kenapa Vercel + Turso cocok untuk hadiah ke Diraa

| Aksi | Hasilnya |
|---|---|
| Kamu tulis pesan dari laptop | ✅ **Muncul di HP Diraa** (di database cloud) |
| Kamu edit surat/foto dari laptop | ✅ **Muncul di HP Diraa** |
| Kamu tambah lagu dari laptop | ✅ **Muncul di semua perangkat** |
| Diraa clear cache / ganti browser | ✅ **Data tetap ada** (di Turso cloud) |
| Kapan pun web dibuka | ✅ **Selalu lihat data terbaru** |

Turso free tier: 500 database, 9GB total storage, 1 billion row reads/bulan — **lebih dari cukup** untuk hadiah pribadi. Gratis selamanya untuk web pribadi.

---

## 🧪 Tes lokal sebelum deploy

```bash
bun run dev      # jalan di http://localhost:3000 (pakai SQLite lokal)
bun run lint     # cek kode
bun run db:push  # sinkronisasi schema database lokal
```

Lokal pakai SQLite file (`db/custom.db`) — tidak butuh Turso.

---

## ❓ Troubleshooting

**"Save admin tidak berhasil" / data tidak muncul di Vercel**
- Pastikan `DATABASE_URL` di Vercel = `libsql://...` (bukan `file:...`)
- Pastikan `TURSO_AUTH_TOKEN` sudah di-set
- Pastikan schema sudah di-init di Turso (Langkah 7)
- Cek tab **Logs** di Vercel untuk error detail

**Build gagal di Vercel**
- Cek tab "Build Logs" untuk error detail
- Pastikan semua 3 env vars sudah di-set dengan benar

**Mau ganti dari GitHub Pages ke Vercel**
- Vercel lebih cocok untuk web ini (butuh server + database)
- Tinggal import repo yang sama ke Vercel, ikuti langkah-langkah di atas

**Mau fitur lebih besar (login user, upload video, dll)**
- Vercel + Turso tetap gratis untuk fitur-fitur itu, tinggal tambah kodenya

---

💗 Selamat! Web hadiah anniversary kamu sekarang live di internet, gratis, data tersimpan permanen di cloud Turso, dan bisa dilihat Diraa dari mana saja. Beri tahu kalau ada yang ingin disesuaikan.
