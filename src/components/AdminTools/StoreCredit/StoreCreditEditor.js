import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

export default class StoreCreditEditor extends Component {

  getUser(userid) {
    if (!userid) {
      return null;
    }
    const { users } = this.props;
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

  renderCreditEntry(userId, dataId, data) {
    const entryMadeBy = this.getUser(data.creditaddedby).value.displayName;
    return (
      <tr key={`${userId}-${dataId}`}>
        <td>{dataId}</td>
        <td>{moment(data.date).format('DD-MM-YYYY - hh:mm')}</td>
        <td>{entryMadeBy}</td>
        <td>{data.note}</td>
        <td className={`${data.value > 0 ? 'has-text-success' : 'has-text-danger'}`}>{data.value} €</td>
      </tr>
    );
  }

  renderUserStoreCredit(userId, creditData) {
    const username = this.getUser(userId).value.displayName;
    const calculatedTotal = this.calculateTotal(creditData);

    return (
      <div key={userId}>
        <h2 className="subtitle">
          <Translate id="username" /> <strong>{username}</strong>
        </h2>
        <table className="table is-bordered">
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
                return this.renderCreditEntry(userId, dataId, data);
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

  render() {
    const { storecredit, users } = this.props;

    if (isLoaded(storecredit) && isLoaded(users) && !isEmpty(storecredit)) {
      return (
        <div>
          <h1 className="title">
            <Translate id="storecredit" />
          </h1>
          {Object.entries(storecredit).map((storecreditEntry) => {
          const creditId = storecreditEntry[0];
          const creditData = storecreditEntry[1];
          return this.renderUserStoreCredit(creditId, creditData);
        })}

        </div>
      );
    } else if (!isLoaded(storecredit) || !isLoaded(storecredit)) {
      return <div><Translate id="loading" /></div>;
    }
    return <div><Translate id="nocreditentries" /></div>;

  }
}

StoreCreditEditor.propTypes = {
  users: PropTypes.array,
  storecredit: PropTypes.object,
};
