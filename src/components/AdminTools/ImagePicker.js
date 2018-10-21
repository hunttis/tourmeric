import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';

export default class ImagePicker extends Component {

  saveChange(value) {
    const { path } = this.props;

    firebase.update(`/${path}`, { image: value });
  }

  render() {
    const { imageList, highlightedImage, size } = this.props;
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
            <div key={`imagePicker-${imageId}`} className={`column is-4 card ${highlightedClass}`} onClick={() => this.saveChange(imageItem.downloadURL)}>

              <div className="box">
                <img alt="" className={`image ${size}`} src={imageItem.downloadURL} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ImagePicker.propTypes = {
  imageList: PropTypes.object,
  highlightedImage: PropTypes.string,
  path: PropTypes.string.isRequired,
  size: PropTypes.string,
};
