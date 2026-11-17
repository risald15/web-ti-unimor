# Portal Website Program Studi Teknologi Informasi
## Universitas Timor (UNIMOR)

Website resmi Program Studi Teknologi Informasi, Fakultas Pertanian, Sains dan Kesehatan, Universitas Timor (UNIMOR), Kefamenanu, Nusa Tenggara Timur. Dibangun dengan framework **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**, dengan benchmarking arsitektur portal perguruan tinggi terkemuka seperti `ti.polbeng.ac.id`.

---

## 🚀 Fitur Unggulan

1. **Top Bar & Header Portal:** Integrasi tautan cepat ke SIAKAD UNIMOR, PMB Online, E-Learning (LMS), dan website utama universitas.
2. **Hero Slider Dinamis:** Showcase visi keilmuan, kuliah umum AI ("From Prompt to Application dan From Application to Production"), dan akreditasi BAN-PT.
3. **Sambutan Koordinator Prodi:** Sambutan resmi Kaprodi TI UNIMOR (Risald, S.Kom., M.T.).
4. **Statistik Kunci:** Indikator akreditasi, rasio dosen berpendidikan S2/S3, 3 laboratorium riset, dan ratusan mahasiswa aktif.
5. **Bidang Peminatan / Konsentrasi:**
   - Rekayasa Perangkat Lunak & Sistem Cerdas (AI)
   - Jaringan Komputer & Keamanan Siber
   - Sains Data & Tata Kelola Sistem Informasi
6. **Warta, Berita & Agenda Akademik:** Kategori Berita, Pengumuman, Agenda Seminar/Ujian, dan Prestasi Mahasiswa.
7. **Direktori Dosen & Staf Pengajar:** Dilengkapi foto, gelar, NIP, fokus riset, Google Scholar, dan SINTA.
8. **Laboratorium & Sarana Kampus:** Detail Lab RPL & AI, Lab Jaringan & Keamanan Siber, serta Lab Multimedia & IoT di Kampus Sasi Kefamenanu.
9. **Kurikulum S1 Interaktif:** Rincian mata kuliah semester 1 s.d 8 beserta beban SKS dan deskripsi kompetensi OBE.
10. **Kontak & Helpdesk Sekretariat:** Formulir konsultasi daring dan petunjuk lokasi strategis perbatasan RI-RDTL.

---

## 📂 Struktur Direktori Proyek

```
web-ti-unimor/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Template root & metadata SEO prodi
│   │   ├── globals.css        # Konfigurasi Tailwind CSS
│   │   ├── page.tsx           # Halaman utama (Landing Page)
│   │   ├── profil/page.tsx    # Visi Misi, Sejarah & Struktur Organisasi
│   │   ├── akademik/page.tsx  # Kurikulum Semester 1-8 & Panduan Skripsi
│   │   ├── dosen/page.tsx     # Direktori Dosen & Profil Publikasi
│   │   ├── fasilitas/page.tsx # Laboratorium Komputer & SOP Riset
│   │   ├── berita/page.tsx    # Arsip Berita, Pengumuman & Agenda
│   │   └── kontak/page.tsx    # Sekretariat, Peta Lokasi & Form Kirim Pesan
│   ├── components/
│   │   ├── Navbar.tsx         # Top bar & navigasi responsif
│   │   ├── HeroSlider.tsx     # Banner slider utama
│   │   ├── SambutanKaprodi.tsx# Sambutan Koordinator Program Studi
│   │   ├── StatistikSection.tsx # Kartu angka statistik prodi
│   │   ├── BidangMinatSection.tsx # 3 Peminatan keahlian
│   │   ├── BeritaDanAgenda.tsx# Grid berita terkini & filter kategori
│   │   ├── FasilitasSection.tsx # Showcase laboratorium komputer
│   │   ├── DosenPreview.tsx   # Pratinjau dosen di beranda
│   │   ├── PortalMahasiswa.tsx# Akses cepat portal SIAKAD & PMB
│   │   └── Footer.tsx         # Footer resmi kampus UNIMOR
│   └── data/
│       └── siteData.ts        # Data terpusat (Dosen, Berita, Lab, Matkul, Kontak)
├── package.json
└── tsconfig.json
```

---

## 🛠️ Cara Menjalankan Proyek Secara Lokal

### 1. Masuk ke Direktori Proyek
```bash
cd "C:\Users\risal\.gemini\antigravity\scratch\web-ti-unimor"
```

### 2. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

### 3. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## ✏️ Cara Menyesuaikan Konten

Seluruh data konten teks, nama dosen, berita terbaru, mata kuliah kurikulum, dan informasi kontak dipusatkan di satu file:
👉 `src/data/siteData.ts`

* **Menambah/Mengedit Dosen:** Buka `daftarDosen` di `siteData.ts` lalu ubah nama, NIP, email, link Sinta, atau bidang keahlian.
* **Menambah Berita / Pengumuman Baru:** Tambahkan objek baru ke array `daftarBerita`.
* **Menyesuaikan Mata Kuliah:** Ubah array `strukturKurikulum` sesuai buku kurikulum terbaru prodi.

---

## 🌐 Panduan Deployment

### Opsi A: Vercel (Gratis, Otomatis & Cepat)
1. Unggah repositori ini ke GitHub (misal: `github.com/ti-unimor/website`).
2. Masuk ke [vercel.com](https://vercel.com) menggunakan akun GitHub.
3. Klik **Add New Project**, pilih repositori `website`, lalu klik **Deploy**.
4. Di dashboard Vercel, masuk ke **Settings > Domains**, tambahkan subdomain kampus Anda (misal `ti.unimor.ac.id`), lalu arahkan CNAME DNS dari Puskom/TIK UNIMOR.

### Opsi B: Server Kampus / VPS UNIMOR (Docker / Node.js)
1. Jalankan `npm run build`.
2. Jalankan `npm run start` dengan process manager seperti `pm2` (`pm2 start npm --name "web-ti-unimor" -- start`).
3. Setup Nginx Reverse Proxy ke port `3000` dengan sertifikat SSL (Let's Encrypt).
