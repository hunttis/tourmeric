import React, { Component } from 'react';
import { FormattedMessage, IntlShape } from "react-intl";

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
              <th><FormattedMessage id="date" /></th>
              <th><FormattedMessage id="entrymadeby" /></th>
              <th><FormattedMessage id="note" /></th>
              <th><FormattedMessage id="value" /></th>
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
                <FormattedMessage id="total" />
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
