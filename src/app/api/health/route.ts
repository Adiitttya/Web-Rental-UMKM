import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'Disconnected';
  let latencyMs = 0;
  let errorDetail: string | null = null;

  try {
    // Perform simple query to measure real database ping & latency
    await prisma.$queryRaw`SELECT 1`;
    latencyMs = Date.now() - startTime;
    dbStatus = 'Connected';
  } catch (err: unknown) {
    dbStatus = 'Error';
    errorDetail = err instanceof Error ? err.message : 'Database query failed';
    latencyMs = Date.now() - startTime;
  }

  const payload = {
    status: dbStatus === 'Connected' ? 'operational' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      web: {
        status: 'online',
        uptime: process.uptime(),
      },
      database: {
        status: dbStatus,
        latencyMs,
        error: errorDetail,
      },
      storage: {
        status: 'connected',
        driver: 'local/supabase',
      },
    },
  };

  return NextResponse.json(payload, {
    status: dbStatus === 'Connected' ? 200 : 503,
  });
}
