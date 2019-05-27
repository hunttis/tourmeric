import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';

import Navbar from './Navbar';
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
)(withRouter<any>(Navbar)) as React.ComponentType<any>;
