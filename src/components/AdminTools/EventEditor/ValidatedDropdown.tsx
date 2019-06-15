import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

interface Props {
  labelContent: string;
  defaultValue: string;
  path: string;
  targetName: string;
  isOk: boolean | undefined;
  updateFieldStatus: (key: string, isEmpty: boolean, data: string) => void;
  dropdownItems: object;
  isHorizontal: boolean;
}

interface State {
  saved: boolean;
  editing: boolean;
  selectedValue: string;
}

export default class ValidatedDropdown extends Component<Props, State> {

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 100)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 100);

  constructor(props: Props) {
    super(props);
    this.setState.bind(this);
  }

  state = { saved: false, editing: false, selectedValue: this.props.defaultValue }

  handleChange(path: string, targetName: string, value: string): void {
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
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded has-icons-right">
              <div className={`select ${saved && 'is-success'} ${editing && 'is-warning'}`}>
                <Translate>
                  {(translate: any) => (
                    <select
                      defaultValue={selectedValue}
                      onChange={event => this.handleChange(path, targetName, event.target.value)}
                      className={`select ${!isOk && 'is-danger'}`}
                    >
                      <option value="">{translate('select')}</option>
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
      </div>
    );
  }
}
