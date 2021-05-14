import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import firebase from 'firebase/app';
import { History } from 'history';
import { StoreCreditRow } from './StoreCreditRow';
import { User } from '../../../models/ReduxState';
import { TourmericStoreCreditData, StoreCreditCategory, CreditCategories } from '../../../models/StoreCredit';

interface Props {
  users: { key: string, value: User }[];
  userId: string;
  creditData: { [key: string]: TourmericStoreCreditData };
  storecreditcategories: { [key: string]: StoreCreditCategory };
  isAdmin: boolean;
  history: History;
}

export default class StoreCreditTable extends Component<Props> {

  getUser(userid: string) {
    const { users } = this.props;
    if (!userid) {
      return null;
    }
    const foundUser = _.find(users, { key: userid });
    return foundUser;
  }

  calculateTotal(creditData: { [key: string]: TourmericStoreCreditData }) {
    let total = 0.0;
    for (const dataItem of Object.values(creditData)) {
      total += dataItem.value;
    }
    return total.toFixed(2);
  }

  updateCategory(entryId: string, category: CreditCategories) {
    firebase.update(`/storecredit/${this.props.userId}/${entryId}`, { category });
  }

  render() {
    const { userId, creditData, storecreditcategories, isAdmin, history } = this.props;
    const user = this.getUser(userId)!.value;
    const username = `${user.firstName} ${user.lastName}`;
    const calculatedTotal = this.calculateTotal(creditData);

    return (
      <div key={userId}>
        <h2 className="subtitle">
          <Translate id="username" /> <strong>{username}</strong>
        </h2>
        <table className="table is-bordered is-fullwidth">
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
            {Object.entries(creditData).map((dataItem) => {
              const dataId = dataItem[0];
              const data = dataItem[1];
              const dataEntryUser = data.creditAddedBy ? this.getUser(data.creditAddedBy)!.value : null;
              const entryMadeBy = dataEntryUser ? `${dataEntryUser.firstName} ${dataEntryUser.lastName}` : '';
              return (
                <StoreCreditRow
                  key={`${userId}-${dataId}`}
                  userId={userId}
                  dataId={dataId}
                  data={data}
                  entryMadeBy={entryMadeBy}
                  isAdmin={isAdmin}
                  updateCategory={(entryId: string, category: CreditCategories) => this.updateCategory(entryId, category)}
                  storecreditcategories={storecreditcategories}
                  history={history}
                />
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3} className="has-text-right">
                <Translate id="total" />
              </th>
              <th>
                {calculatedTotal}&nbsp;€
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}
