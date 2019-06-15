import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { SingleNewsItem } from '~/models/ReduxState';

interface Props {
  newsItem: { key: string, value: SingleNewsItem };
  dateFormat: string;
}

interface State {
  activeNewsItem: boolean;
}

export default class NewsItem extends Component<Props, State> {

  state = { activeNewsItem: false }

  setActiveNewsItem(status: boolean) {
    this.setState({ activeNewsItem: status });
  }

  render() {
    const { newsItem, dateFormat } = this.props;
    const newsData = newsItem.value;
    const newsDate = moment(newsData.date, 'YYYY-MM-DD').format(dateFormat);
    const currentActiveNewsItem = this.state.activeNewsItem;
    const formattedContent = newsData.text ? newsData.text.split('\n') : [];
    const longNewsItem = formattedContent.length > 3;
    const footerNeeded = newsData.link || longNewsItem;

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

          <div className="card-content">
            <div className="content">
              {(!longNewsItem || (longNewsItem && currentActiveNewsItem)) && formattedContent.map((paragraph, index) => <p key={`${newsItem.key}-${index}`}>{paragraph}</p>)}

              {(longNewsItem && !currentActiveNewsItem) && formattedContent.map((paragraph, index) => {
                if (index < 2 && !_.isEmpty(paragraph)) {
                  return <p key={`${newsItem.key}-${index}`}>{paragraph}&nbsp;</p>;
                }
                return '';
              })}
              {(longNewsItem && !currentActiveNewsItem) && <p>...<Translate id="continues" /></p>}
            </div>
          </div>

          {footerNeeded &&
            <div className="card-footer">
              {(longNewsItem && !currentActiveNewsItem) &&
                <a className="card-footer-item" onClick={() => this.setActiveNewsItem(true)}><i className="fas fa-caret-square-down" />&nbsp;&nbsp;<Translate id="showfullnewsitem" /></a>
              }
              {currentActiveNewsItem &&
                <a className="card-footer-item" onClick={() => this.setActiveNewsItem(false)}><i className="fas fa-caret-square-up" />&nbsp;&nbsp;<Translate id="showless" /></a>
              }
              {(!newsData.summary && newsData.link) &&
                <a className="card-footer-item" target="_blank" rel="noopener noreferrer" href={newsData.link}><i className="fas fa-external-link-alt" />&nbsp;&nbsp;{newsData.linkName ? newsData.linkName : newsData.link}</a>
              }
            </div>
          }

        </div>
        <div>&nbsp;</div>
      </Fragment>
    );
  }
}
