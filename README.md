# PT. Trans Berjaya Khatulistiwa - Financial Management System

[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white)](https://nuxt.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-ffd859?style=for-the-badge&logo=vuedotjs&logoColor=black)](https://pinia.vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

Sistem Informasi Manajemen Keuangan dan Pelaporan Laba Rugi (*Profit and Loss Statement*) terpadu untuk **PT. Trans Berjaya Khatulistiwa**. Dibangun dengan arsitektur modern berbasis RESTful API (Laravel + PostgreSQL) dan antarmuka web SPA/SSR yang responsif, elegan, dan interaktif (Nuxt + Pinia + Tailwind CSS).

---

## 🌟 Fitur Utama

- **📊 Executive Financial Dashboard**:
  - Kartu ringkasan KPI (*Total Income*, *Total Expense*, *Net Income*, & *Margin Laba Bersih*).
  - Grafik batang tren bulanan adaptif dan interaktif (*Monthly Cash Flow Comparison*).
  - Distribusi alokasi biaya per kategori master.
  - Widget transaksi terkini dengan pratinjau instan.
- **📁 Master Kategori Akun**:
  - Manajemen pengelompokan akun pemasukan (*Income*) dan pengeluaran operasional (*Expense*).
  - Visual filter tab (*All*, *Income*, *Expense*) & indikator jumlah sub-COA terdaftar.
- **📖 Master Chart of Account (COA)**:
  - Pemetaan kode akun keuangan (misal: `401 - Gaji Karyawan`, `601 - Biaya Sekolah`, dsb).
  - Pencarian ganda (*kode* / *nama*) & filter berdasarkan kategori master.
- **🔄 Catatan Transaksi Keuangan**:
  - Pencatatan mutasi Debit (*Pengeluaran*) dan Credit (*Pemasukan*).
  - Filter multi-parameter: Kata kunci, akun COA, dan rentang tanggal (*Date Range*).
  - *Realtime Metric Bar*: Kalkulasi otomatis total Debit, Credit, dan Selisih Bersih saat memfilter data.
  - Modal form dengan validasi dan pratinjau nominal Rupiah *real-time*.
- **📑 Laporan Profit & Loss (Laba Rugi)**:
  - Rekapitulasi matriks pendapatan vs biaya operasional per bulan (Q1 2022).
  - *Sticky Category Column*: Kolom nama kategori tetap terkunci di sisi kiri saat digeser horizontal pada layar HP / tablet.
  - Fitur **Export Excel (.xlsx / .csv)** dan **Cetak PDF**.
- **⚡ State Management & Caching (Pinia)**:
  - **`useCoaStore`**: Sentralisasi data COA & Kategori dengan mekanisme *smart-caching*, mencegah redudansi *API request* antar navigasi halaman.
  - **`useThemeStore`**: Pengelolaan state tema reaktif dengan *localStorage persistence*.
- **🌓 Mode Gelap & Mode Terang (Dark / Light Mode)**:
  - Pengalihan tema instan (Dark / Light) dengan transisi visual halus.
  - Persistensi preferensi tema tersimpan otomatis di *localStorage*.
- **💎 UI/UX & Desain Responsif**:
  - Desain *Dark/Light Glassmorphism* modern dengan tipografi *Plus Jakarta Sans*.
  - *Floating Toast Notification System* & Modal konfirmasi kustom.
  - 100% responsif (tampilan tabel di desktop dan kartu interaktif di mobile).

---

## 🏗️ Struktur Proyek

```text
PT. Trans Berjaya Khatulistiwa/
├── backend/                  # Laravel 13 REST API Application
│   ├── app/                  # Controllers, Models, Requests
│   ├── database/             # Migrations & Seeders (FY 2022 sample data)
│   ├── routes/api.php        # API Endpoints
│   ├── Dockerfile            # PHP 8.3 & Composer Docker image
│   └── docker-entrypoint.sh  # Auto DB wait, migration & seeder runner
├── frontend/                 # Nuxt 4 Frontend Web Application
│   ├── app/
│   │   ├── assets/css/       # Custom scrollbars, glass tokens, Dark/Light CSS
│   │   ├── components/       # AppToast, AppConfirmModal
│   │   ├── composables/      # useApi, useToast, formatRupiah
│   │   ├── layouts/          # Responsive Sidebar & Topbar Header (Theme Toggle)
│   │   ├── pages/            # Dashboard, Categories, COAs, Transactions, Reports
│   │   └── stores/           # Pinia Stores (coa.ts, theme.ts)
│   ├── Dockerfile            # Node.js 20 & Nuxt runner
│   └── nuxt.config.ts        # Nuxt Configuration
├── docker-compose.yml        # Orchestration (PostgreSQL + Backend + Frontend)
└── README.md                 # Dokumentasi Proyek
```

---

## 🚀 Menjalankan Aplikasi dengan Docker (Rekomendasi)

Hanya memerlukan **1 perintah** untuk menjalankan seluruh stack (Database, Backend API, dan Frontend):

### 1. Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) telah terpasang dan berjalan di komputer Anda.

### 2. Jalankan Container
Buka terminal pada direktori root proyek dan jalankan:

```bash
docker compose up --build
```

*(Atau jalankan di background dengan `docker compose up --build -d`)*

### 3. Akses Aplikasi
- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:8000/api](http://localhost:8000/api)
- **Database PostgreSQL**: `localhost:5432` (`db_tbk`, user: `postgres`, pass: `password123!`)

> [!TIP]
> **Otomatisasi Database & Tabel pada Docker**:
> Ketika Anda menjalankan `docker compose up`, container PostgreSQL akan **otomatis membuat database `db_tbk`**, lalu script `docker-entrypoint.sh` akan **otomatis menjalankan migrasi tabel** dan mengisi seluruh **data awal (*seeders*)** tanpa perlu setup manual.

### 4. Menghentikan Container
```bash
docker compose down
```
*(Tambahkan `-v` jika ingin menghapus volume data database: `docker compose down -v`)*

---

## 🗄️ Inisialisasi Database & Tabel

### A. Melalui Docker (100% Otomatis)
- Tidak perlu membuat database atau menjalankan migrasi manual. Script docker secara otomatis menangani:
  1. Menunggu database PostgreSQL online.
  2. Menjalankan `php artisan migrate --force`.
  3. Menjalankan `php artisan db:seed --force`.

### B. Melalui Manual Local
- Buat database `db_tbk` di PostgreSQL lokal:
  ```sql
  CREATE DATABASE db_tbk;
  ```
- Jalankan migrasi dan seeder tabel:
  ```bash
  php artisan migrate --seed
  ```


---

## 🛠️ Menjalankan Secara Manual (Tanpa Docker)

Jika ingin menjalankan service secara terpisah di lingkungan lokal:

### A. Backend (Laravel & PostgreSQL)

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Pastikan dependensi PHP terinstall:
   ```bash
   composer install
   ```
3. Salin file `.env` dan atur konfigurasi database PostgreSQL:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Sesuaikan konfigurasi database pada `.env`:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=db_tbk
   DB_USERNAME=postgres
   DB_PASSWORD=password123!
   ```
5. Jalankan migrasi dan seeding data:
   ```bash
   php artisan migrate --seed
   ```
6. Jalankan server backend:
   ```bash
   php artisan serve --port=8000
   ```

### B. Frontend (Nuxt & Vue 3)

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Install dependensi Node.js:
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
4. Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📋 Daftar Endpoint API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Statistik KPI ringkasan eksekutif, tren grafik bulanan, dan transaksi terbaru |
| `GET` | `/api/categories` | Mengambil seluruh daftar master kategori akun |
| `POST` | `/api/categories` | Membuat kategori baru (`name`, `type: income/expense`) |
| `PUT` | `/api/categories/{id}` | Memperbarui data kategori |
| `DELETE` | `/api/categories/{id}` | Menghapus kategori |
| `GET` | `/api/coas` | Mengambil seluruh daftar Chart of Accounts (COA) beserta relasi kategori |
| `POST` | `/api/coas` | Menambahkan COA baru (`code`, `name`, `category_id`) |
| `PUT` | `/api/coas/{id}` | Memperbarui data COA |
| `DELETE` | `/api/coas/{id}` | Menghapus data COA |
| `GET` | `/api/transactions` | Mengambil data transaksi (mendukung query filter `search`, `coa_id`, `start_date`, `end_date`) |
| `POST` | `/api/transactions` | Mencatat transaksi baru (`date`, `coa_id`, `description`, `debit`, `credit`) |
| `PUT` | `/api/transactions/{id}` | Memperbarui catatan transaksi |
| `DELETE` | `/api/transactions/{id}` | Menghapus catatan transaksi |
| `GET` | `/api/reports/profit-loss` | Rekapitulasi laporan Laba Rugi (Profit & Loss Matrix) per bulan |
| `GET` | `/api/reports/profit-loss/export` | Mengunduh file ekspor laporan dalam format Excel / CSV |

---

## 📊 Dataset Referensi

Data awal (*seeders*) telah disesuaikan secara presisi dengan dokumen acuan pengujian keuangan `Testing - Engineer Webapp.xlsx` (Periode Januari 2022 – Maret 2022), mencakup:
- **Income Categories**: Salary, Other Income
- **Expense Categories**: Family Expense, Transport Expense, Meal Expense
- **Accounts (COA)**: Gaji Karyawan (401), Gaji Ketua MPR (402), Profit Trading (403), Biaya Sekolah (601), Bensin (602), Parkir (603), Makan Siang (604), Makanan Pokok (605)
- **18 Mutasi Transaksi Keuangan** dengan kalkulasi saldo surplus bersih Q1.

---

## 📄 Lisensi

Hak Cipta © 2026 **PT. Trans Berjaya Khatulistiwa**. Seluruh hak cipta dilindungi undang-undang.
