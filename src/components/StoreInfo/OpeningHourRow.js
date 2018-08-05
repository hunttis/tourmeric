import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

export const OpeningHourRow = ({ settings, dayName }) => {
  const { openingHours } = settings;
  const storeIsOpen = !_.isEmpty(openingHours[dayName.toLowerCase()]);

  if (!storeIsOpen) {
    return (
      <tr>
        <td>{dayName}</td>
        <td><Translate id="closed" /></td>
      </tr>
    );
  }
  if (storeIsOpen) {
    return (
      <tr>
        <td>{dayName}</td>
        <td>{openingHours[dayName.toLowerCase()]}</td>
      </tr>
    );
  }
  return (
    <tr>
      <td><Translate id="error" /></td>
    </tr>
  );
};

OpeningHourRow.propTypes = {
  settings: PropTypes.object,
  dayName: PropTypes.string,
};
