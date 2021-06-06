import React, { Component } from "react";
import firebase from "firebase/app";
import { FormattedMessage, IntlShape } from "react-intl";
import _ from "lodash";

export interface Props {
  labelContent: string;
  placeHolder: string;
  defaultValue: string;
  path: string;
  targetName: string;
  inputType?: string;
  inputClasses?: string;
  leftIcon?: string;
  intl: IntlShape;
}

interface State {
  editing: boolean;
  saved: boolean;
}

export class EditableField extends Component<Props, State> {
  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 300);

  delayedNormalize = _.debounce(() => {
    if (!this.unmounting) {
      this.setState({ saved: false, editing: false });
    }
  }, 2000);

  state = { saved: false, editing: false };

  unmounting = false;

  componentWillUnmount() {
    this.unmounting = true;
  }

  handleChange(path: string, targetName: string, value: string) {
    this.setState({ editing: true, saved: false });
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent,
      placeHolder,
      defaultValue,
      path,
      targetName,
      inputType = "text",
      inputClasses = "",
      leftIcon,
      intl,
    } = this.props;
    const { saved, editing } = this.state;

    return (
      <div className="editablefield field is-horizontal">
        {labelContent && (
          <div className="field-label is-normal">
            <label className="label">
              <FormattedMessage id={labelContent} />
            </label>
          </div>
        )}
        <div className="field-body">
          <div className="field">
            <p
              className={`control is-expanded ${leftIcon &&
                "has-icons-left"} has-icons-right`}
            >
              <input
                type={inputType}
                className={`input ${saved && "is-success"} ${editing &&
                  "is-warning"} ${!editing &&
                  !saved &&
                  "is-normal"} ${inputClasses}`}
                placeholder={`${intl.formatMessage({ id: placeHolder })}`}
                defaultValue={defaultValue}
                onChange={(event) =>
                  this.handleChange(path, targetName, event.target.value)
                }
              />

              {leftIcon && (
                <span className="icon is-small is-left">
                  <i className={`fas fa-${leftIcon}`} />
                </span>
              )}
              {saved && (
                <span className="icon is-small is-right has-text-success">
                  <i className="fas fa-check-circle" />
                </span>
              )}
              {editing && (
                <span className="icon is-small is-right has-text-warning">
                  <i className="fas fa-pencil-alt" />
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
