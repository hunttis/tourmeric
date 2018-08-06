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
    this.state = { modalOpenClass: '' };
  }

  onFilesDrop = async (files) => {
    const result = await firebase.uploadFiles(filesPath, [files[0]]);
    const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();
    firebase.set(`/${filesPath}/${files[0].lastModified}${files[0].size}`, { name: files[0].name, downloadURL });
    return result;
  }

  setActiveStatus(newsId, newStatus) {
    firebase.update(`/news/${newsId}`, { active: newStatus });
    this.setState({ newsActive: newStatus });
  }

  deleteFile = async (file, key) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  createNewsItem() {
    firebase.push('/news', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
  }

  openModal(newsId, newsItem) {
    this.setState({ modalOpenClass: 'is-active', newsId, newsName: newsItem.name, newsImage: newsItem.image, newsDate: newsItem.date, newsActive: newsItem.active, newsText: newsItem.text });
  }

  closeModal() {
    this.setState({ modalOpenClass: '', newsId: '', newsName: '', newsDate: '', newsImage: '', newsActive: '', newsText: '' });
  }

  changeImage(path, value) {
    firebase.update(`/${path}`, value);
    this.setState({ newsImage: value.image });
  }

  listNews(news) {
    return (
      <Fragment>
        {Object.entries(news).map((newsEntry) => {
          const newsId = newsEntry[0];
          const newsItem = newsEntry[1];
          const newsImageExists = Boolean(newsItem.image);
          return (
            <div key={newsId} className="columns is-tablet">
              <div className="column is-3">{moment(newsItem.createDate).format('DD-MM-YYYY')}</div>
              {/* <div className="column is-3">{moment(newsItem.date).format('DD-MM-YYYY')}</div> */}
              <div className="column is-3">{newsItem.name || <Translate id="noname" />}</div>
              <div className="column is-3">
                {newsImageExists && <img alt="" src={newsItem.image} /> }
                {!newsImageExists && <Translate id="noimage" />}
              </div>

              <div className="column is-3">
                <button className="button" onClick={() => this.openModal(newsId, newsItem)}>Edit news</button>
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }

  newsModal() {
    const { uploadedNewsImages } = this.props;
    const { modalOpenClass, newsId, newsName, newsImage, newsDate, newsActive, newsText } = this.state;
    console.log('image', newsImage);
    return (
      <div className={`modal ${modalOpenClass}`}>
        <div className="modal-background" onClick={() => this.closeModal()} />
        <div className="modal-content">
          <div className="box">

            <EditableField
              defaultValue={newsName}
              labelContent="name"
              placeHolder="name"
              path={`/news/${newsId}`}
              targetName="name"
            />
            <EditableField
              defaultValue={newsDate}
              labelContent="date"
              placeHolder="date"
              path={`/news/${newsId}`}
              targetName="date"
            />
            <EditableTextarea
              isOk={this.state.prizesOk}
              updateFieldStatus={this.updateFieldStatus}
              labelContent="text"
              placeHolder="newstextplaceholder"
              defaultValue={newsText}
              path={`/news/${newsId}`}
              targetName="text"
            />
            <FileSelector
              files={uploadedNewsImages}
              defaultValue={newsImage}
              onChange={this.changeImage}
              path={`/news/${newsId}`}
              targetName="image"
            />
            {newsImage && <img alt="" src={newsImage} />}


            {newsActive &&
              <button className="button is-danger" onClick={() => this.setActiveStatus(newsId, false)}>Deactivate</button>
            }
            {!newsActive &&
              <button className="button is-success" onClick={() => this.setActiveStatus(newsId, true)}>Activate</button>
            }

            <div>ID: {newsId}</div>
          </div>

        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
      </div>
    );
  }

  render() {
    const { news, uploadedNewsImages } = this.props;

    if (isLoaded(news) && isLoaded(uploadedNewsImages)) {
      return (
        <Fragment>

          <div className="level is-mobile">
            <div className="level-left">
              <button className="button" onClick={() => this.createNewsItem()}>New news item</button>
            </div>
            <div className="level-right">
              <Dropzone onDrop={this.onFilesDrop}>
                <div>
                  <Translate id="dropfileshere" />
                </div>
              </Dropzone>
            </div>
          </div>
          {this.newsModal()}
          {!isEmpty(news) && this.listNews(news)}
          {isEmpty(news) && <div>No news created, yet...</div>}
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
