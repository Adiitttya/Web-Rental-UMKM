import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          startsWith: 'brand_',
        },
      },
    });

    const brandingMap: Record<string, string> = {
      brand_logo_primary: '/images/logo-dster.png',
      brand_logo_navbar: '/images/logo-dster.png',
      brand_favicon: '/favicon.ico',
      brand_logo_footer: '/images/logo-dster.png',
      brand_site_name: 'DsterGame Studio',
      brand_tagline: 'Console & Racing Simulator Lounge',
      brand_social_preview: '/images/og-preview.jpg',
    };

    settings.forEach((s) => {
      brandingMap[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      data: brandingMap,
    });
  } catch (error) {
    console.error('Error fetching branding settings:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat pengaturan branding.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();

    const allowedKeys = [
      'brand_logo_primary',
      'brand_logo_navbar',
      'brand_favicon',
      'brand_logo_footer',
      'brand_site_name',
      'brand_tagline',
      'brand_social_preview',
    ];

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        await prisma.systemSetting.upsert({
          where: { key },
          update: {
            value: String(body[key]).trim(),
            group: 'branding',
            isPublic: true,
          },
          create: {
            key,
            value: String(body[key]).trim(),
            group: 'branding',
            description: `Brand identity setting for ${key}`,
            isPublic: true,
          },
        });
      }
    }

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_BRANDING_IDENTITY',
      entityName: 'SystemSetting',
      payload: body,
    });

    revalidatePath('/');
    return NextResponse.json({
      success: true,
      message: 'Identitas brand terpusat berhasil diperbarui dan disinkronkan.',
    });
  } catch (error) {
    console.error('Error updating branding settings:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan pengaturan branding.' },
      { status: 500 }
    );
  }
}
