import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';

import moment from 'moment/min/moment-with-locales';

import { mapCategoryToColor } from '../../Common/Utils';
import { StoreCreditReportForMonth } from './StoreCreditReportForMonth';


export default class StoreCreditReport extends Component {

  state = { detailedReport: null }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  delayedScrollToShow() {
    if (this.state.detailedReport) {
      this.timeout = setTimeout(() => {
        const element = document.getElementById('detailedreport');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    }
  }

  render() {
    const { users, storecreditcategories, storecredit, activeLanguage } = this.props;

    if (isLoaded(storecredit) && isEmpty(storecredit)) {
      return <div><Translate id="nocreditevents" /></div>;
    } if (isLoaded(users) && isLoaded(storecreditcategories) && isLoaded(storecredit)) {

      const creditEvents = _.flatMap(Object.entries(storecredit).map(storeCreditEntry => _.flatMap(Object.entries(storeCreditEntry[1]).map((storeCreditEventEntry) => {
        const userId = storeCreditEntry[0];
        const storeCreditEvent = storeCreditEventEntry[1];
        const { category, value, date, creditAddedByName, note } = storeCreditEvent;
        const processedCategory = !category || category.length === 0 ? 'uncategorized' : category;
        return { category: processedCategory, value, date, userId, creditAddedByName, note };
      }))));

      const grouped = _.groupBy(creditEvents, 'category');
      const groupedByMonth = _.groupBy(creditEvents, event => moment(event.date).format('YYYYMM'));

      const totals = Object.entries(grouped).map((groupEntry) => {
        const category = groupEntry[0];
        const entries = groupEntry[1];
        const total = _.reduce(entries, (totalForCategory, event) => totalForCategory + parseFloat(event.value), 0);
        return { category, total };
      });

      moment.locale(activeLanguage);

      return (
        <div>
          <h1 className="title"><Translate id="creditsbycategory" /></h1>
          <h2 className="subtitle"><Translate id="alltime" /></h2>
          <table className="table">
            <thead>
              <tr>
                <th />
                <th><Translate id="category" /></th>
                <th className="has-text-right"><Translate id="total" /></th>
              </tr>
            </thead>
            <tbody>
              {totals.map(total => (
                <tr key={`totalrow-${total.category}`}>
                  <td className={`${total.category && `has-text-${mapCategoryToColor(total.category)}`}`}>
                    <i className="fas fa-circle" />
                  </td>
                  <td>
                    {storecreditcategories[total.category] || <Translate id="nocategory" />}
                  </td>
                  <td className="has-text-right">
                    {total.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h1 className="title"><Translate id="bymonth" /></h1>
          <div className="columns is-multiline">
            {Object.entries(groupedByMonth).map((monthGroupEntry) => {
              const dateString = moment(monthGroupEntry[0], 'YYYY-MM').format('MMMM, YYYY');
              const monthData = monthGroupEntry[1];
              const groupedMonthData = _.groupBy(monthData, 'category');
              const monthTotals = Object.entries(groupedMonthData).map((groupEntry) => {
                const category = groupEntry[0];
                const entries = groupEntry[1];
                const total = _.reduce(entries, (totalForCategory, event) => totalForCategory + parseFloat(event.value), 0);
                return { category, total };
              });
              const backGroundClass = this.state.detailedReport && this.state.detailedReport === monthGroupEntry[0] ? '' : 'has-background-grey-darker';
              return (
                <div className="column is-one-third-desktop is-half-tablet" key={`totals-for-${dateString}`}>

                  <table className={`table ${backGroundClass}`}>
                    <thead>
                      <tr className="is-vcentered-title">
                        <th colSpan="2">{dateString}</th>
                        <th className="has-text-right">
                          {(this.state.detailedReport && this.state.detailedReport === monthGroupEntry[0]) &&
                            <button className="button is-small" onClick={() => this.setState({ detailedReport: null })}>
                              <Translate id="close" />
                            </button>
                          }
                          {!(this.state.detailedReport && this.state.detailedReport === monthGroupEntry[0]) &&
                            <button className="button is-small" onClick={() => this.setState({ detailedReport: monthGroupEntry[0] })}>
                              <Translate id="showdetails" />
                            </button>
                          }
                        </th>
                      </tr>
                      <tr>
                        <th />
                        <th><Translate id="category" /></th>
                        <th className="has-text-right"><Translate id="total" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthTotals.map(total => (
                        <tr key={`totalrow-${dateString}-${total.category}`}>
                          <td className={`${total.category && `has-text-${mapCategoryToColor(total.category)}`}`}>
                            <i className="fas fa-circle" />
                          </td>
                          <td>
                            {storecreditcategories[total.category] || <Translate id="nocategory" />}
                          </td>
                          <td className="has-text-right">
                            {total.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {this.state.detailedReport &&
            <Fragment>
              <h1 id="detailedreport" className="title"><Translate id="showingdetails" /> <span className="has-text-info">{moment(this.state.detailedReport, 'YYYYMM').format('MMMM, YYYY')}</span>
                <button className="button is-warning is-outlined is-pulled-right" onClick={() => this.setState({ detailedReport: null })}><Translate id="close" /></button>
              </h1>
              {this.delayedScrollToShow()}
              <StoreCreditReportForMonth
                data={[this.state.detailedReport, groupedByMonth[this.state.detailedReport]]}
                storecreditcategories={storecreditcategories}
                users={users}
              />
            </Fragment>
            }


        </div>
      );
    }
    return <div><Translate id="loading" /></div>;
  }

}

StoreCreditReport.propTypes = {
  users: PropTypes.object,
  storecredit: PropTypes.object,
  storecreditcategories: PropTypes.object,
  activeLanguage: PropTypes.string,
};
