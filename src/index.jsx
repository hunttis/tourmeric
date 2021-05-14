import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { ConnectedRouter } from "connected-react-router";

import "bulma/css/bulma.css";
import "./mystyles.scss";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";

import { LocalizeProvider } from "react-localize-redux";

import MainView from "./components/MainView/MainView-container";

import { store, history, rrfProps } from "./init-app";

const Main = () => (
  <Provider store={store}>
    <LocalizeProvider store={store}>
      <ReactReduxFirebaseProvider
        firebase={rrfProps.firebase}
        config={rrfProps.config}
        dispatch={rrfProps.dispatch}
      >
        <ConnectedRouter history={history}>
          <MainView />
        </ConnectedRouter>
      </ReactReduxFirebaseProvider>
    </LocalizeProvider>
  </Provider>
);

ReactDOM.render(<Main />, document.getElementById("app"));
