import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import moment from 'moment';
import firebase from 'firebase/app';
import FileDropper from '../FileDropper';
import EditableField from '../../Common/EditableField';
import EditableTextarea from '../../Common/EditableTextarea';
import { OpeningHoursEditor } from './OpeningHoursEditor';
import OpeningHoursExceptionEditor from './OpeningHoursExceptionEditor-container';
import { Settings } from '../../../models/Settings';
import { UploadedFile } from '../../../models/Category';
import { OpeningHoursException } from '../../../models/OpeningHours';
import { OpeningHours } from '../../../components/StoreInfo/OpeningHours';

const filesPath = 'uploadedStoreinfoFiles';

interface Props {
  settings: Settings;
  uploadedStoreinfoFiles: { [key: string]: UploadedFile };
  openinghoursexceptions: { [key: string]: OpeningHoursException };
}

interface State {
  openingHoursExceptionEditorOpen: boolean;
}

export default class StoreInfoEditor extends Component<Props, State> {

  state = { openingHoursExceptionEditorOpen: false }

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

  useAsLocationImage = (file: UploadedFile) => {
    firebase.update('/settings/', { activeLocationImage: file.downloadURL });
  }

  disableLogo = () => {
    // TODO Fix
    // console.log('DOES NOTHING!');
  }

  todaysOpeningHours() {
    const { settings, openinghoursexceptions } = this.props;
    const todayName = moment().format('dddd').toLowerCase();
    const todayDateString = moment().format('YYYY-MM-DD');

    const todaysHours = _.get(settings, `openingHours.${todayName}`, '');
    const exception = _.get(openinghoursexceptions, todayDateString);

    if (exception) {
      if (exception.status === 'closed') {
        return (
          <div className="box">
            <span className="has-text-danger"><FormattedMessage id="exceptionallynotopentoday" /></span>
            : {exception.name}
          </div>
        );
      }
      return (
        <div className="box">
          <span className="has-text-success"><FormattedMessage id="exceptionallyopentoday" /></span>
          : {exception.openingHours}
        </div>
      );
    }
    return (
      <div className="box"><FormattedMessage id="opentoday" /> : <span className="has-text-success">{todaysHours}</span></div>
    );
  }

  toggleOpeningHourExceptions() {
    this.setState((prevState) => ({ openingHoursExceptionEditorOpen: !prevState.openingHoursExceptionEditorOpen }));
  }

  render() {
    const { settings, uploadedStoreinfoFiles, openinghoursexceptions } = this.props;
    const introTextActive = _.get(settings, 'features.storeinfo.introtext', false);

    if (isLoaded(settings)) {
      const { openingHours, location, introText } = settings;
      return (
        <>
          <h1 className="title">
            <FormattedMessage id="storeinfo" />
          </h1>

          <h2 className="subtitle">
            <FormattedMessage id="introtext" />
          </h2>
          <div className="box">
            <EditableTextarea
              defaultValue={introText}
              labelContent=""
              placeHolder="introtextplaceholder"
              path="/settings"
              targetName="introText"
            />
            <div className="level">
              <div className="level-left">
                <FormattedMessage id="featureactive" />:
              </div>
              <div className="level-right">
                <button onClick={() => { firebase.update('/settings/features/storeinfo/', { introtext: true }); }} className={`button ${introTextActive && 'is-success'}`}><FormattedMessage id="on" /></button>
                <button onClick={() => { firebase.update('/settings/features/storeinfo/', { introtext: false }); }} className={`button ${!introTextActive && 'is-danger'}`}><FormattedMessage id="off" /></button>
              </div>
            </div>
          </div>

          <OpeningHoursEditor openingHours={openingHours} toggleOpeningHourExceptions={() => this.toggleOpeningHourExceptions()} />
          <div className="box">
            <OpeningHours settings={settings} openinghoursexceptions={openinghoursexceptions} />
          </div>

          {this.state.openingHoursExceptionEditorOpen && <OpeningHoursExceptionEditor openinghoursexceptions={openinghoursexceptions} />}

          <h2 className="subtitle">
            <FormattedMessage id="storelocation" />
          </h2>
          <div className="box columns is-multiline">
            <div className="column is-6">
              <EditableTextarea
                defaultValue={_.get(location, 'directions', '')}
                labelContent="directions"
                placeHolder="directionsplaceholder"
                path="/settings/location"
                targetName="directions"
              />
            </div>
            <div className="column is-6">
              <EditableTextarea
                defaultValue={_.get(location, 'address', '')}
                labelContent="address"
                placeHolder="addressplaceholder"
                path="/settings/location"
                targetName="address"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(location, 'phone', '')}
                labelContent="phone"
                placeHolder="phoneplaceholder"
                path="/settings/location"
                targetName="phone"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(location, 'email', '')}
                labelContent="email"
                placeHolder="emailplaceholder"
                path="/settings/location"
                targetName="email"
              />
            </div>
          </div>

          <FileDropper path={filesPath} />
          <div>
            {
              uploadedStoreinfoFiles &&
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
                    _.map(uploadedStoreinfoFiles, (file, key) => (
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
                            {(settings.locationImage !== file.downloadURL) &&
                              <button className="button is-info" onClick={() => this.useAsLocationImage(file)}>
                                <FormattedMessage id="useaslocationimage" />
                              </button>
                            }
                            {(settings.locationImage === file.downloadURL) &&
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
          </div>
        </>
      );

    }
    return <div><FormattedMessage id="loading" /></div>;
  }
}
