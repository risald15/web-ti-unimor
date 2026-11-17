import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Download, 
  Layers, 
  Globe2, 
  Library,
  Building2
} from 'lucide-react';
import { siteConfig } from '@/data/siteData';

const portalIcons = [GraduationCap, BookOpen, Layers, Globe2, Library, FileText];

export default function PortalMahasiswa() {
  return (
    <section id="portal" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-blue-800" />
            Layanan Akademik Terpadu
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Portal Kampus & Layanan Sivitas Akademika
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Akses langsung ke seluruh ekosistem sistem informasi akademik, perkuliahan daring, dan repositori karya ilmiah Universitas Timor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {siteConfig.portalEksternal.map((portal, idx) => {
            const Icon = portalIcons[idx % portalIcons.length];

            return (
              <a
                key={idx}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-lg bg-[#0b1d33] text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition">
                      {portal.label}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {portal.deskripsi}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold text-blue-800 group-hover:underline">
                    <span>Akses Portal</span> &rarr;
                  </span>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
