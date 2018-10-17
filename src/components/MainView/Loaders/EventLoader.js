import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';

export const EventLoader = ({ events }) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(events) ? 'has-text-success ' : 'has-text-warning'}`}>- Events - </span>
);

EventLoader.propTypes = {
  events: PropTypes.object,
};
