import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

const defaultPages = [
  {
    pagePath: '/',
    title: 'DsterGame Studio — Rental PS & Racing Simulator Ungaran & Salatiga',
    description: 'Pusat rental PlayStation 5, PS4, Nintendo Switch, dan Rig Racing Simulator terlengkap dan ternyaman.',
    keywords: 'rental ps5, rental game ungaran, rental game salatiga, racing simulator',
  },
  {
    pagePath: '/list-game',
    title: 'Katalog Hardware & Game — DsterGame Studio',
    description: 'Daftar koleksi konsol dan ribuan judul game original terbaru siap dimainkan.',
    keywords: 'katalog ps5, game ps5, racing simulator games',
  },
  {
    pagePath: '/pricing',
    title: 'Pricelist & Paket Tarif — DsterGame Studio',
    description: 'Tarif sewa per jam dan paket malam terjangkau dengan fasilitas full AC dan sofa premium.',
    keywords: 'harga sewa ps5, tarif rental game ungaran, paket malam rental ps',
  },
  {
    pagePath: '/event',
    title: 'Turnamen & Community Events — DsterGame Studio',
    description: 'Ikuti turnamen e-sports seru berhadiah jutaan rupiah di DsterGame Studio.',
    keywords: 'turnamen ps5, kompetisi eafc, turnamen tekken 8',
  },
  {
    pagePath: '/gallery',
    title: 'Dokumentasi Galeri Studio — DsterGame Studio',
    description: 'Potret keseruan suasana lounge, rig simulator, dan fasilitas gaming room premium.',
    keywords: 'galeri rental ps, foto studio dstergame',
  },
  {
    pagePath: '/location',
    title: 'Lokasi Cabang Studio — DsterGame Studio',
    description: 'Temukan lokasi cabang DsterGame Studio terdekat di Ungaran dan Salatiga.',
    keywords: 'lokasi dstergame, rental ps ungaran barat',
  },
  {
    pagePath: '/faq',
    title: 'Pusat Bantuan & FAQ — DsterGame Studio',
    description: 'Jawaban atas pertanyaan umum seputar booking, sewa bawa pulang, dan aturan studio.',
    keywords: 'faq rental ps, syarat rental ps5',
  },
];

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const existing = await prisma.seoMetadata.findMany({
      orderBy: { pagePath: 'asc' },
    });

    // Seed defaults in-memory if empty
    const map = new Map(existing.map((item) => [item.pagePath, item]));
    const result = defaultPages.map((def) => {
      const match = map.get(def.pagePath);
      return match || { id: def.pagePath, ...def, updatedAt: new Date() };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat metadata SEO.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { pagePath, title, description, keywords } = body;

    if (!pagePath || !title) {
      return NextResponse.json(
        { success: false, message: 'pagePath dan title wajib diisi.' },
        { status: 400 }
      );
    }

    const updated = await prisma.seoMetadata.upsert({
      where: { pagePath },
      update: {
        title: title.trim(),
        description: description?.trim() || null,
        keywords: keywords?.trim() || null,
      },
      create: {
        pagePath,
        title: title.trim(),
        description: description?.trim() || null,
        keywords: keywords?.trim() || null,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_SEO_METADATA',
      entityName: 'SeoMetadata',
      entityId: updated.id,
      payload: { pagePath: updated.pagePath, title: updated.title },
    });

    revalidatePath(pagePath);
    return NextResponse.json({
      success: true,
      data: updated,
      message: `Metadata SEO untuk rute ${pagePath} berhasil diperbarui.`,
    });
  } catch (error) {
    console.error('Error updating SEO metadata:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan metadata SEO.' },
      { status: 500 }
    );
  }
}
