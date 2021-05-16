import _ from "lodash";
import { Day } from "../../../models/Calendar";
import { TourmericEvent } from "../../../models/Events";
import { parse, getDaysInMonth, format, isWithinInterval } from "date-fns";

// import moment = require('moment');

export function filterEventsByPublishedStatus(
  events: { key: string; value: TourmericEvent }[]
) {
  if (events) {
    return events.filter((event) => event.value.published);
  }
  return [];
}

export function filterEventsByCategory(
  events: { key: string; value: TourmericEvent }[],
  categoryFilter: string[]
) {
  if (_.isEmpty(categoryFilter)) {
    return events;
  }

  const filteredEvents = events.filter((event) =>
    _.includes(categoryFilter, event.value.category)
  );
  return filteredEvents;
}

export function parseInformationForMonthYear(
  month: string,
  year: string,
  events: { key: string; value: TourmericEvent }[],
  eventsOngoing: { key: string; value: TourmericEvent }[],
  categoryFilter: string[]
) {
  const filteredEvents = filterEventsByCategory(
    filterEventsByPublishedStatus(events),
    categoryFilter
  );
  const filteredEventsongoing = filterEventsByCategory(
    filterEventsByPublishedStatus(eventsOngoing),
    categoryFilter
  );

  const targetMonth = parse(`${month}-${year}`, "MM-yyyy", new Date());
  const dayCount = getDaysInMonth(targetMonth);
  const days: Day[] = [];

  for (let i = 1; i <= dayCount; i += 1) {
    const dayString = `${_.padStart(`${i}`, 2, "0")}-${format(
      targetMonth,
      "MM-yyyy"
    )}`;
    const day = parse(dayString, "dd-MM-yyyy", new Date());
    const dayStringInEventFormat = format(day, "yyyy-MM-dd");

    const eventsForDay = filteredEvents
      ? filteredEvents.filter(
          (eventEntry) => eventEntry.value.date === dayStringInEventFormat
        )
      : [];

    const eventsOnGoing = filteredEventsongoing
      ? filteredEventsongoing.filter((eventEntry) => {
          if (eventEntry.value.endDate) {
            // TODO Move this row to separate filter
            const eventStart = parse(
              eventEntry.value.date,
              "yyyy-MM-dd",
              new Date()
            );
            const eventEnd = parse(
              eventEntry.value.endDate,
              "yyyy-MM-dd",
              new Date()
            );
            const isValid = isWithinInterval(day, {
              start: eventStart,
              end: eventEnd,
            });
            return isValid;
          }
          return false;
        })
      : [];

    days.push({
      day: format(day, "dd"),
      dayOfWeek: parseInt(format(day, "d"), 10),
      dayName: format(day, "dddd"),
      dayString: format(day, "dd-MMMM-yyyy"),
      dayLink: format(day, "yyyy/MM/dd"),
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
  _.forEach(days, (day) => calendar.push(day));
  return calendar;
}
