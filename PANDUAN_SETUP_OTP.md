# 🔐 PANDUAN SETUP OTENTIKASI OTP & GOOGLE SHEETS — WLDN TECHNICAL SUITE

Dokumen ini berisi panduan langkah-demi-langkah untuk mengaktifkan otentikasi **OTP (One-Time Password)** pada aplikasi **WLDN Technical Suite** yang di-host di Vercel.

---

## 📌 1. Struktur Data di Google Sheets

Anda cukup membuat **Spreadsheet Baru** di Google Sheets (misal dinamai `WLDN Technical Suite - User Database`).

Script backend akan **otomatis membuat header** di sheet jika sheet masih kosong. Namun jika Anda ingin membuatnya secara manual, susun kolom pada **Baris 1** sebagai berikut:

| Kolom A | Kolom B | Kolom C | Kolom D | Kolom E | Kolom F | Kolom G | Kolom H |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Timestamp** | **Nama** | **Perusahaan** | **Email** | **WA** | **OTP_Code** | **OTP_Expiry** | **Last_Login** |

---

## 🚀 2. Cara Membuat & Deploy Google Apps Script (`google-apps-script.gs`)

1. Buka spreadsheet Google Sheets yang sudah Anda buat.
2. Klik menu **Extensions (Ekstensi)** ➔ **Apps Script**.
3. Hapus seluruh kode default yang ada di file `Code.gs`.
4. Buka file [`google-apps-script.gs`](file:///e:/WILDAN%20FILE/1.%20Project/Training%20Fasilitator/Diorama%20Training/Terminasi%20MV%2035kV%20-%20Timika/aplikasi/google-apps-script.gs) dari folder aplikasi ini, lalu **Salin (Copy)** seluruh kodenya dan **Tempel (Paste)** ke editor Apps Script.
5. Klik ikon **Save (Disket)** atau tekan `Ctrl + S`.
6. Klik tombol biru **Deploy** di kanan atas ➔ pilih **New deployment (Penerapan baru)**.
7. Pada opsi **Select type** (ikon gerigi), pilih **Web app**.
8. Isi konfigurasi sebagai berikut:
   * **Description**: `WLDN OTP Authentication API`
   * **Execute as**: `Me (email anda@gmail.com)`
   * **Who has access**: **`Anyone` (Siapa saja)** *(Sangat penting agar Vercel dapat mengakses API)*
9. Klik tombol **Deploy**.
10. Google akan meminta otorisasi (Authorize access):
    * Klik **Authorize access**.
    * Pilih akun Google Anda.
    * Jika muncul peringatan *"Google hasn't verified this app"*, klik **Advanced** (Lanjutan) ➔ klik **Go to WLDN OTP (unsafe)**.
    * Klik **Allow**.
11. Salin (Copy) **Web app URL** yang diberikan (URL berakhiran `/exec`, contoh: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## ⚙️ 3. Menghubungkan Web App URL ke Aplikasi Vercel

1. Buka file [`auth-config.js`](file:///e:/WILDAN%20FILE/1.%20Project/Training%20Fasilitator/Diorama%20Training/Terminasi%20MV%2035kV%20-%20Timika/aplikasi/auth-config.js) di folder proyek ini.
2. Tempelkan URL yang sudah disalin ke variabel `GAS_WEB_APP_URL`:

```javascript
window.WLDN_AUTH_CONFIG = {
  // Web App URL dari Google Apps Script Deployment
  GAS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycb.../exec", 

  // Durasi Sesi Login Aktif (dalam hari)
  SESSION_DURATION_DAYS: 3,

  // Masa berlaku kode OTP saat diinput (dalam menit)
  OTP_EXPIRY_MINUTES: 10,

  // Nama key penyimpanan lokal di browser
  STORAGE_KEY: "wldn_auth_session",

  // Mode Demo Simulasi jika Apps Script URL belum diisi
  ALLOW_DEMO_MODE: true
};
```

3. Simpan file dan lakukan **Push / Deploy ulang ke Vercel** (`git commit & push` atau `vercel --prod`).

---

## 🔒 4. Cara Kerja & Alur Otentikasi OTP

1. **Akses Pertama / Sesi Kadaluwarsa (> 3 Hari)**:
   * Pengguna membuka tautan aplikasi Vercel.
   * Modal otentikasi muncul di tengah layar dengan latar belakang blur (*frosted glass*), mengunci halaman.
   * Pengguna wajib mengisi: **Nama Lengkap**, **Nama Perusahaan / Instansi**, **Email**, dan **WhatsApp (Opsional)**.
2. **Pengiriman OTP**:
   * Pengguna mengklik tombol **"📱 Kirim Kode OTP Ke Email"**.
   * Script backend menyimpan/memperbarui data pengguna di Google Sheets dan mengirimkan 6-digit OTP ke email pengguna.
3. **Verifikasi**:
   * Pengguna memasukkan 6-digit OTP dan mengklik **"🔓 Verifikasi & Masuk"**.
   * Jika cocok dan belum melewati 10 menit, sesi pengguna disimpan di `localStorage` browser.
4. **Masa Aktif 3 Hari**:
   * Pengguna yang sudah login dapat bebas berpindah halaman di Vercel **tanpa perlu login ulang selama 3 Hari (72 Jam)**.
   * Badge profil pengguna (`👤 Nama | Perusahaan • Sesi 3 Hari | 🚪 Keluar`) akan ditampilkan di bagian atas header.
   * Pengguna dapat memilih untuk **Keluar (Logout)** kapan saja secara manual.
