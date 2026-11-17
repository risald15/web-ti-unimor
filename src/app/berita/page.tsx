'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, Search, Tag, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { daftarBerita as initialBerita, Berita } from '@/data/siteData';

export default function BeritaPage() {
  const [newsList, setNewsList] = useState<Berita[]>(initialBerita);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Berita | null>(null);

  useEffect(() => {
    fetch('/api/berita')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setNewsList(d.data);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const filteredNews = newsList.filter((item) => {
    const matchesCategory = activeCategory === 'Semua' || item.kategori === activeCategory;
    const matchesSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            Portal Informasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Warta, Berita & Agenda Akademik
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-2 max-w-2xl">
            Informasi terkini mengenai kegiatan Tridharma, seminar nasional, kuliah umum AI, serta pengumuman penting bagi mahasiswa TI UNIMOR.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Controls Bar: Search & Category */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Semua', 'Berita', 'Pengumuman', 'Agenda', 'Prestasi'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari artikel atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Selected Article Detail Modal / View if clicked */}
        {selectedArticle && (
          <div className="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-xl space-y-6">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                {selectedArticle.kategori}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1 bg-slate-100 rounded-lg"
              >
                Tutup Artikel &times;
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {selectedArticle.judul}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" /> {selectedArticle.tanggal}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" /> {selectedArticle.penulis}
              </span>
            </div>

            <div className="text-base text-slate-700 leading-relaxed space-y-4">
              <p>{selectedArticle.isiLengkap}</p>
            </div>
          </div>
        )}

        {/* Grid List Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              id={item.slug}
              className="rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Visual Banner */}
                <div className="h-52 bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 p-6 flex flex-col justify-between text-white relative">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                      {item.kategori}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                        Unggulan
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.tanggal}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {item.ringkasan}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-2">
                <button
                  onClick={() => setSelectedArticle(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 pt-4"
                >
                  <span>Baca Artikel Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
