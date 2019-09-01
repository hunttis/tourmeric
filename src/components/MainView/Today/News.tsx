
import React from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import NewsItem from './NewsItem';
import { Settings } from '~/models/Settings';
import { SingleNewsItem } from '~/models/ReduxState';

interface Props {
  news: [{ key: string, value: SingleNewsItem }];
  settings: Settings;
}

export const News = ({ news, settings }: Props) => {

  const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

  if (isLoaded(news)) {
    const publishedNews = news ? news.filter((newsItem) => newsItem.value.active) : [];
    return (
      <>
        <h1 className="title"><Translate id="news" /></h1>
        <div>&nbsp;</div>
        {publishedNews.map((newsItem) => <NewsItem key={`newsItem-${newsItem.key}`} newsItem={newsItem} dateFormat={dateFormat} />)}
      </>
    );
  }
  return <div><Translate id="loading" /></div>;

};
