import React, { Component } from 'react';
import { map } from 'lodash';
import firebase from 'firebase/app';
import 'firebase/storage';
import { FormattedMessage, IntlShape } from "react-intl";
import FileDropper from '../FileDropper';
import { UploadedFile } from '../../../models/Category';
import { Settings } from '../../../models/Settings';

const filesPath = 'uploadedFiles';

interface Props {
  uploadedFiles: { [key: string]: UploadedFile };
  settings: Settings;
}

export default class FileHandler extends Component<Props> {

  onFilesDrop = async (files: any) => {
    const result = await firebase.uploadFiles(filesPath, [files[0]]);
    const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();

    firebase.set(`/${filesPath}/${files[0].lastModified}${files[0].size}`, { name: files[0].name, downloadURL });

    return result;
  }

  deleteFile = async (file: UploadedFile, key: string) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  useAsLogo = (file: UploadedFile) => {
    firebase.update('/settings/', { activeLogo: file.downloadURL });
  }

  disableLogo = () => {
    firebase.update('/settings/', { activeLogo: null });
  }

  render() {
    const { uploadedFiles, settings } = this.props;
    return (
      <section className="section">
        <br />

        <FileDropper path={filesPath} />

        {
          uploadedFiles &&
          <div>
            <h1 className="title">
              <FormattedMessage id="uploadedfiles" />
            </h1>
            <table className="table">
              <thead>
                <tr>
                  <th><FormattedMessage id="image" /></th>
                  <th><FormattedMessage id="filename" /></th>
                  <th><FormattedMessage id="actions" /></th>
                </tr>
              </thead>
              {
                map(uploadedFiles, (file, key) => (
                  <tbody key={file.name + key}>
                    <tr className={(settings.activeLogo === file.downloadURL) ? 'is-selected' : ''}>
                      <td>
                        <img className="thumbnail" src={file.downloadURL} alt="" />
                      </td>
                      <td>
                        <span>{file.name}</span>
                      </td>
                      <td>
                        <button className="button is-danger" onClick={() => this.deleteFile(file, key)}>
                          <FormattedMessage id="deletefile" />
                        </button>
                        {(settings.activeLogo !== file.downloadURL) &&
                          <button className="button is-info" onClick={() => this.useAsLogo(file)}>
                            <FormattedMessage id="useaslogo" />
                          </button>
                        }
                        {(settings.activeLogo === file.downloadURL) &&
                          <button className="button is-warning" onClick={() => this.disableLogo()}>
                            <FormattedMessage id="disableaslogo" />
                          </button>
                        }
                      </td>
                    </tr>
                  </tbody>
                ))
              }
            </table>
          </div>
        }
      </section>
    );
  }

}
