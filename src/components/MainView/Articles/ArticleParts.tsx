import React from 'react';
import _ from 'lodash';
import { ArticleItem } from '~/models/ReduxState';

interface ArticlePartProps {
  articleItem: ArticleItem;
  padLeft?: boolean;
  padRight?: boolean;
}

export const ArticleSubTitle = ({ articleItem, padLeft = true, padRight = true }: ArticlePartProps) => (
  <>
    {padLeft && <div className="column is-2" />}
    <div className="column is-8">
      <h2 className="subtitle">{articleItem.text ? articleItem.text : ''}</h2>
    </div>
    {padRight && <div className="column is-2" />}
  </>
);

export const ArticleListBlock = ({ articleItem, padLeft = true, padRight = true }: ArticlePartProps) => {
  const listItems: string[] | undefined = _.split(articleItem.text!, '\n');
  return (
    <>
      {padLeft && <div className="column is-2" />}
      <div className="column is-8">

        {listItems &&
          <ul>
            {listItems.map((item: string, index: number) => <li key={`list-${articleItem.orderNumber}-${index}`}>{item}</li>)}
          </ul>
        }

      </div>
      {padRight && <div className="column is-2" />}
    </>
  );
};

export const ArticleTextBlock = ({ articleItem, padLeft = true, padRight = true }: ArticlePartProps) => {
  const paragraphs: string[] | undefined = _.split(articleItem.text!, '\n');
  return (
    <>
      {padLeft && <div className="column is-2" />}
      <div className="column is-8">
        <div className="content">
          {paragraphs && paragraphs.map((paragraph: string, index: number) => <p key={`article-${articleItem.orderNumber}-${index}`}>{paragraph}&nbsp;</p>)}
        </div>
      </div>
      {padRight && <div className="column is-2" />}
    </>
  );
};

export const ArticleImage = ({ articleItem, padLeft = true, padRight = true }: ArticlePartProps) => (
  <>
    {padLeft && <div className="column is-2" />}
    <div className="column is-8 articleimage has-text-centered">
      <img src={articleItem.imageUrl ? articleItem.imageUrl : ''} alt="" />
    </div>
    {padRight && <div className="column is-2" />}
  </>
);
