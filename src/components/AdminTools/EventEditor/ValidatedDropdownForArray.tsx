import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

interface Props {
  labelContent: string;
  defaultValue: string;
  path: string;
  targetName: string;
  isOk: boolean;
  updateFieldStatus: (key: string, isEmpty: boolean, data: string) => void;
  dropdownItems: [string];
  isHorizontal: boolean;
}

interface State {
  saved: boolean;
  editing: boolean;
  selectedValue: string;
}

export default class ValidatedDropdownForArray extends Component<Props, State> {

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 100)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 2000);

  constructor(props: Props) {
    super(props);
    this.setState.bind(this);
  }

  state = { saved: false, editing: false, selectedValue: this.props.defaultValue }

  handleChange(path: string, targetName: string, value: string) {
    this.setState({ editing: true, saved: false, selectedValue: value });
    this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(value), value);
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, path, targetName, isOk, dropdownItems, isHorizontal,
    } = this.props;
    const { saved, editing, selectedValue } = this.state;

    return (
      <div className={`field ${isHorizontal && 'is-horizontal'}`}>
        <div className={`${!isHorizontal && 'label'} ${isHorizontal && 'field-label is-normal'}`}>
          <label className="label">
            <Translate id={labelContent} />
          </label>
        </div>
        <div className="field">
          <div className="control is-expanded has-icons-right">
            <div className={`select ${saved && 'is-success'} ${editing && 'is-warning'}`}>
              <Translate>
                {(translate: any) => (
                  <select
                    defaultValue={selectedValue}
                    onChange={(event) => this.handleChange(path, targetName, event.target.value)}
                    className={`input ${!isOk && 'is-danger'}`}
                  >
                    <option value="">{translate('select')}</option>
                    {dropdownItems.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}
              </Translate>
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
