'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Tag, 
  Bell, 
  BookOpen, 
  Trophy, 
  ExternalLink,
  ChevronRight,
  Download,
  Clock,
  Pin
} from 'lucide-react';
import { daftarBerita } from '@/data/siteData';

export default function BeritaDanAgenda() {
  const [newsList, setNewsList] = useState<any[]>(daftarBerita);
  const [activeNoticeTab, setActiveNoticeTab] = useState<'pengumuman' | 'agenda' | 'unduhan'>('pengumuman');

  useEffect(() => {
    fetch('/api/berita')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setNewsList(data.data);
        }
      })
      .catch(err => console.error('Error fetching live news:', err));
  }, []);

  // Split news: Headline (Featured or first item), other news
  const headline = newsList.find(b => b.featured) || newsList[0];
  const secondaryNews = newsList.filter(b => b.id !== headline?.id).slice(0, 3);
  const pengumumanList = newsList.filter(b => b.kategori === 'Pengumuman' || b.kategori === 'Agenda').slice(0, 4);

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0b1d33] text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              Warta & Informasi Kampus
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Berita, Riset & Pengumuman Akademik
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Informasi terkini mengenai aktivitas perkuliahan, riset dosen, capaian mahasiswa, dan pengumuman resmi prodi.
            </p>
          </div>

          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 group shrink-0"
          >
            <span>Arsip Seluruh Berita</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2-COLUMN UNIVERSITY PORTAL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI (65%): BERITA UTAMA & KUMPULAN BERITA */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Berita Utama (Featured Headline) */}
            {headline && (
              <article className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition bg-slate-50/60 group">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
                  
                  {/* Gambar / Visual Frame */}
                  <div className="sm:col-span-5 h-56 sm:h-auto bg-[#0b1d33] relative overflow-hidden flex items-center justify-center text-white">
                    {headline.gambarUrl ? (
                      <img src={headline.gambarUrl} alt={headline.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="p-6 text-center">
                        <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-2 opacity-80" />
                        <span className="text-xs text-slate-300 font-mono">Warta TI UNIMOR</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      {headline.kategori}
                    </span>
                  </div>

                  {/* Konten Berita Utama */}
                  <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-3 bg-white">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-blue-800" />
                          {headline.tanggal}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {headline.penulis}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-900 transition leading-snug">
                        <Link href={`/berita/${headline.slug || headline.id}`}>
                          {headline.judul}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {headline.ringkasan}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href={`/berita/${headline.slug || headline.id}`}
                        className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        <span>Baca Selengkapnya</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </article>
            )}

            {/* 2. Berita Sekunder (Grid 3 Kartu Kompak) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {secondaryNews.map((item) => (
                <article
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {item.kategori}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{item.tanggal}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-900 line-clamp-2 leading-snug">
                      <Link href={`/berita/${item.slug || item.id}`}>
                        {item.judul}
                      </Link>
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.ringkasan}
                    </p>
                  </div>

                  <Link
                    href={`/berita/${item.slug || item.id}`}
                    className="text-[11px] font-bold text-blue-900 hover:underline pt-2 border-t border-slate-100 inline-flex items-center gap-1"
                  >
                    <span>Selengkapnya &rarr;</span>
                  </Link>
                </article>
              ))}
            </div>

          </div>

          {/* KOLOM KANAN (35%): PAPAN PENGUMUMAN & AGENDA RESMI KAMPUS */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            
            {/* Header Tab Papan Pengumuman */}
            <div className="bg-[#0b1d33] text-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Pin className="w-4 h-4 text-amber-400" />
                  Papan Informasi Resmi
                </span>
                <span className="text-[10px] text-slate-300 font-mono">Sasi Kefamenanu</span>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-lg text-xs font-bold text-center">
                <button
                  onClick={() => setActiveNoticeTab('pengumuman')}
                  className={`py-1.5 rounded transition text-[11px] ${
                    activeNoticeTab === 'pengumuman' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Pengumuman
                </button>
                <button
                  onClick={() => setActiveNoticeTab('agenda')}
                  className={`py-1.5 rounded transition text-[11px] ${
                    activeNoticeTab === 'agenda' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Agenda
                </button>
                <button
                  onClick={() => setActiveNoticeTab('unduhan')}
                  className={`py-1.5 rounded transition text-[11px] ${
                    activeNoticeTab === 'unduhan' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Unduhan
                </button>
              </div>
            </div>

            {/* Isi Tab */}
            <div className="p-4 space-y-3">
              
              {activeNoticeTab === 'pengumuman' && (
                <div className="space-y-3">
                  {pengumumanList.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-400 transition flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-blue-900 text-amber-400 font-bold text-center flex flex-col justify-center shrink-0 leading-none">
                        <span className="text-[9px] uppercase tracking-wider">NOV</span>
                        <span className="text-sm font-extrabold">{15 + i * 3}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          <Link href={`/berita/${p.slug || p.id}`} className="hover:text-blue-900">
                            {p.judul}
                          </Link>
                        </h5>
                        <span className="text-[10px] text-slate-500 block mt-1 font-mono">{p.tanggal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeNoticeTab === 'agenda' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Akademik
                    </span>
                    <h5 className="text-xs font-bold text-slate-900">
                      Batas Akhir Pengunggahan Nilai Akhir Semester (KRS/KHS)
                    </h5>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" /> 08.00 - 16.00 WITA
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                      Kuliah Umum
                    </span>
                    <h5 className="text-xs font-bold text-slate-900">
                      Workshop Kecerdasan Buatan & Web Modern Bersama Polbeng
                    </h5>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" /> Lab Komputer TI / Zoom
                    </p>
                  </div>
                </div>
              )}

              {activeNoticeTab === 'unduhan' && (
                <div className="space-y-2">
                  <a
                    href="/akademik#panduan"
                    className="p-3 rounded-lg bg-white border border-slate-200 hover:bg-blue-50/60 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-blue-800" />
                      Pedoman Tugas Akhir & Skripsi
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">PDF</span>
                  </a>

                  <a
                    href="/akademik#panduan"
                    className="p-3 rounded-lg bg-white border border-slate-200 hover:bg-blue-50/60 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-blue-800" />
                      Formulir Seminar Proposal (Sempro)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">DOCX</span>
                  </a>

                  <a
                    href="/akademik#panduan"
                    className="p-3 rounded-lg bg-white border border-slate-200 hover:bg-blue-50/60 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-blue-800" />
                      SOP Magang Kerja Praktik MBKM
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">PDF</span>
                  </a>
                </div>
              )}

            </div>

            {/* Footer Papan Informasi */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-center">
              <Link href="/akademik#panduan" className="text-xs font-bold text-blue-900 hover:underline">
                Lihat Seluruh SOP & Unduhan Akademik &rarr;
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
