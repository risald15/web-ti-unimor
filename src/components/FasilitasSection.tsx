import React from 'react';
import Link from 'next/link';
import { Monitor, Cpu, Network, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { daftarLaboratorium as fallbackLaboratorium } from '@/data/siteData';
import { readDatabase } from '@/lib/db';

const labIcons = [Monitor, Network, Cpu];

export default function FasilitasSection() {
  const db = readDatabase();
  const labs = db.daftarLaboratorium && db.daftarLaboratorium.length > 0 ? db.daftarLaboratorium : fallbackLaboratorium;

  return (
    <section className="py-16 bg-[#0b1d33] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-900 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Monitor className="w-3.5 h-3.5 text-amber-400" />
              Infrastruktur & Praktikum
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Laboratorium Komputer & Riset Mahasiswa
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Fasilitas laboratorium berstandar industri disiapkan untuk praktikum intensif, riset skripsi, dan uji kompetensi di Kampus Sasi.
            </p>
          </div>

          <Link
            href="/fasilitas"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 group shrink-0"
          >
            <span>Detail Seluruh Laboratorium</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid 3 Lab */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {labs.map((lab, index) => {
            const Icon = labIcons[index % labIcons.length];

            return (
              <div
                key={lab.id}
                className="rounded-xl bg-[#08172b] border border-slate-800 hover:border-blue-500 shadow-md overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Top Bar Header */}
                  <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      Kampus Sasi UNIMOR
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition">
                      {lab.nama}
                    </h3>
                    
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {lab.deskripsi}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                        Kapasitas & Setup:
                      </span>
                      <p className="text-xs text-slate-200 font-medium">
                        {lab.kapasitas}
                      </p>
                    </div>

                    {/* Penanggung Jawab Relasional */}
                    <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/60 space-y-1">
                      <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-amber-400" />
                        Kepala / PJ Laboratorium:
                      </span>
                      <p className="text-xs text-white font-bold">
                        {lab.penanggungJawab || 'Dosen Pengampu TI UNIMOR'}
                      </p>
                      {lab.nipPenanggungJawab && (
                        <p className="text-[10px] text-slate-400 font-mono">NIP. {lab.nipPenanggungJawab}</p>
                      )}
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Spesifikasi Utama:
                      </span>
                      <ul className="space-y-1">
                        {lab.spesifikasi.slice(0, 3).map((spec, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <CheckCircle className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-800/80 mt-3">
                  <Link
                    href={`/fasilitas#${lab.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-white pt-3 transition"
                  >
                    <span>Spesifikasi Lengkap & SOP Lab &rarr;</span>
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
