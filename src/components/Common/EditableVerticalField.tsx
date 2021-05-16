import React, { Component } from 'react';
import firebase from 'firebase/app';
import { FormattedMessage } from "react-intl";
import _ from 'lodash';


interface Props {
  labelContent: string;
  placeHolder: string;
  defaultValue: string;
  path: string;
  targetName: string;
  inputType?: string;
  idleIcon?: string;
  emptyClass?: string;
  disabled?: boolean;
}

interface State {
  saved: boolean;
  editing: boolean;
  fieldValue: string;
}

export default class EditableVerticalField extends Component<Props, State> {

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

  unmounting = false;

  constructor(props: Props) {
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

  handleChange(path: string, targetName: string, value: string) {
    this.setState({ editing: true, saved: false, fieldValue: value });
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, placeHolder, defaultValue, path, targetName, inputType = 'text', idleIcon, emptyClass, disabled = false,
    } = this.props;
    const { saved, editing, fieldValue } = this.state;

    return (
      <div className="field">
        {labelContent &&
          <label className={`label ${disabled && 'has-text-info'}`}>
            <FormattedMessage id={labelContent} />
          </label>
        }
        <div className="field">
          <p className={`control is-expanded ${idleIcon ? 'has-icons-left' : 'has-icons-right'}`}>

            
              <input
                type={inputType || 'text'}
                className={`input ${saved && 'is-success'} ${editing && 'is-warning'} ${(!editing && !saved) && 'is-normal'} ${emptyClass && !fieldValue ? 'is-danger' : ''} ${disabled && 'has-text-info'}`}
                placeholder={`${translate(placeHolder)}`}
                defaultValue={defaultValue}
                onChange={(event) => this.handleChange(path, targetName, event.target.value)}
                disabled={disabled}
              />
            
            {(idleIcon && !saved && !editing) && <span className="icon is-small is-left"><i className={`fas ${idleIcon} ${disabled && 'has-text-black'}`} /></span>}
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
