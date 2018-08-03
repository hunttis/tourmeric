import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { StoreCreditRowUser } from './StoreCreditRowUser';

export default class StoreCreditTableUser extends Component {

  calculateTotal(creditData) {
    let total = 0.0;
    for (const dataItem of Object.values(creditData)) {
      total += dataItem.value;
    }
    return total;
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
              return <StoreCreditRowUser key={`${userId}-${dataId}`} userId={userId} data={data} />;
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3" className="has-text-right">
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

StoreCreditTableUser.propTypes = {
  userId: PropTypes.string,
  creditData: PropTypes.object,
};
