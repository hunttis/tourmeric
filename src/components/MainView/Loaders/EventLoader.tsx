import React from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { TourmericEvent } from '~/models/Events';

interface Props {
  events: { [key: string]: TourmericEvent };
  eventsongoing: { [key: string]: TourmericEvent };
}

export const EventLoader = ({ events, eventsongoing }: Props) => (
  <>
    <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(events) ? 'has-text-success ' : 'has-text-warning'}`}>- Events: {isLoaded(events) && !isEmpty(events) ? Object.keys(events).length : 'x'} - </span>
    <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(eventsongoing) ? 'has-text-success ' : 'has-text-warning'}`}>- Ongoing Events: {isLoaded(eventsongoing) && !isEmpty(eventsongoing) ? Object.keys(eventsongoing).length : 'x'} - </span>
  </>
);
