import React, { Component } from 'react';
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
  }, 300)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 2000);

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
    if (month > 0 && month < 13) {
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
    const { saved, editing } = this.state;

    const dayOk = !!this.state.day && this.state.day > 0 && this.state.day < 32;
    const monthOk = !!this.state.month && this.state.month > 0 && this.state.month < 13;
    const yearOk = !!this.state.year && this.state.year > 0 && this.state.year < 10000;

    moment.locale(this.props.activeLanguage);
    const months = moment.monthsShort();

    return (
      <div>

        <div className="is-inline-flex">
          <div className="field">
            <label className="label">
              <Translate id="day" />
            </label>
            <div className="field">
              <p className="control has-icons-right is-vcentered">

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
                {saved && <span className="icon is-small is-right has-text-success"><i className="fas fa-check-circle" /></span>}
                {editing && <span className="icon is-small is-right has-text-warning"><i className="fas fa-pencil-alt" /></span>}
              </p>
            </div>
          </div>

          <div className="field">
            <label className="label">
              <Translate id="month" />
            </label>
            <div className="field">
              <div className="control has-icons-right is-vcentered">
                <div className={`select ${saved && 'is-success'} ${editing && 'is-warning'}`}>
                  <select
                    defaultValue={this.state.month}
                    onChange={event => this.updateMonth(event.target.value)}
                    className={`input ${!monthOk && 'is-danger'}`}
                  >
                    <option value=""><Translate id="select" /></option>
                    {Object.entries(months).map((month) => {
                      const monthNumber = month[0];
                      const monthName = moment().month(monthNumber).format('MMMM');
                      return (
                        <option key={`monthselector${this.props.targetName}${monthNumber}`} value={monthNumber}>
                          {monthName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {saved &&
                <div className="icon is-small is-right">
                  <i className="fas fa-check-circle has-text-success" />
                </div>
                      }
                {editing &&
                <div className="icon is-small is-right">
                  <i className="fas fa-pencil-alt has-text-warning" />
                </div>
                      }
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">
              <Translate id="year" />
            </label>
            <div className="field">
              <p className="control has-icons-right">

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
                {saved && <span className="icon is-small is-right has-text-success"><i className="fas fa-check-circle" /></span>}
                {editing && <span className="icon is-small is-right has-text-warning"><i className="fas fa-pencil-alt" /></span>}
              </p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

ValidatedDateField.propTypes = {
  activeLanguage: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  targetName: PropTypes.string,
};
