import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import PrivacyPolicyEditor from './PrivacyPolicyEditor';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(PrivacyPolicyEditor);
