import React from 'react';
import _ from 'lodash';
import { ArticleItem } from '~/models/ReduxState';

interface ArticlePartProps {
  articleItem: ArticleItem;
  padRight?: boolean;
}

export const ArticleSubTitle = ({ articleItem, padRight = true }: ArticlePartProps) => (
  <>
    <div className="column is-2" />
    <div className="column is-8">
      <h2 className="subtitle">{articleItem.text}</h2>
    </div>
    {padRight && <div className="column is-2" />}
  </>
);

export const ArticleTextBlock = ({ articleItem, padRight = true }: ArticlePartProps) => {
  const paragraphs: string[] | undefined = _.split(articleItem.text!, '\n');
  return (
    <>
      <div className="column is-2" />
      <div className="column is-8">
        <div className="content">
          {paragraphs && paragraphs.map((paragraph: string, index: number) => <p key={`article-${articleItem.orderNumber}-${index}`}>{paragraph}</p>)}
        </div>
      </div>
      {padRight && <div className="column is-2" />}
    </>
  );
};

export const ArticleImage = ({ articleItem, padRight = true }: ArticlePartProps) => (
  <>
    <div className="column is-2" />
    <div className="column is-8 articleimage has-text-centered">
      <img src={articleItem.imageUrl} alt="" />
    </div>
    {padRight && <div className="column is-2" />}
  </>
);
