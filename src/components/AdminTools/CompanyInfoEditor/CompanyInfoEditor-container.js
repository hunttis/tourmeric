import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import CompanyInfoEditor from './CompanyInfoEditor';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(CompanyInfoEditor);
