import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';

import MainView from './MainView';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/settings' },
    { path: '/highlights' },
  ]),
  connect((state: ReduxState) => ({
    languages: state.locale.languages,
    settings: state.firebase.data.settings,
    highlights: state.firebase.data.highlights,
    location: state.router.location,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any>(MainView));
