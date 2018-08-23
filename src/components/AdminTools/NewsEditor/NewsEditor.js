import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import firebase from 'firebase/app';
import moment from 'moment';

import EditableField from '../../Common/EditableField-container';
import EditableTextarea from '../../Common/EditableTextarea-container';

const filesPath = 'uploadedNewsImages';

export default class NewsEditor extends Component {

  constructor(props) {
    super(props);
    this.state = { openNewsModalId: '' };
    this.changeImage.bind(this);
  }

  onFilesDrop = async (files) => {
    const result = await firebase.uploadFiles(filesPath, [files[0]]);
    const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();
    firebase.set(`/${filesPath}/${files[0].lastModified}${files[0].size}`, { name: files[0].name, downloadURL });
    return result;
  }

  setActiveStatus(newsId, newStatus) {
    firebase.update(`/news/${newsId}`, { active: newStatus });
  }

  deleteFile = async (file, key) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  createNewsItem() {
    firebase.push('/news', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
  }

  openModal(newsId) {
    this.setState({
      openNewsModalId: newsId,
    });
  }

  closeModal() {
    this.setState({
      openNewsModalId: '',
    });
  }

  changeImage(path, value) {
    firebase.update(`/${path}`, value);
  }

  listNews(news) {
    return (
      <Fragment>
        {Object.entries(news).map((newsEntry) => {
          const newsId = newsEntry[0];
          const newsItem = newsEntry[1];
          const newsImageExists = Boolean(newsItem.image);
          const formattedContent = newsItem.text ? newsItem.text.split('\n') : [];

          return (
            <div key={newsId} className="columns is-tablet">
              <div className="column is-2">{moment(newsItem.createDate).format('DD-MM-YYYY')}</div>
              {/* <div className="column is-3">{moment(newsItem.date).format('DD-MM-YYYY')}</div> */}
              <div className="column is-2">{newsItem.name || <Translate id="noname" />}</div>
              <div className="column is-2">
                {newsImageExists && <img alt="" src={newsItem.image} /> }
                {!newsImageExists && <Translate id="noimage" />}
              </div>
              <div className="column">
                {formattedContent.map((paragraph, index) => (<p key={index}>{paragraph}&nbsp;</p>))}
              </div>

              <div className="column is-2">
                <button className="button" onClick={() => this.openModal(newsId)}><Translate id="edit" /></button>
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }

  newsModal(news) {
    const { uploadedNewsImages } = this.props;
    const { openNewsModalId } = this.state;
    return (
      <Fragment>
        {news && Object.entries(news).map((newsEntry, index) => {
          const newsId = newsEntry[0];
          const newsItem = newsEntry[1];
          const modalOpenClass = newsId === openNewsModalId && 'is-active';
          return (
            <div key={`newsEditorModal-${index}`} className={`modal ${modalOpenClass}`}>
              <div className="modal-background" onClick={() => this.closeModal()} />
              <div className="modal-content">
                <div className="box">

                  <EditableField
                    defaultValue={newsItem.name}
                    labelContent="name"
                    placeHolder="name"
                    path={`/news/${newsId}`}
                    targetName="name"
                  />
                  <EditableField
                    defaultValue={newsItem.date}
                    labelContent="date"
                    placeHolder="date"
                    path={`/news/${newsId}`}
                    targetName="date"
                  />

                  <EditableTextarea
                    updateFieldStatus={this.updateFieldStatus}
                    labelContent="text"
                    placeHolder="newstextplaceholder"
                    defaultValue={newsItem.text}
                    path={`/news/${newsId}`}
                    targetName="text"
                  />

                  <EditableField
                    updateFieldStatus={this.updateFieldStatus}
                    labelContent="linkname"
                    placeHolder="linknameplaceholder"
                    defaultValue={newsItem.linkName}
                    path={`/news/${newsId}`}
                    targetName="linkName"
                  />

                  <EditableField
                    updateFieldStatus={this.updateFieldStatus}
                    labelContent="link"
                    placeHolder="linkplaceholder"
                    defaultValue={newsItem.link}
                    path={`/news/${newsId}`}
                    targetName="link"
                  />

                  <div className="level">
                    <div className="level-item">
                      <FileSelector
                        files={uploadedNewsImages}
                        defaultValue={newsItem.image}
                        onChange={this.changeImage}
                        path={`/news/${newsId}`}
                        targetName="image"
                      />
                    </div>
                    <div className="level-item">
                      {newsItem.image && <span><img alt="" src={newsItem.image} /></span>}
                    </div>
                  </div>


                  {news.active &&
                    <button className="button is-danger" onClick={() => this.setActiveStatus(newsId, false)}><Translate id="deactivate" /></button>
                  }
                  {!news.active &&
                    <button className="button is-success" onClick={() => this.setActiveStatus(newsId, true)}><Translate id="activate" /></button>
                  }

                  <div>ID: {newsId}</div>
                </div>

              </div>
              <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
            </div>
          );
        })}
      </Fragment>
    );

  }

  render() {
    const { news, uploadedNewsImages } = this.props;

    if (isLoaded(news) && isLoaded(uploadedNewsImages)) {
      return (
        <Fragment>

          <div className="level is-mobile">
            <div className="level-left">
              <button className="button" onClick={() => this.createNewsItem()}><Translate id="newnewsitem" /></button>
            </div>
            <div className="level-right">
              <Dropzone onDrop={this.onFilesDrop} className="box">
                <div>
                  <Translate id="dropfileshere" />
                </div>
              </Dropzone>
            </div>
          </div>
          {this.newsModal(news)}
          {!isEmpty(news) && this.listNews(news)}
          {isEmpty(news) && <div><Translate id="nonewscreatedyet" /></div>}
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

const FileSelector = ({ path, files, defaultValue, onChange }) => (
  <Fragment>
    {files &&
    <div>
      <label className="label">
        <Translate id="newsimage" />
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
    }
    {!files && <div>No files have been uploaded</div>}
  </Fragment>
);

FileSelector.propTypes = {
  path: PropTypes.string,
  files: PropTypes.object,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

NewsEditor.propTypes = {
  news: PropTypes.object,
  uploadedNewsImages: PropTypes.object,
};
