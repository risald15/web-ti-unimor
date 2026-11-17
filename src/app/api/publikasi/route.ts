import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, Publikasi } from '@/lib/db';
import { deduplicatePublications } from '@/lib/publicationUtils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dosenId = searchParams.get('dosenId');
    const raw = searchParams.get('raw') === 'true'; // jika butuh data mentah tanpa deduplikasi

    const db = readDatabase();
    const rawPubs = db.daftarPublikasi || [];
    const dosenList = db.daftarDosen || [];

    let pubs = raw ? rawPubs : deduplicatePublications(rawPubs, dosenList);

    if (dosenId) {
      if (raw) {
        pubs = pubs.filter(p => p.dosenId === dosenId);
      } else {
        // Pada data terdeduplikasi, sertakan jika dosen adalah penulis utama maupun co-penulis
        pubs = pubs.filter(p => {
          const enriched = p as any;
          return enriched.allDosenIds?.includes(dosenId) || p.dosenId === dosenId;
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: pubs,
      total: pubs.length,
      rawTotal: rawPubs.length
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data publikasi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    const newId = `pub-${Date.now()}`;
    const newPub: Publikasi = {
      id: newId,
      dosenId: body.dosenId,
      judul: body.judul,
      penulis: body.penulis || 'Dosen TI UNIMOR',
      jurnal: body.jurnal || 'Jurnal Ilmiah',
      tahun: Number(body.tahun) || new Date().getFullYear(),
      sitasi: Number(body.sitasi) || 0,
      sumber: body.sumber || 'Manual',
      url: body.url || '',
      doi: body.doi || '',
      featured: Boolean(body.featured)
    };

    if (!db.daftarPublikasi) db.daftarPublikasi = [];
    db.daftarPublikasi.unshift(newPub);

    // Update sitasi dosen jika ada
    const dosenIdx = db.daftarDosen.findIndex(d => d.id === body.dosenId);
    if (dosenIdx !== -1) {
      const dosenPubs = db.daftarPublikasi.filter(p => p.dosenId === body.dosenId);
      db.daftarDosen[dosenIdx].totalSitasi = dosenPubs.reduce((sum, p) => sum + (p.sitasi || 0), 0);
    }

    writeDatabase(db);
    return NextResponse.json({ success: true, data: newPub }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan publikasi' }, { status: 500 });
  }
}
