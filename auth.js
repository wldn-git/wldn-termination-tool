/**
 * ==============================================================================
 * WLDN TECHNICAL SUITE - OTP AUTHENTICATION SYSTEM (FRONTEND ENGINE)
 * ==============================================================================
 * System for requiring OTP verification (Name, Company, Email, WA) before app access,
 * with 3-day session expiration stored in localStorage.
 */

(function () {
  'use strict';

  // Config object with fallback
  const config = window.WLDN_AUTH_CONFIG || {
    GAS_WEB_APP_URL: "",
    SESSION_DURATION_DAYS: 3,
    OTP_EXPIRY_MINUTES: 10,
    STORAGE_KEY: "wldn_auth_session",
    ALLOW_DEMO_MODE: true
  };

  let currentUserData = null; // Store temp user input during OTP step
  let resendTimerInterval = null;

  // Initialize Auth engine when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }

  function initAuth() {
    injectStyles();

    const session = getValidSession();
    if (session) {
      // User is logged in & session is within 3 days
      injectUserBadge(session);
    } else {
      // User not logged in or session expired (> 3 days)
      showAuthModal();
    }
  }

  // --- SESSION MANAGEMENT ---

  function getValidSession() {
    try {
      const raw = localStorage.getItem(config.STORAGE_KEY);
      if (!raw) return null;

      const session = JSON.parse(raw);
      if (!session || !session.expiresAt) return null;

      const now = Date.now();
      if (now > session.expiresAt) {
        // Expired after 3 days
        localStorage.removeItem(config.STORAGE_KEY);
        return null;
      }

      return session;
    } catch (e) {
      return null;
    }
  }

  function saveSession(userData, expiresAt) {
    const sessionData = {
      authenticated: true,
      nama: userData.nama,
      perusahaan: userData.perusahaan,
      email: userData.email,
      wa: userData.wa || '',
      loginTime: Date.now(),
      expiresAt: expiresAt || (Date.now() + config.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)
    };
    localStorage.setItem(config.STORAGE_KEY, JSON.stringify(sessionData));
    return sessionData;
  }

  function logout() {
    if (confirm('Apakah Anda yakin ingin keluar (logout)? Anda akan memerlukan kode OTP baru untuk masuk kembali.')) {
      localStorage.removeItem(config.STORAGE_KEY);
      location.reload();
    }
  }

  // Expose global controller
  window.WLDNAuth = {
    getSession: getValidSession,
    logout: logout,
    showModal: showAuthModal
  };

  // --- STYLES INJECTION ---

  function injectStyles() {
    if (document.getElementById('wldn-auth-styles')) return;

    const style = document.createElement('style');
    style.id = 'wldn-auth-styles';
    style.textContent = `
      /* Lock body scroll when modal is active */
      body.wldn-auth-locked {
        overflow: hidden !important;
        height: 100vh !important;
      }

      /* Modal Backdrop Overlay */
      #wldn-auth-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25rem;
        opacity: 0;
        animation: wldnFadeIn 0.3s ease forwards;
        font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
        box-sizing: border-box;
      }

      @keyframes wldnFadeIn {
        to { opacity: 1; }
      }

      /* Modal Container Box */
      .wldn-auth-card {
        background: var(--card-bg, rgba(255, 255, 255, 0.95));
        border: 1px solid var(--card-border, rgba(255, 255, 255, 0.4));
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        width: 100%;
        max-width: 480px;
        padding: 2.25rem 2rem;
        position: relative;
        color: var(--text-main, #0f172a);
        box-sizing: border-box;
        transform: translateY(20px) scale(0.97);
        animation: wldnSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      [data-theme="dark"] .wldn-auth-card {
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f8fafc;
      }

      @keyframes wldnSlideUp {
        to { transform: translateY(0) scale(1); }
      }

      /* Header Elements */
      .wldn-auth-header {
        text-align: center;
        margin-bottom: 1.75rem;
      }

      .wldn-auth-logo-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 1rem;
        background: linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(56, 189, 248, 0.12) 100%);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        color: #0284c7;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
      }

      [data-theme="dark"] .wldn-auth-logo-badge {
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.15);
      }

      .wldn-auth-title {
        font-size: 1.45rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin: 0 0 0.4rem 0;
        line-height: 1.25;
      }

      .wldn-auth-subtitle {
        font-size: 0.875rem;
        color: var(--text-muted, #475569);
        margin: 0;
        line-height: 1.45;
      }

      [data-theme="dark"] .wldn-auth-subtitle {
        color: #94a3b8;
      }

      /* Form Fields */
      .wldn-auth-form-group {
        margin-bottom: 1.15rem;
        text-align: left;
      }

      .wldn-auth-label {
        display: block;
        font-size: 0.8125rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
        color: var(--text-main, #1e293b);
      }

      [data-theme="dark"] .wldn-auth-label {
        color: #e2e8f0;
      }

      .wldn-auth-input {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 0.9375rem;
        font-family: inherit;
        background: rgba(241, 245, 249, 0.7);
        border: 1.5px solid rgba(203, 213, 225, 0.8);
        border-radius: 12px;
        color: inherit;
        box-sizing: border-box;
        transition: all 0.2s ease;
        outline: none;
      }

      [data-theme="dark"] .wldn-auth-input {
        background: rgba(30, 41, 59, 0.7);
        border-color: rgba(51, 65, 85, 0.8);
        color: #f8fafc;
      }

      .wldn-auth-input:focus {
        border-color: #0284c7;
        background: #ffffff;
        box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.15);
      }

      [data-theme="dark"] .wldn-auth-input:focus {
        background: #0f172a;
        border-color: #38bdf8;
        box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.2);
      }

      .wldn-auth-input-otp {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.75rem;
        font-weight: 800;
        letter-spacing: 0.4em;
        text-align: center;
        padding: 0.75rem 0.5rem;
        text-transform: uppercase;
        color: #0284c7;
      }

      [data-theme="dark"] .wldn-auth-input-otp {
        color: #38bdf8;
      }

      /* Alert Banners */
      .wldn-auth-alert {
        padding: 0.75rem 1rem;
        border-radius: 12px;
        font-size: 0.84rem;
        line-height: 1.45;
        margin-bottom: 1.25rem;
        display: none;
      }

      .wldn-auth-alert-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
      }

      [data-theme="dark"] .wldn-auth-alert-error {
        background: rgba(127, 29, 29, 0.4);
        border-color: rgba(239, 68, 68, 0.4);
        color: #fca5a5;
      }

      .wldn-auth-alert-info {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        color: #075985;
      }

      [data-theme="dark"] .wldn-auth-alert-info {
        background: rgba(12, 74, 110, 0.4);
        border-color: rgba(56, 189, 248, 0.4);
        color: #bae6fd;
      }

      .wldn-auth-alert-warning {
        background: #fffbebfb;
        border: 1px solid #fde68a;
        color: #92400e;
      }

      [data-theme="dark"] .wldn-auth-alert-warning {
        background: rgba(120, 53, 15, 0.4);
        border-color: rgba(245, 158, 11, 0.4);
        color: #fde68a;
      }

      /* Buttons */
      .wldn-auth-btn {
        width: 100%;
        padding: 0.85rem 1.25rem;
        font-size: 0.95rem;
        font-weight: 700;
        font-family: inherit;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        color: #ffffff;
        box-shadow: 0 10px 20px -5px rgba(2, 132, 199, 0.4);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .wldn-auth-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 14px 24px -5px rgba(2, 132, 199, 0.5);
        background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
      }

      .wldn-auth-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none !important;
      }

      .wldn-auth-btn-secondary {
        background: transparent;
        color: var(--text-muted, #475569);
        box-shadow: none;
        border: 1px solid rgba(203, 213, 225, 0.6);
        margin-top: 0.75rem;
        font-weight: 600;
        font-size: 0.85rem;
      }

      [data-theme="dark"] .wldn-auth-btn-secondary {
        color: #cbd5e1;
        border-color: rgba(51, 65, 85, 0.8);
      }

      .wldn-auth-btn-secondary:hover:not(:disabled) {
        background: rgba(241, 245, 249, 0.5);
      }

      [data-theme="dark"] .wldn-auth-btn-secondary:hover:not(:disabled) {
        background: rgba(30, 41, 59, 0.5);
      }

      /* Spinner Animation */
      .wldn-auth-spinner {
        width: 18px;
        height: 18px;
        border: 2.5px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #ffffff;
        animation: wldnSpin 0.7s linear infinite;
        display: inline-block;
      }

      @keyframes wldnSpin {
        to { transform: rotate(360deg); }
      }

      /* Footer note */
      .wldn-auth-footer-note {
        margin-top: 1.5rem;
        font-size: 0.75rem;
        color: var(--text-subtle, #64748b);
        text-align: center;
        line-height: 1.4;
      }

      /* User Badge Component (Injected in navbar/header) */
      .wldn-user-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.4rem 0.85rem;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(226, 232, 240, 0.8);
        backdrop-filter: blur(12px);
        border-radius: 999px;
        font-size: 0.8125rem;
        color: var(--text-main, #0f172a);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
      }

      [data-theme="dark"] .wldn-user-badge {
        background: rgba(30, 41, 59, 0.8);
        border-color: rgba(51, 65, 85, 0.8);
        color: #f8fafc;
      }

      .wldn-user-badge-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .wldn-user-badge-info {
        display: flex;
        flex-direction: column;
        text-align: left;
      }

      .wldn-user-badge-name {
        font-weight: 700;
        line-height: 1.1;
      }

      .wldn-user-badge-company {
        font-size: 0.7rem;
        color: var(--text-muted, #64748b);
      }

      [data-theme="dark"] .wldn-user-badge-company {
        color: #94a3b8;
      }

      .wldn-user-badge-logout {
        background: transparent;
        border: none;
        color: #ef4444;
        cursor: pointer;
        padding: 0.2rem 0.4rem;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 6px;
        transition: background 0.2s ease;
        margin-left: 0.2rem;
      }

      .wldn-user-badge-logout:hover {
        background: rgba(239, 68, 68, 0.1);
      }

      /* Sidebar Specific User Badge (For Cable Calc & Sidebar Layouts) */
      .wldn-sidebar-user-badge {
        margin-top: auto !important;
        margin-bottom: 0.5rem;
        width: calc(100% - 4px) !important;
        box-sizing: border-box;
        border-radius: 12px;
        padding: 0.55rem 0.65rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      [data-theme="light"] .wldn-sidebar-user-badge {
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(203, 213, 225, 0.9);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }

      @media (max-width: 768px) {
        .nav .wldn-sidebar-user-badge {
          margin-top: 0 !important;
          margin-left: auto !important;
          width: auto !important;
          flex-shrink: 0;
        }
      }

      /* Topbar In-line Single-Line User Badge (Replaces Jembo/Kabelindo badge) */
      .wldn-topbar-user-badge {
        display: inline-flex !important;
        align-items: center !important;
        flex-direction: row !important;
        gap: 5px !important;
        height: 26px !important;
        max-height: 26px !important;
        padding: 0 8px 0 3px !important;
        border-radius: 999px !important;
        font-size: 11.5px !important;
        background: rgba(2, 132, 199, 0.15) !important;
        border: 1px solid rgba(56, 189, 248, 0.35) !important;
        color: var(--text, #f8fafc) !important;
        box-shadow: none !important;
        margin-left: 6px !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        line-height: 1 !important;
        box-sizing: border-box !important;
        max-width: 320px !important;
        overflow: hidden !important;
        vertical-align: middle !important;
      }

      [data-theme="light"] .wldn-topbar-user-badge {
        background: rgba(2, 132, 199, 0.08) !important;
        border-color: rgba(2, 132, 199, 0.25) !important;
        color: #0f172a !important;
      }

      .wldn-topbar-user-badge .wldn-user-badge-icon {
        width: 18px !important;
        height: 18px !important;
        border-radius: 50% !important;
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
        color: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 9.5px !important;
        font-weight: 800 !important;
        flex-shrink: 0 !important;
        line-height: 1 !important;
        margin: 0 !important;
      }

      .wldn-topbar-user-badge .wldn-user-badge-text {
        font-weight: 700 !important;
        font-size: 11.5px !important;
        color: inherit !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        line-height: 1 !important;
        display: inline-block !important;
      }

      .wldn-topbar-user-badge .wldn-user-badge-sub {
        font-weight: 500 !important;
        opacity: 0.75 !important;
        font-size: 10.5px !important;
        margin-left: 2px !important;
      }

      .wldn-topbar-user-badge .wldn-user-badge-logout {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        padding: 0 6px !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.12) !important;
        border: 1px solid rgba(239, 68, 68, 0.25) !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        margin-left: 3px !important;
        transition: all 0.15s ease !important;
        line-height: 1 !important;
        height: 18px !important;
        flex-shrink: 0 !important;
      }

      .wldn-topbar-user-badge .wldn-user-badge-logout:hover {
        background: rgba(239, 68, 68, 0.25) !important;
        border-color: rgba(239, 68, 68, 0.4) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // --- MODAL RENDERING & EVENTS ---

  function showAuthModal() {
    if (document.getElementById('wldn-auth-overlay')) return;

    document.body.classList.add('wldn-auth-locked');

    const overlay = document.createElement('div');
    overlay.id = 'wldn-auth-overlay';

    const isGasConfigured = config.GAS_WEB_APP_URL && config.GAS_WEB_APP_URL.trim() !== "" && !config.GAS_WEB_APP_URL.includes("YOUR_SCRIPT_ID");

    overlay.innerHTML = `
      <div class="wldn-auth-card">
        <div class="wldn-auth-header">
          <div class="wldn-auth-logo-badge">⚡ WLDN Technical Suite</div>
          <h2 class="wldn-auth-title" id="wldn-auth-step-title">Verifikasi OTP Akses</h2>
          <p class="wldn-auth-subtitle" id="wldn-auth-step-subtitle">Masukkan data diri Anda untuk menerima Kode OTP via Email.</p>
        </div>

        <div id="wldn-auth-alert" class="wldn-auth-alert"></div>

        ${!isGasConfigured ? `
          <div class="wldn-auth-alert wldn-auth-alert-warning" style="display: block;">
            ⚠️ <strong>Perhatian Developer:</strong> Web App URL Google Apps Script belum diset di <code>auth-config.js</code>.<br>
            <span style="font-size:0.78rem;">Anda dapat menguji menggunakan <strong>Mode Simulasi / Demo OTP</strong> di bawah.</span>
          </div>
        ` : ''}

        <!-- STEP 1: REQUEST OTP FORM -->
        <form id="wldn-auth-form-step1">
          <div class="wldn-auth-form-group">
            <label class="wldn-auth-label" for="wldn-input-nama">👤 Nama Lengkap <span style="color:#ef4444">*</span></label>
            <input type="text" id="wldn-input-nama" class="wldn-auth-input" placeholder="Contoh: Budi Santoso" required autocomplete="name">
          </div>

          <div class="wldn-auth-form-group">
            <label class="wldn-auth-label" for="wldn-input-perusahaan">🏢 Perusahaan / Instansi <span style="color:#ef4444">*</span></label>
            <input type="text" id="wldn-input-perusahaan" class="wldn-auth-input" placeholder="Contoh: PT PLN (Persero) / Vendor" required autocomplete="organization">
          </div>

          <div class="wldn-auth-form-group">
            <label class="wldn-auth-label" for="wldn-input-email">✉️ Alamat Email (Untuk Terima OTP) <span style="color:#ef4444">*</span></label>
            <input type="email" id="wldn-input-email" class="wldn-auth-input" placeholder="nama@perusahaan.com" required autocomplete="email">
          </div>

          <div class="wldn-auth-form-group">
            <label class="wldn-auth-label" for="wldn-input-wa">💬 Nomor WhatsApp (Opsional)</label>
            <input type="tel" id="wldn-input-wa" class="wldn-auth-input" placeholder="Contoh: 08123456789" autocomplete="tel">
          </div>

          <button type="submit" id="wldn-btn-send-otp" class="wldn-auth-btn">
            <span>📱 Kirim Kode OTP Ke Email</span>
          </button>

          ${!isGasConfigured ? `
            <button type="button" id="wldn-btn-demo-mode" class="wldn-auth-btn wldn-auth-btn-secondary">
              ⚡ Test Mode Demo (Gunakan OTP 123456)
            </button>
          ` : ''}
        </form>

        <!-- STEP 2: VERIFY OTP FORM (Hidden by default) -->
        <form id="wldn-auth-form-step2" style="display: none;">
          <div class="wldn-auth-form-group">
            <label class="wldn-auth-label" style="text-align: center;">🔑 Kode OTP 6 Digit</label>
            <input type="text" id="wldn-input-otp" class="wldn-auth-input wldn-auth-input-otp" placeholder="000000" maxlength="6" pattern="[0-9]{6}" required autocomplete="one-time-code">
          </div>

          <button type="submit" id="wldn-btn-verify-otp" class="wldn-auth-btn">
            <span>🔓 Verifikasi &amp; Masuk</span>
          </button>

          <button type="button" id="wldn-btn-back-step1" class="wldn-auth-btn wldn-auth-btn-secondary">
            ← Ubah Email / Kirim Ulang OTP
          </button>
        </form>

        <div class="wldn-auth-footer-note">
          🔒 Sesi login valid selama <strong>3 Hari (72 Jam)</strong> setelah berhasil verifikasi OTP.
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event Listeners
    const formStep1 = document.getElementById('wldn-auth-form-step1');
    const formStep2 = document.getElementById('wldn-auth-form-step2');
    const btnBack = document.getElementById('wldn-btn-back-step1');
    const btnDemo = document.getElementById('wldn-btn-demo-mode');

    formStep1.addEventListener('submit', handleSendOTP);
    formStep2.addEventListener('submit', handleVerifyOTP);

    btnBack.addEventListener('click', () => {
      formStep2.style.display = 'none';
      formStep1.style.display = 'block';
      document.getElementById('wldn-auth-step-title').textContent = "Verifikasi OTP Akses";
      document.getElementById('wldn-auth-step-subtitle').textContent = "Masukkan data diri Anda untuk menerima Kode OTP via Email.";
      hideAlert();
    });

    if (btnDemo) {
      btnDemo.addEventListener('click', handleDemoMode);
    }
  }

  // --- API HANDLERS ---

  async function handleSendOTP(e) {
    e.preventDefault();

    const nama = document.getElementById('wldn-input-nama').value.trim();
    const perusahaan = document.getElementById('wldn-input-perusahaan').value.trim();
    const email = document.getElementById('wldn-input-email').value.trim();
    const wa = document.getElementById('wldn-input-wa').value.trim();

    if (!nama || !perusahaan || !email) {
      showAlert('Mohon lengkapi Nama, Perusahaan, dan Email Anda!', 'error');
      return;
    }

    currentUserData = { nama, perusahaan, email, wa };
    setButtonLoading('wldn-btn-send-otp', true, 'Mengirim OTP...');
    hideAlert();

    const isGasConfigured = config.GAS_WEB_APP_URL && config.GAS_WEB_APP_URL.trim() !== "" && !config.GAS_WEB_APP_URL.includes("YOUR_SCRIPT_ID");

    if (!isGasConfigured) {
      setButtonLoading('wldn-btn-send-otp', false, '📱 Kirim Kode OTP Ke Email');
      showAlert('Web App URL Google Apps Script belum disetel di auth-config.js. Gunakan tombol Test Mode Demo.', 'warning');
      return;
    }

    try {
      // Send request to Google Apps Script
      const response = await fetch(config.GAS_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // Avoids CORS preflight
        },
        body: JSON.stringify({
          action: 'request_otp',
          nama: nama,
          perusahaan: perusahaan,
          email: email,
          wa: wa
        })
      });

      const res = await response.json();
      setButtonLoading('wldn-btn-send-otp', false, '📱 Kirim Kode OTP Ke Email');

      if (res.status === 'success') {
        showStep2View(email);
        showAlert(res.message || `Kode OTP dikirim ke ${email}. Silakan cek inbox/spam.`, 'info');
      } else {
        showAlert(res.message || 'Gagal mengirim OTP. Pastikan email Anda valid.', 'error');
      }
    } catch (err) {
      setButtonLoading('wldn-btn-send-otp', false, '📱 Kirim Kode OTP Ke Email');
      console.error('GAS Request Error:', err);
      showAlert('Terjadi kendala jaringan saat menghubungi server OTP. Silakan coba lagi.', 'error');
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();

    const otp = document.getElementById('wldn-input-otp').value.trim();
    if (!otp || otp.length !== 6) {
      showAlert('Masukkan 6 digit kode OTP!', 'error');
      return;
    }

    setButtonLoading('wldn-btn-verify-otp', true, 'Memverifikasi...');
    hideAlert();

    // Check for Demo Mode fallback
    if (currentUserData && currentUserData.isDemo) {
      setTimeout(() => {
        if (otp === '123456') {
          completeLogin(currentUserData);
        } else {
          setButtonLoading('wldn-btn-verify-otp', false, '🔓 Verifikasi & Masuk');
          showAlert('Kode OTP Demo salah! Gunakan kode 123456.', 'error');
        }
      }, 600);
      return;
    }

    try {
      const response = await fetch(config.GAS_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'verify_otp',
          email: currentUserData.email,
          otp: otp
        })
      });

      const res = await response.json();
      setButtonLoading('wldn-btn-verify-otp', false, '🔓 Verifikasi & Masuk');

      if (res.status === 'success') {
        const userData = res.user || currentUserData;
        const expiresAt = res.expiresAt;
        completeLogin(userData, expiresAt);
      } else {
        showAlert(res.message || 'Kode OTP salah atau kadaluwarsa!', 'error');
      }
    } catch (err) {
      setButtonLoading('wldn-btn-verify-otp', false, '🔓 Verifikasi & Masuk');
      console.error('GAS Verify Error:', err);
      showAlert('Gagal memverifikasi OTP. Periksa koneksi internet Anda.', 'error');
    }
  }

  function handleDemoMode() {
    const nama = document.getElementById('wldn-input-nama').value.trim() || "User Demo";
    const perusahaan = document.getElementById('wldn-input-perusahaan').value.trim() || "PT PLN Demo";
    const email = document.getElementById('wldn-input-email').value.trim() || "demo@wldn.com";
    const wa = document.getElementById('wldn-input-wa').value.trim();

    currentUserData = { nama, perusahaan, email, wa, isDemo: true };
    showStep2View(email);
    showAlert('MODE DEMO AKTIF: Gunakan kode OTP <strong>123456</strong> untuk masuk.', 'info');
  }

  function showStep2View(email) {
    document.getElementById('wldn-auth-form-step1').style.display = 'none';
    document.getElementById('wldn-auth-form-step2').style.display = 'block';

    document.getElementById('wldn-auth-step-title').textContent = "Masukkan Kode OTP";
    document.getElementById('wldn-auth-step-subtitle').innerHTML = `Kode OTP telah dikirimkan ke <strong>${escapeHtml(email)}</strong>`;

    const otpInput = document.getElementById('wldn-input-otp');
    otpInput.value = '';
    otpInput.focus();
  }

  function completeLogin(userData, expiresAt) {
    const session = saveSession(userData, expiresAt);

    // Fade out and remove modal
    const overlay = document.getElementById('wldn-auth-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        overlay.remove();
        document.body.classList.remove('wldn-auth-locked');
      }, 300);
    }

    injectUserBadge(session);
  }

  // --- UI HELPER FUNCTIONS ---

  function showAlert(msg, type) {
    const box = document.getElementById('wldn-auth-alert');
    if (!box) return;
    box.className = `wldn-auth-alert wldn-auth-alert-${type}`;
    box.innerHTML = msg;
    box.style.display = 'block';
  }

  function hideAlert() {
    const box = document.getElementById('wldn-auth-alert');
    if (box) box.style.display = 'none';
  }

  function setButtonLoading(btnId, isLoading, text) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = `<span class="wldn-auth-spinner"></span> ${text}`;
    } else {
      btn.disabled = false;
      btn.innerHTML = text;
    }
  }

  function injectUserBadge(session) {
    // Check if user badge already exists
    if (document.getElementById('wldn-user-badge')) return;

    const badge = document.createElement('div');
    badge.id = 'wldn-user-badge';

    const initials = (session.nama || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const daysLeft = Math.max(1, Math.ceil((session.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));

    // 1. Check if top-badge exists in header (Materi, Evaluasi, Kit Selector)
    const topBadge = document.querySelector('.top-badge');
    
    // 2. Check if sidebar navigation exists (Cable Calc)
    const sidebarNav = document.querySelector('nav.nav') || document.querySelector('.sidebar');
    const landingBar = document.querySelector('.landing-bar');
    const headerEl = document.querySelector('header');
    const navContainer = document.querySelector('.nav-container');

    if (topBadge) {
      // Replace top-badge directly on top bar (far right position, neat 1-line badge)
      badge.className = 'wldn-topbar-user-badge';
      badge.innerHTML = `
        <div class="wldn-user-badge-icon">${initials}</div>
        <span class="wldn-user-badge-text">${escapeHtml(session.nama)} <span class="wldn-user-badge-sub">(${escapeHtml(session.perusahaan)})</span></span>
        <button type="button" class="wldn-user-badge-logout" title="Keluar dari sesi (Aktif ${daysLeft} hari)" onclick="window.WLDNAuth.logout()">
          🚪 Keluar
        </button>
      `;
      topBadge.parentNode.replaceChild(badge, topBadge);
    } else if (sidebarNav) {
      // Specifically place in Sidebar Bottom for Cable Calc
      badge.className = 'wldn-user-badge wldn-sidebar-user-badge';
      badge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
          <div class="wldn-user-badge-icon" style="flex-shrink:0;">${initials}</div>
          <div class="wldn-user-badge-info" style="overflow: hidden;">
            <span class="wldn-user-badge-name" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px; display: block; font-size: 0.8rem;">${escapeHtml(session.nama)}</span>
            <span class="wldn-user-badge-company" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px; display: block; font-size: 0.68rem;">${escapeHtml(session.perusahaan)}</span>
          </div>
        </div>
        <button type="button" class="wldn-user-badge-logout" title="Keluar dari sesi" onclick="window.WLDNAuth.logout()" style="flex-shrink:0; background: rgba(239, 68, 68, 0.12); padding: 0.35rem 0.55rem; border-radius: 8px; font-size: 0.72rem;">
          🚪 Keluar
        </button>
      `;
      sidebarNav.appendChild(badge);
    } else if (landingBar || headerEl || navContainer) {
      const targetNav = landingBar || headerEl || navContainer;
      badge.className = 'wldn-user-badge';
      badge.innerHTML = `
        <div class="wldn-user-badge-icon">${initials}</div>
        <div class="wldn-user-badge-info">
          <span class="wldn-user-badge-name">${escapeHtml(session.nama)}</span>
          <span class="wldn-user-badge-company">${escapeHtml(session.perusahaan)} • Sesi ${daysLeft} Hari</span>
        </div>
        <button type="button" class="wldn-user-badge-logout" title="Keluar dari sesi" onclick="window.WLDNAuth.logout()">
          🚪 Keluar
        </button>
      `;
      targetNav.appendChild(badge);
    } else {
      // Floating fallback position
      badge.className = 'wldn-user-badge';
      badge.innerHTML = `
        <div class="wldn-user-badge-icon">${initials}</div>
        <div class="wldn-user-badge-info">
          <span class="wldn-user-badge-name">${escapeHtml(session.nama)}</span>
          <span class="wldn-user-badge-company">${escapeHtml(session.perusahaan)} • Sesi ${daysLeft} Hari</span>
        </div>
        <button type="button" class="wldn-user-badge-logout" title="Keluar dari sesi" onclick="window.WLDNAuth.logout()">
          🚪 Keluar
        </button>
      `;
      badge.style.position = 'fixed';
      badge.style.bottom = '1rem';
      badge.style.right = '1rem';
      badge.style.zIndex = '9999';
      document.body.appendChild(badge);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

})();
