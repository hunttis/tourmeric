import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class ValidatedDropdown extends Component {

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 300)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 2000);

  state = { saved: false, editing: false, selectedValue: this.props.defaultValue }

  handleChange(path, targetName, value) {
    this.setState({ editing: true, saved: false, selectedValue: value });
    this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(value));
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, path, targetName, isOk, dropdownItems,
    } = this.props;
    const { saved, editing, selectedValue } = this.state;

    return (
      <div className="field is-fullwidth">
        <label className="label">
          <Translate id={labelContent} />
        </label>
        <div className="field">
          <div className="control is-expanded has-icons-right">
            <div className={`select ${saved && 'is-success'} ${editing && 'is-warning'}`}>
              <select
                defaultValue={selectedValue}
                onChange={event => this.handleChange(path, targetName, event.target.value)}
                className={`input ${!isOk && 'is-danger'}`}
              >
                <option value=""><Translate id="select" /></option>
                {Object.entries(dropdownItems).map((categoryEntry) => {
                  const categoryId = categoryEntry[0];
                  const category = categoryEntry[1];
                  return (
                    <option key={categoryId} value={categoryId}>
                      {category.name}
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
    );
  }
}

ValidatedDropdown.propTypes = {
  labelContent: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  targetName: PropTypes.string,
  isOk: PropTypes.bool,
  updateFieldStatus: PropTypes.func,
  dropdownItems: PropTypes.object,
};
