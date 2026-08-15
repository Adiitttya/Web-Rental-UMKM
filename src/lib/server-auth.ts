import { NextResponse } from 'next/server';
import { getSession, SessionPayload } from './auth';

export async function verifyAdminRole(): Promise<{ session: SessionPayload | null; response?: NextResponse }> {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized: Session missing or expired.' },
        { status: 401 }
      ),
    };
  }

  if (session.role !== 'ADMIN') {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient privileges.' },
        { status: 403 }
      ),
    };
  }

  return { session };
}
