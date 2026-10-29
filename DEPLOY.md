# 💗 Hosting Gratis di GitHub Pages — Panduan Lengkap

Website "Diraa & Pupaa — Our Little Universe" sudah dikonfigurasi untuk hosting **gratis** di GitHub Pages. Ikuti langkah-langkah di bawah ini.

---

## ⚠️ Yang perlu diketahui dulu

GitHub Pages itu **static hosting** — tidak ada server, tidak ada database. Jadi fitur-fitur yang tadinya pakai database sekarang pakai **localStorage browser**:

| Fitur | Cara kerja di GitHub Pages |
|---|---|
| Welcome, Hero, Story, Days, Gallery, Letter, Surprise, Footer | ✅ Jalan penuh, tidak berubah |
| Love Notes (tulis pesan) | ✅ Tersimpan di browser pengunjung (per-browser, tidak shared antar perangkat) |
| Admin editor (edit teks & foto) | ✅ Edit disimpan di browser kamu (per-browser). Edit di laptop tidak otomatis muncul di HP/hp Diraa. |
| Musik | ✅ Tambah via URL atau upload (upload dibatasi ~3MB untuk muat di localStorage) |
| Foto galeri/story | ✅ Upload foto (dibatasi ~1.5MB) atau paste URL gambar |

**Intinya:** situs romantisnya utuh dan keren. Yang berbeda: catatan & hasil edit admin tersimpan per-browser, bukan shared ke semua orang. Untuk gift ke Diraa, kamu (Pupaa) bisa edit di laptop/komputermu lalu tunjukkan ke Diraa di perangkat itu, atau backup edit-an kamu secara manual (lihat bagian "Membagikan edit-an ke Diraa" di bawah).

---

## 🚀 Cara deploy — 5 langkah

### 1. Buat repo baru di GitHub
- Masuk ke https://github.com/new
- Nama repo: bebas, misalnya `our-little-universe`
- Pilih **Public** (gratis untuk GitHub Pages)
- Jangan centang "Add a README" dulu
- Klik **Create repository**

### 2. Push kode ke repo
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

### 3. Aktifkan GitHub Pages lewat GitHub Actions
- Buka repo di GitHub → tab **Settings** → menu kiri **Pages**
- Bagian "Build and deployment" → **Source** = **GitHub Actions** (bukan "Deploy from a branch")

### 4. Tunggu build selesai
- Buka tab **Actions** di repo
- Workflow "Deploy to GitHub Pages" akan otomatis jalan saat kamu push
- Tunggu sampai ada tanda ✅ hijau (biasanya 1-2 menit)

### 5. Buka webnya!
Setelah workflow selesai:
- Repo → **Settings** → **Pages** → akan muncul link "Your site is live at https://...”
- URL-nya:
  - Kalau repo bernama `<username>.github.io` → `https://<username>.github.io/`
  - Kalau repo biasa → `https://<username>.github.io/<repo-name>/`

Selesai! 💗 Web kamu sudah live, gratis, selamanya.

---

## 🔑 Ganti password admin (PENTING!)

Default password admin = `ourlittleuniverse`. Ganti supaya orang tidak sembarang masuk editor:

1. Buka file `src/lib/storage.ts`
2. Cari baris: `export const ADMIN_PASSWORD = 'ourlittleuniverse';`
3. Ganti `ourlittleuniverse` dengan password rahasia kamu sendiri
4. Commit & push — build ulang akan otomatis jalan

> Catatan: password ini terlihat di source code (karena static hosting). Ini cuma gerbang halus supaya pengunjung biasa tidak masuk editor — bukan keamanan beneran. Untuk gift personal, sudah lebih dari cukup.

---

## 📸 Ganti foto & musik

### Foto galeri (default)
Foto bawaan ada di `public/images/gallery/photo-1.png` sampai `photo-6.png`. Cara ganti:
- Ganti file di folder itu dengan foto kamu sendiri (nama sama: `photo-1.png`, dst.)
- Atau lewat admin panel: login → tab **Gallery** → upload/paste URL → Save

### Musik
- Login admin → section Music → klik **"Add our song"**
- Pilih file audio (mp3/wav/ogg, maks ~3MB) **atau** paste URL lagu (misalnya dari link public)

### Foto story timeline
- Login admin → tab **Our Story** → upload/paste URL per momen

> Untuk foto besar atau lagu panjang: lebih baik upload dulu ke tempat lain (mis. Google Drive, Imgur, SoundCloud) lalu **paste URL-nya** di admin panel — begitu juga tidak memenuhi localStorage.

---

## 💝 Membagikan edit-an ke Diraa

Karena edit-an admin tersimpan per-browser, kalau kamu mau Diraa lihat hasil edit kamu di perangkatnya, ada 2 cara:

**Cara A (paling gampang):** Tunjukkan langsung di perangkat kamu. Edit di laptop/hp kamu, lalu ajak Diraa buka web di perangkat yang sama.

**Cara B (untuk gift permanen):** Edit di admin panel sampai puas, lalu "kunci" edit-an itu ke kode:
1. Buka DevTools browser (F12) → tab Application → Local Storage → cari key `diraa-pupaa:content`
2. Copy value JSON itu
3. Buka `src/config/loveConfig.ts`, ganti `defaultContent` / `LOVE_CONFIG` dengan nilai kamu
4. Commit & push — sekarang edit-an jadi bawaan situs, terlihat semua orang

Cara B ini juga bagus kalau kamu mau foto kamu sendiri jadi default (ganti file di `public/images/gallery/`).

---

## 🧪 Tes hasil build lokal (sebelum push)

Mau lihat hasil static-nya dulu sebelum push ke GitHub? Jalankan:

```bash
bun run build       # build ke folder ./out
bun run serve       # serve folder ./out di http://localhost:3000
```

Buka `http://localhost:3000` — itu versi yang sama persis dengan yang akan tampil di GitHub Pages.

---

## ❓ Troubleshooting

**Web tampil kosong / 404 di GitHub Pages**
- Pastikan repo Settings → Pages → Source = "GitHub Actions" (bukan "Deploy from a branch")
- Cek tab Actions — kalau workflow gagal, klik pesan error untuk detail

**Foto/music tidak muncul setelah upload di admin**
- localStorage penuh (~5MB). Upload foto lebih kecil, atau pakai URL gambar/lagu dari tempat lain

**Mau fitur database beneran (catatan shared antar perangkat)**
- Deploy ke Vercel gratis (https://vercel.com) — mendukung API routes + database
- Atau tambahkan backend gratis seperti Supabase (https://supabase.com) — butuh setup tambahan, tanya saja nanti kalau mau

---

💗 Selamat! Web hadiah anniversary kamu sekarang live di internet, gratis, selamanya. Beri tahu kalau ada yang ingin disesuaikan.
