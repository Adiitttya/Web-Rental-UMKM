import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json(
        { success: false, message: 'Path revalidasi wajib disertakan.' },
        { status: 400 }
      );
    }

    if (path === 'ALL') {
      revalidatePath('/', 'layout');
    } else {
      revalidatePath(path);
    }

    await logActivity({
      userId: session?.userId,
      action: 'CACHE_REVALIDATE',
      entityName: 'System',
      payload: { path },
    });

    return NextResponse.json({
      success: true,
      message: `Cache ISR untuk rute "${path}" berhasil di-revalidasi secara instan.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating cache:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal melakukan revalidasi cache sistem.' },
      { status: 500 }
    );
  }
}
