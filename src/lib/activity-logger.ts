import { prisma } from './prisma';

export interface LogActivityParams {
  userId?: string | null;
  action: string;
  entityName: string;
  entityId?: string | null;
  payload?: Record<string, unknown> | string | null;
  ipAddress?: string | null;
}

export async function logActivity({
  userId,
  action,
  entityName,
  entityId,
  payload,
  ipAddress,
}: LogActivityParams): Promise<void> {
  try {
    const payloadString =
      payload && typeof payload === 'object'
        ? JSON.stringify(payload)
        : typeof payload === 'string'
        ? payload
        : null;

    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        entityName,
        entityId: entityId || null,
        payload: payloadString,
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
}
