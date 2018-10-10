import React from 'react';
import PropTypes from 'prop-types';
import EventCard from './EventCard-container';

export const SingleEvent = ({ match }) => (
  <div>
    <EventCard eventId={match.params.id} />
  </div>
);

SingleEvent.propTypes = {
  match: PropTypes.object,
};
