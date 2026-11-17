# Sistem Inventaris Alat Elektromedis (SIM-RS IPSRS)
Praktikum Web 2 - Berlian

Aplikasi web modern untuk manajemen dan inventarisasi peralatan elektromedis rumah sakit dengan sistem proteksi Sign In (Autentikasi), pemantauan kelaikan fungsi, dan jadwal kalibrasi BPFK.

## Fitur Utama:
- **Autentikasi / Sign In di Awal:** Pengguna wajib sign in menggunakan username dan password terlebih dahulu sebelum data inventaris alat ditampilkan.
- **Tabel 10 Data Alat Elektromedis:** Menampilkan Nama Alat, Merk, Model, No. Seri, Tahun Pengadaan, Ruangan/Unit Kerja, Status Kelaikan, dan Jadwal Kalibrasi.
- **Pencarian Real-Time & Multi-Filter:** Cari cepat berdasarkan kata kunci nama/merk/no.seri, filter ruangan, filter status, dan filter tahun.
- **Manajemen Data (CRUD):** Tambah alat baru (modal form), edit data alat, kartu detail spesifikasi, dan hapus alat.
- **Ekspor CSV & Cetak Laporan:** Unduh rekapitulasi ke file CSV (Excel) dan cetak laporan resmi.
- **Statistik & Visualisasi Grafik:** Donut chart persentase kelaikan alat dan bar chart populasi alat per ruangan.

## Kredensial Akses Login (Demo):
- **Admin / Ka. IPSRS:** Username `admin` &bull; Password `admin123`
- **Teknisi Elektromedis:** Username `teknisi` &bull; Password `teknisi123`
- *Tersedia tombol "Isi & Masuk Langsung" untuk pengujian instan.*

## Cara Menjalankan:
1. **Langsung di Browser:** Buka file `index.html` menggunakan browser (Google Chrome, Microsoft Edge, dll).
2. **Melalui XAMPP:** Letakkan folder di `htdocs` (misal: `c:/xampp/htdocs/inventory`), jalankan Apache di XAMPP, dan akses `http://localhost/inventory/`.
