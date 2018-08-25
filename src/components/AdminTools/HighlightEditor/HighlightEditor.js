import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import moment from 'moment';
import { map } from 'lodash';
import FileDropper from '../FileDropper';

import EditableField from '../../Common/EditableField-container';

const filesPath = 'uploadedHighlightBanners';

export default class HighlightEditor extends Component {

  constructor(props) {
    super(props);
    this.state = { modalOpenClass: '' };
    this.changeBanner = this.changeBanner.bind(this);
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

  deleteHighlight(highlightId) {
    firebase.set(`/highlights/${highlightId}`, {});
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
        {highlights && Object.entries(highlights).map((highlightEntry) => {
          const highlightId = highlightEntry[0];
          const highlight = highlightEntry[1];
          const highlightImageExists = Boolean(highlight.image);
          return (
            <div key={highlightId} className="columns is-tablet">
              <div className="column is-3">{moment(highlight.createDate).format('DD-MM-YYYY')}</div>
              <div className="column is-4">{highlight.name || 'No name'}</div>
              <div className="column is-2">
                {highlightImageExists &&
                <figure className="image is-3by1">
                  <img alt="" src={highlight.image} />
                </figure>
                  }
                {!highlightImageExists && 'No image'}
              </div>

              <div className="column is-1">
                <button className="button" onClick={() => this.openModal(highlightId, highlight)}><Translate id="edit" /></button>
              </div>
              <div className="column is-1">
                <button className="button is-danger" onClick={() => this.deleteHighlight(highlightId)}><Translate id="delete" /></button>
              </div>
              <div className="column is-1">
                {highlight.active &&
                <button className="button is-warning" onClick={() => this.setActiveStatus(highlightId, false)}><Translate id="deactivate" /></button>
                }
                {!highlight.active &&
                <button className="button is-success" onClick={() => this.setActiveStatus(highlightId, true)}><Translate id="activate" /></button>
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
    console.log('highlight image', highlightImage);
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

            <FileSelector
              files={uploadedHighlightBanners}
              defaultValue={highlightImage}
              onChange={this.changeBanner}
              path={`/highlights/${highlightId}`}
              targetName="image"
            />
            {highlightImage && <img alt="" src={highlightImage} />}


            {highlightActive &&
              <button className="button is-danger" onClick={() => this.setActiveStatus(highlightId, false)}><Translate id="deactivate" /></button>
            }
            {!highlightActive &&
              <button className="button is-success" onClick={() => this.setActiveStatus(highlightId, true)}><Translate id="activate" /></button>
            }

            <div className="is-hidden">ID: {highlightId}</div>
          </div>

        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
      </div>
    );
  }

  listHighLightImages() {
    const { uploadedHighlightBanners } = this.props;

    return (
      <table className="table">
        <thead>
          <tr>
            <th><Translate id="image" /></th>
            <th><Translate id="filename" /></th>
            <th><Translate id="actions" /></th>
          </tr>
        </thead>
        {
          map(uploadedHighlightBanners, (file, key) => {

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
    );
  }

  render() {
    const { highlights, uploadedHighlightBanners } = this.props;

    if (isLoaded(highlights) && isLoaded(uploadedHighlightBanners)) {
      return (
        <Fragment>

          <div className="level is-mobile">
            <div className="level-left">
              <button className="button" onClick={() => this.createNewHighlight()}><Translate id="newhighlight" /></button>
            </div>
            <div className="level-right">
              <FileDropper path={filesPath} />
            </div>
          </div>
          {this.highlightModal()}
          {!isEmpty(highlights) && this.listHighlights(highlights)}
          {isEmpty(highlights) && <div><Translate id="nohighlightscreated" /></div>}
          {!isEmpty(uploadedHighlightBanners) && this.listHighLightImages()}
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

const FileSelector = ({ path, files, defaultValue, onChange }) => (
  <div>
    <label className="label">
      <Translate id="image" />
    </label>
    <div className="control">
      <div className="select">
        <select defaultValue={defaultValue} onChange={event => onChange(path, { image: event.target.value })}>
          <option value=""><Translate id="select" /></option>
          {files && Object.keys(files).map(fileKey => <option key={fileKey} value={files[fileKey].downloadURL}>{files[fileKey].name}</option>)}
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
