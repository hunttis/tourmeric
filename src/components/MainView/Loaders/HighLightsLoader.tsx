import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { HighLight } from '~/models/ReduxState';

interface Props {
  highlights: { [key: string]: HighLight };
}

export const HighLightsLoader = ({ highlights }: Props) => (
  <span
    className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(highlights) ? 'has-text-success ' : 'has-text-warning'}`}
  >
    - HighLights -
  </span>
);
