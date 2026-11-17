import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

export interface Publikasi {
  id: string;
  dosenId: string; // Relasi ke Master Dosen
  judul: string;
  penulis: string;
  jurnal: string;
  tahun: number;
  sitasi: number;
  sumber: 'Google Scholar' | 'SINTA' | 'Scopus' | 'Manual';
  url?: string;
  doi?: string;
  featured?: boolean;
}

export interface Dosen {
  id: string;
  nama: string;
  gelar: string;
  nip: string;
  jabatan: string;
  bidangKeahlian: string[];
  pendidikanTerakhir: string;
  email: string;
  foto?: string;
  scholarUrl?: string;
  sintaId?: string;
  scholarId?: string;
  totalSitasi?: number;
  hIndex?: number;
  i10Index?: number;
  sintaScoreOverall?: number;
  sintaScore3Yr?: number;
}

export interface LabFasilitas {
  id: string;
  nama: string;
  deskripsi: string;
  kapasitas: string;
  spesifikasi: string[];
  peruntukan: string;
  gambarUrl?: string;
  dosenId?: string; // Foreign Key ke Master Dosen
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
  dosenPengampuId?: string; // Foreign Key ke Master Dosen
  dosenPengampu?: string;   // Resolved nama & gelar dosen
  nipPengampu?: string;
  peminatanId?: string;     // Relasi ke PeminatanProdi
  peminatanNama?: string;
}

export interface DokumenAkademik {
  id: string;
  nama: string;
  kategori: 'Panduan' | 'SOP' | 'Formulir' | 'SK' | 'Template';
  deskripsi: string;
  fileUrl: string;
  ukuranFile?: string;
  format: 'PDF' | 'DOCX' | 'XLSX';
  tanggalUnggah?: string;
}

export interface PeminatanProdi {
  id: string;
  judul: string;
  ringkasan: string;
  kompetensi: string[];
  prospekKarir: string[];
}

export interface DataStatistik {
  id: string;
  angka: string;
  label: string;
  keterangan: string;
}

export interface MitraKerjasama {
  id: string;
  nama: string;
  kategori: 'Industri Teknologi' | 'Pemerintah' | 'Perguruan Tinggi' | 'BUMN/Swasta';
  lingkup: string;
  logoUrl?: string;
  masaBerlaku?: string;
}

export interface VideoKegiatan {
  id: string;
  judul: string;
  youtubeId: string;
  youtubeUrl: string;
  kategori: 'Kuliah Umum' | 'Praktikum & Riset' | 'Kegiatan Mahasiswa' | 'Dies Natalis' | 'Workshop & Seminar' | 'Profil Kampus';
  deskripsi: string;
  tanggal: string;
  pemateri?: string;
  dosenId?: string; // Foreign key ke Master Dosen
  dosenNama?: string;
  featured?: boolean;
}

/**
 * Helper untuk mengekstrak 11-digit YouTube Video ID dari berbagai variasi URL
 */
export function extractYoutubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const cleaned = urlOrId.trim();
  const matchWatch = cleaned.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (matchWatch) return matchWatch[1];
  const matchShort = cleaned.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (matchShort) return matchShort[1];
  const matchEmbed = cleaned.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (matchEmbed) return matchEmbed[1];
  const matchShorts = cleaned.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (matchShorts) return matchShorts[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) return cleaned;
  return null;
}

export interface PejabatOrganisasi {
  id: string;
  jabatan: string;
  dosenId?: string;
  nama: string;
  nip?: string;
  keterangan: string;
}

export interface DatabaseSchema {
  siteConfig: {
    namaProdi: string;
    jenjang: string;
    fakultas: string;
    universitas: string;
    singkatan: string;
    slogan: string;
    akreditasi: string;
    nomorSk: string;
    alamat: string;
    email: string;
    telepon: string;
    whatsapp: string;
    jamLayanan: string;
  };
  sambutanKaprodi: {
    dosenId?: string;
    nama: string;
    jabatan: string;
    nip: string;
    foto?: string;
    pesanSingkat: string;
    isi: string[];
  };
  visiMisi: {
    visi: string;
    misi: string[];
    tujuan: string[];
  };
  daftarDosen: Dosen[];
  daftarPublikasi: Publikasi[];
  daftarBerita: Array<{
    id: string;
    slug: string;
    judul: string;
    ringkasan: string;
    isiLengkap: string;
    kategori: 'Berita' | 'Pengumuman' | 'Agenda' | 'Prestasi';
    tanggal: string;
    penulis: string;
    featured?: boolean;
  }>;
  strukturKurikulum: MataKuliah[];
  daftarLaboratorium: LabFasilitas[];
  daftarDokumen: DokumenAkademik[];
  peminatanProdi: PeminatanProdi[];
  dataStatistik: DataStatistik[];
  daftarMitra: MitraKerjasama[];
  strukturOrganisasi: PejabatOrganisasi[];
  daftarVideo?: VideoKegiatan[];
}

export function readDatabase(): DatabaseSchema {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.daftarPublikasi) parsed.daftarPublikasi = [];
    if (!parsed.daftarLaboratorium) parsed.daftarLaboratorium = [];
    if (!parsed.daftarDokumen) parsed.daftarDokumen = [];
    if (!parsed.peminatanProdi) parsed.peminatanProdi = [];
    if (!parsed.dataStatistik) parsed.dataStatistik = [];
    if (!parsed.daftarMitra) parsed.daftarMitra = [];
    if (!parsed.strukturOrganisasi) parsed.strukturOrganisasi = [];
    if (!parsed.daftarVideo) parsed.daftarVideo = [];
    return parsed;
  } catch (error) {
    console.error('Error reading database file:', error);
    throw new Error('Database read failed');
  }
}

export function writeDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database file:', error);
    throw new Error('Database write failed');
  }
}
