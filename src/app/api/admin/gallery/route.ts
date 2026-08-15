import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { MediaFileType } from '@prisma/client';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const photos = await prisma.galleryPhoto.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { media: true },
    });
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch gallery photos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, caption, imageUrl, displayOrder } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, message: 'Title and imageUrl are required.' }, { status: 400 });
    }

    const wibNow = getWibDate();

    // Get or create default main album
    let album = await prisma.galleryAlbum.findFirst();
    if (!album) {
      album = await prisma.galleryAlbum.create({
        data: {
          title: 'Main Gallery',
          slug: 'main-gallery',
          description: 'Default studio documentation album',
        },
      });
    }

    // Create media record
    const media = await prisma.media.create({
      data: {
        filename: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`,
        url: imageUrl.trim(),
        mimeType: 'image/jpeg',
        fileType: MediaFileType.IMAGE,
        sizeBytes: 1024 * 300,
        altText: title.trim(),
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    const newPhoto = await prisma.galleryPhoto.create({
      data: {
        albumId: album.id,
        mediaId: media.id,
        caption: `${title.trim()} - ${caption?.trim() || ''}`,
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_FOTO_GALERI',
      entityName: 'GalleryPhoto',
      entityId: newPhoto.id,
      payload: { title },
    });

    revalidatePath('/');
    revalidatePath('/gallery');
    return NextResponse.json({ success: true, data: newPhoto, message: 'Gallery photo added successfully.' });
  } catch (error) {
    console.error('Error creating gallery photo:', error);
    return NextResponse.json({ success: false, message: 'Failed to add gallery photo' }, { status: 500 });
  }
}
