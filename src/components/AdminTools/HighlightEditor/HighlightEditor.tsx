import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import firebase from 'firebase/app';
import moment from 'moment';
import { map } from 'lodash';
import FileDropper from '../FileDropper';

import { HighlightEditorItem } from './HighlightEditorItem';
import HighlightEditorModal from './HighlightEditorModal';
import { UploadedFile } from '~/models/Category';
import { HighLight } from '~/models/ReduxState';

const filesPath = 'uploadedHighlightBanners';

interface Props {
  highlights: { [key: string]: HighLight };
  uploadedHighlightBanners: { [key: string]: UploadedFile };
}

interface State {
  highlightId: string;
  modalOpenClass: string;
}

export default class HighlightEditor extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { highlightId: '', modalOpenClass: '' };
    this.openModal.bind(this);
  }

  deleteFile = async (file: UploadedFile, key: string) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  createNewHighlight() {
    firebase.push('/highlights', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
  }

  openModal(highlightId: string) {
    this.setState({ modalOpenClass: 'is-active', highlightId });
  }

  closeModal() {
    this.setState({ modalOpenClass: '', highlightId: '' });
  }


  listHighlightImages() {
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
    const { modalOpenClass, highlightId } = this.state;

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
          <div className={`modal ${modalOpenClass}`}>
            <div className="modal-background" onClick={() => this.closeModal()} />
            <div className="modal-content">
              {highlightId &&
                <HighlightEditorModal
                  highlightId={highlightId}
                  highlight={highlights[highlightId]}
                  uploadedHighlightBanners={uploadedHighlightBanners}
                />
              }
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
          </div>
          {
            highlights &&
            !isEmpty(highlights) &&
            Object.entries(highlights).map((highlightEntry, index) => <HighlightEditorItem
              key={`highlightEntry-${index}`}
              highlightEntry={highlightEntry}
              openModal={() => this.openModal(highlightEntry[0])}
            />)
          }

          {isEmpty(highlights) && <div><Translate id="nohighlightscreated" /></div>}
          {!isEmpty(uploadedHighlightBanners) && this.listHighlightImages()}
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}
