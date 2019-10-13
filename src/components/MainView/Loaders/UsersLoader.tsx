import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';
import { User } from 'firebase';

interface Props {
  users: { [key: string]: User };
}

export const UsersLoader = ({ users }: Props) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(users) ? 'has-text-success ' : 'has-text-warning'}`}>- Users - </span>
);

UsersLoader.propTypes = {
  users: PropTypes.object,
};
