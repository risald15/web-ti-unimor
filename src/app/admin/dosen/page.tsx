'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Mail, 
  Award, 
  ExternalLink, 
  X, 
  RotateCw, 
  Sparkles,
  Upload,
  Image as ImageIcon,
  User
} from 'lucide-react';

interface Dosen {
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
  sintaScoreOverall?: number;
  sintaScore3Yr?: number;
  totalSitasi?: number;
  hIndex?: number;
  i10Index?: number;
}

export default function AdminDosenPage() {
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fetchingSinta, setFetchingSinta] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    gelar: '',
    nip: '',
    jabatan: 'Dosen Pengajar',
    bidangKeahlian: '',
    pendidikanTerakhir: 'Magister Komputer (S2)',
    email: '',
    foto: '',
    scholarUrl: '',
    sintaId: '',
    sintaScoreOverall: 0,
    sintaScore3Yr: 0
  });

  const fetchDosen = async () => {
    try {
      const res = await fetch('/api/dosen');
      const data = await res.json();
      if (data.success) {
        setDosenList(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDosen();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      gelar: '',
      nip: '',
      jabatan: 'Dosen Pengajar',
      bidangKeahlian: '',
      pendidikanTerakhir: 'Magister Komputer (S2)',
      email: '',
      foto: '',
      scholarUrl: '',
      sintaId: '',
      sintaScoreOverall: 0,
      sintaScore3Yr: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dosen: Dosen) => {
    setEditingId(dosen.id);
    setFormData({
      nama: dosen.nama,
      gelar: dosen.gelar,
      nip: dosen.nip,
      jabatan: dosen.jabatan,
      bidangKeahlian: Array.isArray(dosen.bidangKeahlian) ? dosen.bidangKeahlian.join(', ') : '',
      pendidikanTerakhir: dosen.pendidikanTerakhir,
      email: dosen.email,
      foto: dosen.foto || '',
      scholarUrl: dosen.scholarUrl || '',
      sintaId: dosen.sintaId || '',
      sintaScoreOverall: dosen.sintaScoreOverall || 0,
      sintaScore3Yr: dosen.sintaScore3Yr || 0
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFoto(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, foto: result.url }));
        setAlert({ type: 'success', message: 'Foto dosen berhasil diunggah!' });
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal mengunggah foto' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat mengunggah foto' });
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleFetchSintaScore = async () => {
    if (!formData.sintaId) return;
    setFetchingSinta(true);
    try {
      const res = await fetch(`/api/sinta?id=${encodeURIComponent(formData.sintaId)}`);
      const result = await res.json();
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          sintaScoreOverall: result.data.overall,
          sintaScore3Yr: result.data.threeYr
        }));
        setAlert({ 
          type: 'success', 
          message: `Berhasil menarik skor SINTA live! Overall: ${result.data.overall}, 3Yr: ${result.data.threeYr}` 
        });
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal mengambil skor dari SINTA' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Gagal menghubungi server SINTA' });
    } finally {
      setFetchingSinta(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        bidangKeahlian: formData.bidangKeahlian.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingId) {
        const res = await fetch(`/api/dosen/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Data dosen berhasil diperbarui!' });
          fetchDosen();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal update dosen' });
        }
      } else {
        const res = await fetch('/api/dosen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Dosen baru berhasil ditambahkan!' });
          fetchDosen();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal menambah dosen' });
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  const handleSyncScholar = async (id: string, nama: string) => {
    setSyncingId(id);
    setAlert(null);
    try {
      const res = await fetch(`/api/dosen/${id}/sync`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAlert({
          type: 'success',
          message: `Berhasil sinkronisasi publikasi ${nama}! ${data.totalImported} artikel diperbarui dari ${data.source}. (SINTA Score: ${data.metrics?.sintaScoreOverall || 0}, 3Yr: ${data.metrics?.sintaScore3Yr || 0} • Sitasi Scholar: ${data.metrics?.totalSitasi || 0}, h-index: ${data.metrics?.hIndex || 0})`
        });
        fetchDosen();
      } else {
        setAlert({ type: 'error', message: data.message || 'Gagal sinkronisasi' });
      }
    } catch (e) {
      setAlert({ type: 'error', message: 'Kesalahan jaringan saat sinkronisasi' });
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Yakin ingin menghapus data dosen: "${nama}"?`)) return;

    try {
      const res = await fetch(`/api/dosen/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: 'Dosen berhasil dihapus!' });
        fetchDosen();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menghapus dosen' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  const filtered = dosenList.filter(d => 
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.nip.toLowerCase().includes(search.toLowerCase()) ||
    d.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Dosen & Tenaga Pendidik
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah, perbarui NIP, gelar, bidang riset, dan tautan SINTA/Google Scholar dosen.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dosen Baru</span>
        </button>
      </div>

      {/* Alert Notification */}
      {alert && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm ${
          alert.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="font-bold text-xs">Tutup &times;</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, atau jabatan dosen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline-block">
          Total: {filtered.length} Dosen
        </span>
      </div>

      {/* Table List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nama Lengkap & Gelar</th>
                <th className="py-3 px-4">NIP / NIDN</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Bidang Fokus</th>
                <th className="py-3 px-4">Skor SINTA & Scholar</th>
                <th className="py-3 px-4">Kontak Surel</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Memuat data dosen...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Tidak ada dosen ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        {item.foto ? (
                          <img 
                            src={item.foto} 
                            alt={item.nama} 
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-amber-400 font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                            {item.nama ? item.nama.charAt(0).toUpperCase() : 'D'}
                          </div>
                        )}
                        <div>
                          <div className="leading-snug">{item.nama}, {item.gelar}</div>
                          <span className="text-[11px] text-slate-500 font-normal">{item.pendidikanTerakhir}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-xs">
                      {item.nip}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.jabatan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {item.bidangKeahlian.slice(0, 2).map((b, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {item.sintaScoreOverall !== undefined && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            <Award className="w-2.5 h-2.5 text-amber-600" />
                            SINTA: {item.sintaScoreOverall} (3Yr: {item.sintaScore3Yr || 0})
                          </span>
                        )}
                        {item.totalSitasi !== undefined && (
                          <span className="block text-[10px] text-emerald-700 font-semibold">
                            Scholar: {item.totalSitasi} sitasi • h:{item.hIndex || 0}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.email}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSyncScholar(item.id, item.nama)}
                          disabled={syncingId === item.id}
                          className="px-2 py-1 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition flex items-center gap-1 text-[11px] font-bold border border-amber-200 disabled:opacity-50"
                          title="Tarik data otomatis dari Google Scholar / SINTA"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                          <span className="hidden lg:inline">Sinkronkan</span>
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Sunting Dosen"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Hapus Dosen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? 'Sunting Data Dosen' : 'Tambah Dosen Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Foto Profil Dosen */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group shrink-0">
                  {formData.foto ? (
                    <img
                      src={formData.foto}
                      alt="Pratinjau Foto"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-amber-400 font-bold flex items-center justify-center text-xl shadow-md border-2 border-white">
                      {formData.nama ? formData.nama.charAt(0).toUpperCase() : <User className="w-8 h-8 text-amber-400" />}
                    </div>
                  )}
                  {formData.foto && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, foto: '' })}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                      title="Hapus Foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingFoto ? 'Mengunggah...' : 'Unggah Foto dari Komputer'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleFileUpload}
                        disabled={uploadingFoto}
                        className="hidden"
                      />
                    </label>

                    {formData.foto && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, foto: '' })}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
                      >
                        Reset Foto
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.foto}
                      onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                      placeholder="Path foto lokal (/uploads/dosen/...) atau URL gambar (https://...)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Terisi otomatis saat mengunggah dari komputer, atau bisa tempel URL langsung.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Dosen (Tanpa Gelar)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Contoh: Risald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gelar Akademik
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.gelar}
                    onChange={(e) => setFormData({...formData, gelar: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Contoh: S.Kom., M.T."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP / NIDN
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({...formData, nip: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    placeholder="19930515..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jabatan Struktural / Tugas
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jabatan}
                    onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Koordinator Prodi / Dosen Pengajar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bidang Keahlian / Fokus Riset (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  required
                  value={formData.bidangKeahlian}
                  onChange={(e) => setFormData({...formData, bidangKeahlian: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Rekayasa Perangkat Lunak, AI, Web Engineering"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={formData.pendidikanTerakhir}
                    onChange={(e) => setFormData({...formData, pendidikanTerakhir: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Magister Teknik Informatika"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="nama@unimor.ac.id"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tautan Google Scholar
                  </label>
                  <input
                    type="text"
                    value={formData.scholarUrl}
                    onChange={(e) => setFormData({...formData, scholarUrl: e.target.value})}
                    placeholder="https://scholar.google.com/citations?user=... atau User ID"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Wajib memuat <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">?user=...</code> untuk sinkronisasi otomatis.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Tautan SINTA Kemdikbud / Kemdiktisaintek
                    </label>
                    <button
                      type="button"
                      onClick={handleFetchSintaScore}
                      disabled={fetchingSinta || !formData.sintaId.trim()}
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 flex items-center gap-1 transition shadow-xs cursor-pointer"
                      title="Tarik skor live langsung dari website resmi SINTA"
                    >
                      <RotateCw className={`w-3 h-3 ${fetchingSinta ? 'animate-spin' : ''}`} />
                      {fetchingSinta ? 'Menarik Skor...' : 'Tarik Skor dari SINTA'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.sintaId}
                    onChange={(e) => setFormData({...formData, sintaId: e.target.value})}
                    onBlur={() => {
                      if (formData.sintaId && !formData.sintaScoreOverall) {
                        handleFetchSintaScore();
                      }
                    }}
                    placeholder="https://sinta.kemdiktisaintek.go.id/authors/profile/... atau Author ID"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Masukkan link URL profil atau nomor ID SINTA, skor otomatis ditarik dari portal SINTA.
                  </p>
                </div>
              </div>

              {/* SINTA Scores (Overall & 3Yr) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    SINTA Score Overall
                  </label>
                  <input
                    type="number"
                    value={formData.sintaScoreOverall || 0}
                    onChange={(e) => setFormData({...formData, sintaScoreOverall: Number(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-amber-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-amber-950 font-mono"
                    placeholder="Contoh: 611"
                  />
                  <p className="text-[10px] text-amber-800/80 mt-1">
                    Skor kumulatif keseluruhan di portal SINTA.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    SINTA Score 3Yr (3 Tahun Terakhir)
                  </label>
                  <input
                    type="number"
                    value={formData.sintaScore3Yr || 0}
                    onChange={(e) => setFormData({...formData, sintaScore3Yr: Number(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-amber-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-amber-950 font-mono"
                    placeholder="Contoh: 277"
                  />
                  <p className="text-[10px] text-amber-800/80 mt-1">
                    Skor 3 tahun terakhir (indikator utama akreditasi BAN-PT).
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-md"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Dosen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
