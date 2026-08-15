import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, hardwareId, genre, isPopular, displayOrder } = body;

    if (!title || !hardwareId) {
      return NextResponse.json({ success: false, message: 'Judul game dan ID device unit wajib diisi.' }, { status: 400 });
    }

    const wibNow = getWibDate();
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now()}`;

    const newGame = await prisma.game.create({
      data: {
        title: title.trim(),
        slug,
        hardwareId,
        genre: genre?.trim() || 'General',
        isPopular: isPopular ?? false,
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_GAME_CATALOG',
      entityName: 'Game',
      entityId: newGame.id,
      payload: { title: newGame.title, hardwareId },
    });

    revalidatePath('/');
    revalidatePath('/list-game');
    return NextResponse.json({ success: true, data: newGame, message: 'Game berhasil ditambahkan ke device.' });
  } catch (error) {
    console.error('Error creating game item:', error);
    return NextResponse.json({ success: false, message: 'Failed to create game item' }, { status: 500 });
  }
}
