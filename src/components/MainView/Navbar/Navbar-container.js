import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import Navbar from './Navbar';

export default compose(
  firebaseConnect([
    { path: '/settings' },
    { path: '/highlights' },
  ]),
  connect(state => ({
    languages: state.locale.languages,
    settings: state.firebase.data.settings,
    highlights: state.firebase.data.highlights,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(Navbar);
