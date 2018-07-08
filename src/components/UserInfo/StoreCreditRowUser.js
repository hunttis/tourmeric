import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export const StoreCreditRowUser = ({ data }) => (
  <tr>
    <td>{moment(data.date).format('DD-MM-YYYY - hh:mm')}</td>
    <td>{data.creditAddedByName}</td>
    <td>{data.note}</td>
    <td className={`${data.value > 0 ? 'has-text-success' : 'has-text-danger'}`}>{data.value} €</td>
  </tr>
);

StoreCreditRowUser.propTypes = {
  data: PropTypes.object,
};
