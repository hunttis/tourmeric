import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class ValidatedEditableField extends Component {

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 300)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 2000);

  state = { saved: false, editing: false }

  handleChange(path, targetName, value) {
    this.setState({ editing: true, saved: false });
    this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(value), value);
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, placeHolder, defaultValue, path, targetName, inputType = 'text', isOk, isHorizontal,
    } = this.props;
    const { saved, editing } = this.state;

    return (
      <div className={`field ${isHorizontal && 'is-horizontal'}`}>
        <div className={`${!isHorizontal && 'label'} ${isHorizontal && 'field-label is-normal'}`}>
          <label className={`label ${!isOk && 'has-text-danger'}`}>
            <Translate id={labelContent} />
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <Translate>
                {translate => (<input
                  type={inputType}
                  className={`input ${!isOk && 'is-danger'} ${saved && 'is-success'} ${editing && 'is-warning'}`}
                  placeholder={translate(placeHolder)}
                  defaultValue={defaultValue}
                  onChange={event => this.handleChange(path, targetName, event.target.value)}
                />)
                  }
              </Translate>
              {saved && <span className="icon is-small is-right has-text-success"><i className="fas fa-check-circle" /></span>}
              {editing && <span className="icon is-small is-right has-text-warning"><i className="fas fa-pencil-alt" /></span>}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

ValidatedEditableField.propTypes = {
  labelContent: PropTypes.string,
  placeHolder: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  targetName: PropTypes.string,
  inputType: PropTypes.string,
  isOk: PropTypes.bool,
  updateFieldStatus: PropTypes.func,
  isHorizontal: PropTypes.bool,
};
