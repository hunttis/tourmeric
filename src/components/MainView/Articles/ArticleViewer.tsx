import React from 'react';
import _ from 'lodash';

import { Translate } from 'react-localize-redux';
import { Article } from '~/models/ReduxState';
import { ArticleSubTitle, ArticleTextBlock, ArticleImage } from './ArticleParts';

interface Props {
  article: Article;
}

export const ArticleViewer = ({ article }: Props) => (
  <div className="section">
    <div className="columns is-multiline">
      <div className="column is-2" />
      <div className="column is-8 has-text-centered">
        <h1 className="title">{article.title}</h1>
      </div>
      <div className="column is-2" />
      {_.sortBy(Object.values(article.articleItems), [(articleItem) => articleItem.orderNumber]).map((articleItem) => {
        switch (articleItem.itemType) {
          case 'subtitle': {
            return <ArticleSubTitle key={`articleItem-${articleItem.orderNumber}`} articleItem={articleItem} />;
          }
          case 'textblock': {
            return <ArticleTextBlock key={`articleItem-${articleItem.orderNumber}`} articleItem={articleItem} />;
          }
          case 'image': {
            return <ArticleImage key={`articleItem-${articleItem.orderNumber}`} articleItem={articleItem} />;
          }
          default: {
            return <div className="column is-12"><Translate id="error" /></div>;
          }
        }
      })}
    </div>
  </div>
);
