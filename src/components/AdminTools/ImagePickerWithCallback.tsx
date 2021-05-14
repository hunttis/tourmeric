import React from 'react';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import { UploadedFile } from '../../models/Category';

interface Props {
  imageList: [{ key: string, value: UploadedFile}];
  onClickCallback: any;
}

export const ImagePickerWithCallback = ({ imageList, onClickCallback }: Props) => {

  if (!imageList || _.isEmpty(imageList)) {
    return <div><Translate id="noimages" /></div>;
  }

  return (
    <div className="columns is-multiline">
      {!_.isEmpty(imageList) && _.reverse(imageList).map((imageEntry) => {
        const imageId: string = imageEntry.key;
        const imageItem: UploadedFile = imageEntry.value;
        return (
          <div key={`imagePicker-${imageId}`} className="column card imagepicker-item" onClick={() => onClickCallback(imageItem.downloadURL)}>
            <div className="imagepicker-box box">
              <img alt="" className="image imagepicker-image" src={imageItem.downloadURL} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
