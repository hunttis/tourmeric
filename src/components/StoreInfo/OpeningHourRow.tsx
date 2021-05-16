import React from 'react';
import { FormattedMessage } from "react-intl";
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
        <td><FormattedMessage id={dayName} /></td>
        <td><FormattedMessage id="closed" /></td>
      </tr>
    );
  }
  if (storeIsOpen) {
    return (
      <tr>
        <td><FormattedMessage id={dayName} /></td>
        <td>{openingHours![dayName as keyof OpeningHours]}</td>
      </tr>
    );
  }
  return (
    <tr>
      <td><FormattedMessage id="error" /></td>
    </tr>
  );
};
