import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export const StoreCreditRow = ({ dataId, data, entryMadeBy, isAdmin }) => (
  <tr>
    {isAdmin &&
      <td className="is-size-7">{dataId}</td>
    }
    <td>{moment(data.date).format('DD-MM-YYYY - hh:mm')}</td>
    <td>{entryMadeBy}</td>
    <td>{data.note}</td>
    <td className={`${data.value > 0 ? 'has-text-success' : 'has-text-danger'}`}>{data.value} €</td>
  </tr>
);

StoreCreditRow.propTypes = {
  dataId: PropTypes.string,
  data: PropTypes.object,
  entryMadeBy: PropTypes.string,
  isAdmin: PropTypes.bool,
};
