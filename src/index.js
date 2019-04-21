import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'connected-react-router';

import 'bulma/css/bulma.css';
import './mystyles.scss';
import MainView from './components/MainView/MainView-container';

import { store, history } from './init-app';

const Main = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MainView />
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(<Main />, document.getElementById('app'));
