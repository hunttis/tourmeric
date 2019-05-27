import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import moment from 'moment';
import _ from 'lodash';
import { mapCategoryToColor } from '../../Common/Utils';
import { User } from '~/models/ReduxState';
import { TourmericStoreCreditData } from '~/models/StoreCredit';

interface Props {
  users: {[key: string]: User};
  data: [{key: string}, {value: TourmericStoreCreditData}];
  storecreditcategories: {[key: string]: string};
  userid: string;
};

export const StoreCreditReportForMonth = ({ users, data, storecreditcategories, userid }: Props) => {
  const items = _.sortBy(data[1], item => moment(item.date).format('YYYYMMDD'));
  return (
    <Fragment>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th className="storecreditreport-categorycolor" />
            <th className="storecreditreport-category"><Translate id="category" /></th>
            <th className="storecreditreport-name"><Translate id="creditaddedbyname" /></th>
            <th className="storecreditreport-name"><Translate id="customer" /></th>
            <th className="storecreditreport-note"><Translate id="note" /></th>
            <th className="storecreditreport-day"><Translate id="daymonthyearshort" /></th>
            <th className="storecreditreport-year"><Translate id="clockshort" /></th>
            <th className="storecreditreport-amount has-text-right"><Translate id="amount" /></th>
          </tr>
        </thead>
        <tbody>
          { items.map((event, index) => {
            const user = users[userid];
            const { firstName, lastName } = user;
            const userName = `${firstName} ${lastName}`;
            const keyString = `detailedreport-${event.date}-${index}`;
            return (
              <tr key={keyString}>
                <td className={`${event.category && `has-text-${mapCategoryToColor(event.category)}`}`}>
                  <i className="fas fa-circle" />
                </td>
                <td>
                  {storecreditcategories[event.category] || <Translate id="nocategory" />}
                </td>
                <td>
                  {event.creditAddedByName}
                </td>
                <td>
                  {userName}
                </td>
                <td>
                  {event.note}
                </td>
                <td className="nowrap">
                  {moment(event.date).format('DD/MM/YYYY')}
                </td>
                <td className="nowrap">
                  {moment(event.date).format('HH:mm')}
                </td>
                <td className="has-text-right">
                  {event.value.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};


