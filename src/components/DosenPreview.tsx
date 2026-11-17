'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Award, BookOpen, ArrowRight, ExternalLink, GraduationCap, Sparkles } from 'lucide-react';
import { daftarDosen as initialDosen } from '@/data/siteData';

export default function DosenPreview() {
  const [dosenList, setDosenList] = useState<any[]>(initialDosen);

  useEffect(() => {
    fetch('/api/dosen')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDosenList(data.data);
        }
      })
      .catch(err => console.error('Error fetching live dosen:', err));
  }, []);

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
              Tenaga Pendidik & Peneliti
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dosen & Tenaga Pengajar Program Studi
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Didukung oleh dosen berkualifikasi Magister dan Doktor dengan kepakaran di bidang Rekayasa Perangkat Lunak, Kecerdasan Buatan, dan Jaringan Komputer.
            </p>
          </div>

          <Link
            href="/dosen"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 group shrink-0"
          >
            <span>Direktori Lengkap Dosen ({dosenList.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Dosen Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dosenList.slice(0, 6).map((dosen) => (
            <div
              key={dosen.id}
              className="rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-[#0b1d33] border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-amber-400 shadow-sm">
                    {dosen.foto ? (
                      <img
                        src={dosen.foto}
                        alt={`${dosen.nama}, ${dosen.gelar}`}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <User className="w-8 h-8 opacity-70" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-900 transition leading-snug truncate">
                      {dosen.nama}, {dosen.gelar}
                    </h3>
                    <p className="text-xs font-semibold text-blue-800 truncate mt-0.5">
                      {dosen.jabatan || 'Dosen Tetap Program Studi TI'}
                    </p>
                    {dosen.nip && dosen.nip !== '-' && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        NIP. {dosen.nip}
                      </p>
                    )}
                  </div>
                </div>

                {/* SINTA & Scholar Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <div className="border-r border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold block">SINTA Score</span>
                    <span className="text-xs font-black text-emerald-700">
                      {dosen.sintaScoreOverall ?? 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Sitasi Scholar</span>
                    <span className="text-xs font-black text-blue-800">
                      {dosen.totalSitasi ?? 0} (h-index {dosen.hIndex ?? 0})
                    </span>
                  </div>
                </div>

                {/* Bidang Keahlian */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Bidang Keahlian / Riset:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {dosen.bidangKeahlian && dosen.bidangKeahlian.slice(0, 3).map((bidang: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] font-medium border border-slate-200"
                      >
                        {bidang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 mt-4 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[170px]">
                  {dosen.email}
                </span>
                <Link
                  href="/dosen"
                  className="font-bold text-blue-900 hover:underline inline-flex items-center gap-1"
                >
                  <span>Profil & Riset &rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
