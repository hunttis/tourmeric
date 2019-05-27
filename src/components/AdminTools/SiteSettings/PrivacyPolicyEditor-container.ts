import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import PrivacyPolicyEditor from './PrivacyPolicyEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(PrivacyPolicyEditor) as React.ComponentType<any>;
