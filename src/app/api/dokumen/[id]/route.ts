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

    const idx = (db.daftarDokumen || []).findIndex(d => d.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    db.daftarDokumen[idx] = {
      ...db.daftarDokumen[idx],
      ...body
    };

    writeDatabase(db);
    return NextResponse.json({ success: true, data: db.daftarDokumen[idx] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui dokumen' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();

    const filtered = (db.daftarDokumen || []).filter(d => d.id !== id);
    if (filtered.length === (db.daftarDokumen || []).length) {
      return NextResponse.json({ success: false, message: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    db.daftarDokumen = filtered;
    writeDatabase(db);
    return NextResponse.json({ success: true, message: 'Dokumen berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus dokumen' }, { status: 500 });
  }
}
