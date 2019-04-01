import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer, getFirebase } from 'react-redux-firebase';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { localeReducer as locale, initialize, addTranslationForLanguage } from 'react-localize-redux';
import firebase from 'firebase/app';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import englishTranslations from './translations/en.json';
import finnishTranslations from './translations/fi.json';
import eventReducer from './reducers/eventReducer';
import eventEditorReducer from './reducers/eventEditorReducer';

import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

/* eslint-disable-next-line import/no-unresolved */
const config = require('./config').get(process.env.NODE_ENV, process.env.DEPLOYMENT);

if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
} else {
  firebase.app();
}

document.title = config.titleText;

const rrfConfig = {
  userProfile: 'users',
  preserveOnLogout: ['events', 'participations', 'categories'],
};

const createStoreWithFirebase = compose(reactReduxFirebase(firebase, rrfConfig))(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  locale,
  admin: eventReducer,
  editor: eventEditorReducer,
});

const initialState = {};

export const history = createBrowserHistory();

export const store = createStoreWithFirebase(
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

const defaultLanguage = 'fi';

Moment.globalMoment = moment;
Moment.globalLocale = defaultLanguage;

store.dispatch(initialize(languages, { defaultLanguage }));

store.dispatch(addTranslationForLanguage(englishTranslations, 'en'));
store.dispatch(addTranslationForLanguage(finnishTranslations, 'fi'));
