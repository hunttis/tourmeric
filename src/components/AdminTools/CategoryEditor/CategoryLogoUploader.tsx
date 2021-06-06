import React, { Component } from 'react';
import { map } from 'lodash';
import firebase from 'firebase/app';
import { FormattedMessage, IntlShape } from "react-intl";
import 'firebase/storage';
import FileDropper from '../FileDropper';
import { UploadedFile } from '../../../models/Category';

const filesPath = 'uploadedCategoryLogos';

interface Props {
  uploadedCategoryLogos: { [key: string]: UploadedFile };
}

export default class CategoryLogoUploader extends Component<Props> {

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

  render() {
    const { uploadedCategoryLogos } = this.props;

    return (
      <section className="section">
        <div className="columns">

          <div className="column is-8">
            {
              uploadedCategoryLogos &&
              <div>
                <h1 className="title">
                  <FormattedMessage id="uploadedfiles" />:
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
                                <FormattedMessage id="deletefile" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              </div>
            }
          </div>


          <div className="column is-4">
            <FileDropper path={filesPath} />
          </div>

        </div>

      </section>
    );
  }
}
