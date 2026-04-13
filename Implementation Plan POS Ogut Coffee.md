# **RENCANA IMPLEMENTASI TEKNIS: SISTEM POS OGUT COFFEE**

Berbasis Microservices (React.js \+ Supabase \+ Flask) dengan Integrasi AI

## **FASE 1: PERSIAPAN DATABASE (SUPABASE) & LINGKUNGAN**

Fase ini berfokus pada pembuatan skema database relasional yang tangguh. Skema ini tidak hanya harus mendukung kecepatan pencatatan transaksi kasir sehari-hari secara *real-time*, tetapi juga harus dirancang untuk menyimpan data historis secara terstruktur guna memenuhi kebutuhan analitik AI (K-Means Clustering dan Time-Series untuk Regresi Linier).

### **Langkah 1.1: Pembuatan Skema Tabel di Supabase**

AI Agent perlu membuat struktur tabel menggunakan SQL di SQL Editor Supabase dengan tipe data yang presisi untuk menghindari anomali saat pemrosesan komputasi.

**Prompt untuk AI Agent:**

"Buatkan script SQL untuk Supabase PostgreSQL dengan tabel-tabel berikut, lengkap dengan tipe data yang sesuai (misalnya UUID untuk id, DECIMAL untuk harga):

1. products: id (UUID), name (VARCHAR), price (DECIMAL), cost\_price (DECIMAL \- untuk kalkulasi margin otomatis), category (VARCHAR).  
2. materials: id (UUID), name (VARCHAR), current\_stock (DECIMAL), unit (VARCHAR \- misal: gram, ml, pcs).  
3. product\_materials: tabel pivot untuk relasi many-to-many (resep menu/Bill of Materials). Kolom: id, product\_id, material\_id, quantity\_used.  
4. transactions: id (UUID), total\_amount (DECIMAL), created\_at (TIMESTAMP WITH TIME ZONE \- sangat penting untuk filter waktu).  
5. transaction\_items: id, transaction\_id, product\_id, quantity (INT), subtotal (DECIMAL), profit\_margin (DECIMAL \- disimpan secara historis agar kebal terhadap perubahan harga modal di masa depan).  
6. inventory\_logs: id, material\_id, date (DATE: YYYY-MM-DD), stock\_used (DECIMAL), end\_of\_day\_stock (DECIMAL \- data esensial untuk pembentukan *time-series* Regresi Linier).  
7. ai\_cluster\_results: id, product\_id, cluster\_label (VARCHAR), evaluation\_date (DATE).  
8. ai\_prediction\_results: id, material\_id, predicted\_stock (DECIMAL), mape\_score (DECIMAL), prediction\_date (DATE).

Sertakan pengaturan RLS (Row Level Security) dasar. RLS ini penting untuk mengamankan data transaksi UMKM, memastikan hanya *role* kasir atau admin terotentikasi yang dapat melakukan operasi INSERT atau UPDATE pada tabel-tabel krusial tersebut."

## **FASE 2: PENGEMBANGAN FLASK MICROSERVICE (CORE & N-GRAM)**

Membangun *backend* Python terisolasi yang akan menangani fitur *Smart Input Assistance*. Karena sistem ini ditujukan untuk lingkungan UMKM yang menuntut respons instan guna mengurai antrean, fitur ini wajib beroperasi murni di memori lokal (RAM) Flask untuk memangkas latensi akses database.

### **Langkah 2.1: Setup Flask & In-Memory Cache N-Gram**

Membuat kerangka Flask dan logika probabilitas N-Gram tanpa menggunakan pemrosesan LLM (*Large Language Model*) yang berat, melainkan menggunakan kalkulasi statistik frekuensi kata sederhana namun sangat cepat.

**Prompt untuk AI Agent:**

"Buatkan aplikasi Flask (Python) bernama app.py. Penuhi kriteria berikut:

1. Buat variabel *in-memory dictionary* bernama ngram\_cache di level global (contoh struktur: {'kopi susu': 150, 'americano': 85}). Variabel ini akan bertindak sebagai tempat penyimpanan probabilitas berkecepatan tinggi.  
2. Buat fungsi full\_refresh\_ngram() yang berjalan otomatis hanya satu kali saat server Flask pertama kali *start*. Fungsi ini melakukan *query* ke tabel products di Supabase untuk mengumpulkan data historis, lalu membangun frekuensi kata/frasa awal agar *cache* tidak kosong saat server di-restart.  
3. Buat API endpoint GET /api/suggest?q=keyword. API ini memindai *substring* atau kecocokan keyword di dalam kunci ngram\_cache dan mengembalikan 5 rekomendasi teratas yang diurutkan (*sorted*) berdasarkan angka probabilitas frekuensi tertinggi. Endpoint ini harus memiliki waktu respons (latensi) di bawah 50 milidetik.  
4. Buat API endpoint POST /api/ngram/increment. API ini menerima payload JSON berupa susunan nama produk yang baru saja terjual. Endpoint ini bertugas menambahkan nilai \+1 (inkremental) pada frekuensi N-Gram terkait di dalam ngram\_cache. Endpoint ini akan dipanggil oleh Frontend sebagai *background task* setiap kali kuitansi transaksi berhasil diterbitkan."

## **FASE 3: PENGEMBANGAN FRONTEND REACT.JS (KASIR & SMART INPUT)**

Fase ini berfokus pada pembuatan antarmuka utama pengguna (UI) yang digunakan oleh staf kasir. Prioritas utama adalah kecepatan interaksi, navigasi yang ergonomis, dan pencegahan penumpukan beban (*bottleneck*) pada jaringan.

### **Langkah 3.1: Setup React & Integrasi Debounce**

Membangun halaman POS dan mengimplementasikan mekanisme *Debounce* (300ms) untuk melindungi *backend* Flask dari kelebihan permintaan (*spam request*).

**Prompt untuk AI Agent:**

"Buatkan komponen fungsional React.js untuk halaman Kasir (Point of Sales) menggunakan *styling* TailwindCSS yang modern dan bersih.

1. Buat *search bar* utama berukuran besar untuk input nama menu. Komponen ini adalah pusat interaksi kasir.  
2. Terapkan fungsi pembatasan laju atau Debounce sebesar 300 milidetik pada *search bar* tersebut menggunakan useEffect atau *custom hook* (misalnya useDebounce). Tujuannya: jika kasir mengetik 'K-O-P-I' secara cepat, sistem tidak mengirim 4 *request* terpisah, melainkan hanya 1 *request* setelah kasir berhenti mengetik selama 300ms.  
3. Lakukan fetch ke endpoint Flask GET /api/suggest?q=... dan tampilkan hasil prediksinya sebagai komponen *dropdown/autocomplete* mengambang (*floating*) di bawah input. Pastikan daftar *dropdown* ini dapat dinavigasi menggunakan tombol panah *keyboard* (Up/Down) dan tombol Enter untuk mempercepat proses input tanpa bergantung pada *mouse*.  
4. Buat daftar keranjang belanja (*cart list*) terstruktur di panel sebelah kanan layar yang menampilkan nama menu, *quantity* (+/- *button*), harga satuan, dan *Grand Total* transaksi."

### **Langkah 3.2: Logika Checkout & Pembaruan Inkremental**

Menyelesaikan siklus transaksi dan memicu *reinforcement learning* sederhana pada memori probabilitas N-Gram.

**Prompt untuk AI Agent:**

"Lanjutkan komponen React Kasir sebelumnya. Buat sebuah fungsi *asynchronous* bernama handleCheckout:

1. Petakan data keranjang belanja dan simpan ke Supabase (lakukan INSERT ke tabel transactions untuk *header* transaksi, dan *bulk insert* ke tabel transaction\_items untuk rincian menu).  
2. Lakukan pengecekan respons: Jika proses simpan ke Supabase mengembalikan status sukses (200 OK), segera lakukan HTTP POST secara *asynchronous* (misalnya menggunakan fetch tanpa await yang memblokir) ke endpoint Flask POST /api/ngram/increment dengan mengirimkan susunan nama menu yang berhasil terjual.  
3. Sangat penting: Eksekusi *request* ke Flask ini secara *fire-and-forget* (berjalan senyap di *background*). Jangan bekukan atau blokir UI (jangan tampilkan *loading spinner* untuk proses increment ini) agar kasir dapat langsung mengosongkan layar dan bersiap melayani pelanggan di antrean berikutnya secara instan."

## **FASE 4: INTEGRASI BACKGROUND JOB AI (FLASK APSCHEDULER)**

Fase ini adalah inti operasional analitik data AI. Komputasi algoritma (K-Means dan Regresi) dipisahkan dari alur interaksi kasir dengan dijadwalkan secara terisolasi pada malam hari, menjamin tidak adanya hambatan (*lag*) selama jam sibuk operasional kafe.

### **Langkah 4.1: Setup APScheduler & K-Means Clustering**

Memproses segmentasi kinerja menu secara statistik untuk membantu strategi pemasaran pemilik usaha.

**Prompt untuk AI Agent:**

"Tambahkan pustaka penjadwalan APScheduler (gunakan *BackgroundScheduler*) ke dalam modul Flask yang sama. Buat sebuah *cron job* yang dijadwalkan untuk dieksekusi secara otomatis setiap pukul 23:59.

Di dalam *job* tersebut, buat fungsi run\_kmeans\_clustering():

1. Lakukan *query* SQL agregasi menggunakan klien Supabase untuk menghitung total 'Volume Penjualan' (akumulasi Qty) dan rata-rata 'Margin Keuntungan' per produk secara spesifik untuk periode 30 hari terakhir.  
2. Format data ke dalam Pandas DataFrame dan lakukan normalisasi skala menggunakan MinMaxScaler dari pustaka scikit-learn agar metrik volume dan margin memiliki bobot kalkulasi yang seimbang.  
3. Terapkan algoritma K-Means dari scikit-learn dengan parameter n\_clusters=3 (yang secara bisnis akan merepresentasikan: Cluster 0: Laris & Untung Besar, Cluster 1: Penjualan Sedang, Cluster 2: Kurang Laris & Untung Kecil).  
4. Hitung validitas distribusi *cluster* model tersebut menggunakan fungsi metrik silhouette\_score.  
5. Simpan pemetaan hasil akhir (relasi ID Produk dan Label *Cluster*\-nya) beserta skor evaluasinya ke dalam tabel Supabase ai\_cluster\_results."

### **Langkah 4.2: Regresi Linier untuk Prediksi Stok**

Melakukan peramalan konsumsi bahan baku berdasarkan tren deret waktu untuk mencegah penumpukan (dead stock) atau kekosongan persediaan (blind inventory).

**Prompt untuk AI Agent:**

"Lanjutkan pada fail Flask yang sama. Di dalam *job* APScheduler (pukul 23:59), tambahkan fungsi pemrosesan run\_linear\_regression():

1. Tarik deretan data historis harian dari tabel inventory\_logs di Supabase, dikelompokkan untuk setiap bahan baku (material\_id) secara iteratif.  
2. Transformasikan format datanya menjadi model *Time-Series* berurutan: Variabel independen (X) adalah indeks urutan hari (misal hari ke-1, 2, 3...), dan Variabel dependen (Y) adalah nilai aktual dari end\_of\_day\_stock.  
3. Lakukan proses pelatihan model LinearRegression bawaan pustaka scikit-learn untuk setiap bahan baku.  
4. Gunakan persamaan garis lurus yang dihasilkan model (y \= mx \+ c) untuk melakukan ekstrapolasi prediksi ketersediaan sisa stok untuk 7 hari ke depan secara berturut-turut.  
5. Lakukan evaluasi persentase kesalahan dari model regresi tersebut menggunakan fungsi perhitungan mean\_absolute\_percentage\_error (MAPE).  
6. Lakukan operasi INSERT/UPDATE menyimpan nilai prediksi dan metrik keakuratan MAPE ke dalam tabel Supabase ai\_prediction\_results."

## **FASE 5: FRONTEND DASHBOARD ANALITIK (UNTUK PEMILIK/MANAJER)**

Fase ini menerjemahkan angka dan komputasi matematis rumit dari Fase 4 ke dalam wawasan bisnis grafis yang mudah dicerna oleh pemilik Ogut Coffee guna merumuskan keputusan pemasaran dan pengadaan operasional harian.

### **Langkah 5.1: Antarmuka Dashboard Evaluasi AI**

**Prompt untuk AI Agent:**

"Buatkan halaman antarmuka fungsional React baru dengan nama AnalyticsDashboard.jsx. Halaman ini harus melakukan *fetch* data *read-only* dari tabel hasil AI di Supabase.

1. Buat seksi 'Segmentasi Kinerja Menu (K-Means)': Kelompokkan data menjadi kartu-kartu atau tabel visual berdasarkan *cluster* (Contoh: Beri sorotan warna hijau untuk 'Menu Andalan/Untung Besar' agar bisa dipertahankan, dan warna merah untuk 'Menu Kurang Laris' agar dapat dipertimbangkan untuk diskon). Tampilkan metrik indikator kebaikan *cluster* (Silhouette Score) di sudut panel.  
2. Buat seksi 'Prediksi Bahan Baku (Regresi Linier)': Rancang tabel indikator peringatan dini (*early warning*). Tabel ini harus menyaring dan menyoroti bahan baku yang berdasarkan tren garis regresinya diprediksi akan menyentuh batas stok minimum (habis) dalam waktu 7 hari ke depan. Cantumkan juga toleransi margin kesalahan (Skor MAPE dalam persentase) agar manajer mengerti tingkat keyakinan prediksinya.  
3. Terapkan desain UI *dashboard* manajerial yang intuitif, *responsive* di berbagai layar perangkat, berikan ruang putih (*white space*) yang rapi, dengan memanfaatkan kerangka kerja TailwindCSS."

## **FASE 6: PENGUJIAN & DEPLOYMENT (OPSIONAL UNTUK PRODUKSI)**

Sebelum penerapan secara langsung di Ogut Coffee, sistem perlu diuji di lingkungan simulasi untuk memastikan arsitektur *microservices* dapat berjalan stabil, terutama dalam sinkronisasi antar platform.

1. **Pengujian Unit (Lokal) & Fallback Mechanism:**  
   * Putuskan koneksi internet sementara secara lokal untuk mensimulasikan kegagalan API Supabase. Verifikasi bahwa React Frontend dapat menangani *error* ini dengan baik (menampilkan *toast notification* gagal kepada kasir alih-alih mengalami *blank screen/crash*).  
   * Lakukan pengujian pengetikan agresif pada kolom input pesanan sambil mengamati *Network Tab* pada panel *Developer Tools* peramban web. Pastikan indikator *network request* hanya muncul satu kali setiap jeda 300ms sesuai prinsip kerangka *Debounce*.  
2. **Pengujian Integrasi Background Job:**  
   * Untuk pengujian, modifikasi *trigger cron job* APScheduler dari 23:59 menjadi interval singkat (misalnya "setiap 1 menit"). Observasi *log console* Python untuk memverifikasi secara langsung bahwa K-Means dan Regresi Linier dapat melakukan siklus operasi BACA (dari Supabase) \-\> HITUNG \-\> TULIS (hasil analitik ke Supabase) secara otonom tanpa mengeluarkan *stack trace error*.  
3. **Deployment Infrastruktur Cloud:**  
   * Lakukan *deploy repository* halaman Frontend React.js ke penyedia *hosting* layanan statis terkelola (seperti **Vercel** atau **Netlify**). Pastikan *Environment Variables* seperti SUPABASE\_URL terkonfigurasi dengan aman.  
   * Lakukan *deploy server backend* Flask ke penyedia Platform-as-a-Service (PaaS) seperti **Render**, **Railway**, atau **Heroku**. Peringatan krusial: Pilih paket layanan peladen yang tidak beralih ke kondisi istirahat (*sleep mode*). Infrastruktur *backend* ini menaungi sistem memori probabilitas N-Gram dan *Scheduler* jam 12 malam; apabila peladen diistirahatkan oleh penyedia layanan awan, probabilitas di memori akan hilang dan automasi komputasi malam hari akan gagal berjalan.