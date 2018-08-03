import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { StoreCreditRow } from './StoreCreditRow';

export default class StoreCreditTable extends Component {

  getUser(userid) {
    const { users } = this.props;
    if (!userid) {
      return null;
    }
    const foundUser = _.find(users, { key: userid });
    return foundUser;
  }

  calculateTotal(creditData) {
    let total = 0.0;
    for (const dataItem of Object.values(creditData)) {
      total += dataItem.value;
    }
    return total;
  }

  render() {
    const { userId, creditData } = this.props;
    const user = this.getUser(userId).value;
    const username = user.displayName;
    const calculatedTotal = this.calculateTotal(creditData);

    return (
      <div key={userId}>
        <h2 className="subtitle">
          <Translate id="username" /> <strong>{username}</strong>
        </h2>
        <table className="table is-bordered is-fullwidth">
          <thead>
            <tr>
              <th><Translate id="transactionid" /></th>
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
              const entryMadeBy = this.getUser(data.creditAddedBy).value.displayName;
              return <StoreCreditRow key={`${userId}-${dataId}`} userId={userId} dataId={dataId} data={data} entryMadeBy={entryMadeBy} />;
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="4" className="has-text-right">
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

StoreCreditTable.propTypes = {
  users: PropTypes.array,
  userId: PropTypes.string,
  creditData: PropTypes.object,
};
