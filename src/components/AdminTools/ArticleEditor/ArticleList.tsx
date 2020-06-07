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
              <div className="column is-4">{articleData.title || <span className="has-text-danger"><Translate id="notitleyet" /></span>}</div>
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
                {!articleData.published && articleData.content &&
                  <ButtonWithIcon
                    className="is-outlined is-success"
                    onClick={() => { firebase.update(`/articles/${articleId}`, { published: true }); }}
                    iconName="fa-eye"
                    translationKey="publish"
                  />
                }
                {!articleData.content && articleData.articleItems &&
                  <ButtonWithIcon
                    className="is-primary is-light"
                    onClick={() => { convertArticleToNewForm(articleId, articleData); }}
                    iconName="fa-star"
                    translationKey="converttonewform"
                  />
                }
                {!articleData.published && !articleData.content &&
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

function convertArticleToNewForm(articleId: string, article: Article) {
  const sortedArticleItems = _.sortBy(Object.entries(article.articleItems!), (itemEntry) => itemEntry[1].orderNumber);

  const newContentForm = sortedArticleItems.map((itemEntry) => {
    const itemData = itemEntry[1];
    if (_.get(itemData, 'text', false) && _.get(itemData, 'imageUrl', false)) {
      return '';
    }
    if (itemData.itemType === 'subtitle') {
      return `## ${itemData.text}`;
    }
    if (itemData.itemType === 'title') {
      return `# ${itemData.text}`;
    }
    if (itemData.itemType === 'textblock') {
      return itemData.text;
    }
    if (itemData.itemType === 'image') {
      return `![alt text](${itemData.imageUrl} "image hover text")`;
    }
    if (itemData.itemType === 'list') {
      const listItems = itemData.text ? itemData.text.split('\n') : [];
      return listItems.map((item) => `- ${item}`).join('\n');
    }
    return '';
  }).join('\n\n');
  firebase.update(`/articles/${articleId}`, { content: newContentForm });

}
