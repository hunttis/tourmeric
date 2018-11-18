import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { mapCategoryToColor } from '../../Common/Utils';


export const StoreCreditReportForMonth = ({ users, data, storecreditcategories }) => {
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
                  {event.value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};

StoreCreditReportForMonth.propTypes = {
  users: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  storecreditcategories: PropTypes.object.isRequired,
};
