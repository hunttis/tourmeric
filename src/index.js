import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer, getFirebase } from 'react-redux-firebase';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

import { createBrowserHistory } from 'history';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';

import { localeReducer as locale, initialize, addTranslationForLanguage } from 'react-localize-redux';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';

import 'bulma/css/bulma.css';
import './mystyles.scss';
import MainView from './components/MainView/MainView-container';

import englishTranslations from './translations/en.json';
import finnishTranslations from './translations/fi.json';

import eventReducer from './reducers/eventReducer';

/* eslint-disable-next-line import/no-unresolved */
const config = require('./config').get(process.env.NODE_ENV, process.env.DEPLOYMENT);

const defaultLanguage = 'fi';

document.title = config.titleText;

Moment.globalMoment = moment;
Moment.globalLocale = defaultLanguage;

if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
} else {
  firebase.app();
}

const rrfConfig = {
  userProfile: 'users',
  preserveOnLogout: ['events', 'participations', 'categories'],
};

const createStoreWithFirebase = compose(reactReduxFirebase(firebase, rrfConfig))(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  locale,
  admin: eventReducer,
});

const initialState = {};

const history = createBrowserHistory();

const store = createStoreWithFirebase(
  connectRouter(history)(rootReducer),
  initialState,
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history),
      thunk.withExtraArgument(getFirebase),
    ),
  ),
);

const languages = ['en', 'fi'];
store.dispatch(initialize(languages, { defaultLanguage }));

store.dispatch(addTranslationForLanguage(englishTranslations, 'en'));
store.dispatch(addTranslationForLanguage(finnishTranslations, 'fi'));

const Main = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MainView />
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(<Main />, document.getElementById('app'));
