import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';

import firebase from 'firebase/app';
import moment from 'moment';
import { map } from 'lodash';

import FileDropper from '../FileDropper';
import EditableField from '../../Common/EditableField-container';
import EditableTextarea from '../../Common/EditableTextarea-container';
import ImagePicker from '../ImagePicker';

import { UploadedFile } from '../../../models/Category';
import { Settings } from '../../../models/Settings';
import { SingleNewsItem } from '../../../models/ReduxState';
import NewsItem from '../../../components/MainView/Today/NewsItem';

const filesPath = 'uploadedNewsImages';


interface Props {
  news: { [key: string]: SingleNewsItem };
  uploadedNewsImages: { [key: string]: UploadedFile };
  settings: Settings;
  updateFieldStatus: (key: string, isEmpty: boolean, data: string) => void;
}

interface State {
  openNewsModalId: string;
}

export default class NewsEditor extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { openNewsModalId: '' };
    this.changeImage.bind(this);
  }

  onFilesDrop = async (files: any) => {
    const result = await firebase.uploadFiles(filesPath, [files[0]]);
    const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();
    firebase.set(`/${filesPath}/${files[0].lastModified}${files[0].size}`, { name: files[0].name, downloadURL });
    return result;
  }

  setActiveStatus(newsId: string, newStatus: boolean) {
    firebase.update(`/news/${newsId}`, { active: newStatus });
  }

  deleteFile = async (file: UploadedFile, key: string) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  createNewsItem() {
    firebase.push('/news', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
  }

  openModal(newsId: string) {
    this.setState({
      openNewsModalId: newsId,
    });
  }

  closeModal() {
    this.setState({
      openNewsModalId: '',
    });
  }

  changeImage(path: string, value: string) {
    firebase.update(`/${path}`, value);
  }

  listNews(news: { [key: string]: SingleNewsItem }) {
    const { dateFormat } = this.props.settings;

    return (
      <div className="columns is-multiline">

        {Object.entries(news).map((newsEntry: [string, SingleNewsItem]) => {
          const newsId: string = newsEntry[0];
          const newsData: SingleNewsItem = newsEntry[1];
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
                <div className="is-marginless is-paddingless">
                  <NewsItem newsItem={newsItem} dateFormat={dateFormat} />
                </div>
              </div>
            </Fragment>
          );
        })
        }

      </div>
    );
  }

  newsModal(news: { [key: string]: SingleNewsItem }) {
    const { uploadedNewsImages } = this.props;
    const { openNewsModalId } = this.state;
    return (
      <>
        {news && Object.entries(news).map((newsEntry: [string, SingleNewsItem], index: number) => {
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
                    updateFieldStatus={() => { }}
                    labelContent="text"
                    placeHolder="newstextplaceholder"
                    defaultValue={newsItem.text}
                    path={`/news/${newsId}`}
                    targetName="text"
                  />

                  <EditableField
                    updateFieldStatus={() => { }}
                    labelContent="linkname"
                    placeHolder="linknameplaceholder"
                    defaultValue={newsItem.linkName}
                    path={`/news/${newsId}`}
                    targetName="linkName"
                  />

                  <EditableField
                    updateFieldStatus={() => { }}
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
      </>
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
        <>
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
        </>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}
