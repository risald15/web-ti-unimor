import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/db';
import { fetchLiveSintaScore } from '@/lib/sinta';

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json({ success: true, data: db.daftarDosen });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data dosen' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    let sintaScoreOverall = Number(body.sintaScoreOverall) || 0;
    let sintaScore3Yr = Number(body.sintaScore3Yr) || 0;

    // Jika admin memasukkan SINTA ID, coba ambil skor live secara otomatis
    if (body.sintaId) {
      try {
        const liveSinta = await fetchLiveSintaScore(body.sintaId);
        if (liveSinta) {
          sintaScoreOverall = liveSinta.overall;
          sintaScore3Yr = liveSinta.threeYr;
        }
      } catch (err) {
        console.warn('Gagal mengambil skor live SINTA saat POST dosen:', err);
      }
    }

    const newId = `dosen-${Date.now()}`;
    const newDosen = {
      id: newId,
      nama: body.nama,
      gelar: body.gelar,
      nip: body.nip || '-',
      jabatan: body.jabatan || 'Dosen Pengajar',
      bidangKeahlian: Array.isArray(body.bidangKeahlian) 
        ? body.bidangKeahlian 
        : typeof body.bidangKeahlian === 'string'
        ? body.bidangKeahlian.split(',').map((s: string) => s.trim())
        : [],
      pendidikanTerakhir: body.pendidikanTerakhir || 'Magister Teknik Informatika',
      email: body.email || `dosen@unimor.ac.id`,
      foto: body.foto || '',
      scholarUrl: body.scholarUrl || '',
      sintaId: body.sintaId || '',
      sintaScoreOverall: sintaScoreOverall,
      sintaScore3Yr: sintaScore3Yr,
      totalSitasi: Number(body.totalSitasi) || 0,
      hIndex: Number(body.hIndex) || 0,
      i10Index: Number(body.i10Index) || 0
    };

    db.daftarDosen.push(newDosen);
    writeDatabase(db);

    return NextResponse.json({ success: true, data: newDosen }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan dosen' }, { status: 500 });
  }
}
