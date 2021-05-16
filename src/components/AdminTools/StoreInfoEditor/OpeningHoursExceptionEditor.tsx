import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import firebase from 'firebase/app';

interface Props {
  openinghoursexceptions: object;
  settings: object;
}

interface State {
  newExceptionName: string;
  newExceptionDate: string;
  newExceptionOpenStatus: ShopStatus;
  newExceptionOpeningHours: string;
  focused: boolean | null;
}

const STATUS_OPEN: ShopStatus = 'open';
const STATUS_CLOSED: ShopStatus = 'closed';
type ShopStatus = 'open' | 'closed';

export default class OpeningHoursExceptionEditor extends Component<Props, State> {

  state = {
    newExceptionName: '',
    newExceptionDate: moment().format('YYYY-MM-DD'),
    newExceptionOpenStatus: STATUS_OPEN,
    newExceptionOpeningHours: '',
    focused: false,
  }

  setOpenStatus(newStatus: ShopStatus) {
    this.setState({ newExceptionOpenStatus: newStatus, newExceptionOpeningHours: '' });
  }

  saveExceptionToOpeningHours() {
    const { newExceptionName, newExceptionDate, newExceptionOpenStatus, newExceptionOpeningHours } = this.state;

    if (newExceptionName && newExceptionDate && (!newExceptionOpenStatus || (newExceptionOpenStatus && newExceptionOpeningHours))) {
      firebase.update(`/openinghoursexceptions/${this.state.newExceptionDate}`, {
        name: this.state.newExceptionName,
        date: this.state.newExceptionDate,
        status: this.state.newExceptionOpenStatus,
        openingHours: this.state.newExceptionOpeningHours,
      });
    }
  }

  render() {
    const { openinghoursexceptions, settings } = this.props;
    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    if (isLoaded(openinghoursexceptions)) {
      return (
        <>
          <h1 className="title"><FormattedMessage id="exceptionstoopeninghours" /></h1>
          {openinghoursexceptions &&
            <div className="box">
              <table className="table">
                <thead>
                  <tr>
                    <th><FormattedMessage id="date" /></th>
                    <th><FormattedMessage id="name" /></th>
                    <th><FormattedMessage id="open" /></th>
                    <th><FormattedMessage id="openinghours" /></th>
                    <th><FormattedMessage id="remove" /></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(openinghoursexceptions).map((exceptionEntry) => {
                    const key = exceptionEntry[0];
                    const data = exceptionEntry[1];
                    return (
                      <tr key={key}>
                        <td>{data.date}</td>
                        <td>{data.name}</td>
                        <td>{data.status === 'open' ? <p className="has-text-success"><FormattedMessage id="yes" /></p> : <p className="has-text-danger"><FormattedMessage id="no" /></p>}</td>
                        <td>{data.status === 'open' ? data.openingHours : '-'}</td>
                        <td><button className="button is-danger is-small"><FormattedMessage id="remove" /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          }
          {!openinghoursexceptions && <p><FormattedMessage id="none" /></p>}

          
            
              <div className="columns box is-multiline">
                <div className="column is-12">
                  <h1 className="title">{translate('addexception')}</h1>
                </div>
                <div className="field column is-1">
                  <label className="label">{translate('date')}</label>
                  <div className="control">
                    <SingleDatePicker
                      date={this.state.newExceptionDate ? moment(this.state.newExceptionDate, 'YYYY-MM-DD') : moment()}
                      onDateChange={(date) => this.setState({ newExceptionDate: date!.format('YYYY-MM-DD') })}
                      focused={this.state.focused}
                      onFocusChange={({ focused }) => this.setState({ focused })}
                      id="exception-datepicker"
                      firstDayOfWeek={1}
                      displayFormat={dateFormat}
                    />
                  </div>
                </div>
                <div className="field column">
                  <label className="label">{translate('name')}</label>
                  <input className="input" type="text" value={this.state.newExceptionName} placeholder={`${translate('name')}`} onChange={(event) => this.setState({ newExceptionName: event.target.value })} />
                </div>
                <div className="field column">
                  <label className="label">{translate('open')}?</label>
                  <div className="field has-addons">
                    <div className="control">
                      <button onClick={() => this.setOpenStatus(STATUS_OPEN)} className={`button is-success ${this.state.newExceptionOpenStatus === STATUS_OPEN && 'is-outlined'}`}>{translate('open')}</button>
                    </div>
                    <div className="control">
                      <button onClick={() => this.setOpenStatus(STATUS_CLOSED)} className={`button is-danger ${this.state.newExceptionOpenStatus === STATUS_CLOSED && 'is-outlined'}`}>{translate('closed')}</button>
                    </div>
                    <div className="control">
                      <input disabled={this.state.newExceptionOpenStatus === STATUS_CLOSED} className="input" type="text" value={this.state.newExceptionOpeningHours} placeholder={`${translate('openinghours')}`} onChange={(event) => this.setState({ newExceptionOpeningHours: event.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="column">
                  <label className="label">{translate('save')}?</label>
                  <div className="control">
                    <button className="button is-primary" onClick={() => this.saveExceptionToOpeningHours()}>{translate('addexception')}</button>
                  </div>
                </div>
              </div>
          


        </>

      );
    }
    return <div><FormattedMessage id="loading" /></div>;
  }
}
