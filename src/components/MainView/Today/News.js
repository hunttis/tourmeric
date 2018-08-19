
import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

export default class News extends Component {

  state = { activeNewsItem: '' }

  setActiveNewsItem(newsId) {
    this.setState({ activeNewsItem: newsId });
  }

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
            const footerNeeded = newsData.link || newsData.summary;
            const currentActiveNewsItem = newsItem.key === this.state.activeNewsItem;
            const content = (currentActiveNewsItem || !newsData.summary) ? newsData.text : newsData.summary;
            const formattedContent = content.split('\n');

            return (
              <Fragment key={newsItem.key}>
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-title">
                      {newsData.name}
                    </div>
                    <div className="card-header-title">
                      {newsDate}
                    </div>
                  </div>
                  {/* {newsData.image &&
                  <div className="card-image">
                    <figure className="image">
                      <img src={newsData.image} alt="" />
                    </figure>
                  </div>
                  } */}

                  <div className="card-content">
                    <div className="content">
                      {formattedContent.map((paragraph, index) => <p key={`${newsItem.key}-${index}`}>{paragraph}</p>)}
                    </div>
                  </div>

                  {footerNeeded &&
                    <div className="card-footer">
                      {(newsData.summary && !currentActiveNewsItem) &&
                        <a className="card-footer-item" onClick={() => this.setActiveNewsItem(newsItem.key)}><Translate id="showfullnewsitem" /></a>
                      }
                      {currentActiveNewsItem &&
                        <a className="card-footer-item" onClick={() => this.setActiveNewsItem('')}><Translate id="showless" /></a>
                      }
                      {(!newsData.summary && newsData.link) &&
                        <a className="card-footer-item" target="_blank" rel="noopener noreferrer" href={newsData.link}>{newsData.linkName ? newsData.linkName : newsData.link}</a>
                      }
                    </div>
                  }

                </div>
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
