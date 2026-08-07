# Resume Aplikasi: WLDN Engineering Tool Suite (V2.0 — Diorama Training 20 kV Edition)

**Portal Technical Suite & Interactive Calculator: Medium Voltage Termination, Jointing & Cable Sizing**

---

## 📌 Ringkasan Eksekutif

**WLDN Engineering Tool Suite (Version 2.0)** adalah aplikasi web interaktif berbasis standar teknik (IEC 60502, SNI, SPLN, PUIL/SNI 04-0225-2000, IEEE, NEC) yang dirancang khusus untuk mendukung **Diorama Training Ketenagalistrikan 20 kV** (Pelatihan Fasilitator & Jointer Kabel Tegangan Menengah).

Aplikasi telah diperbarui dengan struktur **4 Menu Utama** di Landing Page yang memetakan **7 Bab Outline Pelatihan**, mengintegrasikan data resmi katalog kabel **Jembo Cable (Medium Voltage Cable Catalogue)** & **Kabelindo**, serta menyertakan perkakas pemilah aksesoris kabel (Terminasi + **Jointing Kit Sambungan Lurus & Transisi 3M, Raychem, Prysmian**).

---

## 🚀 Peta 4 Menu Utama Landing Page (`index.html`)

```
                          [ 🌐 LANDING PAGE DASHBOARD (index.html) ]
                                             │
          ┌───────────────────┬──────────────┴───────────────┬───────────────────┐
          ▼                   ▼                             ▼                   ▼
   📚 1. MATERI &      📝 2. EVALUASI &         ⚡ 3. TERMINATION &       📐 4. CABLE SPECS &
   MODUL PELATIHAN        OJT CHECKLIST            JOINTING SELECTOR         SIZING CALCULATOR
   (materi.html)          (evaluasi.html)          (selector.html)           (cable-calc.html)
```

---

## 📖 Rincian Fitur & Modul Aplikasi

### 1. Main Portal Dashboard (`index.html`)
* **Fungsi:** Dashboard navigasi utama dengan desain *Glassmorphic Dark Mode* & *Win11 Light Mode* untuk mengakses 4 perkakas utama.
* **Fitur Utama:** Badge akreditasi SKKNI/PLN DIS.KON.016/029, card menu interaktif dengan tag topik pelatihan, dan info strip standar kompetensi.

---

### 2. Modul Materi & Pelatihan (`materi.html`) — *[Menu 1]*
Menyusun modul pembelajaran lengkap 7 Bab pelatihan dengan sidebar navigasi TOC (Table of Contents) interaktif:

* **BAB 1 — TEKNIK ISOLASI (Teori — Hari 1, Sesi 1):**
  * 1.1 Sifat dasar & syarat ideal dielektrik (ketahanan dielektrik, resistivitas, termal, fleksibilitas, impuls).
  * 1.2 Tabel komparatif **PVC vs XLPE vs EPR** (Suhu kerja kontinu $70^\circ\text{C}$ / $90^\circ\text{C}$ / $105^\circ\text{C}$, short-circuit $160^\circ\text{C}$ / $250^\circ\text{C}$, kuat dielektrik 15–25 kV/mm, rentang tegangan, water treeing, dielectric loss). *Poin KHA XLPE 18–22% lebih tinggi.*
  * 1.3 Breakdown Voltage & Electric Stress ($E_{max} = \frac{V}{r \ln(R/r)}$, $E_{min} = \frac{V}{R \ln(R/r)}$).
  * 1.4 Fenomena Water Treeing pada XLPE & urgensi VLF Testing 0.1Hz.
  * 1.5 Prinsip Stress Control / Stress Cone geometri pada titik terminasi.
  * 1.6 Uji Tahanan Isolasi (Megger 5.000V–10.000V DC).

* **BAB 2 — KABEL TEGANGAN MENENGAH 20 KV (Teori — Hari 1, Sesi 2):**
  * 2.1 Membaca kode kabel (N2XSEBY, N2XSY, NA2XSEBY, N2XSEYBY, dsb).
  * 2.2 Konstruksi fisik 8-10 lapisan kabel TM.
  * 2.3 & 2.4 Perbandingan spesifikasi teknis **Kabelindo vs Jembo Cable Catalogue** (N2XSEBY 12/20kV 3-Core — diameter, berat, KHA di udara/tanah).
  * 2.5 Perhitungan KHA & faktor koreksi ($I_{terijin} = I_{nom} \times f_{suhu} \times f_{kedalaman} \times f_{resistivitas} \times f_{grouping}$).
  * 2.6 Cross-link interaktif ke Cable Calculator.

* **BAB 3 — KONSTRUKSI KABEL TANAH 20 KV (Teori — Hari 1, Sesi 3):**
  * 3.1 Jenis konstruksi: Tanam Langsung (Direct Buried), Pipa Conduit (min 5", bak kontrol 100m, 150x100cm), Tunneling (manhole 50m, penangkap air 40x40x20cm).
  * 3.2 Dimensi galian standar PLN Buku 5 (lebar 0.4m, kedalaman 70–80cm, pasir urug 20cm, batu peringatan "AWAS KABEL PLN BERTEGANGAN", stamper per 30cm, max 7 kabel per galian).
  * 3.3 Penandaan patok jalur kabel (maks 30m & titik jointing).
  * 3.4 **Tabel Jarak Aman Utilitas** (SNI 04-0225-2000): Persilangan SKTM (30cm), Telkom (30cm/1m), PAM/Gas, SKTR (30cm/120cm), Rel Kereta (2m/pipa baja 6"), Crossing sungai (>50m/SUTM tiang min 2m dari banjir 10 tahunan, 500 daN).
  * 3.5 Urutan kerja konstruksi & uji komisioning (Megger $\rightarrow$ DC 57kV 1 mnt $\rightarrow$ Megger $\rightarrow$ AC 20kV 15 mnt $\rightarrow$ Megger $\rightarrow$ Energize 20kV).
  * 3.6 Perizinan PEMDA.

* **BAB 4 — KOTAK SAMBUNG DAN TERMINASI (Teori — Hari 2, Sesi 1):**
  * 4.1 Heat shrink vs Cold shrink vs Resin.
  * 4.2 Indoor vs Outdoor termination (weathershed/skirt).
  * 4.3 Kit Selector parameter & 4.4 Database 3M, Raychem, Prysmian.
  * 4.5 SOP 5-Langkah sebelum potong kabel & 4.6 Skun, Torsi baut ($M8, M10, M12, M16$), Clearance IEC 60071-1.

* **BAB 5 — PRAKTEK PENYAMBUNGAN & TERMINASI (Praktek — Hari 2, Sesi 2–3):**
  * 5.1 Alat & bahan, 5.2 SOP K3 (LOTO, discharge rod, APD wajib), 5.3–5.4 Panduan praktik terminasi outdoor/indoor & jointing.
  * 5.5 Megger test pasca-instalasi ($\ge 1 \text{ M}\Omega/\text{kV}$) & 5.6 Hipot, VLF 0.1Hz, Partial Discharge.

* **BAB 6 — AKTIVITAS OJT & SERTIFIKASI (Evaluasi — Hari 2, Sesi 4):**
  * 6.1 Unit kompetensi `DIS.KON.016(2)A` dan `DIS.KON.029(2)A`.

* **BAB 7 — DISKUSI & PENUTUP (Penutup — Hari 2, Sesi 5):**
  * 7.1 Statistik Studi Kasus Kegagalan Jointing (**50% SDM tidak kompeten, 22% kesalahan material, 28% kualitas material**).

---

### 3. Modul Evaluasi & OJT Checklist (`evaluasi.html`) — *[Menu 2]*
* **Evaluation Quiz Interaktif (Bab 1–7):** 10 soal pilihan ganda berbobot dengan sistem skor otomatis, feedback rasional, dan penjelasan teknis tiap soal.
* **Form Checklist Kompetensi Praktik OJT:** Penilaian 9 kriteria unjuk kerja jointer TM (`DIS.KON.016(2)A` & `DIS.KON.029(2)A`).
* **Form Laporan Kegiatan OJT 1 Halaman:** Form digital interaktif **Printable / PDF Ready** (tombol print otomatis).
* **Analisis Studi Kasus Kegagalan Jointing (50:22:28).**

---

### 4. Modul Termination & Jointing Kit Selector (`termination-jointing-selector.html`) — *[Menu 3]*
* **Kit Selector Wizard (Terminasi + Jointing):**
  * Pilihan Aksesoris: **Terminasi (Indoor/Outdoor)** vs **Jointing / Sambungan Kabel (Straight Joint / Transition Joint)**.
  * Parameter: Tegangan (12kV, 24kV, 36kV), Cores (1-Core / 3-Core), Penampang ($35\text{ mm}^2 - 300\text{ mm}^2$).
  * Output Kode Kit Presisi: **3M Cold Shrink** (QT-III/QT-II, QS-III/QS-2000), **Raychem Heat Shrink** (TFTI/TFTO, MXSU/RVS), dan **Prysmian** (Elaspeed & Heat Shrink).
* **SOP 5-Langkah & Cutback Calculator Z:** Visualizer diagram potongan layer kabel & checklist persiapan.
* **Pengujian Pasca-Instalasi & K3 Safety.**
* **Tabel Skun/Lug, Torsi Baut ($M8, M10, M12, M16$) & Clearance IEC 60071-1.**

---

### 5. Cable Specs & Sizing Calculator (`cable-calc.html`) — *[Menu 4]*
* **Geometri Penampang Conductor & Canvas Graphic:** Visualisasi interaktif struktur penampang kabel.
* **Resistansi DC & AC:** Injeksi temperatur ($70^\circ\text{C}/90^\circ\text{C}$), *Skin Effect* ($y_s$), dan *Proximity Effect* ($y_p$).
* **Voltage Drop (% Susut Tegangan):** 1-Phase & 3-Phase beserta indikator status efisiensi.
* **Ampacity KHA & Sizing Advisor:** Rekomendasi otomatis ukuran kabel terkecil yang aman berdasarkan daya beban ($kW/kVA$).
* **Datasheet Vendor Comparison (Jembo vs Kabelindo):** Tabel perbandingan spesifikasi kabel N2XSEBY 12/20kV dari katalog resmi **PT Jembo Cable Company Tbk.** vs Kabelindo.
* **Tabel Derating Factor Jembo Cable:** Koreksi Suhu Tanah ($10^\circ\text{C}-50^\circ\text{C}$), Kedalaman Tanam ($0.5\text{m}-3\text{m}$), Soil Thermal Resistivity ($0.7-3.0\text{ K}\cdot\text{m/W}$), dan Grouping factors.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, Vanilla CSS3 | Custom Properties, Flexbox, Grid System, Glassmorphic & Win11 Fluent Design System. |
| **Theme Engine** | Dynamic Light/Dark Switcher | Pergantian mode terang/gelap secara *real-time*. |
| **Logika & Engine**| Pure JavaScript (ES6+) | *Zero-dependency client-side execution*. |
| **Visual Graphics**| Canvas API & CSS Layer Diagram | Diagram fisik penampang kabel dan jarak kupasan cutback Z. |
| **Print Engine** | `@media print` CSS | Layout otomatis bebas elemen navigasi saat mencetak laporan OJT / simpan PDF. |
| **Standar Acuan** | IEC, SNI, SPLN, PUIL | IEC 60502, IEC 60071-1, PUIL / SNI 04-0225-2000, SKKNI Jointer TM. |

---
*Dokumen resume ini diperbarui secara otomatis berdasarkan kode sumber WLDN Engineering Tool Suite V2.0.*
