'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Layers,
  UserCheck,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { MataKuliah, Dosen, PeminatanProdi } from '@/lib/db';

export default function AdminKurikulumPage() {
  const [matkulList, setMatkulList] = useState<MataKuliah[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [peminatanList, setPeminatanList] = useState<PeminatanProdi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSemester, setActiveSemester] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKode, setEditingKode] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    sks: 3,
    semester: 1,
    kategori: 'Wajib' as MataKuliah['kategori'],
    deskripsi: '',
    dosenPengampuId: '',
    peminatanId: ''
  });

  const fetchData = async () => {
    try {
      const [resKurikulum, resDosen, resProfil] = await Promise.all([
        fetch('/api/kurikulum').then(r => r.json()),
        fetch('/api/dosen').then(r => r.json()),
        fetch('/api/profil').then(r => r.json())
      ]);

      if (resKurikulum.success) setMatkulList(resKurikulum.data || []);
      if (resDosen.success) setDosenList(resDosen.data || []);
      if (resProfil.success && Array.isArray(resProfil.data?.peminatanProdi)) {
        setPeminatanList(resProfil.data.peminatanProdi);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Gagal memuat data kurikulum dan master relasi' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingKode(null);
    setFormData({
      kode: '',
      nama: '',
      sks: 3,
      semester: activeSemester,
      kategori: 'Wajib',
      deskripsi: '',
      dosenPengampuId: '',
      peminatanId: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mk: MataKuliah) => {
    setEditingKode(mk.kode);
    setFormData({
      kode: mk.kode,
      nama: mk.nama,
      sks: mk.sks,
      semester: mk.semester,
      kategori: mk.kategori,
      deskripsi: mk.deskripsi,
      dosenPengampuId: mk.dosenPengampuId || '',
      peminatanId: mk.peminatanId || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dosenPengampuId: formData.dosenPengampuId || undefined,
        peminatanId: formData.peminatanId || undefined
      };

      if (editingKode) {
        const res = await fetch(`/api/kurikulum/${encodeURIComponent(editingKode)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Mata kuliah & relasi dosen berhasil diperbarui!' });
          fetchData();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal update mata kuliah' });
        }
      } else {
        const res = await fetch('/api/kurikulum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          setAlert({ type: 'success', message: 'Mata kuliah baru berhasil ditambahkan!' });
          fetchData();
          setIsModalOpen(false);
        } else {
          setAlert({ type: 'error', message: result.message || 'Gagal menambah mata kuliah' });
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan sistem saat menyimpan' });
    }
  };

  const handleDelete = async (kode: string, nama: string) => {
    if (!confirm(`Yakin ingin menghapus mata kuliah ${kode} - ${nama}?`)) return;

    try {
      const res = await fetch(`/api/kurikulum/${encodeURIComponent(kode)}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setAlert({ type: 'success', message: `Mata kuliah ${kode} berhasil dihapus` });
        fetchData();
      } else {
        setAlert({ type: 'error', message: result.message || 'Gagal menghapus mata kuliah' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat menghapus' });
    }
  };

  const semesterFiltered = matkulList.filter((m) => m.semester === activeSemester);
  const totalSksSemester = semesterFiltered.reduce((sum, item) => sum + item.sks, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Master Kurikulum & Silabus
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Struktur Kurikulum & Mata Kuliah S1
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mata kuliah berelasi langsung dengan Master Dosen (Pengampu MK) dan Bidang Peminatan S1.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mata Kuliah</span>
        </button>
      </div>

      {/* Alert */}
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

      {/* Filter Tab Semester */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Semester Aktif:
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-extrabold text-xs">
            {totalSksSemester} SKS ({semesterFiltered.length} MK)
          </span>
        </div>

        {/* Buttons 1 - 8 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveSemester(sem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeSemester === sem
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Sem. {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Table List Matkul */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Kode MK</th>
                <th className="py-3 px-4">Nama Mata Kuliah</th>
                <th className="py-3 px-4 text-center">SKS</th>
                <th className="py-3 px-4">Kategori & Peminatan</th>
                <th className="py-3 px-4">Dosen Koordinator / Pengampu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Memuat data kurikulum...
                  </td>
                </tr>
              ) : semesterFiltered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada mata kuliah untuk semester {activeSemester}. Silakan klik "Tambah Mata Kuliah".
                  </td>
                </tr>
              ) : (
                semesterFiltered.map((item) => (
                  <tr key={item.kode} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800 text-xs">
                      {item.kode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{item.nama}</div>
                      <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">{item.deskripsi}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {item.sks}
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-block ${
                        item.kategori === 'Keahlian Inti'
                          ? 'bg-amber-100 text-amber-900'
                          : item.kategori === 'Pilihan'
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.kategori}
                      </span>
                      {item.peminatanNama && (
                        <div className="text-[10px] text-purple-700 font-medium">
                          {item.peminatanNama}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {item.dosenPengampu ? (
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>{item.dosenPengampu}</span>
                          </div>
                          {item.nipPengampu && (
                            <div className="text-[10px] font-mono text-slate-400">NIP. {item.nipPengampu}</div>
                          )}
                          <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            🔗 Relasi Master Dosen
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum ditentukan</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Sunting Mata Kuliah"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.kode, item.nama)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Hapus Mata Kuliah"
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
                {editingKode ? 'Sunting Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Mata Kuliah
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingKode)}
                    value={formData.kode}
                    onChange={(e) => setFormData({...formData, kode: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase font-mono disabled:bg-slate-100"
                    placeholder="TI2101"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Mata Kuliah
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  placeholder="Pemrograman Web Lanjut"
                />
              </div>

              {/* Relasi Dosen Pengampu */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                <label className="block text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                  Dosen Koordinator / Pengampu (Relasi Master Dosen)
                </label>
                <select
                  value={formData.dosenPengampuId}
                  onChange={(e) => setFormData({...formData, dosenPengampuId: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-xl border border-blue-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="">-- Pilih Dosen Pengampu --</option>
                  {dosenList.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.nama}{d.gelar ? `, ${d.gelar}` : ''} {d.nip ? `(NIP. ${d.nip})` : ''}
                    </option>
                  ))}
                </select>
                {formData.dosenPengampuId && (
                  <p className="text-[11px] text-blue-700 font-medium">
                    ✓ Data dosen tersinkron dari Master Dosen.
                  </p>
                )}
              </div>

              {/* Relasi Bidang Peminatan */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                <label className="block text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-700" />
                  Rumpun Bidang Peminatan (Relasi Peminatan S1)
                </label>
                <select
                  value={formData.peminatanId}
                  onChange={(e) => setFormData({...formData, peminatanId: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">-- Umum / Dasar Keahlian TI --</option>
                  {peminatanList.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.judul}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bobot SKS
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={formData.sks}
                    onChange={(e) => setFormData({...formData, sks: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Mata Kuliah
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({...formData, kategori: e.target.value as MataKuliah['kategori']})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Wajib">Wajib</option>
                    <option value="Keahlian Inti">Keahlian Inti</option>
                    <option value="Pilihan">Pilihan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Silabus Ringkas
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Capaian pembelajaran dan pokok bahasan mata kuliah..."
                />
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
                  {editingKode ? 'Simpan Perubahan' : 'Tambah Mata Kuliah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
