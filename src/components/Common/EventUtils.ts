import { Moment } from 'moment';
import _ from 'lodash';
import { store } from '../../init-app';
import { ReduxState } from '../../models/ReduxState';
import { createMomentFromDateString, createDateFromDateString } from './Utils';
import { TourmericEvent } from '../../models/Events';
import { isSameDay, isWithinInterval } from 'date-fns';

const notNull = <T>(x: T | null): x is T => x !== null;

export const getEventsForDay = (day: Date, returnAllNotJustFavorites = false): { key: string, value: TourmericEvent }[] => {
  const reduxState: ReduxState = store.getState();

  const { data, profile } = reduxState.firebase;
  const { events } = data;

  const hasDefinedFavorites: boolean = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());

  if (events) {
    const todaysEvents = Object.entries(events).map((eventEntry) => {
      const eventKey = eventEntry[0];
      const eventData = eventEntry[1];

      const isFavorite = returnAllNotJustFavorites || !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;

      const eventDate = createDateFromDateString(eventData.date)
      if (eventData.published && isSameDay(day, eventDate) && isFavorite) {
        return { key: eventKey, value: eventData };
      }
      return null;
    }).filter(notNull);
    return todaysEvents;
  }
  return [];
};

export const getOngoingEventsForDay = (day: Date, returnAllNotJustFavorites = false): { key: string, value: TourmericEvent }[] => {
  const reduxState: ReduxState = store.getState();
  const { data, profile } = reduxState.firebase;
  const { eventsongoing } = data;

  const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());

  if (eventsongoing) {
    const todaysOngoingEvents = Object.entries(eventsongoing).map((eventEntry) => {
      const eventKey = eventEntry[0];
      const eventData = eventEntry[1];
      const isFavorite = returnAllNotJustFavorites || !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;

      const eventStartDate = createDateFromDateString(eventData.date)
      if (!eventData.endDate) {
        return null;
      }
      const eventEndDate = createDateFromDateString(eventData.endDate)

      // TODO Write with filter
      if (eventData.published && eventData.endDate && isFavorite && isWithinInterval(day, {start: eventStartDate, end: eventEndDate})) {
        return { key: eventKey, value: eventData };
      }
      return null;
    }).filter(notNull);
    return todaysOngoingEvents;
  }
  return [];
};
