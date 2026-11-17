import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Default kredensial admin prodi TI UNIMOR (bisa diubah nanti lewat environment atau dashboard)
    if (username === 'admin' && (password === 'unimor2026' || password === 'admin123')) {
      const response = NextResponse.json({ success: true, message: 'Login berhasil' });
      // Set simple auth cookie
      response.cookies.set('admin_session', 'authenticated_ti_unimor', {
        path: '/',
        httpOnly: false, // accessible for simple client check
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
