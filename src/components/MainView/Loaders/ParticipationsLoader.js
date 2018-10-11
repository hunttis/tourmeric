import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';

export const ParticipationsLoader = ({ participations }) => (
  <span className={`${isLoaded(participations) ? 'has-text-success ' : 'has-text-warning'}`}>- Participations - </span>
);

ParticipationsLoader.propTypes = {
  participations: PropTypes.object,
};
