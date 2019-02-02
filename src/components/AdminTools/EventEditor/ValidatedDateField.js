import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';

export default class ValidatedDateField extends Component {

  delayedSave = _.debounce((value) => {
    firebase.update(this.props.path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 1000)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 1000);

  constructor(props) {
    super(props);

    const day = moment(props.defaultValue).date();
    const month = moment(props.defaultValue).month();
    const year = moment(props.defaultValue).year();

    this.state = {
      saved: false, editing: false, day, month, year,
    };
  }

  updateDateInDB(year, month, day) {
    const newDate = moment().year(year).month(month).date(day);
    const { targetName } = this.props;
    this.setState({ editing: true, saved: false });
    this.delayedSave({ [targetName]: newDate.format('YYYY-MM-DD') });
  }

  updateDay(day) {
    this.setState({ day });
    if (day < 32 && day > 0) {
      this.updateDateInDB(this.state.year, this.state.month, day);
    }
  }

  updateMonth(month) {
    this.setState({ month });
    if (month >= 0 && month < 12) {
      this.updateDateInDB(this.state.year, month, this.state.day);
    }
  }

  updateYear(year) {
    this.setState({ year });
    if (year > 0 && year < 10000) {
      this.updateDateInDB(year, this.state.month, this.state.day);
    }
  }

  render() {
    const { saved, editing, year, month, day } = this.state;
    const { isHorizontal, disabled, settings } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    const dayOk = !!this.state.day && this.state.day > 0 && this.state.day < 32;
    const monthOk = !_.isNil(this.state.month) && this.state.month >= 0 && this.state.month < 12;
    const yearOk = !!this.state.year && this.state.year > 0 && this.state.year < 10000;
    const dateOk = dayOk && monthOk && yearOk;

    moment.locale(this.props.activeLanguage);
    const months = moment.monthsShort();
    const eventDate = moment().year(year).month(month).date(day);

    if (disabled) {
      return (
        <div className={`field ${isHorizontal && 'is-horizontal'}`}>
          <div className="field-label is-normal">
            <Translate id="date" />
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control has-icons-left">
                <span className="icon is-small is-left"><i className="fas fa-lock" /></span>
                <input
                  className="input"
                  disabled
                  value={eventDate.format(`dddd - ${dateFormat}`)}
                />
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Fragment>
        <div className={`field ${isHorizontal && 'is-horizontal'}`}>
          <div className="field-label is-normal">
            <label className={`label ${!(dayOk && monthOk && yearOk) && 'has-text-danger'}`}>
              {saved &&
              <div className="icon is-small is-right">
                <i className="fas fa-check-circle has-text-success" />
                &nbsp;&nbsp;
              </div>
              }
              {editing &&
              <div className="icon is-small is-right">
                <i className="fas fa-pencil-alt has-text-warning" />
                &nbsp;&nbsp;
              </div>
              }
              <Translate id="date" />
            </label>
          </div>

          <div className="field-body columns is-multiline">
            <div className="column is-4-desktop is-6-tablet">
              <div className={`field ${isHorizontal && 'is-horizontal'}`}>
                <div className="field-label is-normal">
                  <label className={`label ${!dayOk && 'has-text-danger'}`}>
                    <Translate id="day" />
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control is-vcentered">

                      <Translate>
                        {translate => (<input
                          type="number"
                          className={`input ${!dayOk && 'is-danger'} ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'}`}
                          placeholder={translate('day')}
                          defaultValue={this.state.day}
                          onChange={event => this.updateDay(event.target.value)}
                        />)
                          }
                      </Translate>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-4-desktop is-6-tablet">
              <div className={`field ${isHorizontal && 'is-horizontal'}`}>
                <div className="field-label is-normal">
                  <label className="label">
                    <Translate id="month" />
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control is-vcentered">
                      <div className={`select ${saved && 'is-success'} ${editing && 'is-warning'}`}>
                        <select
                          defaultValue={this.state.month}
                          onChange={event => this.updateMonth(event.target.value)}
                          className={`input ${!monthOk && 'is-danger'}`}
                        >
                          <Translate>
                            {translate => <option value="">{translate('select')}</option>}
                          </Translate>
                          {Object.entries(months).map((monthEntry) => {
                            const monthNumber = monthEntry[0];
                            const monthName = moment().month(monthNumber).format('MMMM');
                            return (
                              <option key={`monthselector${this.props.targetName}${monthNumber}`} value={monthNumber}>
                                {monthName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-4-desktop is-6-tablet">
              <div className={`field ${isHorizontal && 'is-horizontal'}`}>
                <div className="field-label is-normal">
                  <label className="label">
                    <Translate id="year" />
                  </label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <Translate>
                        {translate => (<input
                          type="number"
                          className={`input ${!yearOk && 'is-danger'} ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'}`}
                          placeholder={translate('year')}
                          defaultValue={this.state.year}
                          onChange={event => this.updateYear(event.target.value)}
                        />)
                                }
                      </Translate>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className={`field ${isHorizontal && 'is-horizontal'}`}>
          <div className="field-label is-normal">
            <label className="label">
              <Translate id="weekday" />
            </label>
          </div>
          <div className="field-body">
            <div className="field">
              <input className="input" disabled value={dateOk ? eventDate.format('dddd') : '-'} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

ValidatedDateField.propTypes = {
  activeLanguage: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  settings: PropTypes.object,
  targetName: PropTypes.string,
  isHorizontal: PropTypes.bool,
  disabled: PropTypes.bool,
};
