'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X,
  Cpu,
  ChevronRight,
  FileText,
  Monitor,
  FolderDown,
  Video
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    document.cookie = 'admin_session=; path=/; max-age=0';
    router.push('/admin/login');
  };

  // If on login page, render clean full width without admin sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Kelola Berita & Agenda', href: '/admin/berita', icon: Newspaper },
    { label: 'Galeri Video Kegiatan', href: '/admin/video', icon: Video },
    { label: 'Kelola Dosen & Staf', href: '/admin/dosen', icon: Users },
    { label: 'Publikasi & Riset Scholar', href: '/admin/publikasi', icon: FileText },
    { label: 'Kelola Kurikulum S1', href: '/admin/kurikulum', icon: BookOpen },
    { label: 'Fasilitas & Lab Komputer', href: '/admin/fasilitas', icon: Monitor },
    { label: 'Dokumen & Unduhan SOP', href: '/admin/dokumen', icon: FolderDown },
    { label: 'Profil, VMTS & Tata Kelola', href: '/admin/profil', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
            <img 
              src="/images/logo-unimor.png" 
              alt="Logo UNIMOR" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-bold text-sm">ADMIN TI UNIMOR</span>
            <span className="block text-[10px] text-slate-400">CMS & Manajemen Konten</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:w-72 shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center shadow-md shrink-0">
              <img 
                src="/images/logo-unimor.png" 
                alt="Logo UNIMOR" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight">
                PANEL ADMIN PRODI
              </h2>
              <p className="text-[11px] text-amber-400 font-medium">
                TI UNIMOR • Sasi Kefamenanu
              </p>
            </div>
          </div>

          {/* Menus */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
              Menu Pengelolaan
            </span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-md shadow-blue-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Live Site & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Lihat Website Utama</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>

    </div>
  );
}
