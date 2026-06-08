# Ogut Coffee - Intelligent POS System ☕📊

> **Status:** Active Development - *Smart Point of Sales & AI Analytics*

**Ogut Coffee POS** adalah sistem kasir berbasis web yang dirancang tidak hanya untuk transaksi penjualan, tetapi juga sebagai alat bantu pengambilan keputusan bagi manajemen kedai kopi melalui analisis data cerdas. Sistem ini menggabungkan keandalan Laravel sebagai *core* manajemen transaksi dengan fleksibilitas Flask (Python) untuk pemrosesan AI.

## 🧠 Modul Kecerdasan Buatan (AI Analytics)
Sistem ini mengintegrasikan *backend* berbasis AI untuk membantu pemilik kedai:
* **Stock Prediction (Linear Regression):** Memprediksi kebutuhan stok bahan baku berdasarkan tren penjualan historis untuk meminimalisir *waste*.
* **Menu Analysis (K-Means Clustering):** Mengelompokkan menu berdasarkan performa penjualan untuk menentukan strategi *bundling* produk yang efektif[cite: 20].

## ✨ Fitur Utama
* **Transaksi Kasir Real-time:** Pencatatan pesanan yang cepat dan sinkronisasi data langsung ke *database*[cite: 20].
* **Manajemen Inventaris:** Pemantauan stok bahan baku yang terintegrasi dengan modul prediksi[cite: 20].
* **Dashboard Analitik:** Visualisasi data penjualan harian, mingguan, dan bulanan[cite: 20].
* **Role-Based Access Control (RBAC):** Pemisahan hak akses antara Admin dan Kasir untuk menjaga keamanan transaksi[cite: 20].

## 🛠️ Arsitektur Teknologi
* **Core Application:** Laravel (Manajemen Pengguna & Transaksi).
* **AI Service Layer:** Flask (Python) untuk kalkulasi *Linear Regression* dan *K-Means Clustering*.
* **Database:** Terintegrasi dengan Supabase untuk sinkronisasi data yang cepat dan aman[cite: 20].

## 📂 Dokumentasi Teknis
Sistem ini dikelola dengan dokumentasi komprehensif untuk mempermudah pemeliharaan[cite: 20]:
* [Buku Panduan Pengguna (User Guide)](Dokumentasi/Buku Panduan Pengguna (User Guide).md)
* [Rancangan Database](Dokumentasi/Dokumentasi Rancangan Database.md)
* [Spesifikasi API Flask (AI Services)](Dokumentasi/Perancangan Backend(AI)/Dekomposisi Tahap 2_ Spesifikasi API Flask.md)
* [Bug Fix Reports](Dokumentasi/Bug_Fix_Report_13_May_2026.md)

## 🚀 Instalasi & Setup
Untuk panduan lengkap mengenai cara menjalankan *server* Laravel, konfigurasi API Flask, dan sinkronisasi database, silakan merujuk ke dokumen berikut: [Panduan Instalasi & Setup](Dokumentasi/Panduan Instalasi & Setup.md).
