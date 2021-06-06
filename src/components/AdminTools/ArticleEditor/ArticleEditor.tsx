import React, { Component } from 'react';
import { FormattedMessage, IntlShape } from "react-intl";
import { isLoaded } from 'react-redux-firebase';
import { Location, History } from 'history';

import firebase from 'firebase/app';
import moment from 'moment';

import _ from 'lodash';
import { UploadedFile } from '../../../models/Category';
import { Article, ArticleItem } from '../../../models/ReduxState';
import { ButtonWithIcon } from '../../../components/Common/CommonComponents';
import ArticleMarkdown from './ArticleMarkdown-container';

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

export default class ArticleEditor extends Component<Props, Partial<State>> {

  constructor(props: Props) {
    super(props);

    const articleId = _.last(this.props.location.pathname.split('/')) || '';
    this.state = { articleId };
    let lastOrderNumber = 0;

    if (_.get(props, `articles[${articleId}].articleItems`, false)) {
      Object.values(props.articles[articleId].articleItems!).forEach((articleItem: ArticleItem) => {
        if (articleItem.orderNumber > lastOrderNumber) {
          lastOrderNumber = articleItem.orderNumber;
        }
      });
    }

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
    const { articles } = this.props;
    const { articleId } = this.state;

    if (isLoaded(articles) && !_.isEmpty(articleId)) {
      const article = articles[articleId!];

      return (
        <div className="segment">
          <ArticleMarkdown />
          <hr />
          <div className="buttons is-centered">
            {article.published &&
              <ButtonWithIcon
                className="is-danger is-outlined"
                onClick={() => this.setPublishStatus(false)}
                iconName="fa-eye-slash"
                translationKey="unpublish"
              />
            }
            {!article.published && article.content &&
              <ButtonWithIcon
                className="is-outlined is-success"
                onClick={() => this.setPublishStatus(true)}
                iconName="fa-eye"
                translationKey="presstopublish"
              />
            }
            {!article.published && !article.content &&
              <button className="button is-outlined is-danger" disabled>
                <FormattedMessage id="addsomecontenttoyourarticle" />
              </button>
            }
            <button className="button is-info is-outlined" onClick={() => this.props.history.push('/admin/tools/articles')}><FormattedMessage id="backtoarticlelist" /></button>
          </div>
        </div>
      );
    } if (_.isEmpty(articleId)) {
      return <div>ID?</div>;
    }
    return <div><FormattedMessage id="loading" /></div>;
  }

  setPublishStatus(newPublishStatus: boolean) {
    firebase.update(`/articles/${this.state.articleId}`, { published: newPublishStatus });
  }
}
