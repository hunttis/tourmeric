import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Article } from '../../../models/ReduxState';

interface Props {
  articles: { [key: string]: Article };
}

export const ArticleLoader = ({ articles }: Props) => (
  <span
    className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(articles) ? 'has-text-success ' : 'has-text-warning'}`}
  >
    - Articles -
  </span>
);
