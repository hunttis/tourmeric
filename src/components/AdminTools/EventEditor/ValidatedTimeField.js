import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

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

    const hour = props.defaultValue.split(':')[0];
    const minute = props.defaultValue.split(':')[1];

    this.state = {
      saved: false, editing: false, hour, minute,
    };
  }

  updateDateInDB(hour, minute) {
    const newTime = `${hour}:${_.padStart(minute, 2, '0')}`;
    this.setState({ editing: true, saved: false });
    this.delayedSave({ time: newTime });
  }

  updateHour(hour) {
    this.setState({ hour });
    if (hour >= 0 && hour < 24) {
      this.updateDateInDB(hour, this.state.minute);
    }
  }

  updateMinute(minute) {
    this.setState({ minute });
    if (minute >= 0 && minute < 60) {
      this.updateDateInDB(this.state.hour, minute);
    }
  }

  render() {
    const { saved, editing } = this.state;

    const hourOk = !!this.state.hour && this.state.hour >= 0 && this.state.hour < 24;
    const minuteOk = !!this.state.minute && this.state.minute >= 0 && this.state.minut < 60;

    return (
      <div className="level">
        <div className="level-item">
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">
                <Translate id="hour" />
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded has-icons-right">

                  <Translate>
                    {translate => (<input
                      type="number"
                      className={`input ${!hourOk && 'is-danger'} ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'}`}
                      placeholder={translate('hour')}
                      defaultValue={this.state.hour}
                      onChange={event => this.updateHour(event.target.value)}
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

        <div className="level-item">
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">
                <Translate id="minute" />
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded has-icons-right">

                  <Translate>
                    {translate => (<input
                      type="number"
                      className={`input ${!minuteOk && 'is-danger'} ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'}`}
                      placeholder={translate('minute')}
                      defaultValue={this.state.minute}
                      onChange={event => this.updateMinute(event.target.value)}
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
      </div>
    );
  }
}

ValidatedDateField.propTypes = {
  defaultValue: PropTypes.string,
  path: PropTypes.string,
};
