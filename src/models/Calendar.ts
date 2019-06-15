import { TourmericEvent } from './Events';

export interface Day {
  day?: string;
  dayOfWeek?: number;
  dayName?: string;
  dayString?: string;
  dayLink?: string;
  empty?: boolean;
  eventsForDay?: { key: string, value: TourmericEvent }[];
  ongoingEventsForDay?: { key: string, value: TourmericEvent }[];
}
