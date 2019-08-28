import _ from 'lodash';
import { Day } from '~/models/Calendar';
import { TourmericEvent } from '~/models/Events';

import moment = require('moment');

export function filterEventsByPublishedStatus(events: { key: string, value: TourmericEvent }[]) {
  return events.filter(event => event.value.published);
}

export function filterEventsByCategory(events: { key: string, value: TourmericEvent }[], categoryFilter: string[]) {
  if (_.isEmpty(categoryFilter)) {
    return events;
  }

  const filteredEvents = events.filter(event => _.includes(categoryFilter, event.value.category));
  return filteredEvents;
}

export function parseInformationForMonthYear(month: string, year: string, filteredEvents: { key: string, value: TourmericEvent }[], filteredEventsongoing: { key: string, value: TourmericEvent}[]) {

  const targetMonth = moment(`${month}-${year}`, 'MM-YYYY');
  const dayCount = targetMonth.daysInMonth();
  const days: Day[] = [];


  for (let i = 1; i <= dayCount; i += 1) {
    const dayString = `${_.padStart(`${i}`, 2, '0')}-${targetMonth.format('MM-YYYY')}`;
    const day = moment(dayString, 'DD-MM-YYYY');
    const dayStringInEventFormat = moment(dayString, 'DD-MM-YYYY').format(
      'YYYY-MM-DD',
    );
    const eventsForDay = filteredEvents.filter(
      eventEntry => eventEntry.value.date === dayStringInEventFormat,
    );
    const eventsOnGoing = filteredEventsongoing.filter((eventEntry) => {
      if (eventEntry.value.endDate) {
        return day.isBetween(
          moment(eventEntry.value.date, 'YYYY-MM-DD'),
          moment(eventEntry.value.endDate, 'YYYY-MM-DD'),
          'day',
          '[]',
        );
      }
      return false;
    });


    days.push({
      day: day.format('DD'),
      dayOfWeek: parseInt(day.format('d'), 10),
      dayName: day.format('dddd'),
      dayString: day.format('DD-MMMM-YYYY'),
      dayLink: day.format('YYYY/MM/DD'),
      eventsForDay,
      ongoingEventsForDay: eventsOnGoing,
    });
  }

  let emptyDays = (days[0].dayOfWeek! % 7) - 1;
  if (emptyDays === -1) {
    emptyDays = 6;
  }

  const calendar: Day[] = [];
  for (let i = 0; i < emptyDays; i += 1) {
    calendar.push({ empty: true });
  }
  _.forEach(days, day => calendar.push(day));
  return calendar;
}
