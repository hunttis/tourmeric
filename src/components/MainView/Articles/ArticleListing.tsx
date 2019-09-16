import React from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

import { Location, History } from 'history';
import moment from 'moment';
import { Article } from '~/models/ReduxState';
import { Settings } from '~/models/Settings';

interface Props {
  settings: Settings;
  articles: { [key: string]: Article};
  location: Location;
  history: History;
}

interface ArticleCardProps {
  articleId: string;
  articleData: Article;
  settings: Settings;
  firstParagraph: string;
  history: History;
}

const ArticleCard = ({ articleId, articleData, settings, firstParagraph, history }: ArticleCardProps) => (
  <div className="card">
    <div className="card-content">
      <p className="title">
        {articleData.title}
      </p>
      <p>{moment(articleData.createDate).format(settings.dateFormat)}</p>
    </div>
    <div className="card-content">
      <div>{firstParagraph}</div>
    </div>
    <div className="card-footer">
      <div className="card-footer-item">
        <button className="button" onClick={() => history.push(`/articles/view/${articleId}`)}><Translate id="read" /></button>
      </div>
    </div>
  </div>
);

export const ArticleListing = ({ settings, articles, history }: Props) => (
  <div className="columns is-multiline">
    {!articles &&
      <div className="content"><p><Translate id="noarticlesyet" /></p></div>
    }
    {articles && _.reverse(_.sortBy(Object.entries(articles), (article) => article[1].createDate)).map((article, index) => {
      const articleId = article[0];
      const articleData: Article = article[1];
      const firstWithText = _.find(articleData.articleItems, (item) => _.isEqual(item.itemType, 'textblock'));
      const firstParagraph = firstWithText && firstWithText.text ? _.first(_.get(firstWithText, 'text', '').split('\n'))! : '';
      if (!articleData.published) {
        return '';
      }
      return (
        <div className="column is-6" key={`article-${articleId}-textblock-${index}`}>
          <ArticleCard articleId={articleId} articleData={articleData} settings={settings} firstParagraph={firstParagraph} history={history} />
        </div>
      );
    })}
  </div>
);
