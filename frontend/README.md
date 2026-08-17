# Frontend Web App - PT. Trans Berjaya Khatulistiwa

Aplikasi antarmuka web modern untuk Sistem Manajemen Keuangan dan Laporan Laba Rugi PT. Trans Berjaya Khatulistiwa. Dibangun menggunakan **Nuxt 4**, **Vue 3**, **Pinia**, **Tailwind CSS**, dan **Lucide Icons**.

## 🛠️ Stack Teknologi & Arsitektur

- **Runtime**: Node.js 22.x
- **Framework**: Nuxt 4.x / Vue 3.5
- **State Management**: Pinia (`@pinia/nuxt`)
  - `useCoaStore`: Caching data master COA & Kategori untuk efisiensi API call
  - `useTransactionStore`: Pengelolaan state transaksi, pagination dinamis, multi-filter, dan metrik keuangan
  - `useThemeStore`: Pengelolaan tema Dark/Light mode dengan persistensi `localStorage`
- **Styling & Theme**: Tailwind CSS 3.4 (`darkMode: 'class'`) & Custom Glassmorphism CSS
- **Icons**: Lucide Vue Next
- **HTTP Client**: Axios dengan Interceptor & Error Handling terpusat
- **Utilities**: VueUse

## 🌟 Fitur Utama Frontend

- **Executive Financial Dashboard**: Ringkasan KPI, Grafik arus kas bulanan, breakdown biaya per kategori, dan transaksi terkini.
- **Master COA & Kategori**: Manajemen akun keuangan, filter, dan modal interaktif terintegrasi Pinia.
- **Transaksi Keuangan**: Pencatatan mutasi Debit/Credit dengan kalkulasi metrik *real-time*.
- **Laporan Laba Rugi**: Matriks performa keuangan dengan fitur ekspor Excel (.xlsx/.csv) & cetak PDF.
- **Dark / Light Mode**: Pengalihan tema instan melalui tombol switch di topbar dengan penyimpanan preferensi pengguna.

## 🚀 Menjalankan Frontend

### Menggunakan Docker Compose (Direkomendasikan)

Dari direktori root proyek:

```bash
docker compose up --build
```

### Menjalankan Secara Lokal (Manual)

1. Pastikan backend API sudah berjalan pada `http://localhost:8000`.
2. Install dependensi:
   ```bash
   npm install
   # atau
   yarn install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

Aplikasi frontend dapat diakses di `http://localhost:3000`.

Untuk dokumentasi lengkap arsitektur dan panduan proyek, silakan merujuk ke [README Utama](../README.md).
