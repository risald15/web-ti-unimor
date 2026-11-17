'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Newspaper, 
  Users, 
  BookOpen, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  ExternalLink,
  Settings,
  Video
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBerita: 0,
    totalDosen: 0,
    totalKurikulum: 0,
    totalSks: 0,
    totalVideo: 0
  });
  const [recentBerita, setRecentBerita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resBerita, resDosen, resKurikulum, resVideo] = await Promise.all([
          fetch('/api/berita').then(r => r.json()),
          fetch('/api/dosen').then(r => r.json()),
          fetch('/api/kurikulum').then(r => r.json()),
          fetch('/api/video').then(r => r.json())
        ]);

        if (resBerita.success && resDosen.success && resKurikulum.success) {
          const beritaList = resBerita.data || [];
          const dosenList = resDosen.data || [];
          const kurikulumList = resKurikulum.data || [];
          const videoList = resVideo.success ? (resVideo.data || []) : [];
          const totalSks = kurikulumList.reduce((acc: number, curr: any) => acc + (Number(curr.sks) || 0), 0);

          setStats({
            totalBerita: beritaList.length,
            totalDosen: dosenList.length,
            totalKurikulum: kurikulumList.length,
            totalSks: totalSks,
            totalVideo: videoList.length
          });

          setRecentBerita(beritaList.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Banner Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            Sistem Manajemen Dinamis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Panel Admin Prodi TI UNIMOR
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Kelola seluruh informasi portal publik, publikasikan berita kuliah umum, perbarui direktori dosen, kurikulum, serta profil prodi secara mandiri.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/admin/berita"
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Berita</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 backdrop-blur-sm transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Website</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Berita & Warta</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : stats.totalBerita}
            </p>
            <Link href="/admin/berita" className="text-xs font-semibold text-blue-700 hover:underline mt-2 inline-block">
              Kelola Berita &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dosen Terdaftar</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : stats.totalDosen}
            </p>
            <Link href="/admin/dosen" className="text-xs font-semibold text-blue-700 hover:underline mt-2 inline-block">
              Kelola Dosen &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video YouTube</span>
            <p className="text-3xl font-extrabold text-red-600 mt-1">
              {loading ? '...' : stats.totalVideo}
            </p>
            <Link href="/admin/video" className="text-xs font-semibold text-red-600 hover:underline mt-2 inline-block">
              Kelola Video &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Kuliah S1</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : stats.totalKurikulum}
            </p>
            <Link href="/admin/kurikulum" className="text-xs font-semibold text-blue-700 hover:underline mt-2 inline-block">
              Kelola Kurikulum &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Beban SKS</span>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">
              {loading ? '...' : `${stats.totalSks} SKS`}
            </p>
            <span className="text-xs text-slate-500 mt-2 block">
              Kurikulum OBE S1 TI
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Grid: Berita Terbaru & Panduan Cepat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Berita Terbaru */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Warta & Berita Terakhir Dipublikasikan
              </h2>
              <p className="text-xs text-slate-500">
                Daftar artikel yang saat ini tampil pada halaman publik website prodi.
              </p>
            </div>
            <Link
              href="/admin/berita"
              className="text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentBerita.map((item) => (
              <div key={item.id} className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                      {item.kategori}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.tanggal}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 hover:text-blue-700 transition">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {item.ringkasan}
                  </p>
                </div>

                <Link
                  href="/admin/berita"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Aksi Cepat */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Aksi Cepat Admin
            </h3>

            <div className="space-y-2.5">
              <Link
                href="/admin/berita"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold">Publikasikan Berita Baru</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin/video"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-800 hover:text-red-700 transition border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold">Kelola Galeri Video YouTube</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin/dosen"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 transition border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold">Tambah / Perbarui Dosen</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin/kurikulum"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-700 transition border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">Sesuaikan Mata Kuliah</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin/profil"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 transition border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Edit Sambutan & Visi Misi</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Informasi Keamanan
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Semua data yang Anda simpan di panel admin ini langsung tersimpan secara permanen di database server dan tercermin otomatis pada website publik tanpa perlu kompilasi ulang kode.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
