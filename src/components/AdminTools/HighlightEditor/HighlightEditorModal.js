import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import EditableField from '../../Common/EditableField-container';
import ImagePicker from '../ImagePicker';

export default class HighlightEditorModal extends Component {

  setActiveStatus(highlightId, newStatus) {
    firebase.update(`/highlights/${highlightId}`, { active: newStatus });
  }

  render() {
    const { highlight, highlightId, uploadedHighlightBanners } = this.props;

    return (
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

          <ImagePicker
            imageList={uploadedHighlightBanners}
            highlightedImage={highlight.image}
            path={`/highlights/${highlightId}`}
          />

          {highlight.active &&
          <button className="button is-danger" onClick={() => this.setActiveStatus(highlightId, false)}><Translate id="deactivate" /></button>
        }
          {!highlight.active &&
          <button className="button is-success" onClick={() => this.setActiveStatus(highlightId, true)}><Translate id="activate" /></button>
        }

          <div className="is-hidden">ID: {highlightId}</div>
        </div>

      </Fragment>
    );
  }
}

HighlightEditorModal.propTypes = {
  highlightId: PropTypes.string.isRequired,
  highlight: PropTypes.object.isRequired,
  uploadedHighlightBanners: PropTypes.object.isRequired,
};
