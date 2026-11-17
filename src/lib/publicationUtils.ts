import { Publikasi, Dosen } from './db';

export interface EnrichedPublikasi extends Publikasi {
  primaryDosen?: Dosen;
  coAuthorsDosen: {
    dosen: Dosen;
    rank: number; // 0 = Penulis 1 (Utama), 1 = Penulis 2, dst.
    label: string; // e.g. "Penulis 1 (Utama)", "Penulis 2"
  }[];
  allDosenIds: string[];
  isKolaborasiDosen: boolean;
  urutanPenulisLabel?: string;
}

/**
 * Normalisasi judul untuk perbandingan akurat bebas tanda baca dan spasi berlebih
 */
export function normalizeTitle(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Memeriksa apakah dua judul merujuk ke publikasi / karya ilmiah yang sama
 */
export function isSamePaper(titleA: string, titleB: string): boolean {
  const normA = normalizeTitle(titleA);
  const normB = normalizeTitle(titleB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;

  // Jika salah satu judul merupakan awalan dari judul lainnya (misal terpotong ... pada Scholar)
  // dengan panjang minimal 28 karakter
  const minLen = Math.min(normA.length, normB.length);
  if (minLen >= 28 && (normA.startsWith(normB.slice(0, 28)) || normB.startsWith(normA.slice(0, 28)))) {
    return true;
  }
  return false;
}

/**
 * Mendapatkan indeks/urutan penulis seorang dosen di dalam string penulis paper
 * Return: 0 (Penulis 1), 1 (Penulis 2), dst. Mengembalikan 999 jika tidak ditemukan.
 */
export function getDosenAuthorRank(dosen: Dosen, penulisStr: string): number {
  if (!dosen || !dosen.nama || !penulisStr) return 999;

  // Pecah daftar penulis berdasarkan koma atau titik koma
  const authorTokens = penulisStr
    .split(/[,;]/)
    .map(a => a.trim().toLowerCase())
    .filter(Boolean);

  // Ambil kata-kata signifikan dari nama dosen (minimal 3 huruf, abaikan gelar)
  const nameParts = dosen.nama
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(p => p.length >= 3);

  // Inisial nama depan + nama belakang (contoh: "r risald" atau "b baso")
  const initials = dosen.nama
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  
  const shortCode = initials.length >= 2 
    ? `${initials[0][0]} ${initials[initials.length - 1]}` // e.g. "b baso"
    : '';

  for (let i = 0; i < authorTokens.length; i++) {
    const author = authorTokens[i];

    // Cek kesesuaian inisial + nama belakang
    if (shortCode && author.includes(shortCode)) {
      return i;
    }

    // Cek kesesuaian kata nama (misal nama belakang atau nama khas seperti "risald", "baso", "kelen")
    for (const part of nameParts) {
      if (author.includes(part)) {
        return i;
      }
    }
  }

  return 999;
}

/**
 * Deduplikasi publikasi antar-dosen prodi:
 * Jika ada 2 atau lebih dosen yang sama-sama menulis paper tersebut,
 * tampilkan SATU SAJA dan prioritaskan dosen yang urutan penulisnya paling awal.
 */
export function deduplicatePublications(
  pubs: Publikasi[],
  dosenList: Dosen[]
): EnrichedPublikasi[] {
  const groups: Publikasi[][] = [];

  // 1. Kelompokkan paper yang sama berdasarkan kemiripan judul
  for (const pub of pubs) {
    let matchedGroup: Publikasi[] | undefined;

    for (const g of groups) {
      if (isSamePaper(g[0].judul, pub.judul)) {
        matchedGroup = g;
        break;
      }
    }

    if (matchedGroup) {
      matchedGroup.push(pub);
    } else {
      groups.push([pub]);
    }
  }

  // 2. Untuk setiap kelompok, cari semua dosen TI yang terlibat dan tentukan pemenang urutan penulis
  const result: EnrichedPublikasi[] = [];

  for (const group of groups) {
    const samplePub = group[0];
    const penulisStr = samplePub.penulis;

    // Kumpulkan dosen TI yang terlibat dalam paper ini (baik via record group maupun via pencocokan penulisStr)
    const involvedDosenMap = new Map<string, { dosen: Dosen; rank: number }>();

    // Dari record group yang ada
    for (const p of group) {
      const d = dosenList.find(item => item.id === p.dosenId);
      if (d && !involvedDosenMap.has(d.id)) {
        const rank = getDosenAuthorRank(d, p.penulis);
        involvedDosenMap.set(d.id, { dosen: d, rank });
      }
    }

    // Juga periksa semua dosen lain di dosenList apakah namanya tercantum di penulisStr
    for (const d of dosenList) {
      if (!involvedDosenMap.has(d.id)) {
        const rank = getDosenAuthorRank(d, penulisStr);
        if (rank < 999) {
          involvedDosenMap.set(d.id, { dosen: d, rank });
        }
      }
    }

    // Urutkan dosen yang terlibat berdasarkan rank (urutan penulis paling awal: 0, 1, 2, ...)
    const sortedInvolved = Array.from(involvedDosenMap.values()).sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.dosen.nama.localeCompare(b.dosen.nama);
    });

    // Tentukan primary dosen (yang paling awal urutan kepenulisannya)
    let winnerPub: Publikasi = samplePub;
    let primaryDosen: Dosen | undefined;

    if (sortedInvolved.length > 0) {
      const bestDosen = sortedInvolved[0].dosen;
      primaryDosen = bestDosen;

      // Cari record publikasi milik bestDosen jika ada di dalam group
      const matchingPub = group.find(p => p.dosenId === bestDosen.id);
      if (matchingPub) {
        winnerPub = matchingPub;
      }
    } else {
      primaryDosen = dosenList.find(d => d.id === samplePub.dosenId);
    }

    // Ambil metadata terbaik dari group (misal sitasi tertinggi, DOI, URL)
    const maxSitasi = group.reduce((max, p) => Math.max(max, Number(p.sitasi) || 0), 0);
    const bestUrl = group.find(p => Boolean(p.url))?.url || winnerPub.url || '';
    const bestDoi = group.find(p => Boolean(p.doi))?.doi || winnerPub.doi || '';
    const hasFeatured = group.some(p => Boolean(p.featured));

    // Format label urutan penulis untuk setiap dosen
    const coAuthorsDosen = sortedInvolved.map(item => ({
      dosen: item.dosen,
      rank: item.rank,
      label: item.rank === 0 
        ? 'Penulis Utama' 
        : item.rank < 999 
        ? `Penulis ke-${item.rank + 1}` 
        : 'Co-Author'
    }));

    const allDosenIds = sortedInvolved.map(item => item.dosen.id);
    if (!allDosenIds.includes(winnerPub.dosenId)) {
      allDosenIds.push(winnerPub.dosenId);
    }

    const primaryRank = sortedInvolved[0]?.rank;
    const urutanPenulisLabel = primaryRank === 0 
      ? 'Penulis Utama' 
      : primaryRank !== undefined && primaryRank < 999 
      ? `Penulis ke-${primaryRank + 1}` 
      : undefined;

    result.push({
      ...winnerPub,
      dosenId: primaryDosen ? primaryDosen.id : winnerPub.dosenId,
      sitasi: maxSitasi,
      url: bestUrl,
      doi: bestDoi,
      featured: hasFeatured || maxSitasi >= 10,
      primaryDosen,
      coAuthorsDosen,
      allDosenIds,
      isKolaborasiDosen: sortedInvolved.length > 1,
      urutanPenulisLabel
    });
  }

  // Urutkan hasil akhir: Riset unggulan / Sitasi tertinggi di atas
  return result.sort((a, b) => (Number(b.sitasi) || 0) - (Number(a.sitasi) || 0));
}
