import { EventItem } from '@/data/mock-landing';

/**
 * Determines whether an event is NEW / UPCOMING dynamically based on start date & admin settings.
 * 
 * Logic:
 * 1. If `isNew` is explicitly set to `false` by admin, returns `false`.
 * 2. If `startDate` is specified (e.g. '2026-09-15'):
 *    - If current date (`now`) is BEFORE `startDate`, the event is UPCOMING / NEW -> returns `true`.
 *    - If current date (`now`) is on or after `startDate` (or `endDate`), NEW pin expires -> returns `false`.
 * 3. Fallback: Returns `evt.isNew ?? true`.
 */
export const isEventNewOrUpcoming = (evt: Partial<EventItem>): boolean => {
  if (evt.isNew === false) {
    return false;
  }

  if (evt.startDate) {
    const start = new Date(evt.startDate);
    if (!isNaN(start.getTime())) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);

      // If current date is strictly before start date -> Event is NEW / UPCOMING
      if (now < start) {
        return true;
      }
      
      // Once current date reaches or passes start date -> NEW pin & dot expire
      return false;
    }
  }

  return evt.isNew ?? true;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Formats event start date and end date into a readable string (e.g. '15 - 20 Sep 2026').
 */
export const formatEventTimeRange = (
  startDate?: Date | string | null,
  endDate?: Date | string | null,
  eventDate?: Date | string | null
): string => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const single = eventDate ? new Date(eventDate) : null;

  const validStart = start && !isNaN(start.getTime()) ? start : null;
  const validEnd = end && !isNaN(end.getTime()) ? end : null;
  const validSingle = single && !isNaN(single.getTime()) ? single : null;

  if (validStart && validEnd) {
    const startYear = validStart.getUTCFullYear();
    const startMonthIdx = validStart.getUTCMonth();
    const startMonth = MONTH_NAMES[startMonthIdx];
    const startDay = String(validStart.getUTCDate()).padStart(2, '0');

    const endYear = validEnd.getUTCFullYear();
    const endMonthIdx = validEnd.getUTCMonth();
    const endMonth = MONTH_NAMES[endMonthIdx];
    const endDay = String(validEnd.getUTCDate()).padStart(2, '0');

    const isSameDay = startYear === endYear && startMonthIdx === endMonthIdx && startDay === endDay;

    if (isSameDay) {
      const startTimeStr = `${String(validStart.getUTCHours()).padStart(2, '0')}:${String(validStart.getUTCMinutes()).padStart(2, '0')}`;
      const endTimeStr = `${String(validEnd.getUTCHours()).padStart(2, '0')}:${String(validEnd.getUTCMinutes()).padStart(2, '0')}`;

      if (startTimeStr !== '00:00' || endTimeStr !== '00:00') {
        return `${startDay} ${startMonth} ${startYear}, ${startTimeStr} - ${endTimeStr} WIB`;
      }
      return `${startDay} ${startMonth} ${startYear}`;
    } else {
      if (startMonthIdx === endMonthIdx && startYear === endYear) {
        return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
      } else if (startYear === endYear) {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
      } else {
        return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
      }
    }
  }

  const targetDate = validStart || validSingle;
  if (targetDate) {
    const day = String(targetDate.getUTCDate()).padStart(2, '0');
    const month = MONTH_NAMES[targetDate.getUTCMonth()];
    const year = targetDate.getUTCFullYear();
    return `${day} ${month} ${year}`;
  }

  return 'Setiap Hari';
};
