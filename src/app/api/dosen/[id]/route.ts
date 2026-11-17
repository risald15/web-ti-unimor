import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/db';
import { fetchLiveSintaScore } from '@/lib/sinta';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDatabase();

    const index = db.daftarDosen.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Dosen tidak ditemukan' }, { status: 404 });
    }

    if (body.bidangKeahlian && typeof body.bidangKeahlian === 'string') {
      body.bidangKeahlian = body.bidangKeahlian.split(',').map((s: string) => s.trim());
    }

    // Jika ada sintaId dan diminta sync live atau sintaId baru berubah
    if (body.sintaId && (body.fetchLiveSinta || body.sintaId !== db.daftarDosen[index].sintaId)) {
      try {
        const liveSinta = await fetchLiveSintaScore(body.sintaId);
        if (liveSinta) {
          body.sintaScoreOverall = liveSinta.overall;
          body.sintaScore3Yr = liveSinta.threeYr;
        }
      } catch (err) {
        console.warn('Gagal update live SINTA saat PUT dosen:', err);
      }
    }

    db.daftarDosen[index] = {
      ...db.daftarDosen[index],
      ...body,
    };

    writeDatabase(db);
    return NextResponse.json({ success: true, data: db.daftarDosen[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui dosen' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();

    const filtered = db.daftarDosen.filter((d) => d.id !== id);
    if (filtered.length === db.daftarDosen.length) {
      return NextResponse.json({ success: false, message: 'Dosen tidak ditemukan' }, { status: 404 });
    }

    db.daftarDosen = filtered;
    writeDatabase(db);

    return NextResponse.json({ success: true, message: 'Dosen berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus dosen' }, { status: 500 });
  }
}
