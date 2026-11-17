'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Building2,
  GraduationCap
} from 'lucide-react';
import { siteConfig as initialSiteConfig } from '@/data/siteData';

export default function Footer() {
  const [site, setSite] = useState(initialSiteConfig);

  useEffect(() => {
    fetch('/api/profil')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data?.siteConfig) {
          setSite(d.data.siteConfig);
        }
      })
      .catch(err => console.error('Failed to load dynamic footer config', err));
  }, []);

  return (
    <footer className="bg-[#08172b] text-slate-300 border-t-2 border-amber-500/80">
      
      {/* Garis Aksen Tenun Khas Timor */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-900 via-amber-500 to-blue-900"></div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Identitas Instansi & Kampus (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                <img 
                  src="/images/logo-unimor.png" 
                  alt="Logo Universitas Timor (UNIMOR)" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight uppercase leading-snug">
                  PROGRAM STUDI S1 {site.namaProdi || 'TEKNOLOGI INFORMASI'}
                </h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {site.fakultas || 'Fakultas Pertanian, Sains dan Kesehatan'}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold tracking-wider">
                  UNIVERSITAS TIMOR (UNIMOR)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md text-justify">
              Mencetak sarjana komputer yang berintegritas moral, unggul dalam keilmuan rekayasa perangkat lunak modern, kecerdasan buatan, dan keamanan siber di kawasan beranda perbatasan Negara Kesatuan Republik Indonesia dan Republik Demokratik Timor Leste.
            </p>

            <div className="p-3 rounded-lg bg-[#0b1d33] border border-slate-700/80 inline-flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-extrabold text-white block">{site.akreditasi || 'Terakreditasi Baik BAN-PT'}</span>
                <span className="text-[10px] text-slate-400 font-mono">{site.nomorSk || 'SK BAN-PT No. 1204/SK/BAN-PT/Ak-PKP/S/III/2023'}</span>
              </div>
            </div>
          </div>

          {/* Navigasi Akademik (2 Kolom) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest pb-1 border-b border-slate-800">
              Akademik & Riset
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/profil" className="hover:text-amber-400 transition">
                  Profil & Visi Misi
                </Link>
              </li>
              <li>
                <Link href="/akademik#kurikulum" className="hover:text-amber-400 transition">
                  Kurikulum S1 (144 SKS)
                </Link>
              </li>
              <li>
                <Link href="/akademik#peminatan" className="hover:text-amber-400 transition">
                  Bidang Peminatan
                </Link>
              </li>
              <li>
                <Link href="/dosen" className="hover:text-amber-400 transition">
                  Direktori Dosen & Staf
                </Link>
              </li>
              <li>
                <Link href="/publikasi" className="hover:text-amber-400 transition">
                  Katalog Riset Scholar
                </Link>
              </li>
              <li>
                <Link href="/fasilitas" className="hover:text-amber-400 transition">
                  Laboratorium Riset
                </Link>
              </li>
              <li>
                <Link href="/akademik#panduan" className="hover:text-amber-400 transition">
                  Unduhan SOP & Panduan
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Kampus (2 Kolom) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest pb-1 border-b border-slate-800">
              Ekosistem Kampus
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://unimor.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                  Portal UNIMOR <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://siakad.unimor.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition flex items-center gap-1 font-semibold text-slate-200">
                  SIAKAD UNIMOR <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pmb.unimor.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition flex items-center gap-1 text-amber-300 font-bold">
                  PMB Mahasiswa Baru <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://elearning.unimor.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                  LMS E-Learning <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://repository.unimor.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                  Repository Skripsi <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition flex items-center gap-1 text-slate-400">
                  Login Admin CMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Sekretariat & Kontak Kampus (3 Kolom) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest pb-1 border-b border-slate-800">
              Sekretariat Prodi
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{site.alamat || 'Jl. Km. 09 Kelurahan Sasi, Kota Kefamenanu, Kab. Timor Tengah Utara (TTU), NTT 85613'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${site.email}`} className="hover:text-white transition">
                  {site.email || 'ti@unimor.ac.id'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{site.telepon || '(0388) 2433011'} / {site.whatsapp || '+62 821-4567-8901'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{site.jamLayanan || 'Senin - Jumat, 08.00 - 16.00 WITA'}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar PTN */}
      <div className="bg-[#050e1c] py-4 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>
            &copy; 2026 Program Studi S1 Teknologi Informasi, Universitas Timor (UNIMOR). Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Kementerian Pendidikan Tinggi, Sains, dan Teknologi Republik Indonesia
          </p>
        </div>
      </div>

    </footer>
  );
}
