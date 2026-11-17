'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Award, 
  User, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Quote, 
  Bookmark,
  Users
} from 'lucide-react';
import { Dosen } from '@/lib/db';
import { EnrichedPublikasi } from '@/lib/publicationUtils';

export default function PublikasiPage() {
  const [pubs, setPubs] = useState<EnrichedPublikasi[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDosen, setFilterDosen] = useState('semua');
  const [filterSumber, setFilterSumber] = useState('semua');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qDosen = params.get('dosen');
      if (qDosen) setFilterDosen(qDosen);
    }

    async function loadData() {
      try {
        const [resPub, resDosen] = await Promise.all([
          fetch('/api/publikasi').then(r => r.json()),
          fetch('/api/dosen').then(r => r.json())
        ]);
        if (resPub.success) setPubs(resPub.data || []);
        if (resDosen.success) setDosenList(resDosen.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPubs = pubs.filter(p => {
    const matchesDosen = filterDosen === 'semua' || 
                         p.allDosenIds?.includes(filterDosen) || 
                         p.dosenId === filterDosen;
    const matchesSumber = filterSumber === 'semua' || p.sumber === filterSumber;
    const matchesSearch = p.judul.toLowerCase().includes(search.toLowerCase()) ||
                          p.penulis.toLowerCase().includes(search.toLowerCase()) ||
                          p.jurnal.toLowerCase().includes(search.toLowerCase());
    return matchesDosen && matchesSumber && matchesSearch;
  });

  const totalSitasi = pubs.reduce((sum, p) => sum + (Number(p.sitasi) || 0), 0);
  const totalSinta = pubs.filter(p => p.sumber === 'SINTA').length;
  const totalScholar = pubs.filter(p => p.sumber === 'Google Scholar').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            Tridharma Perguruan Tinggi
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Publikasi Ilmiah & Riset Dosen
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-2 max-w-2xl">
            Arsip karya ilmiah, artikel jurnal terakreditasi SINTA, dan prosiding konferensi yang tersinkronisasi otomatis dengan Google Scholar.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Publikasi</span>
              <p className="text-3xl font-extrabold text-blue-900 mt-1">{loading ? '...' : pubs.length}</p>
              <span className="text-xs text-slate-400 mt-1 block">Paper Terindeks</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sitasi</span>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1">{loading ? '...' : totalSitasi}</p>
              <span className="text-xs text-slate-400 mt-1 block">Rujukan Akademik</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jurnal SINTA</span>
              <p className="text-3xl font-extrabold text-amber-600 mt-1">{loading ? '...' : totalSinta}</p>
              <span className="text-xs text-slate-400 mt-1 block">Terakreditasi Nasional</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Google Scholar</span>
              <p className="text-3xl font-extrabold text-indigo-700 mt-1">{loading ? '...' : totalScholar}</p>
              <span className="text-xs text-slate-400 mt-1 block">Tersinkronisasi Otomatis</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul penelitian, kata kunci, atau nama penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={filterDosen}
              onChange={(e) => setFilterDosen(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="semua">Semua Dosen Peneliti</option>
              {dosenList.map(d => (
                <option key={d.id} value={d.id}>
                  {d.nama}, {d.gelar}
                </option>
              ))}
            </select>

            <select
              value={filterSumber}
              onChange={(e) => setFilterSumber(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="semua">Semua Sumber Indeks</option>
              <option value="Google Scholar">Google Scholar</option>
              <option value="SINTA">SINTA Kemdikbud</option>
              <option value="Scopus">Scopus</option>
            </select>
          </div>
        </div>

        {/* List Publikasi Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Memuat arsip publikasi...
            </div>
          ) : filteredPubs.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 p-8">
              Tidak ada publikasi yang cocok dengan pencarian Anda.
            </div>
          ) : (
            filteredPubs.map((pub) => {
              const primaryDosen = pub.primaryDosen || dosenList.find(d => d.id === pub.dosenId);

              return (
                <div
                  key={pub.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        pub.sumber === 'SINTA'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : pub.sumber === 'Scopus'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {pub.sumber}
                      </span>

                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Tahun {pub.tahun}
                      </span>

                      {pub.isKolaborasiDosen && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          Kolaborasi Antar-Dosen TI
                        </span>
                      )}

                      {pub.urutanPenulisLabel && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {pub.urutanPenulisLabel}
                        </span>
                      )}

                      {pub.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                          Riset Unggulan
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug">
                      {pub.judul}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium">
                      Penulis: <span className="font-semibold text-slate-800">{pub.penulis}</span>
                    </p>

                    {/* Representasi Dosen TI dengan Prioritas Urutan Penulis */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="font-bold text-slate-500 text-[11px]">Dosen TI UNIMOR:</span>
                      {pub.coAuthorsDosen && pub.coAuthorsDosen.length > 0 ? (
                        pub.coAuthorsDosen.map((co, idx) => (
                          <Link
                            key={co.dosen.id}
                            href="/dosen"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold hover:opacity-80 transition ${
                              idx === 0
                                ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <User className={`w-3 h-3 ${idx === 0 ? 'text-blue-600' : 'text-slate-500'}`} />
                            <span>{co.dosen.nama}, {co.dosen.gelar}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                              idx === 0 ? 'bg-blue-200/60 text-blue-900 font-bold' : 'bg-slate-200/70 text-slate-600'
                            }`}>
                              {co.label}
                            </span>
                          </Link>
                        ))
                      ) : (
                        primaryDosen && (
                          <Link href="/dosen" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold hover:opacity-80 transition">
                            <User className="w-3 h-3 text-blue-600" />
                            <span>{primaryDosen.nama}, {primaryDosen.gelar}</span>
                          </Link>
                        )
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="font-semibold text-slate-700">{pub.jurnal}</span>
                      {pub.doi && (
                        <span className="text-blue-600 font-mono text-[11px]">
                          DOI: {pub.doi}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Citations Badge & External Link */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
                      <span className="text-base block">{pub.sitasi}</span>
                      <span className="text-[10px] text-emerald-700 uppercase">Sitasi</span>
                    </div>

                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        <span>Lihat Paper</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
