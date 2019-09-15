import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

interface Props {
  path: string;
}

export default class FileDropper extends Component<Props> {

  delayedNormalize = _.debounce(() => {
    this.setState({ uploadStatus: 'idle', uploadedFiles: '' });
  }, 3000);

  state = { uploadStatus: 'idle', uploadedFiles: '' };

  onFilesDrop = async (files: any) => {
    const { path } = this.props;

    const uploadedFiles = await files.map(async (file: File) => {
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
      <>
        <Dropzone onDrop={this.onFilesDrop} className={`dropzone ${statusClasses} is-fullwidth`}>
          {idleState &&
            <div className="fade-in">
              <p className="icon fa-2x"><i className="fas fa-file-upload" /></p>
              <p>&nbsp;</p>
              <p><Translate id="dropfileshere" /></p>
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
      </>
    );
  }

}
