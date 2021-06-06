import React from 'react';
import { FormattedMessage, IntlShape } from "react-intl";
import EventParticipation from './EventParticipation-container';
import { TourmericEvent } from '../../models/Events';

interface Props {
  title: string;
  events: { key: string, value: TourmericEvent }[];
}

export const DateBasedEvents = ({ title, events }: Props) => (
  <div>
    <h1 className="title"><FormattedMessage id={title} /></h1>
    {Object.entries(events).map((eventEntry) => {
      const eventId = eventEntry[1].key;
      return <EventParticipation key={`usereventlist-${eventId}`} eventEntry={eventEntry[1]} />;
    })}
  </div>
);
