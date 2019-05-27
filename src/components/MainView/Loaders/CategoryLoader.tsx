import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Category } from '~/models/Category';

interface Props {
  categories: {[key: string]: Category};
}

export const CategoryLoader = ({ categories }: Props) => (
  <span 
    className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(categories) ? 'has-text-success ' : 'has-text-warning'}`}
  >
    - Categories -
  </span>
);
