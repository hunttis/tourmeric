import { compose } from 'redux';
import { connect } from 'react-redux';

import PrivacyPolicy from './PrivacyPolicy';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(PrivacyPolicy);
