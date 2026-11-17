import { NextResponse } from 'next/server';
import { fetchLiveSintaScore } from '@/lib/sinta';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Parameter id wajib disertakan' }, { status: 400 });
    }

    const liveData = await fetchLiveSintaScore(id);
    if (!liveData) {
      return NextResponse.json({ 
        success: false, 
        message: 'Gagal mengambil skor SINTA. Pastikan ID atau URL SINTA valid.' 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: liveData });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error?.message || 'Terjadi kesalahan server' 
    }, { status: 500 });
  }
}
