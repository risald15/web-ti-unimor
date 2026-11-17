'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Award, BookOpen, ExternalLink, Search, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { daftarDosen as initialDosen } from '@/data/siteData';

export default function DosenPage() {
  const [dosenList, setDosenList] = useState<any[]>(initialDosen);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/dosen')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setDosenList(d.data);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const filteredDosen = dosenList.filter(d => 
    d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(d.bidangKeahlian) && d.bidangKeahlian.some((b: string) => b.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    d.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            Civitas Akademika
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Direktori Dosen & Staf Pengajar
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-2 max-w-2xl">
            Profil tenaga pengajar profesional Program Studi Teknologi Informasi Universitas Timor dengan keahlian komputasi, rekayasa software, dan keamanan siber.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama dosen atau bidang keahlian (misal: AI, Web, Jaringan)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grid List Dosen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDosen.map((dosen) => (
            <div
              key={dosen.id}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Header Avatar & Info */}
                <div className="flex items-start gap-4 mb-4">
                  {dosen.foto ? (
                    <img
                      src={dosen.foto}
                      alt={`${dosen.nama}, ${dosen.gelar}`}
                      className="w-20 h-20 rounded-2xl object-cover shadow-md border border-slate-200 group-hover:scale-105 transition-transform shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-800 flex items-center justify-center text-amber-400 font-bold text-2xl shadow-md group-hover:scale-105 transition-transform shrink-0">
                      {dosen.nama ? dosen.nama.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-blue-700 transition leading-snug">
                      {dosen.nama}, {dosen.gelar}
                    </h3>
                    <p className="text-xs font-semibold text-blue-700 mt-1">
                      {dosen.jabatan}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      NIP. {dosen.nip}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium">{dosen.pendidikanTerakhir}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Bidang Fokus & Riset:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(dosen.bidangKeahlian) && dosen.bidangKeahlian.map((bidang: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium border border-blue-100"
                        >
                          {bidang}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Metrik Akademis: SINTA & Google Scholar */}
                  <div className="pt-2 space-y-1.5">
                    {/* SINTA Score Row */}
                    {(dosen.sintaScoreOverall !== undefined || Boolean(dosen.sintaId)) && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" />
                          SINTA Score: {dosen.sintaScoreOverall ?? 0}
                        </span>
                        {dosen.sintaScore3Yr !== undefined && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-900 text-[10px] font-bold border border-amber-200/60">
                            3Yr: {dosen.sintaScore3Yr}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Google Scholar Metrics Row */}
                    {dosen.totalSitasi !== undefined && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          {dosen.totalSitasi} Sitasi Scholar
                        </span>
                        {dosen.hIndex !== undefined && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                            h-index: {dosen.hIndex}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tautan Riset & Publikasi Dosen */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={`/publikasi?dosen=${dosen.id}`}
                  className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-800 hover:text-blue-900 font-bold text-xs flex items-center justify-between border border-slate-200/80 transition group/link"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Lihat Publikasi & Riset Dosen
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Footer Kontak & Repositori */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`mailto:${dosen.email}`}
                  className="text-slate-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  {dosen.email}
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={dosen.scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition font-semibold text-[11px] flex items-center gap-1"
                  >
                    Scholar <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={dosen.sintaId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 hover:bg-amber-400 transition font-semibold text-[11px] flex items-center gap-1 border border-amber-200"
                  >
                    SINTA <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
