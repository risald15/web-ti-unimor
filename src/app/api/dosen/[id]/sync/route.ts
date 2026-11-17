import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, Publikasi } from '@/lib/db';
import { syncDosenPublications } from '@/lib/syncScholar';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();

    const dosenIndex = db.daftarDosen.findIndex(d => d.id === id);
    if (dosenIndex === -1) {
      return NextResponse.json({ success: false, message: 'Dosen tidak ditemukan' }, { status: 404 });
    }

    const dosen = db.daftarDosen[dosenIndex];

    // Jalankan service sinkronisasi
    const syncRes = await syncDosenPublications(dosen);

    if (!syncRes.success) {
      return NextResponse.json({ success: false, message: syncRes.message }, { status: 500 });
    }

    if (!db.daftarPublikasi) db.daftarPublikasi = [];

    // Filter keluar paper lama dari dosen ini agar tidak duplikat (atau merge berdasarkan judul)
    const existingOtherPubs = db.daftarPublikasi.filter(p => p.dosenId !== id);

    const newImportedPubs: Publikasi[] = syncRes.publications.map((p, idx) => ({
      id: `pub-${id}-${Date.now()}-${idx}`,
      dosenId: id,
      judul: p.judul,
      penulis: p.penulis,
      jurnal: p.jurnal,
      tahun: p.tahun,
      sitasi: p.sitasi,
      sumber: p.sumber,
      url: p.url,
      doi: p.doi,
      featured: p.featured
    }));

    db.daftarPublikasi = [...newImportedPubs, ...existingOtherPubs];

    // Update metrik sitasi & h-index dosen serta skor SINTA
    db.daftarDosen[dosenIndex] = {
      ...db.daftarDosen[dosenIndex],
      totalSitasi: syncRes.metrics.totalSitasi,
      hIndex: syncRes.metrics.hIndex,
      i10Index: syncRes.metrics.i10Index,
      sintaScoreOverall: syncRes.metrics.sintaScoreOverall ?? db.daftarDosen[dosenIndex].sintaScoreOverall,
      sintaScore3Yr: syncRes.metrics.sintaScore3Yr ?? db.daftarDosen[dosenIndex].sintaScore3Yr
    };

    writeDatabase(db);

    return NextResponse.json({
      success: true,
      message: syncRes.message,
      source: syncRes.source,
      totalImported: newImportedPubs.length,
      metrics: syncRes.metrics,
      publications: newImportedPubs
    });
  } catch (error) {
    console.error('Error during sync:', error);
    return NextResponse.json({ success: false, message: 'Gagal melakukan sinkronisasi publikasi' }, { status: 500 });
  }
}
