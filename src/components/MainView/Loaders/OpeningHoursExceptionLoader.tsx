import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { OpeningHoursException } from '../../../models/OpeningHours';

interface Props {
  openinghoursexceptions: { [key: string]: OpeningHoursException };
}

export const OpeningHoursExceptionLoader = ({ openinghoursexceptions }: Props) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(openinghoursexceptions) ? 'has-text-success ' : 'has-text-warning'}`}>- Opening Hours Exceptions - </span>
);
