# 🚀 Panduan Deploy Backend ke Render.com

## Step 1: Buat Akun Render
1. Buka [render.com](https://render.com)
2. Klik **Get Started for Free**
3. Sign up dengan **GitHub** (recommended)

---

## Step 2: Buat PostgreSQL Database
1. Di dashboard Render, klik **New +** → **PostgreSQL**
2. Isi:
   - **Name**: `e-transport-db`
   - **Region**: Singapore (atau yang terdekat)
   - **Plan**: Free
3. Klik **Create Database**
4. Tunggu sampai status **Available**
5. **PENTING**: Copy **External Database URL** (akan dipakai nanti)

---

## Step 3: Buat Web Service (Backend API)
1. Klik **New +** → **Web Service**
2. Pilih **Build and deploy from a Git repository** → **Next**
3. Connect GitHub dan pilih repository **E-Transport**
4. Isi konfigurasi:
   - **Name**: `e-transport-api`
   - **Region**: Singapore (sama dengan database)
   - **Branch**: `main`
   - **Root Directory**: `TugasPwebKelompok-main`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npx prisma db push && node prisma/seed.js && node src/server.js`
   - **Plan**: Free

5. Scroll ke **Environment Variables**, tambahkan:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | (Paste External Database URL dari Step 2) |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` (update nanti) |
   | `NODE_ENV` | `production` |

6. Klik **Create Web Service**

---

## Step 4: Tunggu Deploy Selesai
- Render akan build dan deploy otomatis
- Proses pertama kali ~5-10 menit
- Status harus menjadi **Live** (hijau)

---

## Step 5: Test API
Buka URL Render + `/api/stations`:
```
https://e-transport-api.onrender.com/api/stations
```

Jika muncul JSON data stasiun, backend **SUKSES**! 🎉

---

## Step 6: Deploy Frontend ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Import repository E-Transport
3. Set **Root Directory**: `TugasPwebKelompok-main/frontend`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://e-transport-api.onrender.com/api`
5. Deploy!

---

## Step 7: Update FRONTEND_URL di Render
Setelah Vercel deploy selesai:
1. Buka Render → Web Service → Environment
2. Update `FRONTEND_URL` dengan URL Vercel yang baru
3. Redeploy
