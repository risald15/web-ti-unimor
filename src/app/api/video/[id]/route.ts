import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, extractYoutubeId } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDatabase();

    if (!db.daftarVideo) db.daftarVideo = [];
    const index = db.daftarVideo.findIndex(v => v.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Video tidak ditemukan' }, { status: 404 });
    }

    let youtubeId = db.daftarVideo[index].youtubeId;
    if (body.youtubeUrl || body.youtubeId) {
      const extracted = extractYoutubeId(body.youtubeUrl || body.youtubeId);
      if (extracted) {
        youtubeId = extracted;
      }
    }

    let dosenNama = body.dosenNama;
    if (body.dosenId) {
      const lecturer = db.daftarDosen.find(d => d.id === body.dosenId);
      if (lecturer) {
        dosenNama = `${lecturer.nama}, ${lecturer.gelar}`;
      }
    }

    if (body.featured) {
      db.daftarVideo.forEach(v => { v.featured = false; });
    }

    db.daftarVideo[index] = {
      ...db.daftarVideo[index],
      ...body,
      youtubeId: youtubeId,
      youtubeUrl: body.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
      dosenNama: dosenNama
    };

    writeDatabase(db);
    return NextResponse.json({ success: true, data: db.daftarVideo[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui video kegiatan' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();

    if (!db.daftarVideo) db.daftarVideo = [];
    const filtered = db.daftarVideo.filter(v => v.id !== id);
    if (filtered.length === db.daftarVideo.length) {
      return NextResponse.json({ success: false, message: 'Video tidak ditemukan' }, { status: 404 });
    }

    db.daftarVideo = filtered;
    writeDatabase(db);
    return NextResponse.json({ success: true, message: 'Video berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus video' }, { status: 500 });
  }
}
