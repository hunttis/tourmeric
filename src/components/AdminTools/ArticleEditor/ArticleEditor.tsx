import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import { Location, History } from 'history';

import firebase from 'firebase/app';
import moment from 'moment';

import _ from 'lodash';
import { UploadedFile } from '~/models/Category';
import { Article, ArticleItem } from '~/models/ReduxState';
import ValidatedEditableField from '../EventEditor/ValidatedEditableField';
import EditableTextarea from '../EventEditor/EditableTextarea';
import OrderedImagePicker from '../OrderedImagePicker';
import FileDropper from '../FileDropper';
import { ArticleSubTitle, ArticleTextBlock, ArticleImage } from '~/components/MainView/Articles/ArticleParts';

const filesPath = 'uploadedArticleImages';

interface Props {
  articles: { [key: string]: Article };
  uploadedArticleImages: [{ key: string, value: UploadedFile}];
  location: Location;
  history: History;
}

interface State {
  nextOrderNumber: number;
  articleId: string;
}

export default class ArticleEditor extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const articleId = _.last(this.props.location.pathname.split('/')) || '';
    let lastOrderNumber = 0;

    if (_.get(props, `articles[${articleId}].articleItems`, false)) {
      Object.values(props.articles[articleId].articleItems).forEach((articleItem: ArticleItem) => {
        if (articleItem.orderNumber > lastOrderNumber) {
          lastOrderNumber = articleItem.orderNumber;
        }
      });
    }

    this.state = { nextOrderNumber: lastOrderNumber + 1, articleId };
  }

  onFilesDrop = async (files: any) => {
    const result = await firebase.uploadFiles(filesPath, [files[0]]);
    const downloadURL = await result[0].uploadTaskSnapshot.ref.getDownloadURL();
    firebase.set(`/${filesPath}/${files[0].lastModified}${files[0].size}`, { name: files[0].name, downloadURL });
    return result;
  }

  deleteFile = async (file: UploadedFile, key: string) => {
    const storageRef = firebase.storage().ref(filesPath);
    await storageRef.child(file.name).delete();
    firebase.set(`/${filesPath}/${key}/`, {});
  }

  createArticle() {
    firebase.push('/articles', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
  }

  changeImage(path: string, value: string) {
    firebase.update(`/${path}`, value);
  }

  togglePublishStatus(path: string, currentStatus: boolean) {
    firebase.update(path, { published: !currentStatus });
  }

  render() {
    const { articles, uploadedArticleImages } = this.props;
    const { articleId } = this.state;

    if (isLoaded(articles) && !_.isEmpty(articleId)) {
      const article = articles[articleId];
      const { articleItems } = article;

      return (
        <div className="segment">
          <div className="level">
            <h1 className="title"><Translate id="editarticle" /></h1>
            {!article.published && <h2 className="subtitle has-text-info">Status: <Translate id="notpublished" /></h2>}
            {article.published && <h2 className="subtitle has-text-success">Status: <Translate id="published" /></h2>}
          </div>
          <hr />
          <div className="columns is-multiline">

            {!article.titleLocked &&
            <>
              <div className="column is-2" />

              <div className="column is-8">
                <ValidatedEditableField
                  isOk
                  updateFieldStatus={() => {}}
                  labelContent="articletitle"
                  placeHolder="eventnameplaceholder"
                  defaultValue={article.title}
                  path={`/articles/${articleId}`}
                  targetName="title"
                  isHorizontal={false}
                />
              </div>
              <div className="column is-2">
                <button
                  className="button"
                  onClick={() => firebase.update(`/articles/${articleId}`, { titleLocked: true })}
                ><i className="fas fa-lock-open" />
                </button>
              </div>
            </>
            }
            {article.titleLocked &&
            <>
              <div className="column is-2" />
              <div className="column is-8 has-text-centered">
                <h1 className="title">{article.title}</h1>
              </div>
              <div className="column is-2">
                {!article.published &&
                  <button
                    className="button"
                    onClick={() => firebase.update(`/articles/${articleId}`, { titleLocked: false })}
                  ><i className="fas fa-lock" />
                  </button>
                }
              </div>
            </>
            }


            {articleItems && Object.entries(articleItems).map((articleEntry) => {
              const itemId = articleEntry[0];
              const item = articleEntry[1];
              switch (item.itemType) {
                case 'subtitle': {
                  if (item.locked) {
                    return (
                      <Fragment key={`articleItem-${itemId}`}>
                        <ArticleSubTitle articleItem={item} padRight={false} />
                        <div className="column is-2">
                          {!article.published && <UnlockButton articleId={articleId} itemId={itemId} />}
                        </div>
                      </Fragment>
                    );
                  }
                  return (
                    <Fragment key={`articleItem-${itemId}`}>
                      <div className="column is-2" />

                      <div className="column is-8">
                        <ValidatedEditableField
                          isOk
                          updateFieldStatus={() => {}}
                          labelContent="subtitle"
                          placeHolder="subtitle"
                          defaultValue={item.text}
                          path={`/articles/${articleId}/articleItems/${itemId}`}
                          targetName="text"
                          isHorizontal={false}
                        />
                      </div>
                      <ModificationButtons articleId={articleId} itemId={itemId} />
                    </Fragment>
                  );
                }
                case 'textblock': {
                  if (item.locked) {
                    return (
                      <Fragment key={`articleItem-${itemId}`}>
                        <ArticleTextBlock articleItem={item} padRight={false} />
                        <div className="column is-2">
                          {!article.published && <UnlockButton articleId={articleId} itemId={itemId} />}
                        </div>
                      </Fragment>
                    );
                  }

                  return (
                    <Fragment key={`articleItem-${itemId}`}>
                      <div className="column is-2" />

                      <div className="column is-8">
                        <EditableTextarea
                          isOk
                          updateFieldStatus={() => {}}
                          labelContent="textblock"
                          placeHolder="textblockplaceholder"
                          defaultValue={item.text}
                          path={`/articles/${articleId}/articleItems/${itemId}`}
                          targetName="text"
                          isHorizontal={false}
                          rows={20}
                        />
                      </div>
                      <ModificationButtons articleId={articleId} itemId={itemId} />
                    </Fragment>
                  );
                }
                case 'image': {
                  if (item.locked) {
                    return (
                      <Fragment key={`articleItem-${itemId}`}>
                        <ArticleImage articleItem={item} padRight={false} />
                        <div className="column is-2">
                          {!article.published && <UnlockButton articleId={articleId} itemId={itemId} />}
                        </div>
                      </Fragment>
                    );
                  }
                  return (
                    <Fragment key={`articleItem-${itemId}`}>
                      <div className="column is-2" />
                      <div className="column is-5">
                        <OrderedImagePicker
                          imageList={uploadedArticleImages}
                          highlightedImage={item.imageUrl}
                          path={`/articles/${articleId}/articleItems/${itemId}`}
                          fieldName="imageUrl"
                        />
                      </div>
                      <div className="column is-3">
                        <FileDropper path={filesPath} />
                      </div>
                      <ModificationButtons articleId={articleId} itemId={itemId} />
                    </Fragment>
                  );
                }
                default: {
                  return <div>WTF</div>;
                }
              }
            })}
          </div>
          <hr />
          <div className="level">
            {article.published &&
            <div className="level-item">
              <Translate id="unpublishtoedit" />
            </div>
            }
            {!article.published &&
            <div className="level-item">
              {this.addItemButtonWithIcon('fa-heading', 'addsubtitle', 'subtitle')}
              {this.addItemButtonWithIcon('fa-align-justify', 'addtextblock', 'textblock')}
              {this.addItemButtonWithIcon('fa-image', 'addimage', 'image')}
            </div>
            }
          </div>
          <hr />
          <div className="level">
            <div className="level-item">
              {article.published &&
                <button className="button is-danger is-outlined" onClick={() => this.setPublishStatus(false)}><Translate id="unpublish" /></button>
              }
              {!article.published && !article.articleItems &&
                <button className="button is-warning is-outlined" disabled><Translate id="addsomecontenttoyourarticle" /></button>
              }
              {!article.published && article.articleItems && this.allItemsLocked() &&
              <button className="button is-success is-outlined" onClick={() => this.setPublishStatus(true)}><Translate id="allitemslockedpresstopublish" /></button>
                }
              {!article.published && article.articleItems && !this.allItemsLocked() &&
              <button className="button is-warning is-outlined" disabled><Translate id="lockitemstopublish" /></button>
                }
              <button className="button is-info is-outlined" onClick={() => this.props.history.push('/admin/tools/articles')}><Translate id="backtoarticlelist" /></button>
            </div>
          </div>
        </div>
      );
    } if (_.isEmpty(articleId)) {
      return <div>ID?</div>;
    }
    return <div><Translate id="loading" /></div>;
  }

  setPublishStatus(newPublishStatus: boolean) {
    firebase.update(`/articles/${this.state.articleId}`, { published: newPublishStatus });
  }

  allItemsLocked(): boolean {
    const { articles } = this.props;
    const article = articles[this.state.articleId];

    if (!article.articleItems) {
      return false;
    }

    const result = _.find(article.articleItems, (item) => !item.locked);
    return !result;
  }

  addItemButtonWithIcon(icon: string, translationKey: string, itemClass: string) {
    return (
      <button
        className="button has-icon-left"
        onClick={() => this.addItem(itemClass)}
      >
        <span className="icon has-text-success"><i className="fas fa-plus" /></span>
        <span className="icon"><i className={`fas ${icon}`} /></span>
        <span><Translate id={translationKey} /></span>
      </button>
    );
  }

  unlockButton(articleId: string, itemId: string) {
    return (
      <div className="column is-2">
        <button className="button" onClick={() => firebase.update(`/articles/${articleId}/articleItems/${itemId}`, { locked: false })}><i className="fas fa-lock" /></button>
      </div>
    );
  }

  addItem(itemType: string) {
    const { location } = this.props;
    const articleId = _.last(location.pathname.split('/'));

    firebase.push(`/articles/${articleId}/articleItems`, { itemType, orderNumber: this.state.nextOrderNumber });
    this.setState((prevState) => ({ nextOrderNumber: prevState.nextOrderNumber + 1 }));
  }
}

interface ButtonsProps {
  articleId: string;
  itemId: string;
}

const ModificationButtons = ({ articleId, itemId }: ButtonsProps) => (
  <>
    <div className="column is-2">
      <button className="button" onClick={() => firebase.update(`/articles/${articleId}/articleItems/${itemId}`, { locked: true })}><i className="fas fa-lock-open" /></button>
      <button className="button" onClick={() => firebase.set(`/articles/${articleId}/articleItems/${itemId}`, {})}><i className="fas fa-trash" /></button>
    </div>
  </>
);

const UnlockButton = ({ articleId, itemId }: ButtonsProps) => (
  <button className="button" onClick={() => firebase.update(`/articles/${articleId}/articleItems/${itemId}`, { locked: false })}><i className="fas fa-lock" /></button>
);
