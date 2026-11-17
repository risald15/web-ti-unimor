import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Monitor, Cpu, Network, CheckCircle, ShieldCheck, Clock, FileCheck, UserCheck } from 'lucide-react';
import { daftarLaboratorium as fallbackLaboratorium } from '@/data/siteData';
import { readDatabase } from '@/lib/db';

const labIcons = [Monitor, Network, Cpu];

export const metadata = {
  title: "Fasilitas & Laboratorium - Prodi Teknologi Informasi UNIMOR",
  description: "Fasilitas laboratorium komputer, riset rekayasa perangkat lunak, jaringan komputer, dan IoT di Universitas Timor.",
};

export default function FasilitasPage() {
  const db = readDatabase();
  const labs = db.daftarLaboratorium && db.daftarLaboratorium.length > 0 ? db.daftarLaboratorium : fallbackLaboratorium;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            Infrastruktur Kampus
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Fasilitas & Laboratorium Riset
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-2 max-w-2xl">
            Sarana workstation komputer, perangkat keras jaringan, sensor IoT, serta ruang server untuk menunjang praktikum dan penelitian inovatif mahasiswa.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Detail Lab Cards */}
        <div className="space-y-10">
          {labs.map((lab, idx) => {
            const Icon = labIcons[idx % labIcons.length];

            return (
              <div
                key={lab.id}
                className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Visual Header / Banner */}
                <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 text-white flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 mb-6">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold uppercase tracking-wider">
                      Lab Spesialis {idx + 1}
                    </span>
                    <h2 className="text-2xl font-extrabold mt-3 leading-snug">
                      {lab.nama}
                    </h2>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
                    Lokasi: Gedung Laboratorium FAPERSANKES, Kampus Sasi UNIMOR
                  </div>
                </div>

                {/* Information Body */}
                <div className="lg:col-span-8 p-8 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Deskripsi Fasilitas
                    </h3>
                    <p className="text-base text-slate-700 leading-relaxed mt-1">
                      {lab.deskripsi}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kapasitas & Setup</span>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{lab.kapasitas}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peruntukan Praktikum</span>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{lab.peruntukan}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Kepala / PJ Lab</span>
                        <p className="text-sm font-bold text-slate-900 mt-1">{lab.penanggungJawab || 'Dosen Pengampu TI'}</p>
                        {lab.nipPenanggungJawab && (
                          <p className="text-[11px] font-mono text-slate-500">NIP. {lab.nipPenanggungJawab}</p>
                        )}
                      </div>
                      {lab.dosenId && (
                        <Link href="/dosen" className="text-[11px] font-bold text-blue-700 hover:text-blue-900 mt-2 inline-flex items-center gap-1">
                          <span>Profil Dosen &rarr;</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Daftar Spesifikasi & Perangkat
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lab.spesifikasi.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SOP & Ketentuan Penggunaan Lab */}
        <section className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-700" />
            <h2 className="text-2xl font-extrabold text-slate-900">
              Tata Tertib & Prosedur Peminjaman Laboratorium
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">1. Izin Penggunaan</span>
              <p className="text-xs leading-relaxed">Mahasiswa yang akan menggunakan lab di luar jam praktikum reguler (misal untuk tugas akhir) wajib mengisi formulir izin ke Laboran/Kalab.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">2. Keamanan & Perangkat</span>
              <p className="text-xs leading-relaxed">Dilarang mengubah konfigurasi sistem tanpa izin atau mengunduh software yang berpotensi membahayakan jaringan kampus.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">3. Jam Operasional Lab</span>
              <p className="text-xs leading-relaxed">Laboratorium melayani praktikum Senin s.d. Jumat pukul 08.00 - 17.00 WITA dengan pendampingan teknisi/asisten lab.</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
