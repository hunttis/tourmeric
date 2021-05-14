import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import moment from 'moment';
import { Translate } from 'react-localize-redux';
import { History } from 'history';
import {
  StoreCreditCategory, TourmericStoreCreditData,
} from '../../../models/StoreCredit';

interface Props {
  dataId: string;
  storecreditcategories: { [key: string]: StoreCreditCategory };
  data: TourmericStoreCreditData;
  isAdmin: boolean;
  history: History;
}

export const StoreCreditRowEditor = ({ dataId, data, isAdmin, history }: Props) => {
  if (!isLoaded(data)) {
    return <div>Loading</div>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th><Translate id="date" /></th>
          <th><Translate id="entrymadeby" /></th>
          <th><Translate id="note" /></th>
          <th><Translate id="value" /></th>
          {/* <th><Translate id="setcategory" /></th> */}
          {isAdmin &&
          <th><Translate id="edit" /></th>
              }
        </tr>
      </thead>
      <tbody>
        <tr
          className={`${data.category === 'green' &&
      'has-text-success'} ${data.category === 'red' &&
      'has-text-danger'} ${data.category === 'yellow' &&
      'has-text-warning'} ${data.category === 'blue' && 'has-text-info'}`}
        >
          {/* {isAdmin && <td className="is-size-7">{dataId}</td>} */}
          <td>{moment(data.date).format('DD-MM-YYYY - hh:mm')}</td>
          <td>{data.creditAddedByName}</td>
          <td>{data.note}</td>
          <td
            className={`${data.value > 0 ? 'has-text-success' : 'has-text-danger'}`}
          >
            {data.value} €
          </td>
          {/* <td>
      <span onClick={() => updateCategory(dataId, '')}>
        <i className="far fa-times-circle has-text-white" />
      </span>
      {_.get(storecreditcategories, 'green', false) && (
        <span onClick={() => updateCategory(dataId, 'green')}>
          <i className="fas fa-circle has-text-success" />
        </span>
      )}
      {_.get(storecreditcategories, 'red', false) && (
        <span onClick={() => updateCategory(dataId, 'red')}>
          <i className="fas fa-circle has-text-danger" />
        </span>
      )}
      {_.get(storecreditcategories, 'yellow', false) && (
        <span onClick={() => updateCategory(dataId, 'yellow')}>
          <i className="fas fa-circle has-text-warning" />
        </span>
      )}
      {_.get(storecreditcategories, 'blue', false) && (
        <span onClick={() => updateCategory(dataId, 'blue')}>
          <i className="fas fa-circle has-text-info" />
        </span>
      )}
    </td> */}
          {isAdmin && <td className="has-text-centered"><button className="button is-small" onClick={() => history.push(`/admin/tools/storecreditrow/${dataId}`)}><i className="fas fa-pencil-alt" /></button></td>}
        </tr>
      </tbody>
    </table>
  );
};
