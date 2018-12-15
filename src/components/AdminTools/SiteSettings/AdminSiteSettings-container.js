import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';

import AdminSiteSettings from './AdminSiteSettings';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
    location: state.router.location,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(withRouter(AdminSiteSettings));
