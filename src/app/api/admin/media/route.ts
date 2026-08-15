import { NextRequest, NextResponse } from 'next/server';
import { prisma, getWibDate } from '@/lib/prisma';
import { MediaFileType } from '@prisma/client';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {
      deletedAt: null,
    };

    if (folder && folder !== 'all') {
      where.folder = folder;
    }

    if (type && type !== 'all') {
      where.fileType = type.toUpperCase() as MediaFileType;
    }

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const mediaList = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            galleryPhotos: true,
            hardwareCovers: true,
            gameCovers: true,
            eventPosters: true,
            branchCovers: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: mediaList,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat daftar media library.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { filename, url, mimeType, fileType, sizeBytes, width, height, altText, folder } = body;

    if (!filename || !url) {
      return NextResponse.json(
        { success: false, message: 'Nama file dan URL media wajib diisi.' },
        { status: 400 }
      );
    }

    const wibNow = getWibDate();

    const newMedia = await prisma.media.create({
      data: {
        filename: filename.trim(),
        url: url.trim(),
        mimeType: mimeType?.trim() || 'image/jpeg',
        fileType: (fileType?.toUpperCase() as MediaFileType) || MediaFileType.IMAGE,
        sizeBytes: Number(sizeBytes) || 1024 * 150,
        width: width ? Number(width) : null,
        height: height ? Number(height) : null,
        altText: altText?.trim() || filename.trim(),
        folder: folder?.trim() || 'general',
        uploadedById: session?.userId || null,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPLOAD_MEDIA',
      entityName: 'Media',
      entityId: newMedia.id,
      payload: { filename: newMedia.filename, url: newMedia.url },
    });

    return NextResponse.json({
      success: true,
      data: newMedia,
      message: 'Media berhasil ditambahkan ke pustaka media terpusat.',
    });
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan media ke pustaka.' },
      { status: 500 }
    );
  }
}
