import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import EditableField from '../../Common/EditableField-container';
import ImagePicker from '../ImagePicker';
import { HighLight } from '~/models/ReduxState';
import { UploadedFile } from '~/models/Category';

interface Props {
  highlightId: string;
  highlight: HighLight;
  uploadedHighlightBanners: {[key: string]: UploadedFile};
};

export default class HighlightEditorModal extends Component<Props> {

  setActiveStatus(highlightId: string, newStatus: boolean) {
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
            fieldName="image"
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

