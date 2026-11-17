import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, LabFasilitas } from '@/lib/db';

export async function GET() {
  try {
    const db = readDatabase();

    // Relasi Dinamis: Laboratorium -> Master Dosen (via dosenId)
    const labs = (db.daftarLaboratorium || []).map(lab => {
      if (lab.dosenId && Array.isArray(db.daftarDosen)) {
        const dosen = db.daftarDosen.find(d => d.id === lab.dosenId);
        if (dosen) {
          return {
            ...lab,
            penanggungJawab: dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama,
            nipPenanggungJawab: dosen.nip,
            fotoPenanggungJawab: dosen.foto
          };
        }
      }
      return lab;
    });

    return NextResponse.json({
      success: true,
      data: labs,
      total: labs.length
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data fasilitas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    let pjNama = body.penanggungJawab || '';
    let pjNip = '';

    // Auto-sync jika dosenId terhubung
    if (body.dosenId && Array.isArray(db.daftarDosen)) {
      const dosen = db.daftarDosen.find(d => d.id === body.dosenId);
      if (dosen) {
        pjNama = dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama;
        pjNip = dosen.nip || '';
      }
    }

    const newId = `lab-${Date.now()}`;
    const newLab: LabFasilitas = {
      id: newId,
      nama: body.nama,
      deskripsi: body.deskripsi || '',
      kapasitas: body.kapasitas || '',
      spesifikasi: Array.isArray(body.spesifikasi)
        ? body.spesifikasi
        : typeof body.spesifikasi === 'string'
        ? body.spesifikasi.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [],
      peruntukan: body.peruntukan || '',
      gambarUrl: body.gambarUrl || '',
      dosenId: body.dosenId || undefined,
      penanggungJawab: pjNama,
      nipPenanggungJawab: pjNip
    };

    if (!db.daftarLaboratorium) db.daftarLaboratorium = [];
    db.daftarLaboratorium.push(newLab);
    writeDatabase(db);

    return NextResponse.json({ success: true, data: newLab }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan fasilitas lab' }, { status: 500 });
  }
}
