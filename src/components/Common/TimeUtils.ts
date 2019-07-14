import { extendMoment } from 'moment-range';
import moment, { Moment } from 'moment/min/moment-with-locales';

const momentRange = extendMoment(moment as any);

export function doDateRangesOverlap(startDate: Moment, endDate: Moment, secondStart: Moment, secondEnd: Moment): boolean {
  const firstRange = momentRange.range(startDate, endDate);
  const secondRange = momentRange.range(secondStart, secondEnd);

  return firstRange.overlaps(secondRange);
}
