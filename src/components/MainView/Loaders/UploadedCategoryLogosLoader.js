import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';

export const UploadedCategoryLogosLoader = ({ uploadedCategoryLogos }) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(uploadedCategoryLogos) ? 'has-text-success ' : 'has-text-warning'}`}>- UploadedCategoryLogos - </span>
);

UploadedCategoryLogosLoader.propTypes = {
  uploadedCategoryLogos: PropTypes.object,
};
