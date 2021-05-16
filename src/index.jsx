import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { ConnectedRouter } from "connected-react-router";

import "bulma/css/bulma.css";
import "./mystyles.scss";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";

import { IntlProvider } from "react-intl";
import englishTranslations from "./translations/en.json";
import finnishTranslations from "./translations/fi.json";

import MainView from "./components/MainView/MainView-container";

import { store, history, rrfProps } from "./init-app";

const language = navigator.language.split(/[-_]/)[0];
const messages = {
  fi: finnishTranslations,
  en: englishTranslations,
};

const Main = () => (
  <Provider store={store}>
    <IntlProvider locale={language} messages={messages[language]}>
      <ReactReduxFirebaseProvider
        firebase={rrfProps.firebase}
        config={rrfProps.config}
        dispatch={rrfProps.dispatch}
      >
        <ConnectedRouter history={history}>
          <MainView />
        </ConnectedRouter>
      </ReactReduxFirebaseProvider>
    </IntlProvider>
  </Provider>
);

ReactDOM.render(<Main />, document.getElementById("app"));
