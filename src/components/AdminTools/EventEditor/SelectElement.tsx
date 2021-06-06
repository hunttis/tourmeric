import React, { Component } from 'react';
import firebase from 'firebase/app';
import { FormattedMessage, IntlShape } from "react-intl";
import _ from 'lodash';
import classnames from 'classnames';
import { Category } from '../../../models/Category';

interface Props {
  labelContent: string;
  defaultValue: string | undefined | null;
  path: string;
  targetName: string;
  isOk: boolean;
  updateFieldStatus?: (key: string, isEmpty: boolean, data: any) => void;
  isHorizontal: boolean;
  isLocked?: boolean;
  nameProp?: SelectElementName;
  dropdownItems: { [key: string]: string | SelectElementItem | Category };
}

export default class SelectElement extends Component<Props> {

  delayedSave = _.debounce(async (path, value) => {
    await firebase.update(path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 250)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 500);

  state = { saved: false, editing: false, selectedValue: this.props.defaultValue }

  handleChange(path: string, targetName: string, value: string): void {
    this.setState({ editing: true, saved: false, selectedValue: value });
    // this.props.updateFieldStatus(this.props.targetName, !_.isEmpty(value), value);
    this.delayedSave(path, { [targetName]: value });
  }

  render() {
    const {
      labelContent, path, targetName, dropdownItems, isHorizontal, nameProp, isOk, isLocked,
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
            <FormattedMessage id={labelContent} />
          </label>
        </div>
        <div className="field-body columns is-multiline is-mobile">
          {isLocked && <LockedButton
            dropdownItems={dropdownItems}
            nameProp={nameProp}
            selectedValue={selectedValue}
            onSelectionClick={(selectionId) => this.handleChange(path, targetName, selectionId)}
          />}
          {!isLocked && <SelectionButtons
            dropdownItems={dropdownItems}
            nameProp={nameProp}
            selectedValue={selectedValue}
            onSelectionClick={(selectionId) => this.handleChange(path, targetName, selectionId)}
          />}
        </div>
      </div>
    );
  }
}

interface SelectionButtonProps {
  dropdownItems: { [key: string]: SelectElementItem | string | Category };
  nameProp?: SelectElementName;
  selectedValue: string | undefined | null;
  onSelectionClick: (selectionId: string) => void;
}

function LockedButton({ dropdownItems, nameProp, selectedValue }: SelectionButtonProps) {
  const selectedItem = dropdownItems[selectedValue!];
  const selectionData = selectedItem;
  const { buttonName, image } = typeof selectionData === 'string' ?
    ({ buttonName: selectionData, image: undefined }) :
    ({ buttonName: selectionData[nameProp!], image: selectionData.image });

  return (
    <div className="column is-3-fullhd is-4-tablet is-6-mobile" key={`selectedData-${selectionData}`}>
      <button className="button has-icons-left" disabled>
        <span className="icon"><i className="fas fa-lock" /></span>
        {image &&
          <span className="icon">
            <figure className="image is-16x16">
              <img alt="" src={image} />
            </figure>
          </span>
        }
        <span>
          {buttonName}
        </span>
      </button>
    </div>
  );
}

function SelectionButtons({ dropdownItems, nameProp, selectedValue, onSelectionClick }: SelectionButtonProps) {
  return (
    <>
      {Object.entries(dropdownItems).map(([selectionId, selectionData]) => {
        const { buttonName, image } = typeof selectionData === 'string' ?
          ({ buttonName: selectionData, image: undefined }) :
          ({ buttonName: selectionData[nameProp!], image: selectionData.image });
        return (
          <div className="column is-3-fullhd is-4-tablet is-6-mobile" key={`selectionDataselector-${selectionId}`}>
            <div className={classnames('button is-fullwidth is-outlined', { 'is-success': selectionId === selectedValue })} onClick={() => onSelectionClick(selectionId)}>
              {image &&
                <span className="icon">
                  <figure className="image is-16x16">
                    <img alt="" src={image} />
                  </figure>
                </span>
              }
              <span>{buttonName}</span>
            </div>
          </div>
        );
      })}
    </>
  );
}

interface SelectElementItem {
  abbreviation: string;
  image: string;
  name: string;
}

type SelectElementName = keyof SelectElementItem
