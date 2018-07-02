import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class EditableTextarea extends Component {
  state = { saved: false, editing: false }

  handleChange(path, value) {
    this.setState({ editing: true, saved: false });
    this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(value));
    this.delayedSave(path, value);
  }

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
  }, 300)

  render() {
    const {
      labelContent, placeHolder, defaultValue, path, targetName, isOk,
    } = this.props;
    const { saved, editing } = this.state;

    return (
      <div className="field">
        <label className="label"><Translate id={labelContent} />:</label>
        <div className="field-body control is-expanded has-icons-right">
          <Translate>
            {translate =>
            (<textarea
              className={`textarea ${!isOk && 'is-danger'} ${saved && 'is-success'} ${editing && 'is-warning'}`}
              placeholder={translate(placeHolder)}
              defaultValue={defaultValue}
              onChange={event => this.handleChange(path, { [targetName]: event.target.value })}
            />)
            }
          </Translate>
          {saved && <span className="icon is-small is-right is-fixed-bottom has-text-success"><i className="fas fa-check-circle" /></span>}
          {editing && <span className="icon is-small is-right has-text-warning"><i className="fas fa-pencil-alt" /></span>}
        </div>
      </div>
    );
  }
}

EditableTextarea.propTypes = {
  labelContent: PropTypes.string,
  placeHolder: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  targetName: PropTypes.string,
  isOk: PropTypes.bool,
  updateFieldStatus: PropTypes.func,
};
