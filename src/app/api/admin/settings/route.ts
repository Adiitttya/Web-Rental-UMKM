import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const settings = await prisma.systemSetting.findMany();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { settings } = body; // Record<string, string>

    if (settings && typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: {
            key,
            value: String(value),
            group: 'general',
          },
        });
      }

      await logActivity({
        userId: session?.userId,
        action: 'UPDATE_SYSTEM_SETTINGS',
        entityName: 'SystemSetting',
        payload: settings,
      });
    }

    revalidatePath('/');
    revalidatePath('/contact');
    return NextResponse.json({ success: true, message: 'System settings updated successfully.' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
