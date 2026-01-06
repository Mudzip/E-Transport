# Panduan Deployment ke Vercel

Karena struktur folder project ini memiliki frontend di dalam folder `frontend`, Anda perlu mengatur **Root Directory** saat deploy di Vercel.

## Langkah-langkah:

1. **Buka Dashboard Vercel**: Masuk ke [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. **Add New Project**: Klik "Add New..." -> "Project" dan import repository `E-Transport`.
3. **Configure Project**:
   - Di halaman konfigurasi "Import Project":
   - Cari bagian **"Root Directory"**.
   - Klik **Edit**.
   - Pilih folder `TugasPwebKelompok-main` lalu pilih `frontend`.
   - Path akhirnya harus mengarah ke tempat file `package.json` frontend berada.
   - Contoh: `TugasPwebKelompok-main/frontend`

4. **Framework Preset**:
   - Vercel seharusnya otomatis mendeteksi **Vite**. Jika tidak, pilih "Vite" secara manual.

5. **Build & Output Settings**:
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)

6. **Environment Variables**:
   - Jika ada environment variables (seperti `VITE_API_URL`), masukkan di bagian ini.

7. **Deploy**: Klik tombol Deploy.

## Kenapa Error Sebelumnya?
Kemungkinan besar Vercel mencoba men-deploy dari root folder (luar), padahal kode frontend ada di dalam folder `frontend`. File `package.json` di root adalah untuk backend dan tidak memiliki perintah `build` untuk frontend.
