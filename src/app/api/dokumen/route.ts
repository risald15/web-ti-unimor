import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, DokumenAkademik } from '@/lib/db';

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json({
      success: true,
      data: db.daftarDokumen || [],
      total: (db.daftarDokumen || []).length
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data dokumen' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    const newId = `doc-${Date.now()}`;
    const newDoc: DokumenAkademik = {
      id: newId,
      nama: body.nama,
      kategori: body.kategori || 'Panduan',
      deskripsi: body.deskripsi || '',
      fileUrl: body.fileUrl || '',
      ukuranFile: body.ukuranFile || '1.0 MB',
      format: body.format || 'PDF',
      tanggalUnggah: body.tanggalUnggah || 'Hari ini'
    };

    if (!db.daftarDokumen) db.daftarDokumen = [];
    db.daftarDokumen.unshift(newDoc);
    writeDatabase(db);

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan dokumen' }, { status: 500 });
  }
}
