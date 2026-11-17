'use client';

import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles,
  Clock,
  Shield
} from 'lucide-react';

export default function PengaturanAkunPage() {
  const [accountInfo, setAccountInfo] = useState({
    username: '',
    namaPengelola: '',
    lastUpdated: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [namaPengelola, setNamaPengelola] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const res = await fetch('/api/auth');
      const json = await res.json();
      if (json.success && json.data) {
        setAccountInfo(json.data);
        setNamaPengelola(json.data.namaPengelola || '');
        setNewUsername(json.data.username || '');
      }
    } catch (err) {
      console.error('Failed to load account data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    // Validation
    if (!currentPassword) {
      setAlert({ type: 'error', message: 'Password saat ini harus diisi untuk konfirmasi keamanan.' });
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setAlert({ type: 'error', message: 'Password baru minimal harus terdiri dari 6 karakter.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setAlert({ type: 'error', message: 'Konfirmasi password baru tidak cocok dengan password baru.' });
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername !== accountInfo.username ? newUsername : undefined,
          newPassword: newPassword || undefined,
          namaPengelola
        })
      });

      const data = await res.json();

      if (data.success) {
        setAlert({
          type: 'success',
          message: data.message || 'Pengaturan akun dan password berhasil diperbarui!'
        });
        // Clear sensitive inputs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Update state
        if (data.data) {
          setAccountInfo(data.data);
          setNewUsername(data.data.username);
        }
      } else {
        setAlert({
          type: 'error',
          message: data.message || 'Gagal memperbarui pengaturan akun.'
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Terjadi kesalahan sistem saat menghubungi server.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Keamanan Portal Prodi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pengaturan Akun & Ubah Password
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Kelola identitas administrator prodi, perbarui username, dan ubah kata sandi rahasia untuk melindungi akses ke sistem manajemen konten.
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <KeyRound className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      {/* Account Info Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Username Aktif</span>
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {loading ? '...' : accountInfo.username}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Status Proteksi</span>
            <span className="text-sm font-extrabold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Aktif & Terenkripsi
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Terakhir Diubah</span>
            <span className="text-xs font-semibold text-slate-700">
              {loading ? '...' : accountInfo.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-700" />
            Formulir Pembaruan Kredensial Administrator
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan form di bawah ini untuk mengganti username atau kata sandi. Anda wajib memasukkan kata sandi saat ini untuk memverifikasi kepemilikan akun.
          </p>
        </div>

        {/* Feedback Alert */}
        {alert && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3 transition ${
            alert.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              {alert.message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section: Identitas Akun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Pengelola / Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={namaPengelola}
                  onChange={(e) => setNamaPengelola(e.target.value)}
                  placeholder="Contoh: Risald, S.Kom., M.T."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Nama penanggung jawab yang tercatat di sistem admin.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Username Login
              </label>
              <div className="relative">
                <span className="text-xs font-mono font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Username admin baru"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Username yang digunakan saat masuk ke halaman login.
              </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Verifikasi Password Lama */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Verifikasi Otorisasi Wajib
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Password Saat Ini (Lama) <span className="text-red-600">*</span>
              </label>
              <div className="relative max-w-md">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini untuk konfirmasi"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-amber-800/80 mt-1 block">
                Diperlukan untuk memastikan bahwa hanya admin yang berwenang yang dapat mengubah akun.
              </span>
            </div>
          </div>

          {/* Section: Password Baru */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ganti Kata Sandi (Kosongkan jika tidak ingin mengubah password)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              * Perubahan kata sandi akan langsung berlaku untuk sesi login berikutnya.
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20 transition disabled:opacity-50"
            >
              {submitting ? (
                <span>Menyimpan Perubahan...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Akun</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
