import { createStore, combineReducers, applyMiddleware } from "redux";
import { firebaseReducer, getFirebase } from "react-redux-firebase";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  localizeReducer,
  addTranslationForLanguage
} from "react-localize-redux";

import firebase from "firebase/app";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import moment from "moment/min/moment-with-locales";
import Moment from "react-moment";
import englishTranslations from "./translations/en.json";
import finnishTranslations from "./translations/fi.json";
import eventReducer from "./reducers/eventReducer";
import eventEditorReducer from "./reducers/eventEditorReducer";

import "firebase/database";
import "firebase/auth";
import "firebase/storage";

/* eslint-disable-next-line import/no-unresolved */
import { get } from "./config";

const activeConfig = get(process.env.NODE_ENV, process.env.DEPLOYMENT);

if (firebase.apps.length === 0) {
  firebase.initializeApp(activeConfig);
} else {
  firebase.app();
}

document.title = activeConfig.titleText;

export const history = createBrowserHistory();

const createRootReducer = () =>
  combineReducers({
    firebase: firebaseReducer,
    // localize: localizeReducer,
    admin: eventReducer,
    editor: eventEditorReducer,
    router: connectRouter(history)
  });

const initialState = {};

export const store = createStore(
  createRootReducer(history),
  initialState,
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history),
      thunk.withExtraArgument(getFirebase)
    )
  )
);

const rrfConfig = {
  userProfile: "users",
  preserveOnLogout: ["events", "participations", "categories"]
};

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
};

// const languages = ['en', 'fi'];

const defaultLanguage = "fi";

Moment.globalMoment = moment;
Moment.globalLocale = defaultLanguage;

// store.dispatch(initialize(languages, { defaultLanguage }));

store.dispatch(addTranslationForLanguage(englishTranslations, "en"));
store.dispatch(addTranslationForLanguage(finnishTranslations, "fi"));
