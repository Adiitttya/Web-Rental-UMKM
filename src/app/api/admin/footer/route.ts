import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const DEFAULT_FOOTER_TEXT = '© 2026 DsterGame Studio. All Rights Reserved.';
export const DEFAULT_SOCIAL_LINKS = [
  { id: 'instagram', platform: 'Instagram', url: 'https://instagram.com/dster.game', icon: 'instagram' },
  { id: 'tiktok', platform: 'TikTok', url: 'https://tiktok.com/@dster.game', icon: 'tiktok' },
  { id: 'whatsapp', platform: 'WhatsApp', url: 'https://wa.me/6285172412206', icon: 'whatsapp' },
  { id: 'email', platform: 'Email', url: 'mailto:admin@dstergame.com', icon: 'email' },
];

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ['footer_text', 'footer_social_links'],
        },
      },
    });

    const settingMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingMap[s.key] = s.value;
    });

    const copyrightNotice = settingMap['footer_text'] || DEFAULT_FOOTER_TEXT;
    let socialLinks = DEFAULT_SOCIAL_LINKS;

    if (settingMap['footer_social_links']) {
      try {
        const parsed = JSON.parse(settingMap['footer_social_links']);
        if (Array.isArray(parsed) && parsed.length > 0) {
          socialLinks = parsed;
        }
      } catch {
        // Fallback if parsing fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        copyrightNotice,
        socialLinks,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data footer dari database.',
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { copyrightNotice, socialLinks } = body;

    if (typeof copyrightNotice !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Copyright notice wajib diisi.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(socialLinks)) {
      return NextResponse.json(
        { success: false, message: 'Social links harus berupa array.' },
        { status: 400 }
      );
    }

    // Upsert footer_text to prevent duplicates
    await prisma.systemSetting.upsert({
      where: { key: 'footer_text' },
      update: { value: copyrightNotice },
      create: {
        key: 'footer_text',
        value: copyrightNotice,
        group: 'footer',
        description: 'Teks Hak Cipta (Copyright Notice) pada Footer Website',
        isPublic: true,
      },
    });

    // Upsert footer_social_links to prevent duplicates
    await prisma.systemSetting.upsert({
      where: { key: 'footer_social_links' },
      update: { value: JSON.stringify(socialLinks) },
      create: {
        key: 'footer_social_links',
        value: JSON.stringify(socialLinks),
        group: 'footer',
        description: 'Daftar Media Sosial dan Tautan Resmi pada Footer Website',
        isPublic: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengaturan footer dan media sosial berhasil diperbarui.',
      data: {
        copyrightNotice,
        socialLinks,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui pengaturan footer ke database.',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
