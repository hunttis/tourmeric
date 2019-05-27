import React from 'react';

import { isLoaded } from 'react-redux-firebase';
import { Participation } from '~/models/ReduxState';

interface Props {
  participations: {[key: string]: Participation}
}

export const ParticipationsLoader = ({ participations }: Props) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(participations) ? 'has-text-success ' : 'has-text-warning'}`}>- Participations - </span>
);
