/**
 * Utility untuk ekstraksi ID dan sinkronisasi skor SINTA langsung dari portal Kemdiktisaintek
 */

export function extractSintaAuthorId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const cleaned = urlOrId.trim();
  const matchProfile = cleaned.match(/(?:authors\/profile\/|profile\/)(\d+)/i);
  if (matchProfile) return matchProfile[1];
  const matchId = cleaned.match(/[?&]id=(\d+)/i);
  if (matchId) return matchId[1];
  if (/^\d{4,10}$/.test(cleaned)) return cleaned;
  return null;
}

export interface LiveSintaScore {
  authorId: string;
  overall: number;
  threeYr: number;
  authorName?: string;
  department?: string;
}

export async function fetchLiveSintaScore(urlOrId: string): Promise<LiveSintaScore | null> {
  const authorId = extractSintaAuthorId(urlOrId);
  if (!authorId) return null;

  try {
    const res = await fetch(`https://sinta.kemdiktisaintek.go.id/authors/profile/${authorId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(7000)
    });

    if (!res.ok) {
      console.warn(`[SINTA] HTTP ${res.status} saat mengakses ID ${authorId}`);
      return null;
    }

    const html = await res.text();

    let overall = 0;
    let threeYr = 0;

    const mOverall = html.match(/<div class="pr-num">\s*([\d\.,]+)\s*<\/div>\s*<div class="pr-txt">\s*SINTA Score Overall\s*<\/div>/i);
    if (mOverall) {
      overall = parseFloat(mOverall[1].replace(/,/g, ''));
    }

    const m3Yr = html.match(/<div class="pr-num">\s*([\d\.,]+)\s*<\/div>\s*<div class="pr-txt">\s*SINTA Score 3Yr\s*<\/div>/i);
    if (m3Yr) {
      threeYr = parseFloat(m3Yr[1].replace(/,/g, ''));
    }

    const mName = html.match(/<h3>\s*<a href="[^"]*">\s*([^<]+)\s*<\/a>\s*<\/h3>/i);
    const authorName = mName ? mName[1].trim() : undefined;

    return {
      authorId,
      overall,
      threeYr,
      authorName
    };
  } catch (err: any) {
    console.warn(`[SINTA] Gagal mengambil skor live untuk ID ${authorId}:`, err?.message || err);
    return null;
  }
}
