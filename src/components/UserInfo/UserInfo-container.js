import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirebase, firebaseConnect } from 'react-redux-firebase';

import UserInfo from './UserInfo';

export default compose(
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),

  firebaseConnect(({ auth }) => [
    { path: '/events', queryParams: ['orderByChild=date'] },
    { path: '/participations' },
    { path: `/storecredit/${auth.uid}` },
    { path: '/categories' },
  ]),
  withFirebase,
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    storecredit: state.firebase.data.storecredit,
  })),
)(UserInfo);
