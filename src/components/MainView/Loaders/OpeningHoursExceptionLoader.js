import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';

export const OpeningHoursExceptionLoader = ({ openinghoursexceptions }) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(openinghoursexceptions) ? 'has-text-success ' : 'has-text-warning'}`}>- Opening Hours Exceptions - </span>
);

OpeningHoursExceptionLoader.propTypes = {
  openinghoursexceptions: PropTypes.object,
};
