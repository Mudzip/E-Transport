# 🎨 Panduan Kustomisasi Tema E-Transport

## Cara Mengubah Tampilan

Untuk mengubah warna dan tampilan UI, **edit file `theme-config.css`** di folder ini.

---

## Contoh Perubahan Warna

### Mengubah Warna Utama (Header, Tombol)

Cari bagian `WARNA UTAMA (PRIMARY)` dan ubah nilai hex:

```css
/* Contoh: Ubah ke warna hijau */
--primary-500: #22c55e;  /* Warna utama */
--primary-600: #16a34a;  /* Hover */
--primary-700: #15803d;  /* Active */
```

### Mengubah Warna Harga/Aksen

Cari bagian `WARNA AKSEN (ACCENT)`:

```css
/* Contoh: Ubah ke warna merah */
--accent-500: #ef4444;
--accent-600: #dc2626;
```

---

## Tips

1. **Gunakan color palette generator** seperti [coolors.co](https://coolors.co) untuk mendapatkan warna yang harmonis
2. **Pastikan kontras cukup** antara teks dan background untuk readability
3. **Test di berbagai device** setelah mengubah warna

---

## Referensi Warna Populer

| Warna | Primary-500 | Primary-600 | Primary-700 |
|-------|-------------|-------------|-------------|
| Biru  | `#0ea5e9`   | `#0284c7`   | `#0369a1`   |
| Hijau | `#22c55e`   | `#16a34a`   | `#15803d`   |
| Ungu  | `#a855f7`   | `#9333ea`   | `#7e22ce`   |
| Merah | `#ef4444`   | `#dc2626`   | `#b91c1c`   |
| Pink  | `#ec4899`   | `#db2777`   | `#be185d`   |
