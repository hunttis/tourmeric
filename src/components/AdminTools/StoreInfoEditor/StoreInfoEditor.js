import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
// import firebase from 'firebase/app';
import _ from 'lodash';
import firebase from 'firebase/app';
import FileDropper from '../FileDropper';
import EditableField from '../../Common/EditableField';
import EditableTextarea from '../../Common/EditableTextarea';
import { OpeningHoursEditor } from './OpeningHoursEditor';

const filesPath = 'uploadedStoreinfoFiles';

export default class StoreInfoEditor extends Component {

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

  useAsLocationImage = (file) => {
    firebase.update('/settings/', { activeLocationImage: file.downloadURL });
  }

  render() {
    const { settings, uploadedStoreinfoFiles } = this.props;
    const { openingHours, location } = settings;

    if (isLoaded(settings)) {
      return (
        <Fragment>
          <h1 className="title">
            <Translate id="storeinfo" />
          </h1>

          <OpeningHoursEditor openingHours={openingHours} />

          <h2 className="subtitle">
            <Translate id="storelocation" />
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
              <Translate id="uploadedfiles" />
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
                        <Translate id="deletefile" />
                      </button>
                      {(settings.locationImage !== file.downloadURL) &&
                      <button className="button is-info" onClick={() => this.useAsLocationImage(file)}>
                        <Translate id="useaslocationimage" />
                      </button>
                      }
                      {(settings.locationImage === file.downloadURL) &&
                      <button className="button is-warning" onClick={() => this.disableLogo()}>
                        <Translate id="disableaslogo" />
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
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

StoreInfoEditor.propTypes = {
  settings: PropTypes.object,
  uploadedStoreinfoFiles: PropTypes.object,
};
