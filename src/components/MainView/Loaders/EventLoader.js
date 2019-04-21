import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isLoaded, isEmpty } from 'react-redux-firebase';

export const EventLoader = ({ events, eventsongoing }) => (
  <Fragment>
    <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(events) ? 'has-text-success ' : 'has-text-warning'}`}>- Events: {isLoaded(events) && !isEmpty(events) ? Object.keys(events).length : 'x'} - </span>
    <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(eventsongoing) ? 'has-text-success ' : 'has-text-warning'}`}>- Ongoing Events: {isLoaded(eventsongoing) && !isEmpty(eventsongoing) ? Object.keys(eventsongoing).length : 'x'} - </span>
  </Fragment>
);

EventLoader.propTypes = {
  events: PropTypes.object,
  eventsongoing: PropTypes.object,
};
