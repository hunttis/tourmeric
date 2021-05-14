import React from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';
import { StoreCreditCategory } from '../../../models/StoreCredit';

interface Props {
  storecreditcategories: { [key: string]: StoreCreditCategory };
}

export const StoreCreditCategoryLoader = ({ storecreditcategories }: Props) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(storecreditcategories) ? 'has-text-success ' : 'has-text-warning'}`}>- StoreCreditCategories - </span>
);

StoreCreditCategoryLoader.propTypes = {
  storecreditcategories: PropTypes.object,
};
