import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, extractYoutubeId, VideoKegiatan } from '@/lib/db';

export async function GET() {
  try {
    const db = readDatabase();
    const videos = (db.daftarVideo || []).map(vid => {
      if (vid.dosenId) {
        const lecturer = db.daftarDosen.find(d => d.id === vid.dosenId);
        if (lecturer) {
          vid.dosenNama = `${lecturer.nama}, ${lecturer.gelar}`;
        }
      }
      return vid;
    });

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data video kegiatan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    const youtubeId = extractYoutubeId(body.youtubeUrl || body.youtubeId || '');
    if (!youtubeId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Tautan YouTube tidak valid. Mohon periksa kembali link video YouTube Anda.' 
      }, { status: 400 });
    }

    let dosenNama = body.dosenNama || '';
    if (body.dosenId) {
      const lecturer = db.daftarDosen.find(d => d.id === body.dosenId);
      if (lecturer) {
        dosenNama = `${lecturer.nama}, ${lecturer.gelar}`;
      }
    }

    const newVideo: VideoKegiatan = {
      id: `vid-${Date.now()}`,
      judul: body.judul || 'Dokumentasi Kegiatan Program Studi TI',
      youtubeId: youtubeId,
      youtubeUrl: body.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
      kategori: body.kategori || 'Kuliah Umum',
      deskripsi: body.deskripsi || '',
      tanggal: body.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      pemateri: body.pemateri || '',
      dosenId: body.dosenId || undefined,
      dosenNama: dosenNama,
      featured: Boolean(body.featured)
    };

    if (!db.daftarVideo) db.daftarVideo = [];

    // If marked as featured, unset other featured if wanted
    if (newVideo.featured) {
      db.daftarVideo.forEach(v => { v.featured = false; });
    }

    db.daftarVideo.unshift(newVideo);
    writeDatabase(db);

    return NextResponse.json({ success: true, data: newVideo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan video kegiatan' }, { status: 500 });
  }
}
