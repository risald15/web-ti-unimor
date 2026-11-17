'use client';

import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  ExternalLink, 
  Calendar, 
  User, 
  Play, 
  X, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { VideoKegiatan } from '@/lib/db';

export default function AdminVideoPage() {
  const [videos, setVideos] = useState<VideoKegiatan[]>([]);
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    judul: '',
    youtubeUrl: '',
    kategori: 'Kuliah Umum' as VideoKegiatan['kategori'],
    deskripsi: '',
    tanggal: '',
    pemateri: '',
    dosenId: '',
    featured: false
  });

  const kategoriOptions: VideoKegiatan['kategori'][] = [
    'Kuliah Umum',
    'Praktikum & Riset',
    'Kegiatan Mahasiswa',
    'Dies Natalis',
    'Workshop & Seminar',
    'Profil Kampus'
  ];

  // Helper to extract 11-digit YouTube ID in real-time
  const getPreviewYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const cleaned = url.trim();
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
  };

  const previewId = getPreviewYoutubeId(formData.youtubeUrl);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/video');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVideos(data.data);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDosen = async () => {
    try {
      const res = await fetch('/api/dosen');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDosenList(data.data);
      }
    } catch (err) {
      console.error('Error fetching dosen:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchDosen();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      youtubeUrl: '',
      kategori: 'Kuliah Umum',
      deskripsi: '',
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      pemateri: '',
      dosenId: '',
      featured: videos.length === 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vid: VideoKegiatan) => {
    setEditingId(vid.id);
    setFormData({
      judul: vid.judul,
      youtubeUrl: vid.youtubeUrl,
      kategori: vid.kategori,
      deskripsi: vid.deskripsi,
      tanggal: vid.tanggal,
      pemateri: vid.pemateri || '',
      dosenId: vid.dosenId || '',
      featured: Boolean(vid.featured)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewId) {
      setAlert({ type: 'error', message: 'Tautan YouTube tidak valid. Mohon masukkan link video YouTube yang benar.' });
      return;
    }

    try {
      const payload = {
        ...formData,
        youtubeId: previewId
      };

      if (editingId) {
        const res = await fetch(`/api/video/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Video kegiatan berhasil diperbarui!' });
          fetchVideos();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal update video' });
        }
      } else {
        const res = await fetch('/api/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Video kegiatan baru berhasil ditambahkan!' });
          fetchVideos();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal menambah video' });
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem saat menyimpan video' });
    }
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus video "${judul}"?`)) return;

    try {
      const res = await fetch(`/api/video/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: 'Video berhasil dihapus' });
        fetchVideos();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menghapus video' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat menghapus video' });
    }
  };

  const handleSetFeatured = async (vid: VideoKegiatan) => {
    try {
      const res = await fetch(`/api/video/${vid.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: true })
      });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: `"${vid.judul}" sekarang menjadi Video Utama di beranda!` });
        fetchVideos();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Gagal menetapkan video utama' });
    }
  };

  const filteredVideos = videos.filter(v => {
    const matchSearch = v.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.pemateri && v.pemateri.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'Semua' || v.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans">
      
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
            Dokumentasi & Kanal Multimedia
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Video className="w-7 h-7 text-red-600" />
            Kelola Galeri Video Kegiatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manajemen arsip video kegiatan akademik dan mahasiswa Prodi TI UNIMOR dari kanal YouTube.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Video Kegiatan</span>
        </button>
      </div>

      {/* Alert Notification */}
      {alert && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm ${
          alert.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="font-medium">{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari video berdasarkan judul, narasumber, atau topik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
            Kategori:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Semua">Semua Kategori ({videos.length})</option>
            {kategoriOptions.map(kat => (
              <option key={kat} value={kat}>{kat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Memuat galeri video...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
          <Video className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Belum ada video kegiatan</h3>
          <p className="text-xs text-slate-400">Silakan tambahkan video pertama Anda dengan menekan tombol Tambah Video Kegiatan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              className={`rounded-2xl bg-white border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                vid.featured ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Thumbnail Preview with Aspect Video */}
                <div className="relative aspect-video bg-black overflow-hidden group">
                  <img
                    src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                    alt={vid.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/20 transition-colors flex items-center justify-center text-white"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </a>

                  {vid.featured && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      VIDEO UTAMA BERANDA
                    </div>
                  )}

                  <span className="absolute bottom-2 right-2 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                    ID: {vid.youtubeId}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                      {vid.kategori}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {vid.tanggal}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {vid.judul}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {vid.deskripsi}
                  </p>

                  {(vid.dosenNama || vid.pemateri) && (
                    <div className="text-[11px] text-slate-600 flex items-center gap-1 pt-1 border-t border-slate-100">
                      <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">Narasumber / PJ: <strong>{vid.dosenNama || vid.pemateri}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  {!vid.featured ? (
                    <button
                      onClick={() => handleSetFeatured(vid)}
                      className="text-[11px] font-bold text-slate-600 hover:text-amber-600 flex items-center gap-1 transition"
                      title="Jadikan video sorotan di beranda"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Jadikan Utama</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Video Utama</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(vid)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                    title="Edit Data Video"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vid.id, vid.judul)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Hapus Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Form Tambah / Edit Video */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {editingId ? 'Edit Video Kegiatan' : 'Tambah Video Kegiatan Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sistem otomatis mendukung link YouTube standar, youtu.be, shorts, maupun embed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              
              {/* Tautan YouTube */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan / URL Video YouTube <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Cukup salin link dari aplikasi atau browser YouTube. ID Video akan terdeteksi otomatis.
                </p>
              </div>

              {/* Real-time YouTube Live Preview */}
              {previewId && (
                <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> ID YouTube Terdeteksi: <code className="bg-slate-800 px-1 py-0.5 rounded text-white">{previewId}</code>
                    </span>
                    <span className="text-slate-400">Live Preview</span>
                  </div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${previewId}?autoplay=0&rel=0`}
                      title="Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Judul Kegiatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Kegiatan / Acara <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Kuliah Umum AI & Prompt Engineering 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Kategori & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Kegiatan
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {kategoriOptions.map(kat => (
                      <option key={kat} value={kat}>{kat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    placeholder="Contoh: 10 November 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Pemateri & Dosen Penanggung Jawab */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Narasumber / Pembicara Luar
                  </label>
                  <input
                    type="text"
                    value={formData.pemateri}
                    onChange={(e) => setFormData({ ...formData, pemateri: e.target.value })}
                    placeholder="Contoh: Praktisi Industri / Narasumber Tamu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dosen Penanggung Jawab / Pengampu (Relasi Master)
                  </label>
                  <select
                    value={formData.dosenId}
                    onChange={(e) => setFormData({ ...formData, dosenId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  >
                    <option value="">-- Pilih Dosen Penanggung Jawab --</option>
                    {dosenList.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.nama}, {d.gelar} ({d.jabatan})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Ringkasan Liputan Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Jelaskan secara singkat tujuan dan jalannya kegiatan tersebut..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              {/* Checkbox Featured */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-900 rounded focus:ring-blue-600 border-slate-300"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-amber-950 cursor-pointer">
                  Tandai sebagai Video Utama (Featured) di Layar Beranda
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition shadow-md"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Video'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
