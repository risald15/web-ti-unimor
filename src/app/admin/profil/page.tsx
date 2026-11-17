'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  UserCheck, 
  Compass, 
  MapPin, 
  Users, 
  BarChart3, 
  Handshake, 
  Layers, 
  Plus, 
  Trash2, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { PejabatOrganisasi, DataStatistik, MitraKerjasama, PeminatanProdi, Dosen } from '@/lib/db';

type ActiveTab = 'identitas' | 'sambutan' | 'visi-misi' | 'organisasi' | 'statistik' | 'mitra' | 'peminatan';

export default function AdminProfilPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('identitas');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Master Dosen for dropdown selection
  const [daftarDosen, setDaftarDosen] = useState<Dosen[]>([]);

  // State sections
  const [siteConfig, setSiteConfig] = useState({
    namaProdi: '',
    jenjang: '',
    fakultas: '',
    universitas: '',
    singkatan: '',
    slogan: '',
    akreditasi: '',
    nomorSk: '',
    alamat: '',
    email: '',
    telepon: '',
    whatsapp: '',
    jamLayanan: ''
  });

  const [sambutan, setSambutan] = useState({
    dosenId: '',
    nama: '',
    jabatan: '',
    nip: '',
    foto: '',
    pesanSingkat: '',
    isiText: ''
  });

  const [visiMisi, setVisiMisi] = useState({
    visi: '',
    misiText: '',
    tujuanText: ''
  });

  const [strukturOrganisasi, setStrukturOrganisasi] = useState<PejabatOrganisasi[]>([]);
  const [dataStatistik, setDataStatistik] = useState<DataStatistik[]>([]);
  const [daftarMitra, setDaftarMitra] = useState<MitraKerjasama[]>([]);
  const [peminatanProdi, setPeminatanProdi] = useState<PeminatanProdi[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [resProfil, resDosen] = await Promise.all([
          fetch('/api/profil'),
          fetch('/api/dosen')
        ]);

        const dataProfil = await resProfil.json();
        const dataDosen = await resDosen.json();

        if (dataDosen.success && Array.isArray(dataDosen.data)) {
          setDaftarDosen(dataDosen.data);
        }

        if (dataProfil.success && dataProfil.data) {
          const { 
            sambutanKaprodi, 
            visiMisi: vm, 
            siteConfig: sc, 
            strukturOrganisasi: org,
            dataStatistik: stat,
            daftarMitra: mitra,
            peminatanProdi: minat
          } = dataProfil.data;

          if (sc) {
            setSiteConfig({
              namaProdi: sc.namaProdi || '',
              jenjang: sc.jenjang || '',
              fakultas: sc.fakultas || '',
              universitas: sc.universitas || '',
              singkatan: sc.singkatan || '',
              slogan: sc.slogan || '',
              akreditasi: sc.akreditasi || '',
              nomorSk: sc.nomorSk || '',
              alamat: sc.alamat || '',
              email: sc.email || '',
              telepon: sc.telepon || '',
              whatsapp: sc.whatsapp || '',
              jamLayanan: sc.jamLayanan || ''
            });
          }

          if (sambutanKaprodi) {
            setSambutan({
              dosenId: sambutanKaprodi.dosenId || '',
              nama: sambutanKaprodi.nama || '',
              jabatan: sambutanKaprodi.jabatan || '',
              nip: sambutanKaprodi.nip || '',
              foto: sambutanKaprodi.foto || '',
              pesanSingkat: sambutanKaprodi.pesanSingkat || '',
              isiText: Array.isArray(sambutanKaprodi.isi) ? sambutanKaprodi.isi.join('\n\n') : ''
            });
          }

          if (vm) {
            setVisiMisi({
              visi: vm.visi || '',
              misiText: Array.isArray(vm.misi) ? vm.misi.join('\n') : '',
              tujuanText: Array.isArray(vm.tujuan) ? vm.tujuan.join('\n') : ''
            });
          }

          if (Array.isArray(org)) setStrukturOrganisasi(org);
          if (Array.isArray(stat)) setDataStatistik(stat);
          if (Array.isArray(mitra)) setDaftarMitra(mitra);
          if (Array.isArray(minat)) setPeminatanProdi(minat);
        }
      } catch (err) {
        console.error('Failed to load profile data', err);
        setAlert({ type: 'error', message: 'Gagal memuat master data profil dari server' });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setAlert(null);

    try {
      const payload = {
        siteConfig,
        sambutanKaprodi: {
          dosenId: sambutan.dosenId,
          nama: sambutan.nama,
          jabatan: sambutan.jabatan,
          nip: sambutan.nip,
          foto: sambutan.foto,
          pesanSingkat: sambutan.pesanSingkat,
          isi: sambutan.isiText.split('\n\n').map(s => s.trim()).filter(Boolean)
        },
        visiMisi: {
          visi: visiMisi.visi,
          misi: visiMisi.misiText.split('\n').map(s => s.trim()).filter(Boolean),
          tujuan: visiMisi.tujuanText.split('\n').map(s => s.trim()).filter(Boolean)
        },
        strukturOrganisasi,
        dataStatistik,
        daftarMitra,
        peminatanProdi
      };

      const res = await fetch('/api/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: 'Seluruh Master Data Profil Prodi & Tata Kelola berhasil disimpan!' });
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menyimpan master data profil' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem saat menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  // Helper Relasi Sambutan Kaprodi -> Master Dosen
  const handleKaprodiDosenChange = (dosenId: string) => {
    const selectedDosen = daftarDosen.find(d => d.id === dosenId);
    if (selectedDosen) {
      const fullName = selectedDosen.gelar ? `${selectedDosen.nama}, ${selectedDosen.gelar}` : selectedDosen.nama;
      setSambutan({
        ...sambutan,
        dosenId: selectedDosen.id,
        nama: fullName,
        nip: selectedDosen.nip || '',
        foto: selectedDosen.foto || '',
        jabatan: sambutan.jabatan || 'Koordinator Program Studi Teknologi Informasi'
      });
    } else {
      setSambutan({
        ...sambutan,
        dosenId: ''
      });
    }
  };

  // Helper Organisasi
  const handleAddOrganisasi = () => {
    const newId = `org-${Date.now()}`;
    setStrukturOrganisasi([
      ...strukturOrganisasi,
      {
        id: newId,
        jabatan: 'Jabatan / Posisi Baru',
        nama: '',
        nip: '',
        keterangan: 'Tugas & tanggung jawab jabatan'
      }
    ]);
  };

  const handleUpdateOrganisasi = (id: string, field: keyof PejabatOrganisasi, val: string) => {
    setStrukturOrganisasi(strukturOrganisasi.map(item => {
      if (item.id === id) {
        if (field === 'dosenId') {
          const selectedDosen = daftarDosen.find(d => d.id === val);
          return {
            ...item,
            dosenId: val,
            nama: selectedDosen ? (selectedDosen.gelar ? `${selectedDosen.nama}, ${selectedDosen.gelar}` : selectedDosen.nama) : item.nama,
            nip: selectedDosen ? (selectedDosen.nip || '') : item.nip
          };
        }
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const handleDeleteOrganisasi = (id: string) => {
    if (confirm('Yakin ingin menghapus posisi struktur ini?')) {
      setStrukturOrganisasi(strukturOrganisasi.filter(item => item.id !== id));
    }
  };

  // Helper Statistik
  const handleAddStatistik = () => {
    const newId = `stat-${Date.now()}`;
    setDataStatistik([
      ...dataStatistik,
      {
        id: newId,
        angka: '100+',
        label: 'Indikator Baru',
        keterangan: 'Keterangan ringkas'
      }
    ]);
  };

  const handleUpdateStatistik = (id: string, field: keyof DataStatistik, val: string) => {
    setDataStatistik(dataStatistik.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleDeleteStatistik = (id: string) => {
    setDataStatistik(dataStatistik.filter(s => s.id !== id));
  };

  // Helper Mitra
  const handleAddMitra = () => {
    const newId = `mitra-${Date.now()}`;
    setDaftarMitra([
      ...daftarMitra,
      {
        id: newId,
        nama: 'Instansi / Mitra Baru',
        kategori: 'Industri Teknologi',
        lingkup: 'Tri Dharma, MBKM Magang & Kolaborasi Riset',
        masaBerlaku: '2025 - 2030'
      }
    ]);
  };

  const handleUpdateMitra = (id: string, field: keyof MitraKerjasama, val: any) => {
    setDaftarMitra(daftarMitra.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const handleDeleteMitra = (id: string) => {
    if (confirm('Hapus mitra kerjasama ini?')) {
      setDaftarMitra(daftarMitra.filter(m => m.id !== id));
    }
  };

  // Helper Peminatan
  const handleUpdatePeminatan = (id: string, field: 'judul' | 'ringkasan' | 'kompetensi' | 'prospekKarir', val: any) => {
    setPeminatanProdi(peminatanProdi.map(p => {
      if (p.id === id) {
        return { ...p, [field]: val };
      }
      return p;
    }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
        <p>Memuat Master Data Profil & Tata Kelola Prodi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            Master Data Manajemen
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Data Profil, VMTS & Tata Kelola
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola seluruh parameter prodi yang dapat berubah: Identitas, Kaprodi, VMTS 2030, Struktur Organisasi, Statistik, Mitra MoU, dan Peminatan S1.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Sedang Menyimpan...' : 'Simpan Semua Data'}</span>
        </button>
      </div>

      {/* Alert Notification */}
      {alert && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm ${
          alert.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="font-bold text-xs hover:underline">Tutup &times;</button>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab('identitas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'identitas'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>1. Identitas & Kontak</span>
        </button>

        <button
          onClick={() => setActiveTab('sambutan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'sambutan'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>2. Sambutan Kaprodi</span>
        </button>

        <button
          onClick={() => setActiveTab('visi-misi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'visi-misi'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>3. Visi & Misi (VMTS)</span>
        </button>

        <button
          onClick={() => setActiveTab('organisasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'organisasi'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. Struktur Organisasi ({strukturOrganisasi.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('statistik')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'statistik'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>5. Angka Statistik ({dataStatistik.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mitra')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'mitra'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>6. Mitra MoU ({daftarMitra.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('peminatan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'peminatan'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>7. Peminatan S1 ({peminatanProdi.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: IDENTITAS & KONTAK                                       */}
      {/* ============================================================== */}
      {activeTab === 'identitas' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Master Identitas Resmi & Kontak Sekretariat
              </h2>
              <p className="text-xs text-slate-500">
                Data umum program studi yang tampil di header, footer, dan dokumen resmi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Program Studi
              </label>
              <input
                type="text"
                value={siteConfig.namaProdi}
                onChange={(e) => setSiteConfig({...siteConfig, namaProdi: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenjang Pendidikan
              </label>
              <input
                type="text"
                value={siteConfig.jenjang}
                onChange={(e) => setSiteConfig({...siteConfig, jenjang: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Singkatan Resmi
              </label>
              <input
                type="text"
                value={siteConfig.singkatan}
                onChange={(e) => setSiteConfig({...siteConfig, singkatan: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fakultas Naungan
              </label>
              <input
                type="text"
                value={siteConfig.fakultas}
                onChange={(e) => setSiteConfig({...siteConfig, fakultas: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Universitas
              </label>
              <input
                type="text"
                value={siteConfig.universitas}
                onChange={(e) => setSiteConfig({...siteConfig, universitas: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Akreditasi
              </label>
              <input
                type="text"
                value={siteConfig.akreditasi}
                onChange={(e) => setSiteConfig({...siteConfig, akreditasi: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor SK Akreditasi BAN-PT
              </label>
              <input
                type="text"
                value={siteConfig.nomorSk}
                onChange={(e) => setSiteConfig({...siteConfig, nomorSk: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Slogan / Tagline Prodi
            </label>
            <input
              type="text"
              value={siteConfig.slogan}
              onChange={(e) => setSiteConfig({...siteConfig, slogan: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 italic"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Kontak & Alamat Kampus</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Resmi Prodi
                </label>
                <input
                  type="text"
                  value={siteConfig.email}
                  onChange={(e) => setSiteConfig({...siteConfig, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telepon Kantor
                </label>
                <input
                  type="text"
                  value={siteConfig.telepon}
                  onChange={(e) => setSiteConfig({...siteConfig, telepon: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Helpdesk
                </label>
                <input
                  type="text"
                  value={siteConfig.whatsapp}
                  onChange={(e) => setSiteConfig({...siteConfig, whatsapp: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Fisik Kampus
                </label>
                <input
                  type="text"
                  value={siteConfig.alamat}
                  onChange={(e) => setSiteConfig({...siteConfig, alamat: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jam Layanan Sekretariat
                </label>
                <input
                  type="text"
                  value={siteConfig.jamLayanan}
                  onChange={(e) => setSiteConfig({...siteConfig, jamLayanan: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SAMBUTAN KAPRODI                                        */}
      {/* ============================================================== */}
      {activeTab === 'sambutan' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Sambutan Koordinator Program Studi (Berelasi ke Master Dosen)
              </h2>
              <p className="text-xs text-slate-500">
                Pilih Dosen yang menjabat sebagai Kaprodi. Data identitas (Nama, Gelar, NIP, Foto) akan tersinkron otomatis dari Master Dosen.
              </p>
            </div>
          </div>

          {/* Pemilihan Relasi Master Dosen */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Pilih Dosen Sebagai Koordinator Program Studi (Relasi Foreign Key)
              </label>
              <select
                value={sambutan.dosenId || ''}
                onChange={(e) => handleKaprodiDosenChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-blue-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900 shadow-sm"
              >
                <option value="">-- Pilih dari Master Dosen --</option>
                {daftarDosen.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.nama}{d.gelar ? `, ${d.gelar}` : ''} {d.nip ? `(NIP. ${d.nip})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Info Preview Dosen Terelasi */}
            {sambutan.dosenId ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-blue-200 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-blue-500 overflow-hidden shrink-0 flex items-center justify-center">
                  {sambutan.foto ? (
                    <img src={sambutan.foto} alt={sambutan.nama} className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{sambutan.nama}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Tersinkron Otomatis
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">NIP. {sambutan.nip || '-'}</p>
                  <p className="text-[11px] text-blue-700 font-medium mt-1">
                    ✓ Data nama, gelar, dan foto profil terhubung langsung dari Master Dosen (Single Source of Truth).
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                ⚠️ Belum memilih dosen dari Master Dosen. Silakan pilih dosen di atas agar data nama dan NIP tidak perlu diketik berulang-ulang.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar (Otomatis dari Master Dosen)
              </label>
              <input
                type="text"
                readOnly
                value={sambutan.nama}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
                title="Nama otomatis disinkronkan dari Master Dosen"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Kaprodi (Otomatis dari Master Dosen)
              </label>
              <input
                type="text"
                readOnly
                value={sambutan.nip}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-700 font-mono cursor-not-allowed"
                title="NIP otomatis disinkronkan dari Master Dosen"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan Struktural
              </label>
              <input
                type="text"
                value={sambutan.jabatan}
                onChange={(e) => setSambutan({...sambutan, jabatan: e.target.value})}
                placeholder="Contoh: Koordinator Program Studi Teknologi Informasi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kutipan Singkat / Headline Sambutan
            </label>
            <input
              type="text"
              value={sambutan.pesanSingkat}
              onChange={(e) => setSambutan({...sambutan, pesanSingkat: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Paragraf Isi Sambutan (Pisahkan antar paragraf dengan baris kosong ganda / Enter 2x)
            </label>
            <textarea
              rows={8}
              value={sambutan.isiText}
              onChange={(e) => setSambutan({...sambutan, isiText: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed font-sans"
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: VISI & MISI (VMTS)                                      */}
      {/* ============================================================== */}
      {activeTab === 'visi-misi' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Visi, Misi & Sasaran Strategis (VMTS 2030)
              </h2>
              <p className="text-xs text-slate-500">
                Arah keilmuan menuju tahun 2030 di kawasan perbatasan NKRI-RDTL dan nasional.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Visi Keilmuan Program Studi
            </label>
            <textarea
              rows={3}
              value={visiMisi.visi}
              onChange={(e) => setVisiMisi({...visiMisi, visi: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Misi Tridharma Perguruan Tinggi (Tuliskan satu butir per baris)
            </label>
            <textarea
              rows={5}
              value={visiMisi.misiText}
              onChange={(e) => setVisiMisi({...visiMisi, misiText: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tujuan Mutu & Capaian Kelulusan (Tuliskan satu butir per baris)
            </label>
            <textarea
              rows={4}
              value={visiMisi.tujuanText}
              onChange={(e) => setVisiMisi({...visiMisi, tujuanText: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: STRUKTUR ORGANISASI                                     */}
      {/* ============================================================== */}
      {activeTab === 'organisasi' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Master Tata Kelola & Struktur Organisasi
                </h2>
                <p className="text-xs text-slate-500">
                  Pejabat pengelola prodi (Kaprodi, Sekprodi, Kepala Lab, GPM, Pembina Himpunan).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddOrganisasi}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Posisi Pejabat</span>
            </button>
          </div>

          <div className="space-y-4">
            {strukturOrganisasi.map((item, idx) => (
              <div 
                key={item.id} 
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Posisi #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteOrganisasi(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus Posisi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Jabatan / Posisi
                    </label>
                    <input
                      type="text"
                      value={item.jabatan}
                      onChange={(e) => handleUpdateOrganisasi(item.id, 'jabatan', e.target.value)}
                      placeholder="Contoh: Koordinator Program Studi"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pautkan ke Master Dosen (Otomatis)
                    </label>
                    <select
                      value={item.dosenId || ''}
                      onChange={(e) => handleUpdateOrganisasi(item.id, 'dosenId', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">-- Pilih dari Dosen Terdaftar (Opsional) --</option>
                      {daftarDosen.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.nama} {d.nip ? `(${d.nip})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap Pejabat
                    </label>
                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => handleUpdateOrganisasi(item.id, 'nama', e.target.value)}
                      placeholder="Nama & Gelar Lengkap"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIP Pejabat
                    </label>
                    <input
                      type="text"
                      value={item.nip || ''}
                      onChange={(e) => handleUpdateOrganisasi(item.id, 'nip', e.target.value)}
                      placeholder="Contoh: 199305152024061004"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rincian Tugas & Tanggung Jawab
                    </label>
                    <input
                      type="text"
                      value={item.keterangan}
                      onChange={(e) => handleUpdateOrganisasi(item.id, 'keterangan', e.target.value)}
                      placeholder="Deskripsi singkat wewenang dan cakupan pelayanan..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: DATA STATISTIK                                          */}
      {/* ============================================================== */}
      {activeTab === 'statistik' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Master Angka Indikator & Statistik Homepage
                </h2>
                <p className="text-xs text-slate-500">
                  Data capaian mutu yang tampil di banner statistik beranda depan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddStatistik}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Indikator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataStatistik.map((stat, idx) => (
              <div 
                key={stat.id} 
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Statistik #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteStatistik(stat.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Angka / Nilai
                    </label>
                    <input
                      type="text"
                      value={stat.angka}
                      onChange={(e) => handleUpdateStatistik(stat.id, 'angka', e.target.value)}
                      placeholder="e.g. 450+"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-black text-blue-700 bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Label Utama
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleUpdateStatistik(stat.id, 'label', e.target.value)}
                      placeholder="e.g. Mahasiswa Aktif"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-semibold bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Keterangan Singkat
                  </label>
                  <input
                    type="text"
                    value={stat.keterangan}
                    onChange={(e) => handleUpdateStatistik(stat.id, 'keterangan', e.target.value)}
                    placeholder="e.g. Generasi Penerus Talenta Digital"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: MITRA KERJASAMA MOU                                     */}
      {/* ============================================================== */}
      {activeTab === 'mitra' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Master Kemitraan Strategis & Kerjasama MoU
                </h2>
                <p className="text-xs text-slate-500">
                  Daftar instansi, industri teknologi, dan kampus mitra pendukung Tridharma dan MBKM.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddMitra}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mitra MoU</span>
            </button>
          </div>

          <div className="space-y-4">
            {daftarMitra.map((mitra, idx) => (
              <div 
                key={mitra.id} 
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-md">
                    Mitra #{idx + 1}: {mitra.kategori}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteMitra(mitra.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Institusi / Perusahaan Mitra
                    </label>
                    <input
                      type="text"
                      value={mitra.nama}
                      onChange={(e) => handleUpdateMitra(mitra.id, 'nama', e.target.value)}
                      placeholder="Contoh: Politeknik Negeri Bengkalis (Polbeng)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori Kemitraan
                    </label>
                    <select
                      value={mitra.kategori}
                      onChange={(e) => handleUpdateMitra(mitra.id, 'kategori', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                    >
                      <option value="Industri Teknologi">Industri Teknologi</option>
                      <option value="Pemerintah">Pemerintah</option>
                      <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                      <option value="BUMN/Swasta">BUMN/Swasta</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ruang Lingkup Kerjasama
                    </label>
                    <input
                      type="text"
                      value={mitra.lingkup}
                      onChange={(e) => handleUpdateMitra(mitra.id, 'lingkup', e.target.value)}
                      placeholder="Contoh: Tri Dharma Perguruan Tinggi, Kuliah Umum AI, Magang MBKM"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Masa Berlaku MoU
                    </label>
                    <input
                      type="text"
                      value={mitra.masaBerlaku || ''}
                      onChange={(e) => handleUpdateMitra(mitra.id, 'masaBerlaku', e.target.value)}
                      placeholder="Contoh: 2024 - 2029"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: PEMINATAN / KONSENTRASI S1                              */}
      {/* ============================================================== */}
      {activeTab === 'peminatan' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Master Bidang Peminatan & Konsentrasi Keahlian S1
              </h2>
              <p className="text-xs text-slate-500">
                Pilar keahlian akademik, kompetensi lulusan, dan prospek karir mahasiswa.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {peminatanProdi.map((peminatan, idx) => (
              <div 
                key={peminatan.id} 
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase">
                    Peminatan #{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {peminatan.id}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Peminatan / Konsentrasi
                  </label>
                  <input
                    type="text"
                    value={peminatan.judul}
                    onChange={(e) => handleUpdatePeminatan(peminatan.id, 'judul', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ringkasan Fokus Keilmuan
                  </label>
                  <textarea
                    rows={2}
                    value={peminatan.ringkasan}
                    onChange={(e) => handleUpdatePeminatan(peminatan.id, 'ringkasan', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kompetensi Inti (Pisahkan dengan baris baru)
                    </label>
                    <textarea
                      rows={4}
                      value={Array.isArray(peminatan.kompetensi) ? peminatan.kompetensi.join('\n') : ''}
                      onChange={(e) => handleUpdatePeminatan(peminatan.id, 'kompetensi', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prospek Karir Lulusan (Pisahkan dengan baris baru)
                    </label>
                    <textarea
                      rows={4}
                      value={Array.isArray(peminatan.prospekKarir) ? peminatan.prospekKarir.join('\n') : ''}
                      onChange={(e) => handleUpdatePeminatan(peminatan.id, 'prospekKarir', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white font-sans"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating / Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800">
        <div className="text-xs text-slate-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Perubahan pada tab aktif maupun tab lainnya akan disimpan serentak ke Master Database.</span>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Sedang Menyimpan...' : 'Simpan Semua Perubahan'}</span>
        </button>
      </div>

    </div>
  );
}