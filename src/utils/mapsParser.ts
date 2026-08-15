/**
 * Google Maps Link Parser Utility
 * Parses Google Maps share links, place links, iframe embed tags, and raw coordinates
 * to extract embed URL, latitude, longitude, and optional address/name hints.
 */

export interface ParsedMapData {
  embedUrl: string;
  mapUrl: string;
  lat?: number;
  lng?: number;
  addressHint?: string;
  nameHint?: string;
}

export function parseGoogleMapsInput(input: string): ParsedMapData {
  const trimmed = input.trim();
  let embedUrl = '';
  const mapUrl = trimmed;
  let lat: number | undefined;
  let lng: number | undefined;
  let addressHint: string | undefined;
  let nameHint: string | undefined;

  // 1. If input is an iframe string, extract the src attribute
  if (trimmed.toLowerCase().includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      embedUrl = srcMatch[1];
    }
  }

  // 2. Extract latitude and longitude if present in @lat,lng format
  const atCoordsMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atCoordsMatch) {
    lat = parseFloat(atCoordsMatch[1]);
    lng = parseFloat(atCoordsMatch[2]);
  }

  // 3. Extract latitude and longitude from q=lat,lng or ll=lat,lng
  if (!lat || !lng) {
    const qCoordsMatch = trimmed.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qCoordsMatch) {
      lat = parseFloat(qCoordsMatch[1]);
      lng = parseFloat(qCoordsMatch[2]);
    }
  }

  // 4. Extract place name or address from place URL path (e.g. /place/Gedongsongo+Ungaran/...)
  const placeMatch = trimmed.match(/\/place\/([^/@?]+)/);
  if (placeMatch && placeMatch[1]) {
    const rawPlace = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    addressHint = rawPlace;
  }

  // 5. Construct fallback embed URL if not already an embed URL
  if (trimmed.includes('maps.google.com/maps') || trimmed.includes('google.com/maps/embed')) {
    if (trimmed.includes('output=embed') || trimmed.includes('/embed')) {
      embedUrl = trimmed;
    }
  }

  if (!embedUrl && lat !== undefined && lng !== undefined) {
    embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  } else if (!embedUrl && addressHint) {
    embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressHint)}&z=17&output=embed`;
  } else if (!embedUrl) {
    embedUrl = `https://maps.google.com/maps?q=-7.133860,110.398851&z=17&output=embed`;
  }

  return {
    embedUrl,
    mapUrl: mapUrl.startsWith('<iframe') ? embedUrl : mapUrl,
    lat,
    lng,
    addressHint,
    nameHint,
  };
}
