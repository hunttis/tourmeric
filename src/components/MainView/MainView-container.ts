import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import _ from 'lodash';
import { withLocalize } from 'react-localize-redux';


import MainView from './MainView';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    location: state.router.location,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withLocalize<any>(withRouter<any, any>(MainView)));
