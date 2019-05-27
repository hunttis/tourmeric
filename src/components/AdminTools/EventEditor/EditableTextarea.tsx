import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

interface Props {
  labelContent: string;
  placeHolder: string;
  defaultValue: string;
  path: string;
  targetName: string;
  isOk: boolean;
  updateFieldStatus: (key: string, isEmpty: boolean, data: {[key: string]: string}) => void;
  isHorizontal: boolean;
}

export default class EditableTextarea extends Component<Props> {

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
  }, 300)

  state = { saved: false, editing: false }

  handleChange(path: string, value: {[key: string]: string}) {
    this.setState({ editing: true, saved: false });
    this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(value), value);
    this.delayedSave(path, value);
  }

  render() {
    const {
      labelContent, placeHolder, defaultValue, path, targetName, isOk, isHorizontal,
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
            <div className="control is-expanded has-icons-right">
              <Translate>
                {(translate: any) => (<textarea
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
        </div>
      </div>
    );
  }
}

