'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, ShieldAlert, Database, ArrowRight, CheckCircle2, BookOpen, GraduationCap } from 'lucide-react';
import { peminatanProdi as initialPeminatan } from '@/data/siteData';
import { PeminatanProdi } from '@/lib/db';

const trackIcons = [Code2, ShieldAlert, Database];

export default function BidangMinatSection() {
  const [tracks, setTracks] = useState<PeminatanProdi[]>(initialPeminatan);

  useEffect(() => {
    fetch('/api/profil')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data && Array.isArray(d.data.peminatanProdi) && d.data.peminatanProdi.length > 0) {
          setTracks(d.data.peminatanProdi);
        }
      })
      .catch(err => console.error('Failed to load dynamic tracks', err));
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
            Kurikulum Berbasis OBE & KKNI Level 6
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bidang Peminatan & Konsentrasi Keahlian S1
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Struktur peminatan keahlian yang adaptif dirancang untuk merespons kebutuhan industri perangkat lunak modern, sistem kecerdasan buatan, infrastruktur jaringan, serta pertahanan siber di tingkat nasional dan perbatasan.
          </p>
        </div>

        {/* Grid 3 Konsentrasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track, idx) => {
            const Icon = trackIcons[idx % trackIcons.length];

            return (
              <div
                key={track.id}
                className="rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Header Card (Gaya Institusi Solid) */}
                  <div className="p-6 bg-[#0b1d33] text-white border-b-2 border-amber-400">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-700/60 flex items-center justify-center text-amber-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/20">
                        Konsentrasi {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold leading-snug text-white">
                      {track.judul}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {track.ringkasan}
                    </p>

                    <div>
                      <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-800" />
                        <span>Kompetensi Inti Lulusan:</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {Array.isArray(track.kompetensi) && track.kompetensi.map((komp, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                            <span>{komp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider mb-2.5">
                        Peluang Karir & Profesi:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(track.prospekKarir) && track.prospekKarir.map((karir, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200"
                          >
                            {karir}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-2">
                  <Link
                    href={`/akademik#kurikulum`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 pt-4"
                  >
                    <span>Lihat Rincian Mata Kuliah Terkait</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
