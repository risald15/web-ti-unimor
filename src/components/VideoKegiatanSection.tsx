'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ExternalLink, 
  Calendar, 
  User, 
  Video, 
  Sparkles,
  ChevronRight,
  Tv
} from 'lucide-react';
import { VideoKegiatan } from '@/lib/db';
import { daftarVideoFallback } from '@/data/siteData';

export default function VideoKegiatanSection() {
  const [videos, setVideos] = useState<VideoKegiatan[]>(daftarVideoFallback || []);
  const [activeVideo, setActiveVideo] = useState<VideoKegiatan | null>(
    daftarVideoFallback && daftarVideoFallback.length > 0 ? daftarVideoFallback[0] : null
  );

  useEffect(() => {
    fetch('/api/video')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setVideos(d.data);
          // Set featured video or first video as active
          const featured = d.data.find((v: VideoKegiatan) => v.featured);
          setActiveVideo(featured || d.data[0]);
        }
      })
      .catch(err => console.error('Error fetching video kegiatan:', err));
  }, []);

  if (!videos || videos.length === 0 || !activeVideo) {
    return null;
  }

  return (
    <section id="video-kegiatan" className="bg-[#071527] text-white py-16 border-b border-slate-800 relative">
      
      {/* Garis Aksen Tenun Khas Timor */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-900 via-amber-500 to-blue-900 absolute top-0 inset-x-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              Dokumentasi & Kanal Multimedia
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Galeri Video Kegiatan Program Studi
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Liputan resmi kuliah umum, praktikum laboratorium teknologi informasi, sidang terbuka, dan aktivitas kemahasiswaan UNIMOR di perbatasan RI-RDTL.
            </p>
          </div>

          <a
            href="https://www.youtube.com/results?search_query=humas+unimor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs sm:text-sm font-bold transition shadow-sm shrink-0 self-start md:self-auto"
          >
            <span>Kanal YouTube Resmi</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interactive Player (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 16:9 Aspect Video Embed Frame */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                title={activeVideo.judul}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>

            {/* Video Details Card */}
            <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-900/80 text-blue-200 text-xs font-bold border border-blue-700">
                  {activeVideo.kategori}
                </span>

                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {activeVideo.tanggal}
                </span>

                {(activeVideo.dosenNama || activeVideo.pemateri) && (
                  <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    {activeVideo.dosenNama || activeVideo.pemateri}
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {activeVideo.judul}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeVideo.deskripsi}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  Sumber: <strong className="text-slate-200">YouTube Embed Player</strong>
                </span>

                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
                >
                  Tonton di YouTube <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

          </div>

          {/* Playlist Queue (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-amber-400" />
                Daftar Putar Video ({videos.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Pilih untuk memutar
              </span>
            </div>

            {/* Scrollable Playlist Cards */}
            <div className="space-y-3 overflow-y-auto max-h-[540px] pr-1.5 custom-scrollbar">
              {videos.map((vid) => {
                const isActive = activeVideo.id === vid.id;

                return (
                  <button
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex gap-3.5 items-start group ${
                      isActive 
                        ? 'bg-blue-950/80 border-amber-500/80 shadow-md ring-1 ring-amber-500/40' 
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Thumbnail with Play Badge */}
                    <div className="w-28 sm:w-32 aspect-video rounded-lg overflow-hidden relative bg-black shrink-0 border border-slate-700/80">
                      <img
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                        alt={vid.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform ${
                          isActive ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-900/80 text-white group-hover:scale-110'
                        }`}>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {vid.kategori}
                        </span>
                        {vid.featured && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 uppercase">
                            Utama
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug transition-colors ${
                        isActive ? 'text-amber-300' : 'text-slate-100 group-hover:text-blue-300'
                      }`}>
                        {vid.judul}
                      </h4>

                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {vid.tanggal}
                      </p>
                    </div>

                    {/* Active Indicator Chevron */}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 self-center" />
                    )}

                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
