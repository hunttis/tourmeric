import React from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { Settings, OpeningHours } from '../../models/Settings';

interface Props {
  settings: Settings;
  dayName: keyof OpeningHours;
}

export const OpeningHourRow = ({ settings, dayName }: Props) => {
  const { openingHours } = settings;
  const storeIsOpen = !_.isEmpty(openingHours![dayName as keyof OpeningHours]);

  if (!storeIsOpen) {
    return (
      <tr>
        <td><Translate id={dayName} /></td>
        <td><Translate id="closed" /></td>
      </tr>
    );
  }
  if (storeIsOpen) {
    return (
      <tr>
        <td><Translate id={dayName} /></td>
        <td>{openingHours![dayName as keyof OpeningHours]}</td>
      </tr>
    );
  }
  return (
    <tr>
      <td><Translate id="error" /></td>
    </tr>
  );
};
