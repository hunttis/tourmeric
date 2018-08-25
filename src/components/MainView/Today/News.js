
import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import NewsItem from './NewsItem';

export default class News extends Component {

  foo() {}

  render() {
    const { news, settings } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    if (isLoaded(news)) {
      const publishedNews = news ? news.filter(newsItem => newsItem.value.active) : [];
      return (
        <Fragment>
          <h1 className="title"><Translate id="news" /></h1>
          <div>&nbsp;</div>
          {publishedNews.map(newsItem => <NewsItem newsItem={newsItem} dateFormat={dateFormat} />)}
        </Fragment>
      );
    }
    return <div><Translate id="loading" /></div>;
  }
}

News.propTypes = {
  news: PropTypes.array,
  settings: PropTypes.object,
};
