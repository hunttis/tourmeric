import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import moment from 'moment';
import { map } from 'lodash';

import FileDropper from '../FileDropper';
import EditableField from '../../Common/EditableField-container';
import EditableTextarea from '../../Common/EditableTextarea-container';
import ImagePicker from '../ImagePicker';
import NewsItem from '../../MainView/Today/NewsItem';

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
    const { dateFormat } = this.props.settings;

    return (
      <div className="columns is-multiline">

        {Object.entries(news).map((newsEntry) => {
          const newsId = newsEntry[0];
          const newsData = newsEntry[1];
          const newsItem = { key: newsId, value: newsData };

          return (
            <Fragment key={newsId}>
              <div className="column is-6">
                <div className="level is-marginless">
                  <div className="level-left">
                    &nbsp;
                  </div>
                  <div className="level-right">
                    <span className={`${newsData.active && 'has-text-success'} ${!newsData.active && 'has-text-warning'}`}>
                      {newsData.active && <Translate id="published" />}
                      {!newsData.active && <Translate id="notpublished" />}
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <button className="button" onClick={() => this.openModal(newsId)}><Translate id="edit" /></button>
                    {newsData.active && <button className="button is-danger" onClick={() => this.setActiveStatus(newsId, false)}><Translate id="unpublish" /></button>}
                    {!newsData.active && <button className="button is-success" onClick={() => this.setActiveStatus(newsId, true)}><Translate id="publish" /></button>}
                  </div>
                </div>
                <p className="is-marginless is-paddingless">
                  <NewsItem newsItem={newsItem} dateFormat={dateFormat} />
                </p>
              </div>
            </Fragment>
          );
        })
        }

      </div>
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

                  <ImagePicker
                    imageList={uploadedNewsImages}
                    highlightedImage={newsItem.image}
                    path={`/news/${newsId}`}
                    fieldName="image"
                  />

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

  listNewsImages() {
    const { uploadedNewsImages } = this.props;

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
          map(uploadedNewsImages, (file, key) => {

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
    const { news, uploadedNewsImages } = this.props;

    if (isLoaded(news) && isLoaded(uploadedNewsImages)) {
      return (
        <Fragment>
          <div className="level is-mobile">
            <div className="level-left">
              <button className="button" onClick={() => this.createNewsItem()}><Translate id="newnewsitem" /></button>
            </div>
            <div className="level-right">
              <FileDropper path={filesPath} />
            </div>
          </div>
          {this.newsModal(news)}
          {!isEmpty(news) && this.listNews(news)}
          {isEmpty(news) && <div><Translate id="nonewscreatedyet" /></div>}
          {!isEmpty(uploadedNewsImages) && this.listNewsImages()}
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
  settings: PropTypes.object,
};
