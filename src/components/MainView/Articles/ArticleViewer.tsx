import React from 'react';
import _ from 'lodash';

import { Translate } from 'react-localize-redux';
import { Article } from '~/models/ReduxState';
import { ArticleSubTitle, ArticleTextBlock, ArticleImage, ArticleListBlock } from './ArticleParts';
import { MarkdownElement } from '~/components/Common/MarkdownElement';

interface Props {
  article: Article;
}

export const ArticleViewer = ({ article }: Props) => (
  <div className="section">
    <div className="columns is-multiline">
      <div className="column is-2" />
      <div className="column is-8 has-text-centered">
        <h1 className="title">{article && article.title}</h1>
      </div>
      <div className="column is-2" />

      {/* NEW ARTICLE RENDERER */}
      {article && article.content &&
        <>
          <div className="column is-2" />
          <div className="column is-8">
            <MarkdownElement markdown={article.content} />
          </div>
          <div className="column is-2" />
        </>
      }

      {/* OLD ARTICLE RENDERER - REMOVE THIS WHEN ALL ARTICLES ARE IN NEW FORM */}
      {article && !article.content && article.articleItems && _.sortBy(Object.values(article.articleItems), [(articleItem) => articleItem.orderNumber]).map((articleItem) => {
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
          case 'list': {
            return <ArticleListBlock key={`articleItem-${articleItem.orderNumber}`} articleItem={articleItem} />;
          }
          default: {
            return <div className="column is-12"><Translate id="error" /></div>;
          }
        }
      })}
    </div>
  </div>
);
