import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';

export const UsersLoader = ({ users }) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(users) ? 'has-text-success ' : 'has-text-warning'}`}>- Users - </span>
);

UsersLoader.propTypes = {
  users: PropTypes.object,
};
