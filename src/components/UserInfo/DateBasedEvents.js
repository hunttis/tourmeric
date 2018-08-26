import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import EventParticipation from './EventParticipation-container';

export const DateBasedEvents = ({ title, events }) => (
  <div>
    <h1 className="title"><Translate id={title} /></h1>
    {Object.entries(events).map((eventEntry) => {
      const eventId = eventEntry[1].key;
      return <EventParticipation key={`usereventlist-${eventId}`} eventEntry={eventEntry[1]} />;
    })}
  </div>
);

DateBasedEvents.propTypes = {
  title: PropTypes.string,
  events: PropTypes.array,
};
