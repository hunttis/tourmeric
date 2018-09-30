import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';

export const EventLoader = ({ events }) => (
  <div className="is-hidden">{`${isLoaded(events) ? 'Events loaded' : 'Events not loaded'}`}</div>
);

EventLoader.propTypes = {
  events: PropTypes.object,
};
