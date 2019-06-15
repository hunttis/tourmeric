import React, { Component } from 'react';
import firebase from 'firebase/app';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import { UploadedFile } from '~/models/Category';

interface Props {
  path: string;
  fieldName: string;
  imageList: { [key: string]: UploadedFile };
  highlightedImage: string | undefined | null;
}

export default class ImagePicker extends Component<Props> {

  saveChange(value: string) {
    const { path, fieldName } = this.props;

    firebase.update(`/${path}`, { [fieldName]: value });
  }

  render() {
    const { imageList, highlightedImage } = this.props;
    if (!imageList || _.isEmpty(imageList)) {
      return <div><Translate id="noimagesforcategories" /></div>;
    }

    return (
      <div className="columns is-multiline">
        {!_.isEmpty(imageList) && Object.entries(imageList).map((imageEntry) => {
          const imageId = imageEntry[0];
          const imageItem = imageEntry[1];
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
