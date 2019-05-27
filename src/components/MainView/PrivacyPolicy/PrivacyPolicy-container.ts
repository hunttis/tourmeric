import { compose } from 'redux';
import { connect } from 'react-redux';

import PrivacyPolicy from './PrivacyPolicy';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(PrivacyPolicy) as React.ComponentType<any>;
