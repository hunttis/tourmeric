import React from 'react';
import { FormattedMessage, IntlShape } from "react-intl";
import moment from 'moment';
import _ from 'lodash';
import { mapCategoryToColor } from '../../Common/Utils';
import { User } from '../../../models/ReduxState';
import { TourmericStoreCreditData, StoreCreditCategory } from '../../../models/StoreCredit';

interface Props {
  users: { [key: string]: User };
  data: TourmericStoreCreditData[];
  storecreditcategories: { [key: string]: string | StoreCreditCategory };
}

export const StoreCreditReportForMonth = ({ users, data, storecreditcategories }: Props) => {
  const items = _.sortBy(data, (item) => moment(item.date).format('YYYYMMDD'));
  return (
    <>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th className="storecreditreport-categorycolor" />
            <th className="storecreditreport-category"><FormattedMessage id="category" /></th>
            <th className="storecreditreport-name"><FormattedMessage id="creditaddedbyname" /></th>
            <th className="storecreditreport-name"><FormattedMessage id="customer" /></th>
            <th className="storecreditreport-note"><FormattedMessage id="note" /></th>
            <th className="storecreditreport-day"><FormattedMessage id="daymonthyearshort" /></th>
            <th className="storecreditreport-year"><FormattedMessage id="clockshort" /></th>
            <th className="storecreditreport-amount has-text-right"><FormattedMessage id="amount" /></th>
          </tr>
        </thead>
        <tbody>
          {items.map((event, index) => {
            const user = users[event.userId];
            const { firstName, lastName } = user;
            const userName = `${firstName} ${lastName}`;
            const keyString = `detailedreport-${event.date}-${index}`;
            return (
              <tr key={keyString}>
                <td className={`${event.category && `has-text-${mapCategoryToColor(event.category)}`}`}>
                  <i className="fas fa-circle" />
                </td>
                <td>
                  {storecreditcategories[event.category] || <FormattedMessage id="nocategory" />}
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
    </>
  );
};
