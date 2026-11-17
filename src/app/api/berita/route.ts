import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json({ success: true, data: db.daftarBerita });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil berita' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    const newId = `berita-${Date.now()}`;
    const slug = body.judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newBerita = {
      id: newId,
      slug: slug || newId,
      judul: body.judul,
      ringkasan: body.ringkasan,
      isiLengkap: body.isiLengkap || body.ringkasan,
      kategori: body.kategori || 'Berita',
      tanggal: body.tanggal || new Date().toISOString().split('T')[0],
      penulis: body.penulis || 'Admin TI UNIMOR',
      featured: Boolean(body.featured)
    };

    // Prepend to array
    db.daftarBerita.unshift(newBerita);
    writeDatabase(db);

    return NextResponse.json({ success: true, data: newBerita }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan berita' }, { status: 500 });
  }
}
