import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';

import { StoreCreditRowUser } from './StoreCreditRowUser';
import { TourmericStoreCreditData } from '../../models/StoreCredit';

interface Props {
  userId: string;
  creditData: { [key: string]: TourmericStoreCreditData };
}

export default class StoreCreditTableUser extends Component<Props> {

  calculateTotal(creditData: { [key: string]: TourmericStoreCreditData }) {
    let total = 0.0;
    for (const dataItem of Object.values(creditData)) {
      total += dataItem.value;
    }
    return total.toFixed(2);
  }

  render() {
    const { userId, creditData } = this.props;
    const calculatedTotal = this.calculateTotal(creditData);

    return (
      <div key={userId}>
        <table className="table is-bordered is-fullwidth">
          <thead>
            <tr>
              <th><Translate id="date" /></th>
              <th><Translate id="entrymadeby" /></th>
              <th><Translate id="note" /></th>
              <th><Translate id="value" /></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(creditData).map((dataItem) => {
              const dataId = dataItem[0];
              const data = dataItem[1];
              return <StoreCreditRowUser key={`${userId}-${dataId}`} data={data} />;
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3} className="has-text-right">
                <Translate id="total" />
              </th>
              <th>
                {calculatedTotal} €
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

}
