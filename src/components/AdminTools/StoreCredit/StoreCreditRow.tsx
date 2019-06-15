import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { TourmericStoreCreditData, StoreCreditCategory, CreditCategories } from '~/models/StoreCredit';

interface Props {
  dataId: string;
  data: TourmericStoreCreditData;
  entryMadeBy: string;
  isAdmin: boolean;
  updateCategory: (entryId: string, newCategory: CreditCategories) => void;
  storecreditcategories: { [key: string]: StoreCreditCategory };
}

export const StoreCreditRow = ({ dataId, data, entryMadeBy, isAdmin, updateCategory, storecreditcategories }: Props) => (
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
