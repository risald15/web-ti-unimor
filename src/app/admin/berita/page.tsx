'use client';

import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Calendar, 
  User, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';

interface Berita {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  isiLengkap: string;
  kategori: 'Berita' | 'Pengumuman' | 'Agenda' | 'Prestasi';
  tanggal: string;
  penulis: string;
  featured?: boolean;
}

export default function AdminBeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    ringkasan: '',
    isiLengkap: '',
    kategori: 'Berita' as Berita['kategori'],
    tanggal: '2026-11-12',
    penulis: 'Humas TI UNIMOR',
    featured: false
  });

  const fetchBerita = async () => {
    try {
      const res = await fetch('/api/berita');
      const data = await res.json();
      if (data.success) {
        setBeritaList(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      ringkasan: '',
      isiLengkap: '',
      kategori: 'Berita',
      tanggal: new Date().toISOString().split('T')[0],
      penulis: 'Humas TI UNIMOR',
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Berita) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      ringkasan: item.ringkasan,
      isiLengkap: item.isiLengkap || item.ringkasan,
      kategori: item.kategori,
      tanggal: item.tanggal,
      penulis: item.penulis,
      featured: Boolean(item.featured)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/berita/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Berita berhasil diperbarui!' });
          fetchBerita();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal update' });
        }
      } else {
        // Create
        const res = await fetch('/api/berita', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Berita baru berhasil ditambahkan!' });
          fetchBerita();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal menambah berita' });
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Yakin ingin menghapus berita: "${judul}"?`)) return;

    try {
      const res = await fetch(`/api/berita/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: 'Berita berhasil dihapus!' });
        fetchBerita();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menghapus berita' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  const filtered = beritaList.filter(b => 
    b.judul.toLowerCase().includes(search.toLowerCase()) ||
    b.kategori.toLowerCase().includes(search.toLowerCase()) ||
    b.penulis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Warta, Berita & Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah, sunting, atau hapus artikel berita kegiatan Tridharma dan pengumuman prodi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
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

      {/* Search & Filter bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, kategori, atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline-block">
          Total: {filtered.length} Berita
        </span>
      </div>

      {/* Table list */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Judul Artikel</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Penulis</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Memuat data berita...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Tidak ada berita ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-md">
                      <div className="flex items-center gap-2">
                        <span>{item.judul}</span>
                        {item.featured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Sorotan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">
                        {item.ringkasan}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                      {item.tanggal}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {item.penulis}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Sunting Berita"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.judul)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Hapus Berita"
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? 'Sunting Berita' : 'Tambah Berita Baru'}
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
                  Judul Artikel Berita / Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Contoh: Kuliah Umum AI & Rekayasa Web Modern di UNIMOR"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({...formData, kategori: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Agenda">Agenda</option>
                    <option value="Prestasi">Prestasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Publikasi
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Penulis / Divisi
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.penulis}
                    onChange={(e) => setFormData({...formData, penulis: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Singkat (Lead Paragraph)
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({...formData, ringkasan: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ringkasan 1-2 kalimat yang tampil pada kartu beranda..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Lengkap Artikel
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.isiLengkap}
                  onChange={(e) => setFormData({...formData, isiLengkap: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tuliskan isi berita atau agenda kegiatan secara lengkap..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Jadikan Berita Sorotan / Featured di Beranda
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
                  {editingId ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
