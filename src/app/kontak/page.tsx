'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, HelpCircle } from 'lucide-react';
import { siteConfig } from '@/data/siteData';

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    kategori: 'Informasi Akademik',
    pesan: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            Hubungi Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Kontak & Sekretariat Prodi
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-2 max-w-2xl">
            Layanan informasi, konsultasi akademik, kemitraan riset, dan helpdesk mahasiswa Program Studi Teknologi Informasi UNIMOR.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Info Kontak & Alamat */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Sekretariat & Lokasi Kampus
              </h2>

              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Alamat Kampus:</span>
                    <span>{siteConfig.alamat}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Email Resmi:</span>
                    <a href={`mailto:${siteConfig.email}`} className="text-blue-700 hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Telepon / WhatsApp:</span>
                    <span>{siteConfig.telepon} / {siteConfig.whatsapp}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Jam Layanan:</span>
                    <span>{siteConfig.jamLayanan}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Peta Petunjuk Lokasi */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Lokasi Strategis Perbatasan</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kampus Universitas Timor berada di jalur utama trans-Timor Km. 09 Kelurahan Sasi, Kota Kefamenanu, menghubungkan Kupang dan Atambua menuju perbatasan Timor Leste.
              </p>
            </div>
          </div>

          {/* Form Pengiriman Pesan */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                  Kirim Pesan
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Formulir Konsultasi & Layanan Informasi
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Silakan tinggalkan pesan untuk pertanyaan seputar perkuliahan, kemitraan riset, atau permohonan informasi akademik.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-base">Pesan Anda Berhasil Terkirim!</h3>
                  <p className="text-xs text-emerald-800">
                    Terima kasih telah menghubungi Program Studi Teknologi Informasi UNIMOR. Tim kami akan segera menanggapi via email Anda.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-bold px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={formData.nama}
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Nama Anda"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Kepentingan</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option>Informasi Akademik & Kurikulum</option>
                      <option>Pendaftaran Mahasiswa Baru (PMB)</option>
                      <option>Tugas Akhir / Skripsi Mahasiswa</option>
                      <option>Kerjasama & Kemitraan Tridharma</option>
                      <option>Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Isi Pesan / Pertanyaan</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.pesan}
                      onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Tuliskan pertanyaan atau pesan Anda secara rinci di sini..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirimkan Pesan Sekarang</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
