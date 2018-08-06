import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import firebase from 'firebase/app';
import moment from 'moment';

import EditableField from '../../Common/EditableField-container';

const filesPath = 'uploadedHighlightBanners';

export default class HighlightEditor extends Component {

  constructor(props) {
    super(props);
    this.state = { modalOpenClass: '' };
    this.changeBanner = this.changeBanner.bind(this);
  }

  onFilesDrop = async (files) => {
    const result = await firebase.uploadFiles(filesPath, [files[0]]);
    const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();
    firebase.set(`/${filesPath}/${files[0].lastModified}${files[0].size}`, { name: files[0].name, downloadURL });
    return result;
  }

  setActiveStatus(highlightId, newStatus) {
    firebase.update(`/highlights/${highlightId}`, { active: newStatus });
    this.setState({ highlightActive: newStatus });
  }

  deleteFile = async (file, key) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  createNewHighlight() {
    firebase.push('/highlights', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
  }

  changeBanner(path, value) {
    firebase.update(`/${path}`, value);
    this.setState({ highlightImage: value.image });
  }

  listHighlights(highlights) {
    return (
      <Fragment>
        {Object.entries(highlights).map((highlightEntry) => {
          const highlightId = highlightEntry[0];
          const highlight = highlightEntry[1];
          const highlightImageExists = Boolean(highlight.image);
          return (
            <div key={highlightId} className="columns is-tablet">
              <div className="column is-3">{moment(highlight.createDate).format('DD-MM-YYYY')}</div>
              {/* <div className="column is-3">{moment(highlight.date).format('DD-MM-YYYY')}</div> */}
              <div className="column is-3">{highlight.name || 'No name'}</div>
              <div className="column is-3">
                {highlightImageExists && <img alt="" src={highlight.image} /> }
                {!highlightImageExists && 'No image'}
              </div>

              <div className="column is-3">
                <button className="button" onClick={() => this.openModal(highlightId, highlight)}>Edit highlight</button>
                {highlight.active &&
                  <button className="button is-danger" onClick={() => this.setActiveStatus(highlightId, false)}>Deactivate</button>
                }
                {!highlight.active &&
                  <button className="button is-success" onClick={() => this.setActiveStatus(highlightId, true)}>Activate</button>
                }
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }

  openModal(highlightId, highlight) {
    this.setState({ modalOpenClass: 'is-active', highlightId, highlightName: highlight.name, highlightImage: highlight.image, highlightDate: highlight.date, highlightActive: highlight.active });
  }

  closeModal() {
    this.setState({ modalOpenClass: '', highlightId: '', highlightName: '', highlightDate: '', highlightImage: '', highlightActive: '' });
  }

  highlightModal() {
    const { uploadedHighlightBanners } = this.props;
    const { modalOpenClass, highlightId, highlightName, highlightImage, highlightDate, highlightActive } = this.state;

    return (
      <div className={`modal ${modalOpenClass}`}>
        <div className="modal-background" onClick={() => this.closeModal()} />
        <div className="modal-content">
          <div className="box">

            <EditableField
              defaultValue={highlightName}
              labelContent="name"
              placeHolder="name"
              path={`/highlights/${highlightId}`}
              targetName="name"
            />
            <EditableField
              defaultValue={highlightDate}
              labelContent="date"
              placeHolder="date"
              path={`/highlights/${highlightId}`}
              targetName="date"
            />
            {/* <EditableField
              defaultValue={highlightImage}
              labelContent="image"
              placeHolder="image"
              path={`/highlights/${highlightId}`}
              targetName="image"
            /> */}
            <FileSelector
              files={uploadedHighlightBanners}
              defaultValue={highlightImage}
              onChange={this.changeBanner}
              path={`/highlights/${highlightId}`}
              targetName="image"
            />
            {highlightImage && <img alt="" src={highlightImage} />}


            {highlightActive &&
              <button className="button is-danger" onClick={() => this.setActiveStatus(highlightId, false)}>Deactivate</button>
            }
            {!highlightActive &&
              <button className="button is-success" onClick={() => this.setActiveStatus(highlightId, true)}>Activate</button>
            }

            <div>ID: {highlightId}</div>
          </div>

        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
      </div>
    );
  }

  render() {
    const { highlights, uploadedHighlightBanners } = this.props;

    if (isLoaded(highlights) && isLoaded(uploadedHighlightBanners)) {
      return (
        <Fragment>

          <div className="level is-mobile">
            <div className="level-left">
              <button className="button" onClick={() => this.createNewHighlight()}>New highlight</button>
            </div>
            <div className="level-right">
              <Dropzone onDrop={this.onFilesDrop}>
                <div>
                  <Translate id="dropfileshere" />
                </div>
              </Dropzone>
            </div>
          </div>
          {this.highlightModal()}
          {!isEmpty(highlights) && this.listHighlights(highlights)}
          {isEmpty(highlights) && <div>No highlights created, yet...</div>}
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

const FileSelector = ({ path, files, defaultValue, onChange }) => (
  <div>
    <label className="label">
      <Translate id="categorylogo" />
    </label>
    <div className="control">
      <div className="select">
        <select defaultValue={defaultValue} onChange={event => onChange(path, { image: event.target.value })}>
          <option value=""><Translate id="select" /></option>
          {Object.keys(files).map(fileKey => <option key={fileKey} value={files[fileKey].downloadURL}>{files[fileKey].name}</option>)}
        </select>
      </div>
    </div>
  </div>
);

FileSelector.propTypes = {
  path: PropTypes.string,
  files: PropTypes.object,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

HighlightEditor.propTypes = {
  highlights: PropTypes.object,
  uploadedHighlightBanners: PropTypes.object,
};
