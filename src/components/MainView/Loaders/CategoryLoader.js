import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';

export const CategoryLoader = ({ categories }) => (
  <span className={`${isLoaded(categories) ? 'has-text-success ' : 'has-text-warning'}`}>- Categories - </span>
);

CategoryLoader.propTypes = {
  categories: PropTypes.object,
};
