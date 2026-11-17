'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronDown, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Clock,
  ShieldCheck,
  Search,
  Building2,
  FileText
} from 'lucide-react';
import { siteConfig } from '@/data/siteData';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [witaTime, setWitaTime] = useState<string>('');
  const [site, setSite] = useState(siteConfig);
  const pathname = usePathname();

  useEffect(() => {
    // Dynamic profil fetch
    fetch('/api/profil')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.siteConfig) setSite(d.data.siteConfig);
      })
      .catch(e => console.error(e));

    // Live clock in WITA (UTC+8)
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setWitaTime(now.toLocaleTimeString('id-ID', options) + ' WITA');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navLinks = [
    { label: 'Beranda', href: '/' },
    {
      label: 'Profil Prodi',
      href: '/profil',
      children: [
        { label: 'Visi, Misi & Sasaran 2030', href: '/profil#visi-misi', desc: 'Arah strategis dan komitmen keilmuan' },
        { label: 'Sambutan Koordinator Prodi', href: '/#sambutan', desc: 'Pesan resmi pimpinan prodi' },
        { label: 'Struktur Organisasi & Tata Kelola', href: '/profil#struktur', desc: 'Bagan kepengurusan & penjaminan mutu' },
        { label: 'Mitra Kerjasama Strategis (MoU)', href: '/profil#mitra', desc: 'Jejaring industri, pemda, dan kampus' },
      ]
    },
    {
      label: 'Akademik',
      href: '/akademik',
      children: [
        { label: 'Kurikulum S1 (144 SKS)', href: '/akademik#kurikulum', desc: 'Distribusi mata kuliah semester 1 s.d 8' },
        { label: 'Konsentrasi Peminatan', href: '/akademik#peminatan', desc: 'RPL-AI, Jaringan Siber, dan Sains Data' },
        { label: 'Panduan Skripsi & SOP Akademik', href: '/akademik#panduan', desc: 'Dokumen formulir bimbingan & sempro' },
      ]
    },
    { label: 'Dosen & Staf', href: '/dosen' },
    { label: 'Publikasi & Riset', href: '/publikasi' },
    { label: 'Fasilitas & Lab', href: '/fasilitas' },
    {
      label: 'Berita & Video',
      href: '/berita',
      children: [
        { label: 'Warta Berita & Pengumuman', href: '/berita', desc: 'Informasi akademik dan agenda terbaru' },
        { label: 'Galeri Video YouTube Kegiatan', href: '/#video-kegiatan', desc: 'Liputan video kuliah umum & praktikum lab' },
      ]
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      
      {/* 1. TOP BAR PEMERINTAH & UNIVERSITAS (GAYA PORTAL PTN RESMI) */}
      <div className="bg-[#0b1d33] text-slate-200 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row justify-between items-center gap-2">
          
          {/* Identitas Instansi & Lokasi */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-300">
            <span className="font-semibold text-slate-200 tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Kementerian Pendidikan Tinggi, Sains, dan Teknologi
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Kampus Sasi, Kota Kefamenanu, TTU, NTT
            </span>
            {witaTime && (
              <>
                <span className="hidden sm:inline text-slate-500">•</span>
                <span className="hidden sm:flex items-center gap-1 text-amber-300 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  {witaTime}
                </span>
              </>
            )}
          </div>

          {/* Akses Cepat Ekosistem UNIMOR */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-400 hidden xl:inline">Portal Terpadu:</span>
            <a 
              href="https://unimor.ac.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:bg-blue-700 hover:text-white transition flex items-center gap-1 border border-slate-700"
            >
              UNIMOR <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a 
              href="https://siakad.unimor.ac.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:bg-blue-700 hover:text-white transition flex items-center gap-1 border border-slate-700 font-semibold"
            >
              SIAKAD <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a 
              href="https://pmb.unimor.ac.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition flex items-center gap-1 border border-amber-500/40 font-bold"
            >
              PMB 2026 <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a 
              href="https://elearning.unimor.ac.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:bg-blue-700 hover:text-white transition hidden md:flex items-center gap-1 border border-slate-700"
            >
              LMS E-Learning
            </a>
            <Link
              href="/admin/login"
              className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 hover:bg-blue-600 hover:text-white transition text-[11px] font-bold border border-blue-700"
            >
              Admin CMS
            </Link>
          </div>

        </div>
      </div>

      {/* 2. MAIN LOGO & NAVIGATION BAR RESMI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo & Identitas Kampus */}
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* Logo Resmi UNIMOR */}
            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <img 
                src="/images/logo-unimor.png" 
                alt="Logo Universitas Timor (UNIMOR)" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#0e294b]">
                {site.fakultas || 'Fakultas Pertanian, Sains dan Kesehatan'}
              </span>
              <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-800 transition">
                PROGRAM STUDI TEKNOLOGI INFORMASI
              </span>
              <span className="text-[11px] font-bold text-slate-600 tracking-wider">
                UNIVERSITAS TIMOR (UNIMOR)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 text-[13px] font-bold text-slate-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.children) {
                return (
                  <div key={link.label} className="relative group">
                    <button
                      className={`px-3 py-2 rounded-md transition flex items-center gap-1 hover:text-blue-900 hover:bg-slate-50 ${
                        isActive ? 'text-blue-900 font-extrabold' : ''
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
                    </button>

                    {/* Submenu Dropdown */}
                    <div className="absolute top-full left-0 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 hidden group-hover:block z-50">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {link.label}
                      </div>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 hover:bg-blue-50/70 transition group/item"
                        >
                          <span className="block font-bold text-slate-800 group-hover/item:text-blue-900 text-xs">
                            {child.label}
                          </span>
                          <span className="block text-[11px] text-slate-500 font-normal">
                            {child.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md transition hover:text-blue-900 hover:bg-slate-50 ${
                    isActive ? 'text-blue-900 font-extrabold border-b-2 border-blue-900' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Tombol Akreditasi BAN-PT */}
            <div className="pl-2">
              <span className="px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{site.akreditasi || 'BAN-PT Baik'}</span>
              </span>
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. ORNAMEN GARIS TENUN KHAS TIMOR (TIMOR ACCENT DIVIDER) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0b1d33] via-amber-500 to-[#0b1d33]"></div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            if (link.children) {
              return (
                <div key={link.label} className="border-b border-slate-100 pb-2">
                  <button
                    onClick={() => toggleDropdown(link.label)}
                    className="w-full flex justify-between items-center py-2 text-sm font-bold text-slate-800"
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="pl-4 space-y-1.5 mt-1 border-l-2 border-blue-600">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-xs text-slate-600 hover:text-blue-900 font-medium"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-900 border-b border-slate-100"
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 space-y-2">
            <a
              href="https://pmb.unimor.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Penerimaan Mahasiswa Baru (PMB)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <span>Login Panel Admin CMS</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
