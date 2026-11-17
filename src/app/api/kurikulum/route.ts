import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, MataKuliah } from '@/lib/db';

export async function GET() {
  try {
    const db = readDatabase();

    // Relasi Dinamis: Kurikulum -> Master Dosen & Peminatan
    const kurikulumList = (db.strukturKurikulum || []).map(mk => {
      let dosenPengampu = mk.dosenPengampu || '';
      let nipPengampu = mk.nipPengampu || '';
      let peminatanNama = mk.peminatanNama || '';

      if (mk.dosenPengampuId && Array.isArray(db.daftarDosen)) {
        const dosen = db.daftarDosen.find(d => d.id === mk.dosenPengampuId);
        if (dosen) {
          dosenPengampu = dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama;
          nipPengampu = dosen.nip || '';
        }
      }

      if (mk.peminatanId && Array.isArray(db.peminatanProdi)) {
        const minat = db.peminatanProdi.find(p => p.id === mk.peminatanId);
        if (minat) {
          peminatanNama = minat.judul;
        }
      }

      return {
        ...mk,
        dosenPengampu,
        nipPengampu,
        peminatanNama
      };
    });

    return NextResponse.json({ success: true, data: kurikulumList });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data kurikulum' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    const kode = body.kode.toUpperCase().trim();
    // Check duplicate kode
    const exists = db.strukturKurikulum.some(m => m.kode === kode);
    if (exists) {
      return NextResponse.json({ success: false, message: 'Kode mata kuliah sudah ada' }, { status: 400 });
    }

    let dosenPengampu = body.dosenPengampu || '';
    let nipPengampu = '';
    let peminatanNama = '';

    if (body.dosenPengampuId && Array.isArray(db.daftarDosen)) {
      const dosen = db.daftarDosen.find(d => d.id === body.dosenPengampuId);
      if (dosen) {
        dosenPengampu = dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama;
        nipPengampu = dosen.nip || '';
      }
    }

    if (body.peminatanId && Array.isArray(db.peminatanProdi)) {
      const minat = db.peminatanProdi.find(p => p.id === body.peminatanId);
      if (minat) {
        peminatanNama = minat.judul;
      }
    }

    const newMatkul: MataKuliah = {
      kode,
      nama: body.nama,
      sks: Number(body.sks) || 3,
      semester: Number(body.semester) || 1,
      kategori: body.kategori || 'Wajib',
      deskripsi: body.deskripsi || '',
      dosenPengampuId: body.dosenPengampuId || undefined,
      dosenPengampu,
      nipPengampu,
      peminatanId: body.peminatanId || undefined,
      peminatanNama
    };

    db.strukturKurikulum.push(newMatkul);
    writeDatabase(db);

    return NextResponse.json({ success: true, data: newMatkul }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan mata kuliah' }, { status: 500 });
  }
}
