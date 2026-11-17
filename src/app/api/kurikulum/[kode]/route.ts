import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;
    const body = await request.json();
    const db = readDatabase();

    const decodedKode = decodeURIComponent(kode);
    const index = db.strukturKurikulum.findIndex((m) => m.kode === decodedKode);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Mata kuliah tidak ditemukan' }, { status: 404 });
    }

    let updatedMatkul = {
      ...db.strukturKurikulum[index],
      ...body,
      sks: body.sks !== undefined ? Number(body.sks) : db.strukturKurikulum[index].sks,
      semester: body.semester !== undefined ? Number(body.semester) : db.strukturKurikulum[index].semester,
    };

    // Auto-sync relasi dosen pengampu
    if (body.dosenPengampuId && Array.isArray(db.daftarDosen)) {
      const dosen = db.daftarDosen.find(d => d.id === body.dosenPengampuId);
      if (dosen) {
        updatedMatkul.dosenPengampu = dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama;
        updatedMatkul.nipPengampu = dosen.nip || '';
      }
    }

    // Auto-sync relasi peminatan prodi
    if (body.peminatanId && Array.isArray(db.peminatanProdi)) {
      const minat = db.peminatanProdi.find(p => p.id === body.peminatanId);
      if (minat) {
        updatedMatkul.peminatanNama = minat.judul;
      }
    }

    db.strukturKurikulum[index] = updatedMatkul;
    writeDatabase(db);
    return NextResponse.json({ success: true, data: db.strukturKurikulum[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui mata kuliah' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;
    const db = readDatabase();

    const decodedKode = decodeURIComponent(kode);
    const filtered = db.strukturKurikulum.filter((m) => m.kode !== decodedKode);
    if (filtered.length === db.strukturKurikulum.length) {
      return NextResponse.json({ success: false, message: 'Mata kuliah tidak ditemukan' }, { status: 404 });
    }

    db.strukturKurikulum = filtered;
    writeDatabase(db);

    return NextResponse.json({ success: true, message: 'Mata kuliah berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus mata kuliah' }, { status: 500 });
  }
}
