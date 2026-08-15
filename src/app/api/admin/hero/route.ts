import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';
import { mockHero } from '@/data/mock-landing';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const hero = await prisma.hero.findFirst({
      where: { isPrimary: true },
      include: {
        bgMedia: true,
        logoMedia: true,
        decorations: { include: { media: true } },
      },
    });

    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ['contact_instagram', 'hero_instagram', 'hero_decorations', 'hero_game_covers', 'hero_logo'],
        },
      },
    });

    const settingMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingMap[s.key] = s.value;
    });

    let decorations = mockHero.decorations;
    if (settingMap.hero_decorations) {
      try {
        decorations = JSON.parse(settingMap.hero_decorations);
      } catch {
        // Fallback to mockHero
      }
    }

    let gameCovers = mockHero.gameCovers;
    if (settingMap.hero_game_covers) {
      try {
        gameCovers = JSON.parse(settingMap.hero_game_covers);
      } catch {
        // Fallback to mockHero
      }
    }

    const heroData = {
      title: hero?.title || 'DsterGame Studio',
      subtitle: hero?.subtitle || 'Console & Racing Simulator Lounge | Rental Tempat & Sewa Bawa Pulang',
      ctaText: hero?.ctaText || 'Explore',
      ctaLink: hero?.ctaLink || '#list-game',
      instagram: settingMap.contact_instagram || settingMap.hero_instagram || '@dster.game',
      logo: settingMap.hero_logo || hero?.logoMedia?.url || mockHero.logo,
      decorations,
      gameCovers,
    };

    return NextResponse.json({ success: true, data: heroData });
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch hero data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, subtitle, ctaText, ctaLink, instagram, decorations, gameCovers, logo } = body;

    const wibNow = getWibDate();

    // 1. Update or create primary Hero record
    let primaryHero = await prisma.hero.findFirst({ where: { isPrimary: true } });
    if (primaryHero) {
      primaryHero = await prisma.hero.update({
        where: { id: primaryHero.id },
        data: {
          title: title?.trim() || primaryHero.title,
          subtitle: subtitle?.trim() || primaryHero.subtitle,
          ctaText: ctaText?.trim() || primaryHero.ctaText,
          ctaLink: ctaLink?.trim() || primaryHero.ctaLink,
          updatedAt: wibNow,
        },
      });
    } else {
      primaryHero = await prisma.hero.create({
        data: {
          title: title?.trim() || 'DsterGame Studio',
          subtitle: subtitle?.trim() || 'Console & Racing Simulator Lounge',
          ctaText: ctaText?.trim() || 'Explore',
          ctaLink: ctaLink?.trim() || '#list-game',
          isPrimary: true,
          createdAt: wibNow,
          updatedAt: wibNow,
        },
      });
    }

    // 2. Update SystemSettings for instagram, decorations, gameCovers, logo
    const settingsToUpsert = [
      { key: 'contact_instagram', value: instagram?.trim() || '@dster.game', group: 'contact', description: 'Instagram handle' },
      { key: 'hero_instagram', value: instagram?.trim() || '@dster.game', group: 'hero', description: 'Hero Instagram' },
    ];

    if (decorations) {
      settingsToUpsert.push({
        key: 'hero_decorations',
        value: typeof decorations === 'string' ? decorations : JSON.stringify(decorations),
        group: 'hero',
        description: 'Hero 3D floating decorations',
      });
    }

    if (gameCovers) {
      settingsToUpsert.push({
        key: 'hero_game_covers',
        value: typeof gameCovers === 'string' ? gameCovers : JSON.stringify(gameCovers),
        group: 'hero',
        description: 'Hero game cover carousel showcase',
      });
    }

    if (logo) {
      settingsToUpsert.push({
        key: 'hero_logo',
        value: logo.trim(),
        group: 'hero',
        description: 'Hero logo URL',
      });
    }

    for (const setting of settingsToUpsert) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_HERO',
      entityName: 'Hero',
      entityId: primaryHero.id,
      payload: { title, instagram, ctaText, ctaLink },
    });

    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'Hero settings updated successfully.' });
  } catch (error) {
    console.error('Error updating hero settings:', error);
    return NextResponse.json({ success: false, message: 'Failed to update hero settings' }, { status: 500 });
  }
}
