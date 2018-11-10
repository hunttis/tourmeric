import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

export const StoreCreditRow = ({ dataId, data, entryMadeBy, isAdmin, updateCategory, storecreditcategories }) => (
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
        <i className="far fa-times-circle has-text-white" />
      </span>
      {_.get(storecreditcategories, 'green', false) &&
        <span onClick={() => updateCategory(dataId, 'green')}>
          <i className="fas fa-circle has-text-success" />
        </span>
      }
      {_.get(storecreditcategories, 'red', false) &&
        <span onClick={() => updateCategory(dataId, 'red')}>
          <i className="fas fa-circle has-text-danger" />
        </span>
      }
      {_.get(storecreditcategories, 'yellow', false) &&
        <span onClick={() => updateCategory(dataId, 'yellow')}>
          <i className="fas fa-circle has-text-warning" />
        </span>
      }
      {_.get(storecreditcategories, 'blue', false) &&
        <span onClick={() => updateCategory(dataId, 'blue')}>
          <i className="fas fa-circle has-text-info" />
        </span>
      }
    </td>
  </tr>
);

StoreCreditRow.propTypes = {
  dataId: PropTypes.string,
  data: PropTypes.object,
  entryMadeBy: PropTypes.string,
  isAdmin: PropTypes.bool,
  updateCategory: PropTypes.func,
  storecreditcategories: PropTypes.object,
};
