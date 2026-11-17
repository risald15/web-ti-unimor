'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quote, CheckCircle, ArrowRight, Award, UserCheck, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { sambutanKaprodi as initialSambutan } from '@/data/siteData';

export default function SambutanKaprodi() {
  const [kaprodi, setKaprodi] = useState(initialSambutan);

  useEffect(() => {
    fetch('/api/profil')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.sambutanKaprodi) {
          setKaprodi(data.data.sambutanKaprodi);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="sambutan" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Academic Card Frame */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Kolom Kiri: Foto Resmi & Profil Pimpinan Prodi */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              
              {/* Bingkai Foto Akademik Resmi */}
              <div className="w-56 h-72 sm:w-64 sm:h-80 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-gradient-to-b from-[#0b1d33] to-slate-900 relative">
                {(kaprodi as any).foto ? (
                  <img 
                    src={(kaprodi as any).foto} 
                    alt={kaprodi.nama} 
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 p-4">
                    <UserCheck className="w-16 h-16 mb-2 opacity-80" />
                    <span className="text-xs font-bold text-white">Koordinator Program Studi</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-3 pt-6 text-white text-center">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider inline-block">
                    Pimpinan Program Studi
                  </span>
                </div>
              </div>

              {/* Data Pejabat */}
              <div className="mt-4 space-y-1 w-full max-w-xs">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  {kaprodi.nama}
                </h3>
                <p className="text-xs font-bold text-blue-900">
                  {kaprodi.jabatan || 'Koordinator Program Studi Teknologi Informasi'}
                </p>
                {kaprodi.nip && (
                  <p className="text-xs text-slate-500 font-mono">
                    NIP. {kaprodi.nip}
                  </p>
                )}

                <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap justify-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                    FAPERSANKES UNIMOR
                  </span>
                  <Link
                    href="/dosen"
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 text-[10px] font-bold transition"
                  >
                    Profil Dosen & Publikasi &rarr;
                  </Link>
                </div>
              </div>

            </div>

            {/* Kolom Kanan: Naskah Sambutan Resmi */}
            <div className="lg:col-span-8 space-y-5">
              
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-widest block mb-1">
                  PENGANTAR KOORDINATOR PROGRAM STUDI
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Sambutan Koordinator Program Studi
                </h2>
              </div>

              {/* Kutipan Visi / Headline */}
              <blockquote className="p-4 rounded-lg bg-blue-50/70 border-l-4 border-blue-900 text-slate-800 text-sm sm:text-base font-medium italic leading-relaxed">
                "{kaprodi.pesanSingkat || 'Mencetak sarjana komputer yang unggul, berkarakter, dan berdaya saing global di kawasan beranda perbatasan Republik Indonesia.'}"
              </blockquote>

              {/* Paragraf Naskah Sambutan */}
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans text-justify">
                {Array.isArray(kaprodi.isi) && kaprodi.isi.map((paragraf: string, idx: number) => (
                  <p key={idx}>
                    {paragraf}
                  </p>
                ))}
              </div>

              {/* Footer Sambutan & Penutup Resmi */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-800 block">Sekretariat Program Studi Teknologi Informasi</span>
                  <span>Gedung FAPERSANKES, Kampus Sasi, Kota Kefamenanu, TTU - NTT</span>
                </div>

                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0b1d33] hover:bg-blue-900 text-white font-bold text-xs transition shadow-xs shrink-0"
                >
                  <span>Selengkapnya Profil & Visi Misi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
