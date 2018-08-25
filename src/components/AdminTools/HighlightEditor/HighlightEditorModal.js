import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import EditableField from '../../Common/EditableField-container';


export const HighlightEditorModal = ({ highlightId, highlight, uploadedHighlightBanners }) => (
  <Fragment>
    <div className="box">

      <EditableField
        defaultValue={highlight.name}
        labelContent="name"
        placeHolder="name"
        path={`/highlights/${highlightId}`}
        targetName="name"
      />
      <EditableField
        defaultValue={highlight.date}
        labelContent="date"
        placeHolder="date"
        path={`/highlights/${highlightId}`}
        targetName="date"
      />

      <FileSelector
        files={uploadedHighlightBanners}
        defaultValue={highlight.image}
        onChange={changeBanner}
        path={`/highlights/${highlightId}`}
        targetName="image"
      />
      {highlight.image && <img alt="" src={highlight.image} />}


      {highlight.active &&
      <button className="button is-danger" onClick={() => setActiveStatus(highlightId, false)}><Translate id="deactivate" /></button>
        }
      {!highlight.active &&
      <button className="button is-success" onClick={() => setActiveStatus(highlightId, true)}><Translate id="activate" /></button>
        }

      <div className="is-hidden">ID: {highlightId}</div>
    </div>

  </Fragment>
);

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

const changeBanner = ({ path, value }) => {
  firebase.update(`/${path}`, value);
  this.setState({ highlightImage: value.image });
};

const setActiveStatus = (highlightId, newStatus) => {
  firebase.update(`/highlights/${highlightId}`, { active: newStatus });
};


FileSelector.propTypes = {
  path: PropTypes.string,
  files: PropTypes.object,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

HighlightEditorModal.propTypes = {
  highlightId: PropTypes.string.isRequired,
  highlight: PropTypes.object.isRequired,
  uploadedHighlightBanners: PropTypes.object.isRequired,
};
