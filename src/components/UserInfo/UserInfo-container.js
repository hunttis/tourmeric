import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirebase, firebaseConnect } from 'react-redux-firebase';

import UserInfo from './UserInfo';

export default compose(
  firebaseConnect([
    { path: '/events', queryParams: ['orderByChild=date'] },
  ]),
  withFirebase,
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(UserInfo);
