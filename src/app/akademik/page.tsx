'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, GraduationCap, FileText, CheckCircle2, Download, Layers } from 'lucide-react';
import { strukturKurikulum as initialKurikulum, peminatanProdi } from '@/data/siteData';

export default function AkademikPage() {
  const [kurikulumList, setKurikulumList] = useState<any[]>(initialKurikulum);
  const [docList, setDocList] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  useEffect(() => {
    fetch('/api/kurikulum')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setKurikulumList(d.data);
        }
      })
      .catch(e => console.error(e));

    fetch('/api/dokumen')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setDocList(d.data);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const matkulSemester = kurikulumList.filter(m => Number(m.semester) === selectedSemester);
  const totalSksSemester = matkulSemester.reduce((acc, curr) => acc + (Number(curr.sks) || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            Kurikulum & Pendidikan
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Akademik & Kurikulum S1
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-2 max-w-2xl">
            Struktur kurikulum berbasis Outcome-Based Education (OBE) dirancang memenuhi standar industri teknologi informasi modern dan era AI.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Ringkasan Beban Studi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Beban Studi</span>
            <p className="text-3xl font-extrabold text-blue-900 mt-1">144 SKS</p>
            <p className="text-xs text-slate-500 mt-1">Standar kelulusan Sarjana Komputer</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Masa Studi Normal</span>
            <p className="text-3xl font-extrabold text-indigo-900 mt-1">8 Semester</p>
            <p className="text-xs text-slate-500 mt-1">4 Tahun Perkuliahan</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gelar Akademik</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">S.Kom.</p>
            <p className="text-xs text-slate-500 mt-1">Sarjana Komputer</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skema Pembelajaran</span>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">OBE & MBKM</p>
            <p className="text-xs text-slate-500 mt-1">Teori, Praktikum Lab & Magang</p>
          </div>
        </div>

        {/* Struktur Kurikulum per Semester */}
        <section id="kurikulum" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                Distribusi Mata Kuliah
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Struktur Kurikulum Semester 1 - 8
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Pilih semester untuk melihat rincian mata kuliah, bobot SKS, dan deskripsi silabus.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-bold shrink-0">
              Total SKS Semester {selectedSemester}: {totalSksSemester} SKS
            </div>
          </div>

          {/* Semester Selector Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedSemester === sem
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>

          {/* Table / List Matkul */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Nama Mata Kuliah</th>
                  <th className="py-3 px-4">Kategori & Peminatan</th>
                  <th className="py-3 px-4 text-center">SKS</th>
                  <th className="py-3 px-4">Dosen Koordinator / Pengampu</th>
                  <th className="py-3 px-4">Deskripsi / Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {matkulSemester.length > 0 ? (
                  matkulSemester.map((mk: any) => (
                    <tr key={mk.kode} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-4 font-mono font-bold text-blue-800 text-xs">
                        {mk.kode}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {mk.nama}
                      </td>
                      <td className="py-4 px-4 space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block ${
                          mk.kategori === 'Keahlian Inti' 
                            ? 'bg-amber-100 text-amber-900' 
                            : mk.kategori === 'Pilihan'
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {mk.kategori}
                        </span>
                        {mk.peminatanNama && (
                          <div className="text-[11px] text-purple-700 font-medium">
                            {mk.peminatanNama}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-800">
                        {mk.sks}
                      </td>
                      <td className="py-4 px-4 text-xs">
                        {mk.dosenPengampu ? (
                          <div>
                            <Link href="/dosen" className="font-semibold text-blue-700 hover:text-blue-900 hover:underline inline-block">
                              {mk.dosenPengampu}
                            </Link>
                            {mk.nipPengampu && (
                              <div className="text-[10px] font-mono text-slate-400">NIP. {mk.nipPengampu}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Dosen Pengampu TI</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">
                        {mk.deskripsi}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                      Mata kuliah pilihan atau tugas akhir terintegrasi pada semester ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Panduan Tugas Akhir & Skripsi */}
        <section id="panduan" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 scroll-mt-24">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              SOP & Dokumen
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Panduan Tugas Akhir & Unduhan SOP
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Ketentuan pelaksanaan seminar proposal, bimbingan berkala, dan sidang skripsi Program Studi TI UNIMOR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {docList.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                Memuat daftar berkas unduhan...
              </div>
            ) : (
              docList.map((doc) => (
                <div key={doc.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FileText className="w-8 h-8 text-blue-700" />
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 font-mono">
                        {doc.format} • {doc.ukuranFile || '1 MB'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {doc.nama}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {doc.deskripsi}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" /> 
                      <span>Unduh Berkas {doc.format}</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
