import { Moment } from 'moment';
import _ from 'lodash';
import { store } from '~/init-app';
import { ReduxState } from '~/models/ReduxState';
import { createMomentFromDateString } from './Utils';
import { TourmericEvent } from '~/models/Events';

const notNull = <T>(x: T | null): x is T => x !== null;

export const getEventsForDay = (day: Moment): { key: string, value: TourmericEvent }[] => {
  const reduxState: ReduxState = store.getState();

  const { data, profile } = reduxState.firebase;
  const { events } = data;

  const hasDefinedFavorites: boolean = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());

  if (events) {
    const todaysEvents = Object.entries(events).map((eventEntry) => {
      const eventKey = eventEntry[0];
      const eventData = eventEntry[1];

      const isFavorite = !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;

      if (eventData.published && createMomentFromDateString(eventData.date).isSame(day, 'day') && isFavorite) {
        return { key: eventKey, value: eventData };
      }
      return null;
    }).filter(notNull);
    return todaysEvents;
  }
  return [];
};

export const getOngoingEventsForDay = (day: Moment): { key: string, value: TourmericEvent }[] => {
  const reduxState: ReduxState = store.getState();
  const { data, profile } = reduxState.firebase;
  const { eventsongoing } = data;

  const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());

  if (eventsongoing) {
    const todaysOngoingEvents = Object.entries(eventsongoing).map((eventEntry) => {
      const eventKey = eventEntry[0];
      const eventData = eventEntry[1];
      const isFavorite = !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;

      if (eventData.published && eventData.endDate && isFavorite && day.isBetween(createMomentFromDateString(eventData.date), createMomentFromDateString(eventData.endDate), 'day', '[]')) {
        return { key: eventKey, value: eventData };
      }
      return null;
    }).filter(notNull);
    return todaysOngoingEvents;
  }
  return [];
};
