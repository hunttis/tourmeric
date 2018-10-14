import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export const StoreCreditRow = ({ dataId, data, entryMadeBy, isAdmin, updateCategory }) => (
  <tr className={`${data.category === 'green' && 'has-text-success'} ${data.category === 'red' && 'has-text-danger'} ${data.category === 'yellow' && 'has-text-warning'} ${data.category === 'blue' && 'has-text-info'}`}>
    {isAdmin &&
      <td className="is-size-7">{dataId}</td>
    }
    <td>{moment(data.date).format('DD-MM-YYYY - hh:mm')}</td>
    <td>{entryMadeBy}</td>
    <td>{data.note}</td>
    <td className={`${data.value > 0 ? 'has-text-success' : 'has-text-danger'}`}>{data.value} €</td>
    <td>
      <span onClick={() => updateCategory(dataId, '')}>
        <i className="fas fa-circle has-text-white" />
      </span>
      <span onClick={() => updateCategory(dataId, 'green')}>
        <i className="fas fa-circle has-text-success" />
      </span>
      <span onClick={() => updateCategory(dataId, 'red')}>
        <i className="fas fa-circle has-text-danger" />
      </span>
      <span onClick={() => updateCategory(dataId, 'yellow')}>
        <i className="fas fa-circle has-text-warning" />
      </span>
      <span onClick={() => updateCategory(dataId, 'blue')}>
        <i className="fas fa-circle has-text-info" />
      </span>
    </td>
  </tr>
);

StoreCreditRow.propTypes = {
  dataId: PropTypes.string,
  data: PropTypes.object,
  entryMadeBy: PropTypes.string,
  isAdmin: PropTypes.bool,
  updateCategory: PropTypes.func,
};
