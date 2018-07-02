import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import MainView from './MainView';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect(state => ({
    languages: state.locale.languages,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(MainView);
