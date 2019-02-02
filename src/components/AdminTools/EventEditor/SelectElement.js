import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class SelectElement extends Component {

  delayedSave = _.debounce((path, value) => {
    firebase.update(path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 250)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 500);

  constructor(props) {
    super(props);
    this.setState.bind(this);
  }

  state = { saved: false, editing: false, selectedValue: this.props.defaultValue }

  handleChange(path, targetName, value) {
    this.setState({ editing: true, saved: false, selectedValue: value });
    this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(value), value);
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, path, targetName, dropdownItems, isHorizontal, nameProp, isOk,
    } = this.props;
    const { saved, editing, selectedValue } = this.state;

    return (
      <div className={`field ${isHorizontal && 'is-horizontal'}`}>
        <div className={`${!isHorizontal && 'label'} ${isHorizontal && 'field-label is-normal'}`}>
          <label className={`label ${!isOk && 'has-text-danger'}`}>
            {saved &&
            <span className="icon is-small is-right">
              <i className="fas fa-check-circle has-text-success" />
            </span>
            }
            {editing &&
            <span className="icon is-small is-right">
              <i className="fas fa-pencil-alt has-text-warning" />
            </span>
            }
            &nbsp;&nbsp;
            <Translate id={labelContent} />
          </label>
        </div>
        <div className="field-body columns is-multiline is-mobile">
          {Object.entries(dropdownItems).map((selectEntry) => {
            const selectionId = selectEntry[0];
            const selectionData = selectEntry[1];
            const buttonName = nameProp ? selectionData[nameProp] : selectionData;
            const buttonClass = selectionId === selectedValue ? 'is-success is-outlined' : 'is-outlined';
            return (
              <div className="column is-3-fullhd is-4-tablet is-6-mobile" key={`selectionDataselector-${selectionId}`}>
                <div className={`button is-fullwidth ${buttonClass}`} onClick={() => this.handleChange(path, targetName, selectionId)}>
                  {selectionData.image &&
                  <figure className="image is-16x16">
                    <img alt="" src={selectionData.image} />
                  </figure>
                  }
                  {selectionData.image && <span>&nbsp;&nbsp;</span>}
                  {buttonName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

SelectElement.propTypes = {
  labelContent: PropTypes.string,
  defaultValue: PropTypes.string,
  path: PropTypes.string,
  targetName: PropTypes.string,
  isOk: PropTypes.bool,
  nameProp: PropTypes.string,
  updateFieldStatus: PropTypes.func,
  dropdownItems: PropTypes.object,
  isHorizontal: PropTypes.bool,
};
