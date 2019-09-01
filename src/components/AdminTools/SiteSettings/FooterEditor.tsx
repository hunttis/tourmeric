import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import firebase from 'firebase/app';
import FileDropper from '../FileDropper';
import EditableField from '../../Common/EditableField-container';
import PrivacyPolicy from '../../MainView/PrivacyPolicy/PrivacyPolicy-container';
import { Settings } from '~/models/Settings';
import { UploadedFile } from '~/models/Category';

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
    const hasAtLeastOneSponsor = showingSponsors && !_.isEmpty(_.get(settings, 'footer', {}));

    if (isLoaded(settings)) {
      return (
        <>
          <h1 className="title">
            <Translate id="footer" />
          </h1>
          <div className="columns is-multiline">

            <div className="column is2">
              <h2 className="subtitle"><Translate id="showsponsors" /></h2>

              <div className="content">
                <button onClick={() => { firebase.update('/settings', { showSponsors: true }); }} className={`button ${showingSponsors && 'is-info'}`}><Translate id="yes" /></button>
                <button onClick={() => { firebase.update('/settings', { showSponsors: false }); }} className={`button ${!showingSponsors && 'is-info'}`}><Translate id="no" /></button>
              </div>
            </div>
            <div className="column is-4">
              <FileDropper path={filesPath} />
            </div>

            <div className="column is-12">
              <h2 className="subtitle"><Translate id="chosensponsors" /></h2>

              {_.get(settings, 'footer.first') &&
                <div className="columns box">
                  <div className="column is-6">
                    <figure className="image is-paddingless is-marginless">
                      <img className="footerImage" src={_.get(settings, 'footer.first.image', '')} alt="" />
                    </figure>
                  </div>
                  <div className="column is-6">
                    <EditableField
                      defaultValue={_.get(settings, 'footer.first.link', '')}
                      labelContent="link"
                      placeHolder="link"
                      path="/settings/footer/first"
                      targetName="link"
                    />
                  </div>
                </div>
              }
              <p>&nbsp;</p>
              {_.get(settings, 'footer.second') &&
                <div className="columns box">
                  <div className="column is-6">
                    <figure className="image is-paddingless is-marginless">
                      <img className="footerImage" src={_.get(settings, 'footer.second.image', '')} alt="" />
                    </figure>
                  </div>
                  <div className="column is-6">
                    <EditableField
                      defaultValue={_.get(settings, 'footer.second.link', '')}
                      labelContent="link"
                      placeHolder="link"
                      path="/settings/footer/second"
                      targetName="link"
                    />
                  </div>
                </div>
              }
              <p>&nbsp;</p>
              {_.get(settings, 'footer.third') &&
                <div className="columns box">
                  <div className="column is-6">
                    <figure className="image is-paddingless is-marginless">
                      <img className="footerImage" src={_.get(settings, 'footer.third.image', '')} alt="" />
                    </figure>
                  </div>
                  <div className="column is-6">
                    <EditableField
                      defaultValue={_.get(settings, 'footer.third.link', '')}
                      labelContent="link"
                      placeHolder="link"
                      path="/settings/footer/third"
                      targetName="link"
                    />
                  </div>
                </div>
              }
            </div>

            <div className="column is-12">
              {uploadedFooterItems &&
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
                      _.map(uploadedFooterItems, (file, key) => {

                        if (!file || !key) {
                          return <div>No file or key</div>;
                        }
                        const firstImage = _.get(settings, 'footer.first.image');
                        const secondImage = _.get(settings, 'footer.second.image');
                        const thirdImage = _.get(settings, 'footer.third.image');

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
                                <button className="button is-danger" onClick={() => this.deleteFile(file, key)}>
                                  <Translate id="deletefile" />
                                </button>
                                {firstImage !== file.downloadURL &&
                                  <button className="button is-primary" onClick={() => { firebase.update('/settings/footer', { first: { image: file.downloadURL } }); }}>
                                    <Translate id="first" />
                                  </button>
                                }
                                {firstImage === file.downloadURL &&
                                  <button className="button is-info" onClick={() => { firebase.update('/settings/footer', { first: null }); }}>
                                    <Translate id="first" />
                                  </button>
                                }
                                {secondImage !== file.downloadURL &&
                                  <button className="button is-primary" onClick={() => { firebase.update('/settings/footer', { second: { image: file.downloadURL } }); }}>
                                    <Translate id="second" />
                                  </button>
                                }
                                {secondImage === file.downloadURL &&
                                  <button className="button is-info" onClick={() => { firebase.update('/settings/footer', { second: null }); }}>
                                    <Translate id="second" />
                                  </button>
                                }
                                {thirdImage !== file.downloadURL &&
                                  <button className="button is-primary" onClick={() => { firebase.update('/settings/footer', { third: { image: file.downloadURL } }); }}>
                                    <Translate id="third" />
                                  </button>
                                }
                                {thirdImage === file.downloadURL &&
                                  <button className="button is-info" onClick={() => { firebase.update('/settings/footer', { third: null }); }}>
                                    <Translate id="third" />
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
          </div>

          <p>
            -- Demo --
          </p>
          <footer className="footer less-bottompadding">
            <div className="content">
              <div className="columns">

                {hasAtLeastOneSponsor &&
                  <>
                    <div className="column has-text-centered is-hidden-desktop">
                      <Translate id="sponsoredby" />:
                    </div>
                    <div className="column has-text-left is-hidden-mobile">
                      <Translate id="sponsoredby" />:
                    </div>
                  </>
                }
                {_.get(settings, 'footer.first.image') &&
                  <div className="column is-vcentered">
                    <figure className="image is-paddingless is-marginless">
                      <a href={_.get(settings, 'footer.first.link', '')} target="_blank" rel="noopener noreferrer">
                        <img className="footerImage" src={_.get(settings, 'footer.first.image', '')} alt="" />
                      </a>
                    </figure>
                  </div>
                }
                {_.get(settings, 'footer.second.image') &&
                  <div className="column">
                    <figure className="image is-paddingless is-marginless">
                      <a href={_.get(settings, 'footer.second.link', '')} target="_blank" rel="noopener noreferrer">
                        <img className="footerImage" src={_.get(settings, 'footer.second.image', '')} alt="" />
                      </a>
                    </figure>
                  </div>
                }
                {_.get(settings, 'footer.third.image') &&
                  <div className="column">
                    <figure className="image is-paddingless is-marginless">
                      <a href={_.get(settings, 'footer.third.link', '')} target="_blank" rel="noopener noreferrer">
                        <img className="footerImage" src={_.get(settings, 'footer.third.image', '')} alt="" />
                      </a>
                    </figure>
                  </div>
                }
                <div className="column has-text-centered is-hidden-desktop">
                  <PrivacyPolicy showAcceptance={false} />
                </div>
                <div className="column has-text-right is-hidden-mobile">
                  <PrivacyPolicy showAcceptance={false} />
                </div>
              </div>
            </div>
          </footer>
          <p>
            -- Demo --
          </p>

        </>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}
