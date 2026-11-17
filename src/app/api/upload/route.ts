import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    // Validasi tipe file gambar
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Format file tidak didukung. Harap unggah file gambar (JPG, PNG, atau WebP).' 
      }, { status: 400 });
    }

    // Batasan ukuran: maks 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ukuran file terlalu besar. Maksimal 5 MB.' 
      }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'dosen');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Amankan nama file
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
    const fileName = `dosen-${Date.now()}-${cleanBase || 'photo'}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/dosen/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'Foto dosen berhasil diunggah',
      url: publicUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengunggah foto' }, { status: 500 });
  }
}
