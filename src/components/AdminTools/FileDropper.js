import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

export default class FileDropper extends Component {

  delayedNormalize = _.debounce(() => {
    this.setState({ uploadStatus: 'idle', uploadedFiles: '' });
  }, 3000);

  state = { uploadStatus: 'idle', uploadedFiles: '' };

  onFilesDrop = async (files) => {
    const { path } = this.props;

    const uploadedFiles = await files.map(async (file) => {
      const result = await firebase.uploadFiles(path, [file]);
      const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();
      await firebase.push(`/${path}`, { name: file.name, downloadURL });
      return downloadURL;
    });

    this.setState({ uploadStatus: 'uploading' });

    Promise.all(uploadedFiles).then(() => {
      this.setState({ uploadedFiles, uploadStatus: 'done' });
      this.delayedNormalize();
    });

    return uploadedFiles;
  }


  render() {
    const { uploadStatus, uploadedFiles } = this.state;

    const uploadState = uploadStatus === 'uploading';
    const doneState = uploadStatus === 'done';
    const idleState = uploadStatus === 'idle';
    const statusClasses = `${uploadState && 'has-text-warning'} ${doneState && 'has-text-success'} ${idleState && ''}`;
    return (
      <Fragment>
        <Dropzone onDrop={this.onFilesDrop} className={`box ${statusClasses} is-fullwidth`}>
          {idleState &&
            <div className="fade-in">
              <Translate id="dropfileshere" />
            </div>
          }

          {uploadState &&
            <div className="fade-in">
              <Translate id="uploadingfiles" />
            </div>
          }

          {doneState &&
            <div className="fade-in">
              <Translate id="filessent" />: {uploadedFiles.length}
            </div>
          }
        </Dropzone>
      </Fragment>
    );
  }

}

FileDropper.propTypes = {
  path: PropTypes.string.isRequired,
};
