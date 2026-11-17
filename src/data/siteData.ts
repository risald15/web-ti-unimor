export interface Dosen {
  id: string;
  nama: string;
  gelar: string;
  nip: string;
  jabatan: string;
  bidangKeahlian: string[];
  pendidikanTerakhir: string;
  email: string;
  scholarUrl?: string;
  sintaId?: string;
  foto?: string;
  fotoUrl?: string;
  scholarId?: string;
  totalSitasi?: number;
  hIndex?: number;
  i10Index?: number;
  sintaScoreOverall?: number;
  sintaScore3Yr?: number;
}

export interface Berita {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  isiLengkap: string;
  kategori: 'Berita' | 'Pengumuman' | 'Agenda' | 'Prestasi';
  tanggal: string;
  penulis: string;
  gambarUrl: string;
  featured?: boolean;
}

export interface LabFasilitas {
  id: string;
  nama: string;
  deskripsi: string;
  kapasitas: string;
  spesifikasi: string[];
  peruntukan: string;
  gambarUrl: string;
  dosenId?: string;
  penanggungJawab?: string;
  nipPenanggungJawab?: string;
}

export interface MataKuliah {
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  kategori: 'Wajib' | 'Pilihan' | 'Keahlian Inti';
  deskripsi: string;
  dosenPengampuId?: string;
  dosenPengampu?: string;
  nipPengampu?: string;
  peminatanId?: string;
  peminatanNama?: string;
}

export const siteConfig = {
  namaProdi: "Teknologi Informasi",
  jenjang: "Strata 1 (S1)",
  fakultas: "Fakultas Pertanian, Sains dan Kesehatan",
  universitas: "Universitas Timor (UNIMOR)",
  singkatan: "TI UNIMOR",
  slogan: "Inovatif, Berkarakter, Unggul di Wilayah Perbatasan & Berdaya Saing Global di Era Kecerdasan Buatan",
  akreditasi: "Terakreditasi Baik",
  nomorSk: "SK BAN-PT No. 1204/SK/BAN-PT/Ak-PKP/S/III/2023",
  alamat: "Jl. Km. 09 Kelurahan Sasi, Kota Kefamenanu, Kabupaten Timor Tengah Utara (TTU), Nusa Tenggara Timur (NTT) 85613",
  email: "ti@unimor.ac.id",
  telepon: "(0388) 2433011",
  whatsapp: "+62 821-4567-8901",
  jamLayanan: "Senin - Jumat, 08.00 - 16.00 WITA",
  sosialMedia: {
    instagram: "https://instagram.com/ti_unimor",
    youtube: "https://youtube.com/@ti_unimor",
    facebook: "https://facebook.com/ti.unimor",
    github: "https://github.com/ti-unimor",
  },
  portalEksternal: [
    { label: "SIAKAD UNIMOR", url: "https://siakad.unimor.ac.id", deskripsi: "Sistem Informasi Akademik Mahasiswa & Dosen" },
    { label: "E-Learning (LMS)", url: "https://elearning.unimor.ac.id", deskripsi: "Pembelajaran Daring Terpadu" },
    { label: "PMB Online", url: "https://pmb.unimor.ac.id", deskripsi: "Penerimaan Mahasiswa Baru" },
    { label: "Website UNIMOR", url: "https://unimor.ac.id", deskripsi: "Portal Resmi Universitas Timor" },
    { label: "Repository & Skripsi", url: "https://repository.unimor.ac.id", deskripsi: "Arsip Tugas Akhir & Karya Ilmiah" },
    { label: "Jurnal TI UNIMOR", url: "https://jurnal.unimor.ac.id", deskripsi: "Publikasi Ilmiah Bidang IT & Komputer" },
  ]
};

export const sambutanKaprodi = {
  "nama": "Yasinta Oktaviana Legu Rema, S.Kom., M.T.",
  "jabatan": "Koordinator Program Studi Teknologi Informasi",
  "nip": "198303262024212014",
  "pesanSingkat": "Selamat datang di website resmi Program Studi Teknologi Informasi, Fakultas Pertanian, Sains dan Kesehatan, Universitas Timor.",
  "isi": [
    "Puji syukur ke hadirat Tuhan Yang Maha Esa atas rahmat dan karunia-Nya, portal resmi Program Studi Teknologi Informasi Universitas Timor kini hadir sebagai media informasi, transparansi, serta jembatan komunikasi antara sivitas akademika, calon mahasiswa, alumni, dan masyarakat luas.",
    "Berada di gerbang perbatasan Republik Indonesia dan Republik Demokratik Timor Leste, Program Studi Teknologi Informasi UNIMOR memiliki komitmen kokoh untuk mencetak talenta digital yang adaptif terhadap percepatan teknologi revolusi industri 4.0 dan era Artificial Intelligence (AI). Kami memadukan kurikulum berstandar industri dengan penguatan kompetensi rekayasa perangkat lunak, sistem cerdas, dan teknologi informasi terapan.",
    "Melalui sinergi Tridharma Perguruan Tinggi—pendidikan berkualitas, riset kolaboratif, serta pengabdian masyarakat yang solutif—kami terus bergerak maju menghantarkan generasi muda Timor dan Indonesia menjadi inovator teknologi yang berintegritas tinggi dan berdaya saing global.",
    "Kami mengundang seluruh civitas akademika, calon mahasiswa baru, dan para mitra industri untuk bersama-sama berkolaborasi dalam ekosistem akademik yang dinamis dan berorientasi masa depan."
  ],
  "dosenId": "dosen-1",
  "foto": "/uploads/dosen/sinta-dosen-1.jpg"
};

export const visiMisi = {
  visi: "Menjadi Program Studi Teknologi Informasi yang unggul, berkarakter, dan berdaya saing di tingkat nasional maupun internasional dalam pengembangan teknologi informasi dan sistem cerdas yang kontekstual bagi kawasan perbatasan pada tahun 2030.",
  misi: [
    "Menyelenggarakan pendidikan sarjana Teknologi Informasi yang berkualitas tinggi, adaptif terhadap perkembangan AI, Rekayasa Perangkat Lunak, dan Keamanan Siber.",
    "Melaksanakan penelitian inovatif dan aplikatif di bidang teknologi informasi yang mampu menjawab tantangan dan potensi wilayah perbatasan RI-RDTL serta kebutuhan global.",
    "Melaksanakan pengabdian kepada masyarakat berbasis penerapan teknologi tepat guna untuk mendorong transformasi digital di bidang pertanian, kesehatan, pemerintahan, dan UMKM lokal.",
    "Membangun jejaring kemitraan strategis dengan institusi pendidikan terkemuka, industri teknologi, dan pemerintah guna memperkuat kompetensi serta serapan lulusan."
  ],
  tujuan: [
    "Menghasilkan lulusan Sarjana Komputer (S.Kom.) yang kompeten, beretika profesi, serta mampu bersaing sebagai Software Engineer, Data Scientist, Network/Security Specialist, maupun IT Technopreneur.",
    "Meningkatkan kuantitas dan kualitas publikasi ilmiah dosen dan mahasiswa pada jurnal bereputasi nasional (SINTA) dan internasional.",
    "Mewujudkan tata kelola program studi yang transparan, akuntabel, dan berbasis teknologi informasi modern.",
    "Membekali mahasiswa dengan sertifikasi kompetensi keahlian berstandar nasional dan internasional sebelum kelulusan."
  ]
};

export const dataStatistik = [
  { angka: "Baik", label: "Akreditasi BAN-PT", keterangan: "Mutu Akademik Terjamin" },
  { angka: "450+", label: "Mahasiswa Aktif", keterangan: "Generasi Penerus Talenta Digital" },
  { angka: "100%", label: "Dosen S2 & S3", keterangan: "Lulusan Kampus Ternama" },
  { angka: "3", label: "Laboratorium Riset", keterangan: "RPL, Jaringan & AI" },
  { angka: "25+", label: "Mitra Kerjasama", keterangan: "Industri & Kampus Mitra" }
];

export const peminatanProdi = [
  {
    id: "rpl-ai",
    judul: "Rekayasa Perangkat Lunak & Sistem Cerdas (AI)",
    ringkasan: "Fokus pada perancangan arsitektur web modern, aplikasi mobile, cloud computing, serta integrasi kecerdasan buatan (Prompt to Production).",
    kompetensi: ["Fullstack Web Development (React/Next.js)", "Mobile Application", "AI Engineering & LLM Integration", "DevOps & Cloud Deployment"],
    prospekKarir: ["Software Engineer", "Fullstack Developer", "AI Engineer", "Frontend/Backend Specialist"]
  },
  {
    id: "cyber-network",
    judul: "Jaringan Komputer & Keamanan Siber",
    ringkasan: "Fokus pada arsitektur infrastruktur jaringan komputer, komputasi awan, administrasi server, pertahanan siber, dan audit keamanan sistem.",
    kompetensi: ["Network Architecture & Routing", "Cyber Security & Ethical Hacking", "Cloud Infrastructure (AWS/GCP)", "Server & Linux Administration"],
    prospekKarir: ["Network Engineer", "Cybersecurity Analyst", "System Administrator", "Cloud Architect"]
  },
  {
    id: "data-si",
    judul: "Sains Data & Tata Kelola Sistem Informasi",
    ringkasan: "Fokus pada pengolahan big data, pemodelan analitik data, business intelligence, serta perancangan enterprise architecture untuk organisasi.",
    kompetensi: ["Data Analytics & Machine Learning", "Database Management & SQL", "Business Intelligence & Data Viz", "IT Governance & Audit"],
    prospekKarir: ["Data Scientist", "Data Analyst", "Database Administrator", "IT Consultant"]
  }
];

export const daftarDosen: Dosen[] = [
  {
    "id": "dosen-1",
    "nama": "Yasinta Oktaviana Legu Rema",
    "gelar": "S.Kom., M.T.",
    "nip": "198303262024212014",
    "jabatan": "Koordinator Program Studi",
    "bidangKeahlian": [
      "Sistem Informasi Terapan",
      "Sistem Pendukung Keputusan",
      "Kecerdasan Buatan (AI)",
      "Rekayasa Perangkat Lunak"
    ],
    "pendidikanTerakhir": "Magister Teknik (M.T.)",
    "email": "yasintarema@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Yasinta+Oktaviana+Legu+Rema",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6680437",
    "scholarId": "yasintarema_unimor",
    "totalSitasi": 120,
    "hIndex": 5,
    "i10Index": 3,
    "sintaScoreOverall": 366,
    "sintaScore3Yr": 191,
    "foto": "/uploads/dosen/sinta-dosen-1.jpg"
  },
  {
    "id": "dosen-2",
    "nama": "Risald",
    "gelar": "S.Kom., M.T.",
    "nip": "199305152024061004",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Rekayasa Perangkat Lunak",
      "Web Engineering",
      "Kecerdasan Buatan (AI)",
      "Sistem Informasi"
    ],
    "pendidikanTerakhir": "Magister Teknik Informatika",
    "email": "risald@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?user=qxN0b8YAAAAJ&hl=en",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6692168/?view=iprs",
    "scholarId": "qxN0b8YAAAAJ",
    "totalSitasi": 410,
    "hIndex": 7,
    "i10Index": 6,
    "sintaScoreOverall": 611,
    "sintaScore3Yr": 277,
    "foto": "/uploads/dosen/dosen-1794728966655-RisaldTransparan.png"
  },
  {
    "id": "dosen-3",
    "nama": "Hevi Herlina Ullu",
    "gelar": "S.Kom., M.Kom.",
    "nip": "-",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Decision Support System (SPK)",
      "Sistem Pakar (Expert System)",
      "Kecerdasan Buatan (AI)",
      "Pengolahan Citra Digital"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "heviherlina@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Hevi+Herlina+Ullu",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6805767",
    "totalSitasi": 85,
    "hIndex": 4,
    "i10Index": 3,
    "sintaScoreOverall": 183,
    "sintaScore3Yr": 131,
    "foto": "/uploads/dosen/sinta-dosen-3.jpg"
  },
  {
    "id": "dosen-4",
    "nama": "Yoseph P.K Kelen",
    "gelar": "S.Si., S.Kom., M.Kom.",
    "nip": "0829118002",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Sistem Informasi Terapan",
      "Rekayasa Perangkat Lunak",
      "Sistem Pendukung Keputusan",
      "Algoritma & Pemrograman"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "yosephkelen@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Yoseph+Pius+Kurniawan+Kelen",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/5989028",
    "totalSitasi": 145,
    "hIndex": 5,
    "i10Index": 4,
    "sintaScoreOverall": 1665,
    "sintaScore3Yr": 527,
    "foto": "/uploads/dosen/sinta-dosen-4.jpg"
  },
  {
    "id": "dosen-5",
    "nama": "Krisantus J. Tey Seran",
    "gelar": "S.T., M.T.",
    "nip": "0025108505",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Data Mining",
      "Machine Learning",
      "Decision Support Systems (DSS)",
      "Sistem Informasi Terapan"
    ],
    "pendidikanTerakhir": "Magister Teknik (M.T.)",
    "email": "krisantusteys@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Krisantus+Jumarto+Tey+Seran",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6182267",
    "totalSitasi": 110,
    "hIndex": 5,
    "i10Index": 3,
    "sintaScoreOverall": 616,
    "sintaScore3Yr": 320,
    "foto": "/uploads/dosen/sinta-dosen-5.jpg"
  },
  {
    "id": "dosen-6",
    "nama": "Budiman Baso",
    "gelar": "S.Kom., M.Kom.",
    "nip": "198904122019031008",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Jaringan Komputer",
      "Keamanan Siber",
      "Cloud Computing",
      "Sistem Terdistribusi"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "budimanbaso@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?user=_4-yOEkAAAAJ&hl=en",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6776721",
    "totalSitasi": 251,
    "hIndex": 8,
    "i10Index": 7,
    "sintaScoreOverall": 606,
    "sintaScore3Yr": 337,
    "foto": "/uploads/dosen/sinta-dosen-6.jpg"
  },
  {
    "id": "dosen-7",
    "nama": "Siprianus S. Manek",
    "gelar": "S.Kom., M.Kom.",
    "nip": "-",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Kecerdasan Buatan (AI)",
      "Fuzzy Inference System",
      "Sistem Pendukung Keputusan",
      "Pengolahan Citra Digital"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "siprianusmanek@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Siprianus+Septian+Manek",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6691856",
    "totalSitasi": 65,
    "hIndex": 3,
    "i10Index": 2,
    "sintaScoreOverall": 207,
    "sintaScore3Yr": 133,
    "foto": "/uploads/dosen/sinta-dosen-7.jpg"
  },
  {
    "id": "dosen-8",
    "nama": "Patricia G. Manek",
    "gelar": "S.Kom., M.Kom.",
    "nip": "-",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Rekayasa Perangkat Lunak",
      "Pengolahan Citra Digital",
      "Machine Learning",
      "Sistem Informasi"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "patricia.manek@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Patricia+Gertrudis+Manek",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6795085",
    "totalSitasi": 70,
    "hIndex": 4,
    "i10Index": 2,
    "sintaScoreOverall": 151,
    "sintaScore3Yr": 98,
    "foto": "/uploads/dosen/sinta-dosen-8.jpg"
  },
  {
    "id": "dosen-9",
    "nama": "Leonard Peter Gelu",
    "gelar": "S.Kom., M.Kom.",
    "nip": "0008039105",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Mobile & Web Development",
      "Internet of Things (IoT)",
      "Sistem Informasi Geografis",
      "Sistem Pendukung Keputusan"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "leonardpgelu@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Leonard+Peter+Gelu",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6790146",
    "totalSitasi": 95,
    "hIndex": 4,
    "i10Index": 3,
    "sintaScoreOverall": 414,
    "sintaScore3Yr": 350,
    "foto": "/uploads/dosen/sinta-dosen-9.jpg"
  },
  {
    "id": "dosen-10",
    "nama": "Kristoforus Fallo",
    "gelar": "S.Kom., M.Kom.",
    "nip": "-",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Jaringan Komputer & Telekomunikasi",
      "Wireless Sensor Networks (WSN)",
      "Infrastruktur Jaringan",
      "Sistem Informasi"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "kristoforusfallo@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Kristoforus+Fallo",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6805696",
    "totalSitasi": 80,
    "hIndex": 4,
    "i10Index": 2,
    "sintaScoreOverall": 165,
    "sintaScore3Yr": 119,
    "foto": "/uploads/dosen/sinta-dosen-10.jpg"
  },
  {
    "id": "dosen-11",
    "nama": "Anastasia Kadek D. Lestari",
    "gelar": "S.Si., M.Sc.",
    "nip": "199310172024062001",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Sistem Informasi Geografis (GIS)",
      "Fisika Komputasi",
      "Geofisika",
      "Decision Support Systems"
    ],
    "pendidikanTerakhir": "Master of Science (M.Sc.)",
    "email": "anastasiakadek@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Anastasia+Kadek+Dety+Lestari",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6768902",
    "totalSitasi": 60,
    "hIndex": 3,
    "i10Index": 2,
    "sintaScoreOverall": 352,
    "sintaScore3Yr": 258,
    "foto": "/uploads/dosen/sinta-dosen-11.jpg"
  },
  {
    "id": "dosen-12",
    "nama": "Regolinda Maneno",
    "gelar": "S.Si., M.Si.",
    "nip": "2330103820000641",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Geofisika Terapan",
      "Sistem Informasi Geografis (GIS)",
      "Pemetaan Lingkungan",
      "Komputasi Sains"
    ],
    "pendidikanTerakhir": "Magister Sains (M.Si.)",
    "email": "regolindamaneno@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Regolinda+Maneno",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6884934",
    "totalSitasi": 45,
    "hIndex": 3,
    "i10Index": 1,
    "sintaScoreOverall": 156,
    "sintaScore3Yr": 111,
    "foto": "/uploads/dosen/sinta-dosen-12.jpg"
  },
  {
    "id": "dosen-13",
    "nama": "Debora Chrisinta",
    "gelar": "S.Si., M.Si.",
    "nip": "199406292022032014",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Statistika Komputasi",
      "Text Mining & NLP",
      "Machine Learning",
      "Data Science"
    ],
    "pendidikanTerakhir": "Magister Sains (M.Si.)",
    "email": "deborachrisinta@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Debora+Chrisinta",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6806395",
    "totalSitasi": 75,
    "hIndex": 4,
    "i10Index": 2,
    "sintaScoreOverall": 731,
    "sintaScore3Yr": 416,
    "foto": "/uploads/dosen/sinta-dosen-13.jpg"
  },
  {
    "id": "dosen-14",
    "nama": "Fetronela Rambu Bobu",
    "gelar": "S.Si., M.Sc.",
    "nip": "199004132022032009",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Fisika Komputasi",
      "Pemodelan Sains",
      "Sistem Pendukung Keputusan",
      "Media Pembelajaran Interaktif"
    ],
    "pendidikanTerakhir": "Master of Science (M.Sc.)",
    "email": "fetronelarb@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Fetronela+Rambu+Bobu",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6805620",
    "totalSitasi": 55,
    "hIndex": 3,
    "i10Index": 2,
    "sintaScoreOverall": 455,
    "sintaScore3Yr": 370,
    "foto": "/uploads/dosen/sinta-dosen-14.jpg"
  },
  {
    "id": "dosen-15",
    "nama": "Dian Grace Ludji",
    "gelar": "S.Si., M.Si.",
    "nip": "199412292022032011",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Matematika Terapan",
      "Pemodelan Dinamis & Biomatematika",
      "Algoritma Fuzzy",
      "Sistem Pendukung Keputusan"
    ],
    "pendidikanTerakhir": "Magister Sains (M.Si.)",
    "email": "diangracel@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Dian+Grace+Ludji",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6805847",
    "totalSitasi": 65,
    "hIndex": 4,
    "i10Index": 2,
    "sintaScoreOverall": 199,
    "sintaScore3Yr": 149,
    "foto": "/uploads/dosen/sinta-dosen-15.jpg"
  },
  {
    "id": "dosen-16",
    "nama": "Ernes Josias Blegur",
    "gelar": "S.Si., M.Si.",
    "nip": "2330103110003009",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Fisika Instrumentasi & Sensor",
      "Sains Material",
      "Sistem Informasi & Digitalisasi Perbatasan"
    ],
    "pendidikanTerakhir": "Magister Sains (M.Si.)",
    "email": "ernesblegur@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Ernes+Josias+Blegur",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6905802",
    "totalSitasi": 50,
    "hIndex": 3,
    "i10Index": 2,
    "sintaScoreOverall": 93,
    "sintaScore3Yr": 74,
    "foto": "/uploads/dosen/sinta-dosen-16.jpg"
  },
  {
    "id": "dosen-17",
    "nama": "Guido Adolfus Suni",
    "gelar": "S.Kom., M.Kom.",
    "nip": "199701232025061005",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Internet of Things (IoT)",
      "Optimasi Jaringan Nirkabel",
      "Algoritma Komputasi",
      "Sistem Cerdas Terapan"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "guidosuni@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Guido+Adolfus+Suni",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6984220",
    "totalSitasi": 35,
    "hIndex": 2,
    "i10Index": 1,
    "sintaScoreOverall": 51,
    "sintaScore3Yr": 15,
    "foto": "/uploads/dosen/sinta-dosen-17.jpg"
  },
  {
    "id": "dosen-18",
    "nama": "Darsono Nababan",
    "gelar": "S.Kom., M.Kom.",
    "nip": "198502222019031008",
    "jabatan": "Dosen Pengajar",
    "bidangKeahlian": [
      "Artificial Intelligence",
      "Big Data Analytics",
      "Data Mining",
      "Sistem Informasi Terapan"
    ],
    "pendidikanTerakhir": "Magister Ilmu Komputer (M.Kom.)",
    "email": "darsono.nababan@unimor.ac.id",
    "scholarUrl": "https://scholar.google.com/citations?view_op=search_authors&mauthors=Darsono+Nababan",
    "sintaId": "https://sinta.kemdiktisaintek.go.id/authors/profile/6005498",
    "scholarId": "darsononababan_unimor",
    "totalSitasi": 135,
    "hIndex": 6,
    "i10Index": 4,
    "sintaScoreOverall": 732,
    "sintaScore3Yr": 281,
    "foto": "/uploads/dosen/sinta-dosen-18.jpg"
  }
];

export const daftarBerita: Berita[] = [
  {
    id: "berita-1",
    slug: "kuliah-umum-ai-prompt-to-production-unimor",
    judul: "Kuliah Umum TI UNIMOR: 'From Prompt to Application dan From Application to Production' dengan Kecerdasan Buatan (AI)",
    ringkasan: "Program Studi TI UNIMOR sukses menggelar kuliah umum nasional di Aula Arnoldus dengan menghadirkan narasumber dari Politeknik Negeri Bengkalis untuk memperkuat skill AI engineering mahasiswa.",
    isiLengkap: "Program Studi Teknologi Informasi Fakultas Pertanian, Sains dan Kesehatan Universitas Timor menyelenggarakan kegiatan kuliah umum bertema 'From Prompt to Application dan From Application to Production dengan Kecerdasan Buatan (AI)' bertempat di Aula Arnoldus Kampus UNIMOR Sasi Kefamenanu. Kegiatan ini menghadirkan narasumber Muhammad Ikhsan Wibowo, S.Kom., M.T. dari Politeknik Negeri Bengkalis (Polbeng). Mahasiswa dan dosen dibekali keterampilan merancang instruksi AI terstruktur, implementasi coding web modern, hingga tata kelola pengamanan API dan keamanan kode di lingkungan production.",
    kategori: "Berita",
    tanggal: "26 Oktober 2026",
    penulis: "Humas TI UNIMOR",
    gambarUrl: "/images/berita/kuliah-umum-ai.jpg",
    featured: true
  },
  {
    id: "berita-2",
    slug: "workshop-peninjauan-kurikulum-obe-ti",
    judul: "Penyempurnaan Kurikulum Berbasis Outcome-Based Education (OBE) dan Integrasi AI di Prodi TI",
    ringkasan: "Rapat koordinasi dosen Prodi TI UNIMOR merumuskan penguatan Rencana Pembelajaran Semester (RPS) agar adaptif dengan kebutuhan industri rekayasa perangkat lunak.",
    isiLengkap: "Sebagai tindak lanjut dari evaluasi mutu akademik, Program Studi Teknologi Informasi melaksanakan lokakarya peninjauan silabus mata kuliah Pemrograman Web, Rekayasa Perangkat Lunak, dan Keamanan Sistem Informasi agar selaras dengan standar kompetensi terkini.",
    kategori: "Pengumuman",
    tanggal: "29 Oktober 2026",
    penulis: "Tim Kurikulum",
    gambarUrl: "/images/berita/workshop-kurikulum.jpg",
    featured: true
  },
  {
    id: "berita-3",
    slug: "pendaftaran-ujian-proposal-tugas-akhir-semester-ganjil",
    judul: "Jadwal dan Persyaratan Pendaftaran Ujian Proposal Tugas Akhir & Skripsi Semester Ganjil 2026/2027",
    ringkasan: "Diumumkan kepada seluruh mahasiswa semester 7 ke atas bahwa pendaftaran seminar proposal skripsi telah dibuka secara daring.",
    isiLengkap: "Pendaftaran proposal tugas akhir mahasiswa Prodi TI dibuka mulai tanggal 10 hingga 25 November. Mahasiswa diwajibkan mengunggah naskah proposal yang telah disetujui dosen pembimbing beserta logbook bimbingan ke sistem repository.",
    kategori: "Agenda",
    tanggal: "02 November 2026",
    penulis: "Sekretariat Prodi",
    gambarUrl: "/images/berita/seminar-proposal.jpg"
  },
  {
    id: "berita-4",
    slug: "prestasi-mahasiswa-hackathon-nasional",
    judul: "Mahasiswa TI UNIMOR Raih Juara Inovasi Solusi Digital Wilayah Perbatasan pada Ajang Nasional",
    ringkasan: "Tim mahasiswa prodi TI berhasil merancang aplikasi monitoring pertanian lahan kering berbasis IoT dan AI di Kefamenanu.",
    isiLengkap: "Rasa bangga diraih civitas akademika UNIMOR atas pencapaian tim mahasiswa TI yang menjuarai kompetisi karya tulis dan prototipe aplikasi cerdas tingkat regional dan nasional.",
    kategori: "Prestasi",
    tanggal: "15 September 2026",
    penulis: "Divisi Kemahasiswaan",
    gambarUrl: "/images/berita/prestasi-mahasiswa.jpg"
  }
];

export const daftarLaboratorium: LabFasilitas[] = [
  {
    id: "lab-rpl",
    nama: "Laboratorium Rekayasa Perangkat Lunak & AI",
    deskripsi: "Laboratorium untuk praktikum pemrograman web, aplikasi mobile, algoritma struktur data, dan rekayasa kecerdasan buatan.",
    kapasitas: "40 Workstation PC Core i7, Dual Monitor, GPU Dedicated untuk komputasi AI",
    spesifikasi: [
      "40 Unit PC Intel Core i7 13th Gen, 32GB RAM, RTX 4060",
      "Koneksi Internet Dedicated Fiber Optic 100 Mbps",
      "Interactive Smartboard 75 inch & Proyektor 4K",
      "Server Lokal Development & Docker Container"
    ],
    peruntukan: "Praktikum Pemrograman Web, Pemrograman Berorientasi Objek, Machine Learning, UI/UX Design",
    gambarUrl: "/images/fasilitas/lab-rpl.jpg"
  },
  {
    id: "lab-jaringan",
    nama: "Laboratorium Jaringan & Keamanan Siber",
    deskripsi: "Laboratorium yang dilengkapi dengan rak server, switch manageable, router Cisco/MikroTik, dan simulator audit keamanan siber.",
    kapasitas: "35 Unit Workstation + 4 Network Rack Testbed",
    spesifikasi: [
      "35 Unit PC Intel Core i5, 16GB RAM, Dual Gigabit NIC",
      "Cisco Catalyst Switch & Router Series",
      "MikroTik RouterBOARD Cloud Router",
      "Peralatan Crimping, Cable Tester, dan Optical Power Meter"
    ],
    peruntukan: "Praktikum Jaringan Komputer, Administrasi Jaringan & Server, Keamanan Sistem Informasi, Cloud Computing",
    gambarUrl: "/images/fasilitas/lab-jaringan.jpg"
  },
  {
    id: "lab-multimedia",
    nama: "Laboratorium Multimedia & Internet of Things (IoT)",
    deskripsi: "Fasilitas pengembangan sistem embedded, microcontroller Arduino/ESP32, sensor pertanian cerdas, serta produksi konten digital.",
    kapasitas: "30 Meja Praktikum IoT + Studio Podcasting Akademik",
    spesifikasi: [
      "Kit Sensor IoT (LoRa, ESP32, Raspberry Pi, Sensor Tanah & Cuaca)",
      "Workstation Desain Grafis & Video Editing",
      "Microphone Audio Profesional & Lighting Studio",
      "3D Printer untuk pembuatan prototipe casing perangkat"
    ],
    peruntukan: "Praktikum Sistem Tertanam & IoT, Multimedia, Pengolahan Citra Digital, Workshop Kreatif Mahasiswa",
    gambarUrl: "/images/fasilitas/lab-iot.jpg"
  }
];

export const strukturKurikulum: MataKuliah[] = [
  // Semester 1
  { kode: "TI1101", nama: "Algoritma & Pemrograman Dasar", sks: 3, semester: 1, kategori: "Wajib", deskripsi: "Logika pemecahan masalah komputasional dan implementasi dengan bahasa pemrograman modern." },
  { kode: "TI1102", nama: "Pengantar Teknologi Informasi", sks: 2, semester: 1, kategori: "Wajib", deskripsi: "Konsep dasar komputasi, perangkat keras, sistem operasi, dan etika profesi IT." },
  { kode: "TI1103", nama: "Matematika Diskrit", sks: 3, semester: 1, kategori: "Wajib", deskripsi: "Himpunan, logika proposisi, graf, dan struktur diskrit untuk ilmu komputer." },
  { kode: "TI1104", nama: "Kalkulus untuk Komputasi", sks: 3, semester: 1, kategori: "Wajib", deskripsi: "Fungsi, limit, turunan, dan integral dalam konteks optimasi algoritma komputasi." },
  { kode: "MKU101", nama: "Pendidikan Pancasila & Kewarganegaraan", sks: 2, semester: 1, kategori: "Wajib", deskripsi: "Pembentukan karakter kebangsaan dan integritas moral mahasiswa." },

  // Semester 2
  { kode: "TI1201", nama: "Struktur Data & Analisis Algoritma", sks: 3, semester: 2, kategori: "Wajib", deskripsi: "Implementasi antrean, tumpukan, pohon, graf, dan kompleksitas waktu Big-O." },
  { kode: "TI1202", nama: "Pemrograman Berorientasi Objek (OOP)", sks: 3, semester: 2, kategori: "Wajib", deskripsi: "Prinsip enkapsulasi, pewarisan, polimorfisme, dan design patterns." },
  { kode: "TI1203", nama: "Arsitektur & Organisasi Komputer", sks: 3, semester: 2, kategori: "Wajib", deskripsi: "Struktur internal CPU, memori, bus sistem, dan instruksi mesin." },
  { kode: "TI1204", nama: "Sistem Basis Data", sks: 3, semester: 2, kategori: "Wajib", deskripsi: "Perancangan model relasional ERD, normalisasi, dan implementasi SQL." },

  // Semester 3
  { kode: "TI2101", nama: "Pemrograman Web Frontend (React/Next.js)", sks: 3, semester: 3, kategori: "Keahlian Inti", deskripsi: "HTML5, CSS3, Tailwind CSS, TypeScript, dan arsitektur Single Page Application." },
  { kode: "TI2102", nama: "Jaringan Komputer Dasar", sks: 3, semester: 3, kategori: "Keahlian Inti", deskripsi: "Model OSI, TCP/IP, subnetting IPv4/IPv6, routing, switching, dan implementasi LAN." },
  { kode: "TI2103", nama: "Sistem Operasi & Linux System", sks: 3, semester: 3, kategori: "Wajib", deskripsi: "Manajemen proses, memori, file system, dan shell scripting Linux." },
  { kode: "TI2104", nama: "Statistika & Probabilitas", sks: 3, semester: 3, kategori: "Wajib", deskripsi: "Pengolahan data statistik, regresi, dan probabilitas untuk machine learning." },

  // Semester 4
  { kode: "TI2201", nama: "Pemrograman Web Backend & RESTful API", sks: 3, semester: 4, kategori: "Keahlian Inti", deskripsi: "Arsitektur backend mikroservis, otentikasi JWT, caching, dan deployment server." },
  { kode: "TI2202", nama: "Rekayasa Perangkat Lunak (Software Engineering)", sks: 3, semester: 4, kategori: "Keahlian Inti", deskripsi: "Siklus hidup SDLC, Agile/Scrum, pemodelan UML, dan manajemen proyek perangkat lunak." },
  { kode: "TI2203", nama: "Administrasi Jaringan & Server", sks: 3, semester: 4, kategori: "Keahlian Inti", deskripsi: "Konfigurasi DNS, Web Server, DHCP, Firewall, dan monitoring jaringan." },
  { kode: "TI2204", nama: "Kecerdasan Buatan (Artificial Intelligence)", sks: 3, semester: 4, kategori: "Keahlian Inti", deskripsi: "Konsep searching, sistem pakar, logika fuzzy, pengenalan prompt engineering & LLM." },

  // Semester 5
  { kode: "TI3101", nama: "Keamanan Sistem Informasi & Kriptografi", sks: 3, semester: 5, kategori: "Keahlian Inti", deskripsi: "Enkripsi, keamanan aplikasi web, mitigasi SQLi/XSS, dan prinsip cyber defense." },
  { kode: "TI3102", nama: "Pemrograman Aplikasi Bergerak (Mobile Dev)", sks: 3, semester: 5, kategori: "Keahlian Inti", deskripsi: "Pengembangan aplikasi Android/iOS dengan teknologi cross-platform." },
  { kode: "TI3103", nama: "Machine Learning & Sains Data", sks: 3, semester: 5, kategori: "Keahlian Inti", deskripsi: "Supervised & unsupervised learning, evaluasi model, dan data visualization." },
  { kode: "TI3104", nama: "Interaksi Manusia & Komputer (UI/UX)", sks: 2, semester: 5, kategori: "Wajib", deskripsi: "Design thinking, riset pengguna, wireframing, dan usability testing di Figma." },

  // Semester 6
  { kode: "TI3201", nama: "Cloud Computing & DevOps", sks: 3, semester: 6, kategori: "Keahlian Inti", deskripsi: "Virtualisasi, Docker, CI/CD pipeline, dan deployment aplikasi cloud (AWS/Vercel)." },
  { kode: "TI3202", nama: "Internet of Things (IoT) untuk Pertanian/Smart City", sks: 3, semester: 6, kategori: "Pilihan", deskripsi: "Pengembangan sensor cerdas terintegrasi cloud untuk kasus nyata wilayah Timor." },
  { kode: "TI3203", nama: "Metodologi Penelitian & Penulisan Ilmiah", sks: 2, semester: 6, kategori: "Wajib", deskripsi: "Perumusan masalah penelitian, studi literatur, sitasi, dan etika publikasi ilmiah." },

  // Semester 7 & 8
  { kode: "TI4101", nama: "Kuliah Kerja Nyata / Magang Industri (MBKM)", sks: 6, semester: 7, kategori: "Wajib", deskripsi: "Penerapan kompetensi keilmuan TI di instansi pemerintah, BUMN, atau industri teknologi." },
  { kode: "TI4102", nama: "Seminar Proposal Tugas Akhir", sks: 2, semester: 7, kategori: "Wajib", deskripsi: "Penyusunan dan pengujian rancangan penelitian skripsi di hadapan dewan penguji." },
  { kode: "TI4201", nama: "Skripsi / Tugas Akhir", sks: 6, semester: 8, kategori: "Wajib", deskripsi: "Penyelesaian karya ilmiah dan prototipe sistem perangkat lunak mandiri sebagai syarat kelulusan S.Kom." }
];


export interface VideoKegiatan {
  id: string;
  judul: string;
  youtubeId: string;
  youtubeUrl: string;
  kategori: 'Kuliah Umum' | 'Praktikum & Riset' | 'Kegiatan Mahasiswa' | 'Dies Natalis' | 'Workshop & Seminar' | 'Profil Kampus';
  deskripsi: string;
  tanggal: string;
  pemateri?: string;
  dosenId?: string;
  dosenNama?: string;
  featured?: boolean;
}

export const daftarVideoFallback: VideoKegiatan[] = [
  {
    "id": "vid-1",
    "judul": "Kuliah Umum: From Prompt to Application & Production dengan Artificial Intelligence",
    "youtubeId": "kJQP7kiw5Fk",
    "youtubeUrl": "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "kategori": "Kuliah Umum",
    "deskripsi": "Kuliah umum Prodi S1 Teknologi Informasi UNIMOR bersama pemateri praktisi AI tentang rekayasa instruksi, tata kelola model cerdas, dan coding modern di industri.",
    "tanggal": "10 November 2026",
    "pemateri": "Muhammad Ikhsan Wibowo, S.Kom., M.T. & Tim Dosen TI",
    "dosenId": "dosen-2",
    "dosenNama": "Risald, S.Kom., M.T.",
    "featured": true
  },
  {
    "id": "vid-2",
    "judul": "Sidang Terbuka Senat Universitas Timor & Prosesi Wisuda Sarjana",
    "youtubeId": "PCu9XHiEA0g",
    "youtubeUrl": "https://www.youtube.com/watch?v=PCu9XHiEA0g",
    "kategori": "Dies Natalis",
    "deskripsi": "Dokumentasi resmi Sidang Terbuka Senat Universitas Timor dalam pelepasan lulusan sarjana baru di Kampus Sasi Kota Kefamenanu.",
    "tanggal": "28 Oktober 2026",
    "pemateri": "Rektor & Senat Akademik UNIMOR",
    "dosenId": "dosen-1",
    "dosenNama": "Yasinta Oktaviana Legu Rema, S.Kom., M.T.",
    "featured": false
  },
  {
    "id": "vid-3",
    "judul": "Praktikum Jaringan Komputer, Cisco Packet Tracer & Konfigurasi Router Mikrotik",
    "youtubeId": "7_LPdttKXPc",
    "youtubeUrl": "https://www.youtube.com/watch?v=7_LPdttKXPc",
    "kategori": "Praktikum & Riset",
    "deskripsi": "Kegiatan praktikum mahasiswa Prodi TI di Laboratorium Komputer Jaringan & Siber UNIMOR, simulasi topologi jaringan dan subnetting.",
    "tanggal": "15 Oktober 2026",
    "pemateri": "Budiman Baso, S.Kom., M.Kom.",
    "dosenId": "dosen-6",
    "dosenNama": "Budiman Baso, S.Kom., M.Kom.",
    "featured": false
  },
  {
    "id": "vid-4",
    "judul": "Workshop Pemrograman Web Modern Fullstack dengan Next.js & Tailwind CSS",
    "youtubeId": "SqcY0GlETPk",
    "youtubeUrl": "https://www.youtube.com/watch?v=SqcY0GlETPk",
    "kategori": "Workshop & Seminar",
    "deskripsi": "Pelatihan intensif pengembangan aplikasi web berbasis server-side rendering, REST API, dan basis data terintegrasi bagi mahasiswa tingkat akhir.",
    "tanggal": "22 September 2026",
    "pemateri": "Risald, S.Kom., M.T.",
    "dosenId": "dosen-2",
    "dosenNama": "Risald, S.Kom., M.T.",
    "featured": false
  },
  {
    "id": "vid-5",
    "judul": "Ekspedisi Kampus & Profil Universitas Timor di Wilayah Perbatasan RI-RDTL",
    "youtubeId": "H14bBuluwB8",
    "youtubeUrl": "https://www.youtube.com/watch?v=H14bBuluwB8",
    "kategori": "Profil Kampus",
    "deskripsi": "Mengenal lebih dekat lingkungan kampus, laboratorium sains, dan fasilitas pendidikan Program Studi S1 Teknologi Informasi UNIMOR di Kefamenanu.",
    "tanggal": "1 September 2026",
    "pemateri": "Humas UNIMOR & BEM Faperta-Saintek",
    "dosenId": "dosen-1",
    "dosenNama": "Yasinta Oktaviana Legu Rema, S.Kom., M.T.",
    "featured": false
  }
];
