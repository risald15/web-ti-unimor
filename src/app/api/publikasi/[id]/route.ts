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

    const index = db.daftarPublikasi.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Publikasi tidak ditemukan' }, { status: 404 });
    }

    db.daftarPublikasi[index] = {
      ...db.daftarPublikasi[index],
      ...body,
      tahun: body.tahun ? Number(body.tahun) : db.daftarPublikasi[index].tahun,
      sitasi: body.sitasi !== undefined ? Number(body.sitasi) : db.daftarPublikasi[index].sitasi,
    };

    writeDatabase(db);
    return NextResponse.json({ success: true, data: db.daftarPublikasi[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui publikasi' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();

    const filtered = db.daftarPublikasi.filter(p => p.id !== id);
    if (filtered.length === db.daftarPublikasi.length) {
      return NextResponse.json({ success: false, message: 'Publikasi tidak ditemukan' }, { status: 404 });
    }

    db.daftarPublikasi = filtered;
    writeDatabase(db);

    return NextResponse.json({ success: true, message: 'Publikasi berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus publikasi' }, { status: 500 });
  }
}
