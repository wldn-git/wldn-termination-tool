/**
 * ==============================================================================
 * WLDN TECHNICAL SUITE - CONFIGURATION FILE FOR OTP AUTHENTICATION
 * ==============================================================================
 * 
 * CARA MENGHUBUNGKAN APLIKASI DENGAN GOOGLE APPS SCRIPT:
 * 1. Deploy file `google-apps-script.gs` di Google Sheets Apps Script Anda.
 * 2. Salin Web App URL (misal: https://script.google.com/macros/s/AKfycb.../exec).
 * 3. Ganti nilai `GAS_WEB_APP_URL` di bawah ini dengan Web App URL milik Anda.
 */

window.WLDN_AUTH_CONFIG = {
  // Web App URL dari Google Apps Script Deployment
  GAS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbxBIm111W5Ij7ETHRyaEFmoBVFt8IHhX601GPXdPdROe-lCL-QyjtfWtp78IQzS6jLf/exec", 

  // Durasi Sesi Login Aktif (dalam hari) -> Sesuai permintaan: 3 Hari
  SESSION_DURATION_DAYS: 3,

  // Masa berlaku kode OTP saat diinput (dalam menit) -> 10 Menit
  OTP_EXPIRY_MINUTES: 10,

  // Nama key penyimpanan lokal di browser
  STORAGE_KEY: "wldn_auth_session",

  // Mode Demo Simulasi jika Apps Script URL belum diisi (Bisa dicoba tanpa backend dulu)
  ALLOW_DEMO_MODE: true
};
