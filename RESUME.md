# RESUME APLIKASI DIORAMA TRAINING: MV CABLE SUITE & ACCESSORY SELECTOR

## 📌 Ringkasan Eksekutif
Aplikasi **WLDN MV Cable Suite & Accessory Selector** adalah platform web interaktif serbaguna (*all-in-one suite*) yang dirancang khusus untuk memenuhi kebutuhan **Pelatihan Fasilitator & Jointer Kabel Tegangan Menengah (SKTM 20 kV)**. Platform ini disusun berdasarkan kurikulum pelatihan 7 Bab, standar konstruksi **PT PLN (Persero) Buku 5**, standar keselamatan **PUIL 2011 / SNI 04-0225-2000**, katalog resmi kabel **PT Jembo Cable Company Tbk.** & **Kabelindo**, serta standar pengujian internasional (**IEC 60502-2**, **IEC 61442**, **IEEE Std 48**, **IEEE Std 404**, **IEEE Std 400.2**, **NETA MTS-2023**, dan **SKKNI DIS.KON.016/029**).

---

## 🚀 Fitur Utama & Struktur Navigasi Aplikasi

Aplikasi memiliki **Landing Page Dashboard (`index.html`)** dengan **4 Card Menu utama** yang memberikan akses langsung ke seluruh perkakas pelatihan:

### 1. Landing Page Dashboard (`index.html`)
* **Top Bar Navigasi & Theme Engine:** Win11 Fluent Design System dengan fitur toggle mode terang (*Light Mode*) dan mode gelap (*Dark Mode*).
* **Header & Quick Summary:** Informasi versi aplikasi, standar acuan, dan deskripsi suite.
* **4 Cards Interactive Navigation Grid:**
  1. **📚 Materi & Knowledge Base (7 Bab):** Ruang baca modul teori & panduan standar pelatihan.
  2. **📝 Evaluasi & OJT Checklist:** Kuis evaluasi 12 soal, checklist kompetensi jointer, & laporan printable.
  3. **🧮 Kit Selector Terminasi + Jointing:** Perkakas pemilah kit aksesoris 3M, Raychem, Prysmian, SOP Cutback Z, & Torsi.
  4. **⚡ Cable Specs & Sizing Calculator:** Kalkulator teknis KHA, susut tegangan, resistansi AC/DC, & komparasi Katalog Vendor.

---

### 2. Modul Materi & Pelatihan (`materi.html`) — *[Menu 1]*
Menyusun modul pembelajaran lengkap 7 Bab pelatihan dengan sidebar navigasi TOC (Table of Contents) interaktif:

* **BAB 1 — TEKNIK ISOLASI (Teori — Hari 1, Sesi 1):**
  * 1.1 Sifat dasar & syarat ideal dielektrik (ketahanan dielektrik, resistivitas, termal, fleksibilitas, impuls).
  * 1.2 Tabel komparatif **PVC vs XLPE vs EPR** (Suhu kerja kontinu 70°C / 90°C / 105°C, short-circuit 160°C / 250°C, kuat dielektrik 15–25 kV/mm, rentang tegangan, water treeing, dielectric loss). *Poin KHA XLPE 18–22% lebih tinggi.*
  * 1.3 Breakdown Voltage & Electric Stress (E_max = V / (r · ln(R/r)), E_min = V / (R · ln(R/r))).
  * 1.4 Fenomena Water Treeing pada XLPE & urgensi VLF Testing 0.1Hz.
  * 1.5 Prinsip Stress Control / Stress Cone geometri pada titik terminasi.
  * 1.6 Uji Tahanan Isolasi (Megger 2.500V–5.000V DC).

* **BAB 2 — KABEL TEGANGAN MENENGAH 20 KV (Teori — Hari 1, Sesi 2):**
  * 2.1 Membaca kode kabel (N2XSEBY, N2XSY, NA2XSEBY, N2XSEYBY, dsb).
  * 2.2 Konstruksi fisik 8-10 lapisan kabel TM.
  * 2.3 & 2.4 Perbandingan spesifikasi teknis **Kabelindo vs Jembo Cable Catalogue** (N2XSEBY 12/20kV 3-Core — diameter, berat, KHA di udara/tanah).
  * 2.5 Perhitungan KHA & faktor koreksi (I_terijin = I_nominal × f_suhu × f_kedalaman × f_resistivitas × f_grouping).
  * 2.6 Cross-link interaktif ke Cable Calculator.

* **BAB 3 — KONSTRUKSI KABEL TANAH 20 KV (Teori — Hari 1, Sesi 3):**
  * 3.1 Jenis konstruksi: Tanam Langsung (Direct Buried), Pipa Conduit (min 5", bak kontrol 100m, 150x100cm), Tunneling (manhole 50m, penangkap air 40x40x20cm).
  * 3.2 Dimensi galian standar PLN Buku 5 (lebar 0.4m, kedalaman 70–80cm, pasir urug 20cm, batu peringatan "AWAS KABEL PLN BERTEGANGAN", stamper per 30cm, max 7 kabel per galian).
  * 3.3 Penandaan patok jalur kabel (maks 30m & titik jointing).
  * 3.4 **Tabel Jarak Aman Utilitas** (SNI 04-0225-2000): Persilangan SKTM (30cm), Telkom (30cm/1m), PAM/Gas, SKTR (30cm/120cm), Rel Kereta (2m/pipa baja 6"), Crossing sungai (>50m/SUTM tiang min 2m dari banjir 10 tahunan, 500 daN).
  * 3.5 Urutan kerja konstruksi & uji komisioning (Megger 2.5/5kV → DC 57kV 1 mnt → Megger → AC 20kV 15 mnt → Megger → Energize 20kV).
  * 3.6 Perizinan PEMDA.

* **BAB 4 — KOTAK SAMBUNG DAN TERMINASI (Teori — Hari 2, Sesi 1):**
  * 4.1 Heat shrink vs Cold shrink vs Resin.
  * 4.2 Indoor vs Outdoor termination (weathershed/skirt).
  * 4.3 Pemetaan Kode Kit Raychem HVT-Z 15kV (HVT-Z-151 s.d HVT-Z-154 G/SG).
  * 4.4 Rekomendasi Skirt 3M QT-III Outdoor berdasarkan Tingkat Polusi Lingkungan (Light, Medium, Heavy, Extremely Heavy).
  * 4.5 Aturan Material Lug Tembaga (Cu), Aluminium (Al), & Bimetal (mencegah korosi galvanis).

* **BAB 5 — PRAKTEK PENYAMBUNGAN & TERMINASI (Praktek — Hari 2, Sesi 2–3):**
  * 5.1 Alat & bahan, 5.2 SOP K3 (LOTO, discharge rod, APD wajib), 5.3–5.4 Panduan praktik terminasi outdoor/indoor & jointing.
  * 5.5 Megger test pasca-instalasi (≥ 1 MΩ/kV) & 5.6 Hipot, VLF 0.1Hz, Partial Discharge.

* **BAB 6 — AKTIVITAS OJT & SERTIFIKASI (Evaluasi — Hari 2, Sesi 4):**
  * 6.1 Unit kompetensi `DIS.KON.016(2)A` dan `DIS.KON.029(2)A`.

* **BAB 7 — DISKUSI & PENUTUP (Penutup — Hari 2, Sesi 5):**
  * 7.1 Statistik Studi Kasus Kegagalan Jointing (**50% SDM tidak kompeten, 22% kesalahan material, 28% kualitas material**).

* **MATRIKS STANDAR TEKNIK RESMI:**
  * Tabel referensi IEC 60502-2, IEC 61442, IEEE Std 48, IEEE Std 404, IEEE Std 400.2, NETA MTS-2023, PUIL 2011, PLN Buku 5, & SKKNI.

---

### 3. Modul Evaluasi & OJT Checklist (`evaluasi.html`) — *[Menu 2]*
* **Evaluation Quiz Interaktif (Bab 1–7):** 12 soal pilihan ganda berbobot dengan sistem skor otomatis, feedback rasional, dan penjelasan teknis tiap soal (Heat vs Cold shrink, bimetal lug, IEEE 48 vs 404).
* **Form Checklist Kompetensi Praktik OJT:** Penilaian 9 kriteria unjuk kerja jointer TM (`DIS.KON.016(2)A` & `DIS.KON.029(2)A`).
* **Form Laporan Kegiatan OJT 1 Halaman:** Form digital interaktif **Printable / PDF Ready** (tombol print otomatis).
* **Analisis Studi Kasus Kegagalan Jointing (50:22:28).**

---

### 4. Modul Termination & Jointing Kit Selector (`termination-jointing-selector.html`) — *[Menu 3]*
* **Kit Selector Wizard (Terminasi + Jointing):**
  * Pilihan Aksesoris: **Terminasi (Indoor/Outdoor)** vs **Jointing / Sambungan Kabel (Straight Joint / Transition Joint)**.
  * Parameter: Tegangan (12kV, 24kV, 36kV), Cores (1-Core / 3-Core), Penampang (35 mm² – 300 mm²), Tingkat Polusi (Outdoor).
  * Output Kode Kit Presisi: **3M Cold Shrink** (QT-III/QT-II, QS-III/QS-2000), **Raychem Heat Shrink** (HVT-Z-151/152/153/154, MXSU/RVS), dan **Prysmian** (Elaspeed & ColdFit).
* **SOP 5-Langkah Field Checklist (Checkbox Interaktif).**
* **Accordion Maintenance 3M QT-III & Troubleshooting Lapangan.**
* **Interactive Cutback Z Calculator (Form Live JS Input & Formula Z = Stress Tube + Lug + Gap).**
* **Tabel Uji Kualifikasi IEEE Std 48 / IEEE Std 404 Class 1 & Accordion Megger IEEE 400 / NETA MTS-2023.**
* **Tabel Skun/Lug, Torsi Baut (M8, M10, M12, M16), Shear Bolt Specs, & Tabel Clearance Minimum IEC 60071-1.**

---

### 5. Cable Specs & Sizing Calculator (`cable-calc.html`) — *[Menu 4]*
* **Geometri Penampang Conductor & Canvas Graphic:** Visualisasi interaktif struktur penampang kabel.
* **Resistansi DC & AC:** Injeksi temperatur (70°C / 90°C), *Skin Effect* (y_s), dan *Proximity Effect* (y_p).
* **Voltage Drop (% Susut Tegangan):** 1-Phase & 3-Phase beserta indikator status efisiensi.
* **Ampacity KHA & Sizing Advisor:** Rekomendasi otomatis ukuran kabel terkecil yang aman berdasarkan daya beban (kW / kVA).
* **Datasheet Vendor Comparison (Jembo vs Kabelindo):** Tabel perbandingan spesifikasi kabel N2XSEBY 12/20kV dari katalog resmi **PT Jembo Cable Company Tbk.** vs Kabelindo.
* **Tabel Derating Factor Jembo Cable:** Koreksi Suhu Tanah (10°C – 50°C), Kedalaman Tanam (0.5m – 3m), Soil Thermal Resistivity (0.7 – 3.0 K·m/W), dan Grouping factors.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, Vanilla CSS3 | Custom Properties, Flexbox, Grid System, Glassmorphic & Win11 Fluent Design System. |
| **Theme Engine** | Dynamic Light/Dark Switcher | Pergantian mode terang/gelap secara *real-time*. |
| **Logika & Engine**| Pure JavaScript (ES6+) | *Zero-dependency client-side execution*. |
| **Visual Graphics**| Canvas API & CSS Layer Diagram | Diagram fisik penampang kabel dan jarak kupasan cutback Z. |
| **Print Engine** | `@media print` CSS | Layout otomatis bebas elemen navigasi saat mencetak laporan OJT / simpan PDF. |
| **Standar Acuan** | IEC, IEEE, SNI, SPLN, PUIL | IEC 60502-2, IEC 61442, IEEE 48, IEEE 404, IEEE 400.2, NETA MTS-2023, PUIL / SNI 04-0225-2000, SKKNI. |

---

## 📌 Ringkasan Commit Git
1. `de848ee` - *Feat: Restructure landing page into 4 core menu cards, add 7-chapter training curriculum, quiz & OJT checklist, printable OJT report, and Jembo Cable catalogue derating factor tables.*
2. `e86bc6c` - *Fix: Restore full 5-step checklist, accordions, live cutback calculator, IEEE 48 test table, and lug specs in termination-jointing-selector.html.*
3. `642b9ee` - *Feat: Enrich knowledge base with Raychem HVT-Z, 3M QT-III pollution guide, bimetallic lug rules, and IEC/IEEE/SPLN standards matrix.*
