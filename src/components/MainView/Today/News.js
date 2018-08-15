
import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

export default class News extends Component {

  foo() {}

  render() {
    const { news, settings } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    if (isLoaded(news)) {
      const publishedNews = news.filter(newsItem => newsItem.value.active);
      return (
        <Fragment>
          <h1 className="title"><Translate id="news" /></h1>
          <div>&nbsp;</div>
          {publishedNews.map((newsItem) => {
            const newsData = newsItem.value;
            const newsDate = moment(newsData.date, 'YYYY-MM-DD').format(dateFormat);
            return (
              <Fragment key={newsItem.key}>
                <h2 className="subtitle">{newsDate} - {newsData.name}</h2>
                <pre>{newsData.text}</pre>
                <div>&nbsp;</div>
              </Fragment>
            );
          })}
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
