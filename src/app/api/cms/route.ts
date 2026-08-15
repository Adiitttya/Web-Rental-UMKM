import { NextResponse } from 'next/server';
import { parseGoogleMapsInput } from '@/utils/mapsParser';
import { landingService } from '@/services/landing.service';

// Security headers helper
const createSecureResponse = (data: unknown, status: number = 200) => {
  const response = NextResponse.json(data, { status });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
};

// GET /api/cms - Retrieve dynamic CMS data from database across all 10 landing page data domains
export async function GET() {
  try {
    const fullData = await landingService.getFullLandingData();
    return createSecureResponse(fullData);
  } catch (error) {
    console.error('Error fetching CMS data:', error);
    return createSecureResponse({ error: 'Database service unavailable' }, 500);
  }
}

// POST /api/cms/parse-map - Extract location data from Google Maps URL or embed
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.url) {
      return createSecureResponse({ error: 'URL Google Maps wajib diisi.' }, 400);
    }

    const parsed = parseGoogleMapsInput(body.url);
    return createSecureResponse({
      message: 'Maps link parsed successfully',
      data: parsed,
    });
  } catch {
    return createSecureResponse({ error: 'Gagal memproses link Google Maps.' }, 500);
  }
}
