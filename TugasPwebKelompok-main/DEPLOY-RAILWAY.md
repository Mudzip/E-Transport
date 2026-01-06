# 🚂 Panduan Deploy Backend ke Railway

## Langkah 1: Persiapan

✅ **Sudah dilakukan:**
- Database diubah dari SQLite → PostgreSQL
- CORS dikonfigurasi untuk production
- Script deploy ditambahkan

---

## Langkah 2: Buat Akun Railway

1. Buka [railway.app](https://railway.app)
2. Sign up dengan **GitHub** (recommended)

---

## Langkah 3: Deploy Backend

### A. Buat Project Baru
1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Connect dan pilih repository E-Transport
4. Railway akan detect folder root sebagai backend

### B. Tambah Database PostgreSQL
1. Dalam project, klik **"+ New"**
2. Pilih **"Database"** → **"PostgreSQL"**
3. Railway otomatis membuat `DATABASE_URL`

### C. Set Environment Variables
Di tab **Variables**, tambahkan:

| Variable | Value |
|----------|-------|
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |
| `DATABASE_URL` | *(otomatis dari PostgreSQL service)* |

### D. Deploy
1. Railway akan auto-deploy saat push ke GitHub
2. Tunggu build selesai (±2-3 menit)

---

## Langkah 4: Jalankan Database Migration

Setelah deploy berhasil, buka **Railway Shell** (atau local terminal):

```bash
# Push schema ke database
npx prisma db push

# Seed data (opsional)
npm run seed
```

---

## Langkah 5: Catat URL Backend

1. Buka tab **Settings** di Railway
2. Scroll ke **Domains**
3. Klik **Generate Domain**
4. Copy URL (contoh: `https://e-transport-production.up.railway.app`)

**Gunakan URL ini untuk `VITE_API_URL` di Vercel!**

---

## Ringkasan Flow Deploy

```
1. Push ke GitHub
         ↓
2. Railway auto-deploy backend
         ↓
3. Catat URL backend Railway
         ↓
4. Vercel → Set VITE_API_URL = URL backend + "/api"
         ↓
5. Railway → Set FRONTEND_URL = URL frontend Vercel
         ↓
✅ Selesai!
```

---

## Environment Variables Summary

### Railway (Backend)
| Variable | Example |
|----------|---------|
| `DATABASE_URL` | Auto dari PostgreSQL |
| `FRONTEND_URL` | `https://e-transport.vercel.app` |

### Vercel (Frontend)
| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://e-transport-api.up.railway.app/api` |
