import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { checkTimeStringFormat } from '../../Common/Utils';

export default class ValidatedTimeField extends Component {

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

    this.state = {
      saved: false,
      editing: false,
      time: props.defaultValue,
    };
  }


  updateDateInDB(time) {
    this.setState({ editing: true, saved: false });
    this.delayedSave({ time });
  }

  updateTime(time) {
    this.setState({ time });
    this.updateDateInDB(time);
    this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(time), time);
  }

  render() {
    const { saved, editing } = this.state;
    const { labelContent } = this.props;

    const isHorizontal = true;

    const timeOk = this.state.time && checkTimeStringFormat(this.state.time);

    return (
      <Fragment>
        <div className={`field ${isHorizontal && 'is-horizontal'}`}>
          <div className="field-label is-normal">
            <label className={`label ${!timeOk && 'has-text-danger'}`}>
              <Translate id={labelContent} /> {'(24h -> 18:30)'}
            </label>
          </div>

          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-right">
                <Translate>
                  {translate => (<input
                    type="text"
                    className={`input ${!timeOk && 'is-danger'} ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'}`}
                    placeholder={translate('hour')}
                    defaultValue={this.state.time}
                    onChange={event => this.updateTime(event.target.value)}
                  />)
                  }
                </Translate>
                {saved && <span className="icon is-small is-right has-text-success"><i className="fas fa-check-circle" /></span>}
                {editing && <span className="icon is-small is-right has-text-warning"><i className="fas fa-pencil-alt" /></span>}
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

ValidatedTimeField.propTypes = {
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  labelContent: PropTypes.string,
  updateFieldStatus: PropTypes.func,
  targetName: PropTypes.string,
};
