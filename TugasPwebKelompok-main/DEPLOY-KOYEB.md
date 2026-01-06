# 🚀 Panduan Deploy Backend ke Koyeb (100% GRATIS)

Koyeb gratis tanpa credit card! Tapi Koyeb tidak punya database built-in, jadi kita pakai **Neon** (PostgreSQL gratis).

---

## PART A: Buat Database PostgreSQL di Neon

### Step 1: Buat Akun Neon
1. Buka [neon.tech](https://neon.tech)
2. Klik **Sign Up** → Login dengan **GitHub** (gratis, tanpa credit card)

### Step 2: Buat Project & Database
1. Klik **Create Project**
2. Isi:
   - **Project name**: `e-transport`
   - **Region**: Singapore (atau terdekat)
3. Klik **Create Project**

### Step 3: Copy Connection String
1. Setelah project dibuat, akan muncul **Connection Details**
2. Copy **Connection string** (yang mulai dengan `postgresql://...`)
3. **SIMPAN INI!** Akan dipakai untuk Koyeb nanti

Format seperti ini:
```
postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

---

## PART B: Deploy Backend ke Koyeb

### Step 1: Buat Akun Koyeb
1. Buka [koyeb.com](https://www.koyeb.com)
2. Klik **Get Started Free**
3. Sign up dengan **GitHub**

### Step 2: Create New App
1. Di dashboard, klik **Create App**
2. Pilih **GitHub** sebagai deployment source
3. Connect dan authorize GitHub
4. Pilih repository **E-Transport**

### Step 3: Configure Service
1. **Service name**: `e-transport-api`
2. **Branch**: `main`
3. **Root directory**: `TugasPwebKelompok-main`
4. **Builder**: Buildpack (auto-detect Node.js)
5. **Build command**: `npm install && npx prisma generate`
6. **Run command**: `npx prisma db push && node prisma/seed.js && node src/server.js`
7. **Port**: `3000`

### Step 4: Set Environment Variables
Klik **Environment variables** → Add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | (Paste connection string dari Neon) |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

### Step 5: Deploy
1. Klik **Deploy**
2. Tunggu build selesai (~5 menit)
3. Status harus **Healthy** (hijau)

### Step 6: Test API
Koyeb akan memberikan URL seperti:
`https://e-transport-api-xxx.koyeb.app`

Buka di browser:
```
https://e-transport-api-xxx.koyeb.app/api/stations
```

Jika muncul JSON = SUKSES! 🎉

---

## PART C: Deploy Frontend ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Import repository
3. **Root Directory**: `TugasPwebKelompok-main/frontend`
4. **Environment Variable**:
   - `VITE_API_URL` = `https://e-transport-api-xxx.koyeb.app/api`
5. Deploy!

---

## Troubleshooting

### Error "prisma: command not found"
Pastikan build command: `npm install && npx prisma generate`

### Error database connection
Pastikan `?sslmode=require` ada di akhir DATABASE_URL

### App tidak jalan
Cek logs di Koyeb dashboard untuk detail error
