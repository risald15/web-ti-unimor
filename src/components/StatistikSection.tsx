'use client';

import React, { useState, useEffect } from 'react';
import { Award, Users, GraduationCap, Monitor, Handshake, ShieldCheck } from 'lucide-react';
import { dataStatistik as initialData } from '@/data/siteData';
import { DataStatistik } from '@/lib/db';

const icons = [Award, Users, GraduationCap, Monitor, Handshake];

export default function StatistikSection() {
  const [stats, setStats] = useState<Array<{ id?: string; angka: string; label: string; keterangan: string }>>(initialData);

  useEffect(() => {
    fetch('/api/profil')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data && Array.isArray(d.data.dataStatistik) && d.data.dataStatistik.length > 0) {
          setStats(d.data.dataStatistik);
        }
      })
      .catch(err => console.error('Failed to load dynamic stats', err));
  }, []);

  return (
    <section className="bg-[#081a30] text-white border-y-2 border-amber-500/80 relative">
      
      {/* Garis Aksen Ornamen Khas Timor */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-900 via-amber-500 to-blue-900"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-700/60">
          {stats.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={item.id || index}
                className="flex flex-col items-center text-center px-4 py-2 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-900/40 text-amber-400 flex items-center justify-center mb-2 border border-blue-800">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {item.angka}
                </div>

                <div className="text-xs sm:text-sm font-bold text-amber-300 mt-1">
                  {item.label}
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {item.keterangan}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
