'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  RotateCw, 
  Search, 
  ExternalLink, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Award, 
  User, 
  X 
} from 'lucide-react';
import { Publikasi, Dosen } from '@/lib/db';

export default function AdminPublikasiPage() {
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [selectedDosenFilter, setSelectedDosenFilter] = useState<string>('semua');
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dosenId: '',
    judul: '',
    penulis: '',
    jurnal: '',
    tahun: 2026,
    sitasi: 0,
    sumber: 'Google Scholar' as Publikasi['sumber'],
    url: '',
    doi: '',
    featured: false
  });

  const fetchData = async () => {
    try {
      const [resPub, resDosen] = await Promise.all([
        fetch('/api/publikasi').then(r => r.json()),
        fetch('/api/dosen').then(r => r.json())
      ]);

      if (resPub.success) setPublikasiList(resPub.data || []);
      if (resDosen.success) {
        setDosenList(resDosen.data || []);
        if (resDosen.data?.length > 0 && !formData.dosenId) {
          setFormData(prev => ({ ...prev, dosenId: resDosen.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler Sinkronisasi Otomatis Google Scholar / SINTA
  const handleSyncDosen = async (dosenId: string) => {
    setSyncingId(dosenId);
    setAlert(null);

    const targetDosen = dosenList.find(d => d.id === dosenId);
    const dosenName = targetDosen ? targetDosen.nama : 'Dosen';

    try {
      const res = await fetch(`/api/dosen/${dosenId}/sync`, {
        method: 'POST'
      });
      const data = await res.json();

      if (data.success) {
        setAlert({
          type: 'success',
          message: `Berhasil sinkronisasi untuk ${dosenName}! ${data.totalImported} artikel diperbarui dari ${data.source}. (Total Sitasi: ${data.metrics?.totalSitasi || 0}, h-index: ${data.metrics?.hIndex || 0})`
        });
        fetchData();
      } else {
        setAlert({
          type: 'error',
          message: data.message || `Gagal sinkronisasi data untuk ${dosenName}`
        });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan jaringan saat sinkronisasi' });
    } finally {
      setSyncingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      dosenId: dosenList[0]?.id || '',
      judul: '',
      penulis: '',
      jurnal: '',
      tahun: 2026,
      sitasi: 0,
      sumber: 'Google Scholar',
      url: '',
      doi: '',
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pub: Publikasi) => {
    setEditingId(pub.id);
    setFormData({
      dosenId: pub.dosenId,
      judul: pub.judul,
      penulis: pub.penulis,
      jurnal: pub.jurnal,
      tahun: pub.tahun,
      sitasi: pub.sitasi,
      sumber: pub.sumber,
      url: pub.url || '',
      doi: pub.doi || '',
      featured: Boolean(pub.featured)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/publikasi/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Publikasi berhasil diperbarui!' });
          fetchData();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal update publikasi' });
        }
      } else {
        const res = await fetch('/api/publikasi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Publikasi baru berhasil ditambahkan!' });
          fetchData();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal menambah publikasi' });
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus publikasi: "${judul}"?`)) return;

    try {
      const res = await fetch(`/api/publikasi/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: 'Publikasi berhasil dihapus!' });
        fetchData();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menghapus' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  // Filter List
  const filteredPubs = publikasiList.filter(p => {
    const enriched = p as any;
    const matchesDosen = selectedDosenFilter === 'semua' || 
                         enriched.allDosenIds?.includes(selectedDosenFilter) || 
                         p.dosenId === selectedDosenFilter;
    const matchesSearch = p.judul.toLowerCase().includes(search.toLowerCase()) ||
                          p.penulis.toLowerCase().includes(search.toLowerCase()) ||
                          p.jurnal.toLowerCase().includes(search.toLowerCase());
    return matchesDosen && matchesSearch;
  });

  // Statistik Kunci
  const totalSitasiProdi = publikasiList.reduce((sum, p) => sum + (Number(p.sitasi) || 0), 0);
  const totalSinta = publikasiList.filter(p => p.sumber === 'SINTA').length;
  const totalScholar = publikasiList.filter(p => p.sumber === 'Google Scholar').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Publikasi & Riset Dosen (Google Scholar / SINTA)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data turunan master dosen untuk pencatatan rekam jejak publikasi ilmiah, sitasi, dan luaran Tridharma.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Publikasi Manual</span>
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

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Publikasi</span>
          <p className="text-3xl font-extrabold text-blue-900 mt-1">{publikasiList.length}</p>
          <span className="text-xs text-slate-400">Artikel & Paper Terdata</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Sitasi Prodi</span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-1">{totalSitasiProdi}</p>
          <span className="text-xs text-slate-400">Kutipan Ilmiah Terindeks</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Terindeks SINTA</span>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{totalSinta}</p>
          <span className="text-xs text-slate-400">Jurnal Nasional Terakreditasi</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Google Scholar</span>
          <p className="text-3xl font-extrabold text-indigo-700 mt-1">{totalScholar}</p>
          <span className="text-xs text-slate-400">Indeks Sitasi Akademik</span>
        </div>
      </div>

      {/* Sync Action Tool Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Sinkronisasi Otomatis 1-Klik
          </div>
          <h2 className="text-xl font-bold">
            Tarik Otomatis Publikasi Dosen dari Google Scholar & SINTA
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Sistem secara cerdas memindai indeks publikasi online berdasarkan nama dan ID dosen, menghitung jumlah sitasi dan h-index secara otomatis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <select
            id="syncDosenSelect"
            className="w-full sm:w-60 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            defaultValue={dosenList[0]?.id || ''}
          >
            {dosenList.map(d => (
              <option key={d.id} value={d.id}>
                {d.nama}, {d.gelar}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const el = document.getElementById('syncDosenSelect') as HTMLSelectElement;
              if (el && el.value) handleSyncDosen(el.value);
            }}
            disabled={Boolean(syncingId)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${syncingId ? 'animate-spin' : ''}`} />
            <span>{syncingId ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul paper, penulis, atau nama jurnal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">Filter Dosen:</span>
          <select
            value={selectedDosenFilter}
            onChange={(e) => setSelectedDosenFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          >
            <option value="semua">Semua Dosen ({publikasiList.length})</option>
            {dosenList.map(d => {
              const count = publikasiList.filter(p => (p as any).allDosenIds?.includes(d.id) || p.dosenId === d.id).length;
              return (
                <option key={d.id} value={d.id}>
                  {d.nama} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Table Publikasi */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Judul Publikasi & Penulis</th>
                <th className="py-3 px-4">Dosen Pemilik</th>
                <th className="py-3 px-4">Jurnal / Seminar</th>
                <th className="py-3 px-4 text-center">Tahun</th>
                <th className="py-3 px-4 text-center">Sitasi</th>
                <th className="py-3 px-4">Sumber</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Memuat data publikasi...
                  </td>
                </tr>
              ) : filteredPubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Tidak ada publikasi yang cocok. Silakan gunakan tombol sinkronisasi di atas.
                  </td>
                </tr>
              ) : (
                filteredPubs.map((pub) => {
                  const owner = dosenList.find(d => d.id === pub.dosenId);

                  return (
                    <tr key={pub.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-md">
                        <div className="flex items-center gap-2">
                          <span>{pub.judul}</span>
                          {pub.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Unggulan
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                          Penulis: {pub.penulis}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="block font-bold">
                            {(pub as any).primaryDosen ? `${(pub as any).primaryDosen.nama}, ${(pub as any).primaryDosen.gelar}` : (owner ? `${owner.nama}, ${owner.gelar}` : 'Dosen TI')}
                          </span>
                          {(pub as any).urutanPenulisLabel && (
                            <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {(pub as any).urutanPenulisLabel}
                            </span>
                          )}
                          {(pub as any).isKolaborasiDosen && (
                            <span className="block text-[10px] text-purple-700 font-semibold">
                              ✨ Kolaborasi {(pub as any).coAuthorsDosen?.length || 2} Dosen TI
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs text-xs">
                        {pub.jurnal}
                        {pub.doi && (
                          <span className="block text-[10px] text-blue-600 font-mono mt-0.5">
                            DOI: {pub.doi}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                        {pub.tahun}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {pub.sitasi} sitasi
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          pub.sumber === 'SINTA'
                            ? 'bg-amber-100 text-amber-900'
                            : pub.sumber === 'Scopus'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}>
                          {pub.sumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition"
                              title="Buka Naskah Asli"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => openEditModal(pub)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Sunting Publikasi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pub.id, pub.judul)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Hapus Publikasi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Publikasi Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? 'Sunting Publikasi' : 'Tambah Publikasi Manual'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dosen Penulis (Relasi Master Dosen)
                </label>
                <select
                  required
                  value={formData.dosenId}
                  onChange={(e) => setFormData({...formData, dosenId: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {dosenList.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.nama}, {d.gelar} ({d.nip})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Artikel Ilmiah
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Contoh: Implementasi Deep Learning untuk Klasifikasi Tanaman..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Susunan Penulis (Authors)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.penulis}
                    onChange={(e) => setFormData({...formData, penulis: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Contoh: Risald, MI Wibowo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Jurnal / Prosiding
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jurnal}
                    onChange={(e) => setFormData({...formData, jurnal: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Jurnal Sains Komputer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun Terbit
                  </label>
                  <input
                    type="number"
                    min={2000}
                    max={2035}
                    required
                    value={formData.tahun}
                    onChange={(e) => setFormData({...formData, tahun: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jumlah Sitasi
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.sitasi}
                    onChange={(e) => setFormData({...formData, sitasi: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Basis Indeks
                  </label>
                  <select
                    value={formData.sumber}
                    onChange={(e) => setFormData({...formData, sumber: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Google Scholar">Google Scholar</option>
                    <option value="SINTA">SINTA</option>
                    <option value="Scopus">Scopus</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tautan Artikel (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor DOI (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({...formData, doi: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    placeholder="10.1234/jtik.2026.01"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredPub"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featuredPub" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Jadikan Publikasi Unggulan (Tampil di Beranda & Profil Prodi)
                </label>
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
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Publikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
