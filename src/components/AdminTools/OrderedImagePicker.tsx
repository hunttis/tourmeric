import React, { Component } from 'react';
import firebase from 'firebase/app';
import _ from 'lodash';
import { FormattedMessage, IntlShape } from "react-intl";
import { UploadedFile } from '../../models/Category';

interface Props {
  path: string;
  fieldName: string;
  imageList: [{ key: string, value: UploadedFile}];
  highlightedImage: string | undefined | null;
}

export default class OrderedImagePicker extends Component<Props> {

  saveChange(value: string) {
    const { path, fieldName } = this.props;
    firebase.update(`/${path}`, { [fieldName]: value });
  }

  render() {
    const { imageList, highlightedImage } = this.props;
    if (!imageList || _.isEmpty(imageList)) {
      return <div><FormattedMessage id="noimages" /></div>;
    }

    return (
      <div className="columns is-multiline">
        {!_.isEmpty(imageList) && _.reverse(imageList).map((imageEntry) => {
          const imageId: string = imageEntry.key;
          const imageItem: UploadedFile = imageEntry.value;
          const highlightedClass = (imageId === highlightedImage || imageItem.downloadURL === highlightedImage) && 'has-background-white';
          return (
            <div key={`imagePicker-${imageId}`} className={`column card ${highlightedClass} imagepicker-item`} onClick={() => this.saveChange(imageItem.downloadURL)}>
              <div className="imagepicker-box box">
                <img alt="" className="image imagepicker-image" src={imageItem.downloadURL} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
