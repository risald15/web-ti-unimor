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

    const idx = (db.daftarLaboratorium || []).findIndex(l => l.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Fasilitas tidak ditemukan' }, { status: 404 });
    }

    if (body.spesifikasi && typeof body.spesifikasi === 'string') {
      body.spesifikasi = body.spesifikasi.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }

    let updatedLab = {
      ...db.daftarLaboratorium[idx],
      ...body
    };

    // Auto-sync jika dosenId diubah / terhubung
    if (body.dosenId && Array.isArray(db.daftarDosen)) {
      const dosen = db.daftarDosen.find(d => d.id === body.dosenId);
      if (dosen) {
        updatedLab.penanggungJawab = dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama;
        updatedLab.nipPenanggungJawab = dosen.nip || '';
      }
    }

    db.daftarLaboratorium[idx] = updatedLab;
    writeDatabase(db);
    return NextResponse.json({ success: true, data: db.daftarLaboratorium[idx] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui fasilitas' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();

    const filtered = (db.daftarLaboratorium || []).filter(l => l.id !== id);
    if (filtered.length === (db.daftarLaboratorium || []).length) {
      return NextResponse.json({ success: false, message: 'Fasilitas tidak ditemukan' }, { status: 404 });
    }

    db.daftarLaboratorium = filtered;
    writeDatabase(db);
    return NextResponse.json({ success: true, message: 'Fasilitas berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus fasilitas' }, { status: 500 });
  }
}
