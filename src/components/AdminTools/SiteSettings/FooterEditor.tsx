import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import firebase from 'firebase/app';
import FileDropper from '../FileDropper';
import EditableField from '../../Common/EditableField-container';
import { Settings } from '../../../models/Settings';
import { UploadedFile } from '../../../models/Category';

const filesPath = 'uploadedFooterItems';

interface Props {
  settings: Settings;
  uploadedFooterItems: { [key: string]: UploadedFile };
}

export default class PrivacyPolicyEditor extends Component<Props> {

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
    const { settings, uploadedFooterItems } = this.props;

    const showingSponsors = _.get(settings, 'showSponsors', false);

    if (isLoaded(settings)) {
      return (
        <div className="section">
          <h1 className="title">
            <FormattedMessage id="footer" />
          </h1>
          <div className="columns is-multiline">

            <div className="column is-12">
              <h2 className="subtitle"><FormattedMessage id="showsponsors" /></h2>

              <div className="content">
                <button onClick={() => { firebase.update('/settings', { showSponsors: true }); }} className={`button ${showingSponsors && 'is-info'}`}><FormattedMessage id="yes" /></button>
                <button onClick={() => { firebase.update('/settings', { showSponsors: false }); }} className={`button ${!showingSponsors && 'is-info'}`}><FormattedMessage id="no" /></button>
              </div>
            </div>

            <div className="column is-8">
              {uploadedFooterItems &&
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
                      _.map(uploadedFooterItems, (file, key) => {

                        if (!file || !key) {
                          return <div>No file or key</div>;
                        }

                        const imageChosen = _.find(settings.footer, (footer) => footer.image === file.downloadURL);

                        return (
                          <tbody key={file.name + key}>
                            <tr className="">
                              <td>
                                <img className="footerImage" src={file.downloadURL} alt="" />
                              </td>
                              <td>
                                <span>{file.name}</span>
                              </td>
                              <td>

                                {!imageChosen &&
                                  <button className="button is-info is-outlined" onClick={() => { firebase.update(`/settings/footer/${key}`, { image: file.downloadURL }); }}>
                                    <FormattedMessage id="activate" />
                                  </button>
                                }
                                {imageChosen &&
                                  <button className="button is-warning is-outlined" onClick={() => { firebase.update('/settings/footer', { [key]: null }); }}>
                                    <FormattedMessage id="deactivate" />
                                  </button>
                                }

                                {!imageChosen &&
                                <button className="button is-danger" onClick={() => this.deleteFile(file, key)}>
                                  <FormattedMessage id="deletefile" />
                                </button>
                                }

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

            <div className="column is-12">
              <h1 className="title"><FormattedMessage id="chosensponsors" /> :</h1>
              <div className="columns is-multiline">
                {settings.footer && Object.entries(settings.footer).map((footerEntry) => {

                  const key = footerEntry[0];
                  const value = footerEntry[1];

                  return (
                    <div className="column is-4" key={`Footer-${key}`}>
                      <div className="card">
                        <div className="card-image has-text-centered">

                          <figure className="image is-marginless is-inline-block">
                            <img className="footerImage" src={value.image} alt="" />
                          </figure>

                        </div>

                        <div className="card-content">
                          <EditableField
                            defaultValue={value.text}
                            labelContent="text"
                            placeHolder="text"
                            path={`/settings/footer/${key}`}
                            targetName="text"
                          />
                        </div>

                        <div className="card-content">
                          <EditableField
                            defaultValue={value.link}
                            labelContent="link"
                            placeHolder="link"
                            path={`/settings/footer/${key}`}
                            targetName="link"
                          />
                        </div>

                        <div className="card-footer buttons is-right">
                          <button className="button is-warning is-outlined" onClick={() => { firebase.update('/settings/footer', { [key]: null }); }}>
                            <FormattedMessage id="deactivate" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      );

    }
    return <div><FormattedMessage id="loading" /></div>;
  }
}
