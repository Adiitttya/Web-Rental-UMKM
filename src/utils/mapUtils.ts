/**
 * Utility functions for parsing Google Maps URLs and coordinates.
 */

export interface ParsedCoordinates {
  latitude: number | null;
  longitude: number | null;
}

/**
 * Extracts latitude and longitude from Google Maps URLs or manual strings.
 * Supports patterns:
 * - @lat,lng,zoom
 * - ?q=lat,lng
 * - ?ll=lat,lng
 * - query=lat,lng
 * - direct string "lat, lng"
 */
export function parseCoordinatesFromInput(input: string): ParsedCoordinates {
  if (!input || typeof input !== 'string') {
    return { latitude: null, longitude: null };
  }

  const trimmed = input.trim();

  // Pattern 1: Direct numbers format, e.g. "-7.133860, 110.398851" or "-7.133860 110.398851"
  const directMatch = trimmed.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
  if (directMatch) {
    const lat = parseFloat(directMatch[1]);
    const lng = parseFloat(directMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { latitude: lat, longitude: lng };
    }
  }

  // Pattern 2: URL containing @latitude,longitude, e.g. https://www.google.com/maps/@-7.133860,110.398851,17z
  const atMatch = trimmed.match(/@([-+]?\d{1,2}\.\d+),([-+]?\d{1,3}\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // Pattern 3: URL containing ?q=lat,lng or ?ll=lat,lng or destination=lat,lng
  const paramMatch = trimmed.match(/[?&](?:q|ll|query|destination|center|point)=([-+]?\d{1,2}\.\d+)[,%2C\s]+([-+]?\d{1,3}\.\d+)/i);
  if (paramMatch) {
    const lat = parseFloat(paramMatch[1]);
    const lng = parseFloat(paramMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // Pattern 4: Embedded coordinate string inside query parameters
  const generalMatch = trimmed.match(/([-+]?\d{1,2}\.\d{4,})[,\s]+([-+]?\d{1,3}\.\d{4,})/);
  if (generalMatch) {
    const lat = parseFloat(generalMatch[1]);
    const lng = parseFloat(generalMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { latitude: lat, longitude: lng };
    }
  }

  return { latitude: null, longitude: null };
}

/**
 * Generate Google Maps embed URL from latitude & longitude
 */
export function getEmbedUrl(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
}
