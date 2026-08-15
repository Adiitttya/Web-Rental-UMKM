import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({
      where: { id },
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

    if (!media) {
      return NextResponse.json(
        { success: false, message: 'Media tidak ditemukan.' },
        { status: 404 }
      );
    }

    const usageCount =
      media._count.galleryPhotos +
      media._count.hardwareCovers +
      media._count.gameCovers +
      media._count.eventPosters +
      media._count.branchCovers;

    if (usageCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Media tidak dapat dihapus karena sedang digunakan oleh ${usageCount} entitas data lain.`,
        },
        { status: 400 }
      );
    }

    await prisma.media.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_MEDIA',
      entityName: 'Media',
      entityId: id,
      payload: { filename: media.filename },
    });

    return NextResponse.json({
      success: true,
      message: 'Media berhasil dihapus dari pustaka.',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus media.' },
      { status: 500 }
    );
  }
}
