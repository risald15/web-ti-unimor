'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Target, 
  Compass, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle, 
  ShieldCheck, 
  Handshake, 
  Building2, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  visiMisi as initialVisiMisi, 
  siteConfig as initialSiteConfig, 
  sambutanKaprodi as initialKaprodi 
} from '@/data/siteData';
import { PejabatOrganisasi, MitraKerjasama, PeminatanProdi } from '@/lib/db';
import Link from 'next/link';

export default function ProfilPage() {
  const [vm, setVm] = useState(initialVisiMisi);
  const [kaprodi, setKaprodi] = useState(initialKaprodi);
  const [site, setSite] = useState(initialSiteConfig);
  const [strukturOrganisasi, setStrukturOrganisasi] = useState<PejabatOrganisasi[]>([]);
  const [daftarMitra, setDaftarMitra] = useState<MitraKerjasama[]>([]);
  const [peminatan, setPeminatan] = useState<PeminatanProdi[]>([]);

  useEffect(() => {
    fetch('/api/profil')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          if (d.data.visiMisi) setVm(d.data.visiMisi);
          if (d.data.sambutanKaprodi) setKaprodi(d.data.sambutanKaprodi);
          if (d.data.siteConfig) setSite(d.data.siteConfig);
          if (Array.isArray(d.data.strukturOrganisasi)) setStrukturOrganisasi(d.data.strukturOrganisasi);
          if (Array.isArray(d.data.daftarMitra)) setDaftarMitra(d.data.daftarMitra);
          if (Array.isArray(d.data.peminatanProdi)) setPeminatan(d.data.peminatanProdi);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const getCategoryColor = (kat: string) => {
    switch (kat) {
      case 'Industri Teknologi':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pemerintah':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Perguruan Tinggi':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Profil Program Studi
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-2 max-w-2xl">
            Mengenal lebih dekat arah strategis, visi keilmuan 2030, tata kelola, dan jejaring kemitraan strategis Program Studi {site.namaProdi} {site.universitas}.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Identitas Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jenjang Pendidikan</span>
            <p className="text-xl font-bold text-slate-900">{site.jenjang}</p>
            <p className="text-xs text-slate-500">Gelar Lulusan: Sarjana Komputer (S.Kom.)</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fakultas Naungan</span>
            <p className="text-xl font-bold text-slate-900">{site.fakultas}</p>
            <p className="text-xs text-slate-500">{site.universitas}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Akreditasi</span>
            <p className="text-xl font-bold text-blue-700">{site.akreditasi}</p>
            <p className="text-[11px] text-slate-500 font-mono">{site.nomorSk}</p>
          </div>
        </div>

        {/* Visi & Misi */}
        <section id="visi-misi" className="space-y-8 scroll-mt-24">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-blue-700" />
              Visi Program Studi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              Visi Keilmuan Menuju 2030
            </h2>
            <blockquote className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-700 text-slate-800 text-base sm:text-lg italic leading-relaxed">
              "{vm.visi}"
            </blockquote>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Misi */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4 text-indigo-700" />
                Misi Program Studi
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Pilar Tridharma Perguruan Tinggi
              </h3>
              <ul className="space-y-4">
                {vm.misi && vm.misi.map((m: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {m}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tujuan */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-700" />
                Tujuan Strategis
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Capaian Mutu & Kompetensi
              </h3>
              <ul className="space-y-4">
                {vm.tujuan && vm.tujuan.map((t: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {t}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* Struktur Organisasi (Dynamic from Master Database) */}
        <section id="struktur" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 scroll-mt-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-blue-700" />
              Tata Kelola Akademik
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Struktur Organisasi & Pimpinan Program Studi
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Bagan kepengurusan pengelolaan administrasi akademik, laboratorium komputer riset, penjaminan mutu, dan pembinaan kemahasiswaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strukturOrganisasi.map((pejabat, idx) => (
              <div 
                key={pejabat.id || idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 inline-block mb-3">
                    {pejabat.jabatan}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {pejabat.nama}
                  </h3>
                  {pejabat.nip && pejabat.nip !== '-' && (
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      NIP. {pejabat.nip}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {pejabat.keterangan}
                  </p>
                </div>

                {pejabat.dosenId && (
                  <div className="pt-3 border-t border-slate-200/60">
                    <Link
                      href={`/dosen`}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 group"
                    >
                      <span>Lihat Profil & Publikasi Dosen</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Mitra Kerjasama MoU (Dynamic from Master Database) */}
        <section id="mitra" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 scroll-mt-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Handshake className="w-4 h-4 text-purple-700" />
              Jejaring Strategis
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Mitra Kerjasama & Nota Kesepahaman (MoU)
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Kolaborasi tridharma, implementasi MBKM magang bersertifikat, dan penyerapan lulusan bersama industri, pemerintah, dan perguruan tinggi bereputasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daftarMitra.map((mitra, idx) => (
              <div 
                key={mitra.id || idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(mitra.kategori)}`}>
                    {mitra.kategori}
                  </span>
                  {mitra.masaBerlaku && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Masa Berlaku: {mitra.masaBerlaku}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {mitra.nama}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Lingkup Kerjasama: </span>
                  {mitra.lingkup}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}