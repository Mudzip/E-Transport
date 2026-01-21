# E-Transport - Setup Guide

## 🏠 Development Lokal (SQLite)

### Backend
```bash
cd TugasPwebKelompok-main

# 1. Install dependencies
npm install

# 2. Setup environment variable untuk SQLite
# Ganti DATABASE_URL di .env menjadi:
DATABASE_URL="file:./dev.db"

# 3. Push schema dan seed database
npx prisma db push
npm run seed

# 4. Jalankan server
npm run dev
```

### Frontend  
```bash
cd TugasPwebKelompok-main/frontend

# 1. Install dependencies
npm install

# 2. Setup environment (opsional untuk lokal)
cp .env.example .env
# VITE_API_URL sudah default ke http://localhost:3000/api

# 3. Jalankan dev server
npm run dev
```

Buka `http://localhost:5173`

---



### Vercel (Frontend)
1. Buat project di [Vercel](https://vercel.com)
2. Import repository
3. **PENTING**: Set **Root Directory** ke `TugasPwebKelompok-main/frontend`
4. Framework: Vite (auto-detect)
5. Set environment variable:
   - `VITE_API_URL`: URL backend + `/api` (contoh: `https://api.your-domain.com/api`)

---

## 🔄 Switching Database

File `prisma/schema.prisma` saat ini set ke **PostgreSQL** untuk production.

**Untuk development lokal dengan SQLite:**
1. Ubah sementara `provider = "postgresql"` → `provider = "sqlite"` di `schema.prisma`
2. Atau gunakan `schema.local.prisma` yang sudah saya sediakan

**PENTING**: Jangan lupa kembalikan ke PostgreSQL jika ingin deploy ke production yang menggunakan PostgreSQL!
