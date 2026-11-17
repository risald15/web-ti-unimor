'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  ExternalLink,
  Bell,
  Download,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: "Kawasan Beranda Perbatasan NKRI - Timor Leste",
    title: "Mencetak Sarjana Komputer Unggul & Berkarakter di Era Kecerdasan Buatan",
    desc: "Program Studi S1 Teknologi Informasi Universitas Timor memadukan kurikulum berstandar industri dengan penguatan rekayasa perangkat lunak modern, sistem cerdas, dan keamanan siber.",
    ctaPrimary: { label: "Struktur Kurikulum S1", href: "/akademik#kurikulum" },
    ctaSecondary: { label: "Profil & Visi 2030", href: "/profil" },
  },
  {
    id: 2,
    tag: "Kurikulum Outcome-Based Education (OBE) 2024",
    title: "Tiga Konsentrasi Keahlian Merespons Transformasi Industri Digital",
    desc: "Fokus keilmuan yang adaptif: Rekayasa Perangkat Lunak & AI, Jaringan Komputer & Keamanan Siber, serta Sains Data dan Tata Kelola Sistem Informasi.",
    ctaPrimary: { label: "Konsentrasi Studi", href: "/akademik#peminatan" },
    ctaSecondary: { label: "Direktori Dosen", href: "/dosen" },
  },
  {
    id: 3,
    tag: "Infrastruktur Praktikum & Riset Kampus Sasi",
    title: "Fasilitas Tiga Laboratorium Komputer Riset Berstandar Industri",
    desc: "Laboratorium Rekayasa Perangkat Lunak, Laboratorium Jaringan & Keamanan Siber, serta Laboratorium Multimedia & IoT siap menunjang praktikum mahasiswa.",
    ctaPrimary: { label: "Fasilitas Laboratorium", href: "/fasilitas" },
    ctaSecondary: { label: "Publikasi Riset Dosen", href: "/publikasi" },
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative bg-[#0c2340] text-white">
      
      {/* 1. TICKER PENGUMUMAN BERJALAN KAMPUS (OFFICIAL MARQUEE) */}
      <div className="bg-[#08172b] border-b border-slate-800 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
            <Bell className="w-3 h-3" />
            <span>PENGUMUMAN</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap text-slate-300 text-xs font-medium">
            <div className="inline-block animate-marquee">
              Pendaftaran Ujian Seminar Proposal & Skripsi Semester Berjalan Telah Dibuka &bull; 
              Kuliah Tamu AI & Web Engineering Bersama Mitra Industri &bull; 
              Akses Repository Skripsi dan Jurnal Ilmiah SINTA Dosen TI UNIMOR &bull; 
              Penerimaan Mahasiswa Baru Jalur SNBP, SNBT, dan Mandiri 2026/2027
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Kolom Kiri: Slider Konten Resmi Kampus */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Institutional Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/60 border border-blue-700/60 text-blue-200 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Terakreditasi BAN-PT &bull; Program Sarjana S1</span>
              </div>

              {/* Tag / Kategori Slide */}
              <div className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                {slides[currentSlide].tag}
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-snug sm:leading-tight text-white">
                {slides[currentSlide].title}
              </h1>

              {/* Deskripsi */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {slides[currentSlide].desc}
              </p>
            </div>

            {/* Tombol Aksi & Navigasi Slider */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={slides[currentSlide].ctaPrimary.href}
                  className="px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>{slides[currentSlide].ctaPrimary.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={slides[currentSlide].ctaSecondary.href}
                  className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                >
                  {slides[currentSlide].ctaSecondary.label}
                </Link>

                <a
                  href="https://pmb.unimor.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 ml-auto sm:ml-0"
                >
                  <span>Daftar PMB UNIMOR</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Controls Dots & Arrows */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <button
                    onClick={prevSlide}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition"
                    aria-label="Slide sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition"
                    aria-label="Slide berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Papan Informasi Cepat Akademik (Formal University Quick Board) */}
          <div className="lg:col-span-4 bg-[#081a30] border border-blue-900/60 rounded-xl p-6 flex flex-col justify-between space-y-5 shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  Informasi Program Studi
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Aktif PDDIKTI
                </span>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Gelar Lulusan:</span>
                    <span className="text-slate-300">Sarjana Komputer (S.Kom.)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Total Beban Studi:</span>
                    <span className="text-slate-300">144 SKS (Masa Studi Normal 4 Tahun)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Status Akreditasi:</span>
                    <span className="text-amber-300 font-bold">Terakreditasi Baik (BAN-PT)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Fakultas:</span>
                    <span className="text-slate-300">Pertanian, Sains dan Kesehatan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Navigasi Mahasiswa */}
            <div className="pt-3 border-t border-blue-900/60 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Layanan Unduhan Cepat:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/akademik#panduan"
                  className="p-2.5 rounded bg-blue-950/80 hover:bg-blue-900 text-slate-200 border border-blue-900/80 flex items-center gap-1.5 transition text-[11px] font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>SOP Skripsi & KP</span>
                </Link>
                <Link
                  href="/akademik#kurikulum"
                  className="p-2.5 rounded bg-blue-950/80 hover:bg-blue-900 text-slate-200 border border-blue-900/80 flex items-center gap-1.5 transition text-[11px] font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Silabus MK</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
