'use client';

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Cpu, 
  Layers, 
  X, 
  Upload, 
  CheckCircle, 
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { LabFasilitas, Dosen } from '@/lib/db';

export default function AdminFasilitasPage() {
  const [labs, setLabs] = useState<LabFasilitas[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    kapasitas: '',
    spesifikasiText: '',
    peruntukan: '',
    gambarUrl: '',
    dosenId: '',
    penanggungJawab: '',
    nipPenanggungJawab: ''
  });

  const fetchData = async () => {
    try {
      const [resLabs, resDosen] = await Promise.all([
        fetch('/api/fasilitas').then(r => r.json()),
        fetch('/api/dosen').then(r => r.json())
      ]);

      if (resLabs.success) setLabs(resLabs.data || []);
      if (resDosen.success) setDosenList(resDosen.data || []);
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Gagal memuat data laboratorium dan dosen' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDosenChange = (dosenId: string) => {
    const selectedDosen = dosenList.find(d => d.id === dosenId);
    if (selectedDosen) {
      const fullName = selectedDosen.gelar ? `${selectedDosen.nama}, ${selectedDosen.gelar}` : selectedDosen.nama;
      setFormData(prev => ({
        ...prev,
        dosenId: selectedDosen.id,
        penanggungJawab: fullName,
        nipPenanggungJawab: selectedDosen.nip || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dosenId: '',
        penanggungJawab: '',
        nipPenanggungJawab: ''
      }));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      deskripsi: '',
      kapasitas: '',
      spesifikasiText: '',
      peruntukan: '',
      gambarUrl: '',
      dosenId: '',
      penanggungJawab: '',
      nipPenanggungJawab: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lab: LabFasilitas) => {
    setEditingId(lab.id);
    setFormData({
      nama: lab.nama,
      deskripsi: lab.deskripsi,
      kapasitas: lab.kapasitas,
      spesifikasiText: Array.isArray(lab.spesifikasi) ? lab.spesifikasi.join('\n') : '',
      peruntukan: lab.peruntukan,
      gambarUrl: lab.gambarUrl || '',
      dosenId: lab.dosenId || '',
      penanggungJawab: lab.penanggungJawab || '',
      nipPenanggungJawab: lab.nipPenanggungJawab || ''
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

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, gambarUrl: result.url }));
        setAlert({ type: 'success', message: 'Foto laboratorium berhasil diunggah!' });
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal mengunggah foto' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat mengunggah foto' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const payload = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      kapasitas: formData.kapasitas,
      spesifikasi: formData.spesifikasiText.split('\n').map(s => s.trim()).filter(Boolean),
      peruntukan: formData.peruntukan,
      gambarUrl: formData.gambarUrl,
      dosenId: formData.dosenId || undefined,
      penanggungJawab: formData.penanggungJawab,
      nipPenanggungJawab: formData.nipPenanggungJawab
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/fasilitas/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/fasilitas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (result.success) {
        setAlert({ 
          type: 'success', 
          message: editingId ? 'Data laboratorium & relasi dosen berhasil diperbarui!' : 'Laboratorium baru berhasil ditambahkan!' 
        });
        setIsModalOpen(false);
        fetchData();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menyimpan data' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem saat menyimpan' });
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus laboratorium "${nama}"?`)) return;

    try {
      const res = await fetch(`/api/fasilitas/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: `Laboratorium "${nama}" berhasil dihapus` });
        fetchData();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menghapus' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat menghapus' });
    }
  };

  const filteredLabs = labs.filter(lab => 
    lab.nama.toLowerCase().includes(search.toLowerCase()) ||
    (lab.penanggungJawab && lab.penanggungJawab.toLowerCase().includes(search.toLowerCase())) ||
    (lab.peruntukan && lab.peruntukan.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Monitor className="w-3.5 h-3.5" />
            Master Fasilitas & Riset
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Fasilitas & Laboratorium Komputer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Laboratorium berelasi langsung dengan Master Dosen untuk penunjukan Penanggung Jawab (PJ Lab).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Laboratorium Baru</span>
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
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="font-bold text-xs">Tutup &times;</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama lab, penanggung jawab, atau peruntukan praktikum..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
        />
      </div>

      {/* Grid Daftar Lab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">
            Memuat data laboratorium...
          </div>
        ) : filteredLabs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">
            Belum ada laboratorium yang terdaftar.
          </div>
        ) : (
          filteredLabs.map((lab) => (
            <div 
              key={lab.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col justify-between p-6 space-y-4"
            >
              <div className="space-y-3">
                {/* Gambar Lab Preview */}
                <div className="h-44 w-full rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-100">
                  {lab.gambarUrl ? (
                    <img 
                      src={lab.gambarUrl} 
                      alt={lab.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Monitor className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs">Belum ada foto</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold">
                    {lab.kapasitas}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {lab.nama}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {lab.deskripsi}
                  </p>
                </div>

                {/* Relasi PJ Lab */}
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-blue-900 font-bold">
                    <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Kepala / Penanggung Jawab:</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {lab.penanggungJawab || 'Belum ditentukan'}
                  </p>
                  {lab.nipPenanggungJawab && (
                    <p className="text-[11px] font-mono text-slate-500">
                      NIP. {lab.nipPenanggungJawab}
                    </p>
                  )}
                  {lab.dosenId && (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      🔗 Terelasi ke Master Dosen
                    </span>
                  )}
                </div>

                {/* Spesifikasi Ringkas */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Spesifikasi Utama:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {lab.spesifikasi.slice(0, 3).map((spec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">•</span>
                        <span className="line-clamp-1">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {lab.peruntukan && (
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">Peruntukan: </span>
                    {lab.peruntukan}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(lab)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Sunting Lab</span>
                </button>
                <button
                  onClick={() => handleDelete(lab.id, lab.nama)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? 'Sunting Data Laboratorium' : 'Tambah Laboratorium Baru'}
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
                  Nama Laboratorium
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  placeholder="Contoh: Laboratorium Rekayasa Perangkat Lunak & AI"
                />
              </div>

              {/* Relasi PJ Lab ke Master Dosen */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <label className="block text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                  Pilih Dosen Penanggung Jawab / Kepala Lab (Relasi Master Dosen)
                </label>
                <select
                  value={formData.dosenId}
                  onChange={(e) => handleDosenChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="">-- Pilih dari Master Dosen (Otomatis) --</option>
                  {dosenList.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.nama}{d.gelar ? `, ${d.gelar}` : ''} {d.nip ? `(NIP. ${d.nip})` : ''}
                    </option>
                  ))}
                </select>
                {formData.dosenId && (
                  <p className="text-[11px] text-blue-700 font-medium">
                    ✓ Terhubung ke Master Dosen: Jika gelar atau NIP dosen diperbarui, data lab ini akan ikut terbarui otomatis.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kapasitas Workstation / PC
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kapasitas}
                    onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Contoh: 40 Workstation Core i7"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Penanggung Jawab (Teks Cadangan)
                  </label>
                  <input
                    type="text"
                    value={formData.penanggungJawab}
                    onChange={(e) => setFormData({...formData, penanggungJawab: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Contoh: Risald, S.Kom., M.T."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Laboratorium
                </label>
                <textarea
                  rows={2}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Deskripsi sarana dan kelengkapan fasilitas lab..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daftar Spesifikasi Hardware & Jaringan (1 baris = 1 spesifikasi)
                </label>
                <textarea
                  rows={4}
                  value={formData.spesifikasiText}
                  onChange={(e) => setFormData({...formData, spesifikasiText: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                  placeholder="40 Unit PC Intel Core i7 13th Gen, 32GB RAM&#10;Koneksi Dedicated Fiber Optic 100 Mbps&#10;Smartboard Interactive 75 Inch"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peruntukan Mata Kuliah Praktikum & Riset
                </label>
                <input
                  type="text"
                  value={formData.peruntukan}
                  onChange={(e) => setFormData({...formData, peruntukan: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Praktikum Pemrograman Web, OOP, Machine Learning, UI/UX"
                />
              </div>

              {/* Upload Foto Lab */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Foto Dokumentasi Laboratorium
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Mengunggah...' : 'Unggah Foto Lab'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={formData.gambarUrl}
                    onChange={(e) => setFormData({...formData, gambarUrl: e.target.value})}
                    placeholder="URL gambar atau /uploads/dosen/..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Laboratorium'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
