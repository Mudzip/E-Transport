# 🚀 Panduan Deploy ke Vercel

## Langkah 1: Persiapan Backend

Karena backend menggunakan Prisma + SQLite, backend **harus di-deploy terpisah** ke:
- [Railway](https://railway.app) (Recommended)
- [Render](https://render.com)
- [Fly.io](https://fly.io)

> ⚠️ **Penting**: Ubah database dari SQLite ke PostgreSQL untuk production!

---

## Langkah 2: Deploy Frontend ke Vercel

### Opsi A: Deploy via Vercel Dashboard (Recommended)

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) dan login
3. Klik **"Add New Project"**
4. Import repository dari GitHub
5. Pada konfigurasi:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Tambahkan **Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api`
7. Klik **Deploy**

### Opsi B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Masuk ke folder frontend
cd frontend

# Login ke Vercel
vercel login

# Deploy
vercel

# Untuk production
vercel --prod
```

---

## Environment Variables di Vercel

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | URL backend API | `https://api.example.com/api` |

---

## Troubleshooting

### Error: API tidak bisa diakses
- Pastikan backend sudah di-deploy dan running
- Pastikan CORS di backend sudah mengizinkan domain Vercel
- Cek apakah `VITE_API_URL` sudah benar

### Error: Halaman 404 saat refresh
- File `vercel.json` sudah menghandle SPA routing
- Pastikan file ini ada di folder frontend
