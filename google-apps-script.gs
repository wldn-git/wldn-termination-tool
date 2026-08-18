/**
 * ==============================================================================
 * WLDN MV TECHNICAL SUITE - GOOGLE APPS SCRIPT OTP AUTHENTICATION BACKEND
 * ==============================================================================
 * 
 * PANDUAN PENYETELAN (SETUP):
 * 1. Buka Google Sheets (https://sheets.google.com) dan buat Spreadsheet Baru.
 * 2. Beri nama Spreadsheet, misalnya: "WLDN Technical Suite - User Database".
 * 3. Baris 1 (Header Tabel) akan otomatis dibuat oleh script ini jika kosong, 
 *    tetapi Anda juga bisa menyiapkannya manual sebagai berikut:
 *    A1: Timestamp | B1: Nama | C1: Perusahaan | D1: Email | E1: WA | F1: OTP_Code | G1: OTP_Expiry | H1: Last_Login
 * 
 * 4. Buka menu Extensions (Ekstensi) -> Apps Script.
 * 5. Hapus semua kode default yang ada di Code.gs, lalu Salin (Paste) seluruh kode file ini.
 * 6. Klik tombol "Save" (ikon disket / Ctrl+S).
 * 7. Klik tombol "Deploy" (di kanan atas) -> "New deployment" (Penerapan baru).
 * 8. Pada tombol gerigi (Select type), pilih "Web app".
 * 9. Isi Konfigurasi:
 *    - Description: WLDN OTP Backend API
 *    - Execute as: Me (Email Google Anda)
 *    - Who has access: Anyone (Siapa saja)  <-- SANGAT PENTING!
 * 10. Klik "Deploy". Google akan meminta izin (Authorize access), klik "Continue" / "Advanced" -> "Go to (unsafe)" -> "Allow".
 * 11. Salin (Copy) "Web app URL" yang dihasilkan (berakhiran /exec).
 * 12. Tempel (Paste) URL tersebut ke dalam file `auth-config.js` di baris `GAS_WEB_APP_URL`.
 * ==============================================================================
 */

// Menangani HTTP GET Request (Mendukung JSONP & Standard Query)
function doGet(e) {
  return handleRequest(e);
}

// Menangani HTTP POST Request (Mendukung JSON & Form Data)
function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Script Lock untuk mencegah konflik penulisan bersamaan pada Google Sheet
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Tunggu maks 10 detik
  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: 'Server sedang sibuk, silakan coba lagi dalam beberapa detik.'
    });
  }

  try {
    var params = {};

    // Parse data dari request body (POST) atau parameter URL (GET)
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        params = e.parameter || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }

    var action = params.action;
    var sheet = getOrCreateSheet();

    if (action === 'request_otp') {
      return processRequestOTP(sheet, params);
    } else if (action === 'verify_otp') {
      return processVerifyOTP(sheet, params);
    } else if (action === 'ping') {
      return createJsonResponse({
        status: 'success',
        message: 'Backend WLDN OTP Service berjalan normal.'
      });
    } else {
      return createJsonResponse({
        status: 'error',
        message: 'Aksi tidak dikenal / parameter action kosong.'
      });
    }
  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: 'Terjadi kesalahan server: ' + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Mendapatkan atau membuat sheet 'Users'
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  
  if (!sheet) {
    sheet = ss.getSheets()[0]; // Gunakan sheet pertama jika 'Users' belum ada
    sheet.setName('Users');
  }

  // Jika sheet masih kosong, buat Header
  if (sheet.getLastRow() === 0) {
    var headers = ['Timestamp', 'Nama', 'Perusahaan', 'Email', 'WA', 'OTP_Code', 'OTP_Expiry', 'Last_Login'];
    sheet.appendRow(headers);
    
    // Format Header (Bold & Background Accent)
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0284c7');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * 1. PROSES REQUEST OTP
 */
function processRequestOTP(sheet, params) {
  var nama = (params.nama || '').toString().trim();
  var perusahaan = (params.perusahaan || '').toString().trim();
  var email = (params.email || '').toString().trim().toLowerCase();
  var wa = (params.wa || '').toString().trim();

  if (!nama) {
    return createJsonResponse({ status: 'error', message: 'Nama lengkap wajib diisi!' });
  }
  if (!perusahaan) {
    return createJsonResponse({ status: 'error', message: 'Nama perusahaan / instansi wajib diisi!' });
  }
  if (!email || !isValidEmail(email)) {
    return createJsonResponse({ status: 'error', message: 'Alamat email tidak valid!' });
  }

  // Generate Kode OTP 6 Digit
  var otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Waktu Expiry OTP Input (10 Menit dari sekarang)
  var now = new Date();
  var expiryTimeMs = now.getTime() + (10 * 60 * 1000); 

  // Cari baris user berdasarkan email
  var rowIndex = findRowIndexByEmail(sheet, email);

  if (rowIndex > 0) {
    // Update data user yang sudah ada
    sheet.getRange(rowIndex, 2).setValue(nama);        // Kolom B: Nama
    sheet.getRange(rowIndex, 3).setValue(perusahaan);  // Kolom C: Perusahaan
    sheet.getRange(rowIndex, 5).setValue(wa);          // Kolom E: WA
    sheet.getRange(rowIndex, 6).setValue(otpCode);     // Kolom F: OTP_Code
    sheet.getRange(rowIndex, 7).setValue(expiryTimeMs);// Kolom G: OTP_Expiry
  } else {
    // Tambah baris baru
    sheet.appendRow([now, nama, perusahaan, email, wa, otpCode, expiryTimeMs, '']);
  }

  // Kirim Email OTP ke User
  try {
    sendOtpEmail(email, nama, perusahaan, otpCode);
  } catch (emailErr) {
    return createJsonResponse({
      status: 'error',
      message: 'Gagal mengirim email OTP: ' + emailErr.toString() + '. Pastikan email Anda benar.'
    });
  }

  return createJsonResponse({
    status: 'success',
    message: 'Kode OTP 6-digit berhasil dikirim ke email ' + email + '. Silakan periksa inbox / spam Anda.'
  });
}

/**
 * 2. PROSES VERIFIKASI OTP
 */
function processVerifyOTP(sheet, params) {
  var email = (params.email || '').toString().trim().toLowerCase();
  var otpEntered = (params.otp || '').toString().trim();

  if (!email) {
    return createJsonResponse({ status: 'error', message: 'Email tidak boleh kosong!' });
  }
  if (!otpEntered) {
    return createJsonResponse({ status: 'error', message: 'Kode OTP tidak boleh kosong!' });
  }

  var rowIndex = findRowIndexByEmail(sheet, email);
  if (rowIndex === 0) {
    return createJsonResponse({
      status: 'error',
      message: 'Email tidak ditemukan dalam sistem. Silakan minta kode OTP baru.'
    });
  }

  var storedNama = sheet.getRange(rowIndex, 2).getValue();
  var storedPerusahaan = sheet.getRange(rowIndex, 3).getValue();
  var storedWA = sheet.getRange(rowIndex, 5).getValue();
  var storedOtp = sheet.getRange(rowIndex, 6).getValue().toString().trim();
  var storedExpiryMs = Number(sheet.getRange(rowIndex, 7).getValue());

  var nowMs = new Date().getTime();

  // Cek Kesesuaian OTP
  if (storedOtp !== otpEntered) {
    return createJsonResponse({
      status: 'error',
      message: 'Kode OTP salah! Silakan periksa kembali email Anda.'
    });
  }

  // Cek Expiry OTP Input (10 menit)
  if (nowMs > storedExpiryMs) {
    return createJsonResponse({
      status: 'error',
      message: 'Kode OTP telah kadaluwarsa (berlaku 10 menit). Silakan minta kode OTP baru.'
    });
  }

  // OTP Berhasil diverifikasi -> Kosongkan OTP Code agar tidak bisa dipakai ulang
  sheet.getRange(rowIndex, 6).setValue('');
  sheet.getRange(rowIndex, 7).setValue('');
  
  // Update Tgl Last Login
  var loginTime = new Date();
  sheet.getRange(rowIndex, 8).setValue(loginTime);

  // Waktu Kadaluwarsa Sesi Login di Browser = 3 Hari dari sekarang
  var sessionDurationDays = 3;
  var sessionExpiresAtMs = nowMs + (sessionDurationDays * 24 * 60 * 60 * 1000);

  return createJsonResponse({
    status: 'success',
    message: 'Verifikasi OTP Berhasil! Sesi Anda aktif selama 3 hari.',
    user: {
      nama: storedNama,
      perusahaan: storedPerusahaan,
      email: email,
      wa: storedWA,
      loginTime: nowMs,
      expiresAt: sessionExpiresAtMs
    }
  });
}

/**
 * Mencari nomor baris berdasarkan Email (Kolom D / Kolom 4)
 */
function findRowIndexByEmail(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0; // Hanya ada header

  var data = sheet.getRange(2, 4, lastRow - 1, 1).getValues(); // Ambil seluruh kolom Email
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim().toLowerCase() === email) {
      return i + 2; // Offset 2 karena baris 1 adalah header
    }
  }
  return 0;
}

/**
 * Format & Kirim HTML Email OTP
 */
function sendOtpEmail(email, nama, perusahaan, otpCode) {
  var subject = "🔐 Kode OTP Verifikasi Akses - WLDN Technical Suite";
  
  var htmlTemplate = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">⚡ WLDN TECHNICAL SUITE</h1>
      <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Pelatihan Teknik Ketenagalistrikan MV 6 kV – 35 kV</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px 28px; background-color: #ffffff;">
      <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Halo, <strong>${escapeHtml(nama)}</strong> (${escapeHtml(perusahaan)})</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Berikut adalah Kode OTP (One-Time Password) Anda untuk masuk dan mengakses portal aplikasi <strong>WLDN Technical Suite</strong>:
      </p>

      <!-- OTP Display Box -->
      <div style="background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #0369a1; font-weight: 700; display: block; margin-bottom: 8px;">KODE OTP VERIFIKASI</span>
        <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #0284c7; letter-spacing: 10px;">${otpCode}</div>
        <span style="font-size: 12px; color: #64748b; margin-top: 8px; display: block;">⏱️ Kode ini berlaku selama <strong>10 Menit</strong></span>
      </div>

      <div style="background-color: #fffbebfb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;">
          <strong>ℹ️ Masa Aktif Sesi Login:</strong><br>
          Setelah berhasil verifikasi OTP, login Anda di perangkat ini akan <strong>tetap aktif selama 3 Hari (72 jam)</strong> tanpa perlu meminta OTP ulang.
        </p>
      </div>

      <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
        Jika Anda tidak merasa meminta kode ini, silakan abaikan email ini. Jangan berikan kode OTP ini kepada siapapun demi keamanan.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
      © WLDN Technical Suite — Timika & Jakarta. All rights reserved.
    </div>
  </div>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlTemplate
  });
}

/**
 * Helper untuk format response JSON dengan header CORS
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
