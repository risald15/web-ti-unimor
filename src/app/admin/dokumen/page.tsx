'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Download, 
  X, 
  Upload, 
  CheckCircle,
  FileSpreadsheet,
  FolderDown
} from 'lucide-react';

interface Dokumen {
  id: string;
  nama: string;
  kategori: 'Panduan' | 'SOP' | 'Formulir' | 'SK' | 'Template';
  deskripsi: string;
  fileUrl: string;
  ukuranFile?: string;
  format: 'PDF' | 'DOCX' | 'XLSX';
  tanggalUnggah?: string;
}

export default function AdminDokumenPage() {
  const [docs, setDocs] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Panduan' as Dokumen['kategori'],
    deskripsi: '',
    fileUrl: '',
    ukuranFile: '1.2 MB',
    format: 'PDF' as Dokumen['format']
  });

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/dokumen');
      const data = await res.json();
      if (data.success) {
        setDocs(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      kategori: 'Panduan',
      deskripsi: '',
      fileUrl: '',
      ukuranFile: '1.0 MB',
      format: 'PDF'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Dokumen) => {
    setEditingId(doc.id);
    setFormData({
      nama: doc.nama,
      kategori: doc.kategori,
      deskripsi: doc.deskripsi,
      fileUrl: doc.fileUrl,
      ukuranFile: doc.ukuranFile || '1.0 MB',
      format: doc.format
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);

      // Otomatis deteksi format & ukuran
      const ext = file.name.split('.').pop()?.toUpperCase();
      let formatDetected: Dokumen['format'] = 'PDF';
      if (ext === 'DOC' || ext === 'DOCX') formatDetected = 'DOCX';
      if (ext === 'XLS' || ext === 'XLSX') formatDetected = 'XLSX';

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData(prev => ({ 
          ...prev, 
          fileUrl: result.url,
          format: formatDetected,
          ukuranFile: sizeInMB
        }));
        setAlert({ type: 'success', message: 'File dokumen berhasil diunggah!' });
      } else {
        // Jika endpoint upload hanya untuk gambar, kita tetap simpan nama file dan infokan
        setFormData(prev => ({ 
          ...prev, 
          fileUrl: `/documents/${file.name}`,
          format: formatDetected,
          ukuranFile: sizeInMB
        }));
        setAlert({ type: 'success', message: 'Path dokumen disiapkan!' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat mengunggah' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tanggalUnggah: '15 November 2026'
      };

      if (editingId) {
        const res = await fetch(`/api/dokumen/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Dokumen akademik berhasil diperbarui!' });
          fetchDocs();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal update dokumen' });
        }
      } else {
        const res = await fetch('/api/dokumen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Dokumen baru berhasil ditambahkan!' });
          fetchDocs();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal menambah dokumen' });
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Yakin ingin menghapus dokumen: "${nama}"?`)) return;

    try {
      const res = await fetch(`/api/dokumen/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: 'Dokumen berhasil dihapus!' });
        fetchDocs();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menghapus dokumen' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem' });
    }
  };

  const filtered = docs.filter(d => {
    const matchesKategori = filterKategori === 'semua' || d.kategori === filterKategori;
    const matchesSearch = d.nama.toLowerCase().includes(search.toLowerCase()) ||
                          d.deskripsi.toLowerCase().includes(search.toLowerCase());
    return matchesKategori && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Dokumen, Pedoman & SOP Akademik
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola template penulisan skripsi, berkas pendaftaran sempro, logbook bimbingan, dan formulir MBKM.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Baru</span>
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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul pedoman, formulir, atau SOP skripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">Kategori:</span>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          >
            <option value="semua">Semua Kategori ({docs.length})</option>
            <option value="Panduan">Panduan & Pedoman</option>
            <option value="Formulir">Formulir & Blanko</option>
            <option value="SOP">Standar Operasional (SOP)</option>
            <option value="SK">Surat Keputusan (SK)</option>
            <option value="Template">Template Naskah</option>
          </select>
        </div>
      </div>

      {/* Table Dokumen */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nama Dokumen & Deskripsi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-center">Format & Ukuran</th>
                <th className="py-3 px-4">Tautan Berkas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Memuat daftar dokumen...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Tidak ada dokumen ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-md">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{item.nama}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
                        {item.deskripsi}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.kategori === 'Panduan'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : item.kategori === 'Formulir'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : item.kategori === 'SOP'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {item.kategori}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800">
                        {item.format}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {item.ukuranFile}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Berkas</span>
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Sunting Dokumen"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Hapus Dokumen"
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? 'Sunting Dokumen Akademik' : 'Tambah Dokumen Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Dokumen / Pedoman
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Contoh: Pedoman Penulisan Skripsi & Tugas Akhir S1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Dokumen
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({...formData, kategori: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Panduan">Panduan & Pedoman</option>
                    <option value="Formulir">Formulir & Blanko</option>
                    <option value="SOP">Standar Operasional (SOP)</option>
                    <option value="SK">Surat Keputusan (SK)</option>
                    <option value="Template">Template Naskah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Format File & Perkiraan Ukuran
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({...formData, format: e.target.value as any})}
                      className="w-24 px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-mono"
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                      <option value="XLSX">XLSX</option>
                    </select>
                    <input
                      type="text"
                      value={formData.ukuranFile}
                      onChange={(e) => setFormData({...formData, ukuranFile: e.target.value})}
                      placeholder="Misal: 2.4 MB"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Keterangan Berkas
                </label>
                <textarea
                  rows={2}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Penjelasan isi formulir atau ketentuan penggunaan dokumen..."
                />
              </div>

              {/* Tautan Berkas / Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Berkas File Dokumen
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Memproses...' : 'Pilih Berkas File'}</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                    placeholder="/documents/nama-file.pdf atau link Google Drive"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
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
                  {editingId ? 'Simpan Perubahan' : 'Tambah Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
