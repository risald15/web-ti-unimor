import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDatabase();

    const index = db.daftarBerita.findIndex((b) => b.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    db.daftarBerita[index] = {
      ...db.daftarBerita[index],
      ...body,
    };

    writeDatabase(db);
    return NextResponse.json({ success: true, data: db.daftarBerita[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui berita' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();

    const filtered = db.daftarBerita.filter((b) => b.id !== id);
    if (filtered.length === db.daftarBerita.length) {
      return NextResponse.json({ success: false, message: 'Berita tidak ditemukan' }, { status: 404 });
    }

    db.daftarBerita = filtered;
    writeDatabase(db);

    return NextResponse.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus berita' }, { status: 500 });
  }
}
