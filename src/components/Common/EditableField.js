import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class EditableField extends Component {

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
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, placeHolder, defaultValue, path, targetName, inputType = 'text', inputClasses, leftIcon,
    } = this.props;
    const { saved, editing } = this.state;

    return (
      <div className="editablefield field is-horizontal">
        {labelContent &&
        <div className="field-label is-normal">
          <label className="label">
            <Translate id={labelContent} />
          </label>
        </div>
        }
        <div className="field-body">
          <div className="field">
            <p className={`control is-expanded ${leftIcon && 'has-icons-left'} has-icons-right`}>

              <Translate>
                {translate => (<input
                  type={inputType}
                  className={`input ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'} ${inputClasses}`}
                  placeholder={translate(placeHolder)}
                  defaultValue={defaultValue}
                  onChange={event => this.handleChange(path, targetName, event.target.value)}
                />)
                }
              </Translate>
              {leftIcon && <span className="icon is-small is-left"><i className={`fas fa-${leftIcon}`} /></span>}
              {saved && <span className="icon is-small is-right has-text-success"><i className="fas fa-check-circle" /></span>}
              {editing && <span className="icon is-small is-right has-text-warning"><i className="fas fa-pencil-alt" /></span>}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

EditableField.propTypes = {
  labelContent: PropTypes.string,
  placeHolder: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  targetName: PropTypes.string,
  inputType: PropTypes.string,
  inputClasses: PropTypes.string,
  leftIcon: PropTypes.string,
};
