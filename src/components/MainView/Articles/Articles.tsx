import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

import { Location, History } from 'history';
import { Route, Switch } from 'react-router-dom';
import { Article } from '../../../models/ReduxState';
import { Settings } from '../../../models/Settings';
import ArticleViewer from './ArticleViewer-container';
import ArticleListing from './ArticleListing-container';

interface Props {
  settings: Settings;
  articles: { [key: string]: Article};
  location: Location;
  history: History;
  isAdmin: boolean;
}

export const Articles = ({ articles, history, location, isAdmin, settings }: Props) => {
  if (!isLoaded(articles) || !isLoaded(settings)) {
    return (
      <div className="section has-text-centered">
        <div className="button is-loading"><Translate id="loading" /></div>
      </div>
    );
  }

  if (isLoaded(articles) && isLoaded(settings)) {
    const rootView = _.endsWith(location.pathname, 'articles');
    return (
      <div className="section">
        <div className="level">
          <div className="level-left">
            <h1 className="title"><Translate id="articles" /></h1>
          </div>
          <div className="level-right">
            {!rootView &&
            <button className="button is-info is-outlined" onClick={() => { history.push('/articles'); }}><Translate id="backtoarticlelist" /></button>
          }
            {isAdmin &&
            <button className="button is-warning is-outlined" onClick={() => { history.push('/admin/tools/articles'); }}>
              <span className="icon"><i className="fas fa-pencil-alt" /></span>
              <span>ADMIN: <Translate id="articleeditor" /></span>
            </button>
          }
          </div>
        </div>
        <Switch>
          <Route exact path="/articles" component={ArticleListing} />
          <Route path="/articles/:id" component={ArticleViewer} />
        </Switch>
        <div className="has-text-centered">
          {!rootView &&
          <button className="button is-info is-outlined" onClick={() => { history.push('/articles'); }}><Translate id="backtoarticlelist" /></button>
        }
        </div>
      </div>
    );
  }

  return (
    <div>...</div>
  );
};
