import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class EditableVerticalField extends Component {

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value); // Error handling?
    if (!this.unmounting) {
      this.setState({ saved: true, editing: false });
      this.delayedNormalize();
    }
  }, 1000)

  delayedNormalize = _.debounce(() => {
    if (!this.unmounting) {
      this.setState({ saved: false, editing: false });
    }
  }, 2000);

  constructor(props) {
    super(props);
    this.state = { saved: false, editing: false, fieldValue: props.defaultValue };
    this.unmounting = false;
  }

  componentDidMount() {
    this.unmounting = false;
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  handleChange(path, targetName, value) {
    this.setState({ editing: true, saved: false, fieldValue: value });
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, placeHolder, defaultValue, path, targetName, inputType = 'text', idleIcon, emptyClass,
    } = this.props;
    const { saved, editing, fieldValue } = this.state;

    return (
      <div className="field">
        <label className="label">
          <Translate id={labelContent} />
        </label>
        <div className="field">
          <p className={`control is-expanded ${idleIcon ? 'has-icons-left' : 'has-icons-right'}`}>

            <Translate>
              {translate => (<input
                type={inputType}
                className={`input ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'} ${emptyClass && !fieldValue ? 'is-danger' : ''}`}
                placeholder={translate(placeHolder)}
                defaultValue={defaultValue}
                onChange={event => this.handleChange(path, targetName, event.target.value)}
              />)
              }
            </Translate>
            {(idleIcon && !saved && !editing) && <span className="icon is-small is-left"><i className={`fas ${idleIcon}`} /></span>}
            {saved &&
              <span className={`icon is-small ${idleIcon ? 'is-left' : 'is-right'} ${emptyClass && !fieldValue ? 'has-text-danger' : 'has-text-success'}`}>
                <i className={`fas ${(emptyClass && !fieldValue) ? 'fa-thumbs-down' : 'fa-thumbs-up'}`} />
              </span>}
            {editing && <span className={`icon is-small ${idleIcon ? 'is-left' : 'is-right'} has-text-warning`}><i className="fas fa-pencil-alt" /></span>}
          </p>
        </div>
      </div>
    );
  }
}

EditableVerticalField.propTypes = {
  labelContent: PropTypes.string,
  placeHolder: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  targetName: PropTypes.string,
  inputType: PropTypes.string,
  idleIcon: PropTypes.string,
  emptyClass: PropTypes.string,
};
