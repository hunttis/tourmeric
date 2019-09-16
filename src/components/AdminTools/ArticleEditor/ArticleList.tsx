import React from 'react';
import moment from 'moment';
import firebase from 'firebase/app';
import { History } from 'history';

import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { Article } from '~/models/ReduxState';
import { Settings } from '~/models/Settings';
import { ButtonWithIcon } from '~/components/Common/CommonComponents';

interface Props {
  articles: { [key: string]: Article };
  settings: Settings;
  history: History;
}

export const ArticleList = ({ articles, settings, history }: Props) => (
  <div className="segment">
    <div className="level">
      <div className="level-left">
        <h1 className="title"><Translate id="articles" /></h1>
      </div>
      <div className="level-right">
        <button className="button is-info is-outlined" onClick={() => { history.push('/articles'); }}>
          <span className="icon"><i className="fas fa-list" /></span>
          <span><Translate id="userarticlelist" /></span>
        </button>
        <button className="button is-success is-outlined" onClick={() => firebase.push('/articles', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') })}>
          <span className="icon"><i className="fas fa-pencil-alt" /></span>
          <span><Translate id="newarticle" /></span>
        </button>
      </div>
    </div>
    <div className="columns is-multiline">
      {articles && _.reverse(_.sortBy(Object.entries(articles), (articleEntry) => articleEntry[1].createDate)).map((article) => {
        const articleId = article[0];
        const articleData: Article = article[1];
        return (
          <div className="column is-12" key={`article-${articleId}`}>
            <div className="columns card">
              <div className="column is-2"><Translate id="created" />: {moment(articleData.createDate).format(settings.dateFormat)}</div>
              <div className="column is-2">
                {articleData.published && <span className="has-text-success"><Translate id="published" /></span>}
                {!articleData.published && <span className="has-text-warning"><Translate id="notpublished" /></span>}
              </div>
              <div className="column is-4">{articleData.title || <Translate id="notitleyet" />}</div>
              <div className="column is-4">
                <ButtonWithIcon
                  className="is-outlined is-warning"
                  onClick={() => history.push(`/admin/tools/articles/edit/${articleId}`)}
                  iconName="fa-pencil-alt"
                  translationKey="edit"
                />
                <ButtonWithIcon
                  className="is-outlined is-info"
                  onClick={() => history.push(`/articles/view/${articleId}`)}
                  iconName="fa-glasses"
                  translationKey="view"
                />
                {articleData.published &&
                  <ButtonWithIcon
                    className="is-outlined is-danger"
                    onClick={() => { firebase.update(`/articles/${articleId}`, { published: false }); }}
                    iconName="fa-eye-slash"
                    translationKey="unpublish"
                  />
                }
                {!articleData.published && allItemsLocked(articleData) &&
                  <ButtonWithIcon
                    className="is-outlined is-success"
                    onClick={() => { firebase.update(`/articles/${articleId}`, { published: true }); }}
                    iconName="fa-eye"
                    translationKey="publish"
                  />
              }
                {!articleData.published && !allItemsLocked(articleData) &&
                  <button className="button is-outlined is-disabled" disabled><Translate id="articlenotreadytopublish" /></button>
                }
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

function allItemsLocked(article: Article): boolean {

  if (!article.articleItems) {
    return false;
  }

  const result = _.find(article.articleItems, (item) => !item.locked);
  return !result;
}
