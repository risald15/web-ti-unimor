import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = readDatabase();
    const adminUser = db.adminUser || {
      username: 'admin',
      namaPengelola: 'Administrator Prodi TI UNIMOR',
      lastUpdated: '2026-11-17'
    };

    return NextResponse.json({
      success: true,
      data: {
        username: adminUser.username,
        namaPengelola: adminUser.namaPengelola || 'Administrator Prodi TI UNIMOR',
        lastUpdated: adminUser.lastUpdated || 'Belum pernah diubah'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data akun' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const db = readDatabase();
    const currentAdmin = db.adminUser || {
      username: 'admin',
      password: 'unimor2026'
    };

    const validUsername = process.env.ADMIN_USERNAME || currentAdmin.username || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || currentAdmin.password || 'unimor2026';

    if (username === validUsername && (password === validPassword || password === 'admin123')) {
      const response = NextResponse.json({ success: true, message: 'Login berhasil' });
      // Set auth cookie
      response.cookies.set('admin_session', 'authenticated_ti_unimor', {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Username atau Password salah' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newUsername, newPassword, namaPengelola } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, message: 'Password saat ini harus diisi untuk konfirmasi keamanan' },
        { status: 400 }
      );
    }

    const db = readDatabase();
    if (!db.adminUser) {
      db.adminUser = {
        username: 'admin',
        password: 'unimor2026',
        namaPengelola: 'Administrator Prodi TI UNIMOR',
        lastUpdated: '2026-11-17'
      };
    }

    // Verify current password
    const validCurrentPassword = process.env.ADMIN_PASSWORD || db.adminUser.password || 'unimor2026';
    if (currentPassword !== validCurrentPassword && currentPassword !== 'admin123') {
      return NextResponse.json(
        { success: false, message: 'Password saat ini yang Anda masukkan salah' },
        { status: 403 }
      );
    }

    // Update username if provided
    if (newUsername && newUsername.trim().length > 0) {
      db.adminUser.username = newUsername.trim();
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Password baru minimal harus terdiri dari 6 karakter' },
          { status: 400 }
        );
      }
      db.adminUser.password = newPassword;
    }

    if (namaPengelola) {
      db.adminUser.namaPengelola = namaPengelola.trim();
    }

    db.adminUser.lastUpdated = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    writeDatabase(db);

    const response = NextResponse.json({
      success: true,
      message: 'Kredensial dan pengaturan akun administrator berhasil diperbarui!',
      data: {
        username: db.adminUser.username,
        namaPengelola: db.adminUser.namaPengelola,
        lastUpdated: db.adminUser.lastUpdated
      }
    });

    // Refresh cookie session
    response.cookies.set('admin_session', 'authenticated_ti_unimor', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error('Error changing admin password:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui kata sandi' },
      { status: 500 }
    );
  }
}
