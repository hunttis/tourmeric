import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { map } from 'lodash';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import 'firebase/storage';

const filesPath = 'uploadedCategoryLogos';

export default class CategoryLogoUploader extends Component {

  onFilesDrop = async (files) => {
    const result = await firebase.uploadFiles(filesPath, [files[0]]);
    const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();
    firebase.set(`/${filesPath}/${files[0].lastModified}${files[0].size}`, { name: files[0].name, downloadURL });
    return result;
  }

  deleteFile = async (file, key) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  render() {
    const { uploadedCategoryLogos } = this.props;

    return (
      <section className="section">
        <Dropzone onDrop={this.onFilesDrop}>
          <div>
            <Translate id="dropfileshere" />
          </div>
        </Dropzone>
        <br />
        {
        uploadedCategoryLogos &&
          <div>
            <h1 className="title">
              <Translate id="uploadedfiles" />:
            </h1>
            <table className="table">
              <thead>
                <tr>
                  <th><Translate id="image" /></th>
                  <th><Translate id="filename" /></th>
                  <th><Translate id="actions" /></th>
                </tr>
              </thead>
              {
              map(uploadedCategoryLogos, (file, key) => {
                // console.log(file, key);
                if (!file || !key) {
                  return <div>No file or key</div>;
                }
                return (
                  <tbody key={file.name + key}>
                    <tr className="">
                      <td>
                        <img className="thumbnail" src={file.downloadURL} alt="" />
                      </td>
                      <td>
                        <span>{file.name}</span>
                      </td>
                      <td>
                        <button className="button is-danger" onClick={() => this.deleteFile(file, key)}>
                          <Translate id="deletefile" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        }

      </section>
    );
  }

}

CategoryLogoUploader.propTypes = {
  uploadedCategoryLogos: PropTypes.object,
};
