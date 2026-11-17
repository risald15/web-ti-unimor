import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = readDatabase();

    // 1. Relasi Dinamis: Sambutan Kaprodi -> Master Dosen (via dosenId)
    let sambutanKaprodi = { ...db.sambutanKaprodi };
    if (sambutanKaprodi.dosenId && Array.isArray(db.daftarDosen)) {
      const dosen = db.daftarDosen.find(d => d.id === sambutanKaprodi.dosenId);
      if (dosen) {
        sambutanKaprodi.nama = dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama;
        sambutanKaprodi.nip = dosen.nip || sambutanKaprodi.nip;
        sambutanKaprodi.foto = dosen.foto;
      }
    }

    // 2. Relasi Dinamis: Struktur Organisasi -> Master Dosen (via dosenId)
    const strukturOrganisasi = (db.strukturOrganisasi || []).map(org => {
      if (org.dosenId && Array.isArray(db.daftarDosen)) {
        const dosen = db.daftarDosen.find(d => d.id === org.dosenId);
        if (dosen) {
          return {
            ...org,
            nama: dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama,
            nip: dosen.nip || org.nip
          };
        }
      }
      return org;
    });

    return NextResponse.json({
      success: true,
      data: {
        siteConfig: db.siteConfig,
        sambutanKaprodi,
        visiMisi: db.visiMisi,
        dataStatistik: db.dataStatistik || [],
        daftarMitra: db.daftarMitra || [],
        strukturOrganisasi,
        peminatanProdi: db.peminatanProdi || []
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

    if (body.siteConfig) {
      db.siteConfig = { ...db.siteConfig, ...body.siteConfig };
    }

    if (body.sambutanKaprodi) {
      const newSambutan = { ...db.sambutanKaprodi, ...body.sambutanKaprodi };
      
      // Auto-sinkronisasi data profil dosen jika dosenId terhubung
      if (newSambutan.dosenId && Array.isArray(db.daftarDosen)) {
        const dosen = db.daftarDosen.find(d => d.id === newSambutan.dosenId);
        if (dosen) {
          newSambutan.nama = dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama;
          newSambutan.nip = dosen.nip || newSambutan.nip;
          newSambutan.foto = dosen.foto;
        }
      }
      db.sambutanKaprodi = newSambutan;
    }

    if (body.visiMisi) {
      db.visiMisi = { ...db.visiMisi, ...body.visiMisi };
    }

    if (body.dataStatistik) {
      db.dataStatistik = body.dataStatistik;
    }

    if (body.daftarMitra) {
      db.daftarMitra = body.daftarMitra;
    }

    if (body.strukturOrganisasi) {
      // Auto-sinkronisasi nama & nip setiap posisi yang berelasi dengan dosenId
      db.strukturOrganisasi = body.strukturOrganisasi.map((org: any) => {
        if (org.dosenId && Array.isArray(db.daftarDosen)) {
          const dosen = db.daftarDosen.find(d => d.id === org.dosenId);
          if (dosen) {
            return {
              ...org,
              nama: dosen.gelar ? `${dosen.nama}, ${dosen.gelar}` : dosen.nama,
              nip: dosen.nip || org.nip
            };
          }
        }
        return org;
      });
    }

    if (body.peminatanProdi) {
      db.peminatanProdi = body.peminatanProdi;
    }

    writeDatabase(db);
    return NextResponse.json({ 
      success: true, 
      message: 'Profil prodi & relasi Master Dosen berhasil diperbarui' 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
